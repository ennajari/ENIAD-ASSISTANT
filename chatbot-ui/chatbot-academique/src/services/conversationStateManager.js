import firebaseStorageService from './firebaseStorageService';

/**
 * Comprehensive Conversation State Manager
 * Handles all conversation operations with Firebase synchronization
 */
class ConversationStateManager {
  constructor() {
    this.currentUser = null;
    this.isOnline = navigator.onLine;
    this.pendingOperations = [];
    
    // Listen for online/offline status
    window.addEventListener('online', () => {
      this.isOnline = true;
      this.processPendingOperations();
    });
    
    window.addEventListener('offline', () => {
      this.isOnline = false;
    });
  }

  /**
   * Set current user for all operations
   */
  setCurrentUser(user) {
    this.currentUser = user;
    console.log('👤 Conversation state manager user set:', user?.email || 'anonymous');
  }

  /**
   * Create a new conversation with Firebase sync
   */
  async createConversation(conversationData, setConversationHistory) {
    try {
      console.log('📝 Creating new conversation:', conversationData.id);

      const conversation = {
        ...conversationData,
        userId: this.currentUser?.uid,
        createdAt: new Date().toISOString(),
        lastUpdated: new Date().toISOString()
      };

      // Update local state immediately
      setConversationHistory(prev => [conversation, ...prev]);

      // Update local storage
      const currentHistory = JSON.parse(localStorage.getItem('conversationHistory') || '[]');
      const updatedHistory = [conversation, ...currentHistory];
      localStorage.setItem('conversationHistory', JSON.stringify(updatedHistory));
      console.log('💾 Local storage updated with new conversation:', conversation.id);

      // Sync with Firebase if user is logged in
      if (this.currentUser?.uid) {
        if (this.isOnline) {
          try {
            await firebaseStorageService.saveConversation(this.currentUser.uid, conversation);
            console.log('✅ New conversation saved to Firebase:', conversation.id);
          } catch (firebaseError) {
            console.error('❌ Firebase save failed, adding to pending operations:', firebaseError);
            this.addPendingOperation('create', conversation);
          }
        } else {
          console.log('📴 Offline - adding to pending operations:', conversation.id);
          this.addPendingOperation('create', conversation);
        }
      } else {
        console.log('👤 No user logged in - conversation saved locally only');
      }

      return conversation;
    } catch (error) {
      console.error('❌ Error creating conversation:', error);
      throw error;
    }
  }

  /**
   * Delete conversation with immediate Firebase sync
   */
  async deleteConversation(conversationId, setConversationHistory, setCurrentChatId, setMessages) {
    try {
      console.log('🗑️ Deleting conversation:', conversationId);

      // Update local state immediately
      setConversationHistory(prev => {
        const filtered = prev.filter(conv => conv.id !== conversationId);
        
        // If we deleted the current conversation, switch to another or create new
        setCurrentChatId(currentId => {
          if (currentId === conversationId) {
            if (filtered.length > 0) {
              const newCurrentId = filtered[0].id;
              setMessages(filtered[0].messages || []);
              localStorage.setItem('currentChatId', newCurrentId);
              return newCurrentId;
            } else {
              setMessages([]);
              localStorage.removeItem('currentChatId');
              return null;
            }
          }
          return currentId;
        });

        return filtered;
      });

      // Update local storage immediately
      const currentHistory = JSON.parse(localStorage.getItem('conversationHistory') || '[]');
      const updatedHistory = currentHistory.filter(conv => conv.id !== conversationId);
      localStorage.setItem('conversationHistory', JSON.stringify(updatedHistory));

      // Remove from current chat if it was the deleted one
      const currentChatId = localStorage.getItem('currentChatId');
      if (currentChatId === conversationId) {
        localStorage.removeItem('currentChatId');
      }

      // Sync with Firebase if user is logged in
      if (this.currentUser?.uid) {
        if (this.isOnline) {
          await firebaseStorageService.deleteConversation(this.currentUser.uid, conversationId);
          console.log('✅ Conversation deleted from Firebase:', conversationId);
        } else {
          this.addPendingOperation('delete', { id: conversationId });
        }
      }

      return true;
    } catch (error) {
      console.error('❌ Error deleting conversation:', error);
      
      // Revert local changes on error
      try {
        const firebaseConversations = await firebaseStorageService.getUserConversations(this.currentUser?.uid);
        setConversationHistory(firebaseConversations);
        localStorage.setItem('conversationHistory', JSON.stringify(firebaseConversations));
      } catch (revertError) {
        console.error('❌ Error reverting conversation state:', revertError);
      }
      
      throw error;
    }
  }

