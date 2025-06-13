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
      const conversation = {
        ...conversationData,
        userId: this.currentUser?.uid,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      // Update local state immediately
      setConversationHistory(prev => [conversation, ...prev]);
      
      // Update local storage
      const currentHistory = JSON.parse(localStorage.getItem('conversationHistory') || '[]');
      const updatedHistory = [conversation, ...currentHistory];
      localStorage.setItem('conversationHistory', JSON.stringify(updatedHistory));

      // Sync with Firebase if user is logged in
      if (this.currentUser?.uid) {
        if (this.isOnline) {
          await firebaseStorageService.performRealTimeSync(
            this.currentUser.uid, 
            'create', 
            conversation
          );
          console.log('✅ New conversation synced to Firebase:', conversation.id);
        } else {
          this.addPendingOperation('create', conversation);
        }
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
      const updatedConversation = {
        id: conversationId,
        messages: updatedMessages,
        lastUpdated: new Date().toISOString(),
        userId: this.currentUser?.uid
      };

      // Update local state
      setConversationHistory(prev => {
        const existingChat = prev.find(c => c.id === conversationId);
        const title = existingChat?.title || 
          updatedMessages.find(m => m.role === 'user')?.content?.substring(0, 30) || 
          'Nouvelle conversation';

        const updatedChat = {
          ...existingChat,
          ...updatedConversation,
          title: title.length > 30 ? title.substring(0, 30) + '...' : title
        };

        const newHistory = [
          updatedChat,
          ...prev.filter(c => c.id !== conversationId)
        ];

        // Update local storage
        localStorage.setItem('conversationHistory', JSON.stringify(newHistory));
        
        return newHistory;
      });

      // Sync with Firebase if user is logged in
      if (this.currentUser?.uid) {
        if (this.isOnline) {
          await firebaseStorageService.performRealTimeSync(
            this.currentUser.uid, 
            'update', 
            updatedConversation
          );
          console.log('✅ Conversation updated in Firebase:', conversationId);
        } else {
          this.addPendingOperation('update', updatedConversation);
        }
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
        console.log('👤 No user logged in, loading local conversations only');
        const localConversations = JSON.parse(localStorage.getItem('conversationHistory') || '[]');
        setConversationHistory(localConversations);
        return localConversations;
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
      return firebaseConversations;
      
    } catch (error) {
      console.error('❌ Error loading conversations:', error);
      
      // Fallback to local storage
      const localConversations = JSON.parse(localStorage.getItem('conversationHistory') || '[]');
      setConversationHistory(localConversations);
      return localConversations;
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