  /**
   * Rename conversation with Firebase sync
   */
  async renameConversation(conversationId, newTitle, setConversationHistory) {
    try {
      console.log('✏️ Renaming conversation:', conversationId, 'to:', newTitle);

      // Update local state immediately
      setConversationHistory(prev => 
        prev.map(conv => 
          conv.id === conversationId 
            ? { ...conv, title: newTitle, updatedAt: new Date().toISOString() }
            : conv
        )
      );

      // Update local storage
      const currentHistory = JSON.parse(localStorage.getItem('conversationHistory') || '[]');
      const updatedHistory = currentHistory.map(conv => 
        conv.id === conversationId 
          ? { ...conv, title: newTitle, updatedAt: new Date().toISOString() }
          : conv
      );
      localStorage.setItem('conversationHistory', JSON.stringify(updatedHistory));

      // Sync with Firebase if user is logged in
      if (this.currentUser?.uid) {
        if (this.isOnline) {
          await firebaseStorageService.renameConversation(
            this.currentUser.uid, 
            conversationId, 
            newTitle
          );
          console.log('✅ Conversation renamed in Firebase:', conversationId);
        } else {
          this.addPendingOperation('rename', { id: conversationId, title: newTitle });
        }
      }

      return true;
    } catch (error) {
      console.error('❌ Error renaming conversation:', error);
      throw error;
    }
  }

  /**
   * Update conversation messages with Firebase sync
   */
  async updateConversation(conversationId, updatedMessages, setConversationHistory) {
    try {
      console.log('🔄 Updating conversation:', conversationId, 'with', updatedMessages.length, 'messages');

      let completeConversation = null;

      // Update local state and get complete conversation data
      setConversationHistory(prev => {
        console.log('🔍 Looking for conversation in history:', conversationId);
        console.log('📋 Current conversation history:', prev.map(c => ({ id: c.id, title: c.title })));

        let existingChat = prev.find(c => c.id === conversationId);
        console.log('🎯 Found existing chat:', existingChat ? 'YES' : 'NO');

        // If conversation doesn't exist, create it
        if (!existingChat) {
          console.log('📝 Creating new conversation entry for:', conversationId);
          existingChat = {
            id: conversationId,
            title: 'New Conversation',
            messages: [],
            createdAt: new Date().toISOString(),
            userId: this.currentUser?.uid
          };
        }

        // Generate title from first user message if no existing title or if it's still default
        let title = existingChat.title;
        if (!title || title === 'New Conversation' || title === 'Nouvelle conversation') {
          const firstUserMessage = updatedMessages.find(m => m.role === 'user');
          if (firstUserMessage) {
            title = firstUserMessage.content.substring(0, 30);
            if (firstUserMessage.content.length > 30) {
              title += '...';
            }
          } else {
            title = 'New Conversation';
          }
        }

        const updatedChat = {
          ...existingChat, // Preserve existing fields
          id: conversationId,
          title: title,
          messages: updatedMessages,
          lastUpdated: new Date().toISOString(),
          userId: this.currentUser?.uid
        };

        console.log('📝 Updated chat object:', {
          id: updatedChat.id,
          title: updatedChat.title,
          messageCount: updatedChat.messages.length,
          userId: updatedChat.userId,
          isNew: !prev.find(c => c.id === conversationId)
        });

        // Store complete conversation for Firebase sync
        completeConversation = updatedChat;

        // Update the conversation list
        const newHistory = [
          updatedChat,
          ...prev.filter(c => c.id !== conversationId)
        ];

        // Update local storage immediately
        localStorage.setItem('conversationHistory', JSON.stringify(newHistory));
        console.log('💾 Local storage updated with conversation:', conversationId);
        console.log('📊 New history length:', newHistory.length);

        return newHistory;
      });

      // Sync with Firebase if user is logged in
      if (this.currentUser?.uid && completeConversation) {
        if (this.isOnline) {
          try {
            await firebaseStorageService.saveConversation(this.currentUser.uid, completeConversation);
            console.log('✅ Conversation saved to Firebase:', conversationId);
          } catch (firebaseError) {
            console.error('❌ Firebase save failed, adding to pending operations:', firebaseError);
            this.addPendingOperation('update', completeConversation);
          }
        } else {
          console.log('📴 Offline - adding to pending operations:', conversationId);
          this.addPendingOperation('update', completeConversation);
        }
      } else if (!this.currentUser?.uid) {
        console.log('👤 No user logged in - conversation saved locally only');
      }

      return true;
    } catch (error) {
      console.error('❌ Error updating conversation:', error);
      throw error;
    }
  }

  /**
   * Load conversations from Firebase (source of truth)
   */
  async loadConversations(setConversationHistory) {
    try {
      if (!this.currentUser?.uid) {
        console.log('👤 No user logged in, clearing conversations and creating anonymous chat');
        setConversationHistory([]);
        localStorage.removeItem('conversationHistory');
        return [];
      }

      console.log('📥 Loading conversations from Firebase for user:', this.currentUser.email);

      // Get local conversations for potential sync
      const localConversations = JSON.parse(localStorage.getItem('conversationHistory') || '[]');

      // Sync with Firebase (Firebase is source of truth)
      const firebaseConversations = await firebaseStorageService.syncConversations(
        this.currentUser.uid,
        localConversations
      );

      // Update local state with Firebase data
      setConversationHistory(firebaseConversations);

      console.log(`✅ Loaded ${firebaseConversations.length} conversations from Firebase`);

      // If no conversations exist, we'll let the App.jsx create a new one
      if (firebaseConversations.length === 0) {
        console.log('📝 No conversations found for user, will create new conversation');
      }

      return firebaseConversations;

    } catch (error) {
      console.error('❌ Error loading conversations:', error);

      if (this.currentUser?.uid) {
        // If user is logged in but Firebase failed, try to get their conversations directly
        try {
          const directConversations = await firebaseStorageService.getUserConversations(this.currentUser.uid);
          setConversationHistory(directConversations);
          localStorage.setItem('conversationHistory', JSON.stringify(directConversations));
          console.log(`🔄 Fallback: Loaded ${directConversations.length} conversations directly from Firebase`);
          return directConversations;
        } catch (directError) {
          console.error('❌ Direct Firebase load also failed:', directError);
        }
      }

      // Final fallback - clear everything for logged in users, keep local for anonymous
      if (this.currentUser?.uid) {
        console.log('🧹 Clearing conversations due to Firebase errors for logged-in user');
        setConversationHistory([]);
        localStorage.removeItem('conversationHistory');
        return [];
      } else {
        // For anonymous users, keep local conversations
        const localConversations = JSON.parse(localStorage.getItem('conversationHistory') || '[]');
        setConversationHistory(localConversations);
        return localConversations;
      }
    }
  }

  /**
   * Clear all conversations (logout)
   */
  async clearConversations(setConversationHistory, setMessages, setCurrentChatId) {
    try {
      console.log('🧹 Clearing all conversations (logout)');
      
      setConversationHistory([]);
      setMessages([]);
      setCurrentChatId(null);
      
      localStorage.removeItem('conversationHistory');
      localStorage.removeItem('currentChatId');
      
      this.currentUser = null;
      this.pendingOperations = [];
      
      console.log('✅ All conversations cleared');
    } catch (error) {
      console.error('❌ Error clearing conversations:', error);
    }
  }

  /**
   * Add operation to pending queue for offline sync
   */
  addPendingOperation(action, data) {
    this.pendingOperations.push({
      action,
      data,
      timestamp: Date.now()
    });
    console.log('📝 Added pending operation:', action, data.id);
  }

  /**
   * Process pending operations when back online
   */
  async processPendingOperations() {
    if (!this.currentUser?.uid || this.pendingOperations.length === 0) return;

    console.log(`🔄 Processing ${this.pendingOperations.length} pending operations...`);

    const operations = [...this.pendingOperations];
    this.pendingOperations = [];

    for (const operation of operations) {
      try {
        await firebaseStorageService.performRealTimeSync(
          this.currentUser.uid,
          operation.action,
          operation.data
        );
        console.log('✅ Processed pending operation:', operation.action, operation.data.id);
      } catch (error) {
        console.error('❌ Failed to process pending operation:', error);
        // Re-add failed operation to queue
        this.pendingOperations.push(operation);
      }
    }
  }
}

// Export singleton instance
const conversationStateManager = new ConversationStateManager();
export default conversationStateManager;
