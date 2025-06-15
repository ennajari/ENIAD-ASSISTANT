import { 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  getDocs, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  limit,
  serverTimestamp 
} from 'firebase/firestore';
import { db } from '../firebase';

class FirebaseStorageService {
  constructor() {
    this.conversationsCollection = 'conversations';
    this.usersCollection = 'users';
  }

  /**
   * Save user profile information
   */
  async saveUserProfile(user) {
    if (!db || !user) return null;

    try {
      const userRef = doc(db, this.usersCollection, user.uid);
      const userData = {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
        lastLogin: serverTimestamp(),
        updatedAt: serverTimestamp()
      };

      await setDoc(userRef, userData, { merge: true });
      console.log('✅ User profile saved:', user.email);
      return userData;
    } catch (error) {
      console.error('❌ Error saving user profile:', error);
      throw error;
    }
  }

  /**
   * Get user profile
   */
  async getUserProfile(userId) {
    if (!db || !userId) return null;

    try {
      const userRef = doc(db, this.usersCollection, userId);
      const userSnap = await getDoc(userRef);
      
      if (userSnap.exists()) {
        return userSnap.data();
      }
      return null;
    } catch (error) {
      console.error('❌ Error getting user profile:', error);
      return null;
    }
  }

  /**
   * Save conversation to Firebase
   */
  async saveConversation(userId, conversation) {
    if (!db || !userId || !conversation) {
      console.log('❌ Cannot save conversation: missing db, userId, or conversation');
      return null;
    }

    try {
      console.log('💾 Saving conversation to Firebase:', {
        id: conversation.id,
        title: conversation.title,
        messageCount: conversation.messages?.length || 0,
        userId: userId
      });

      const conversationRef = doc(db, this.conversationsCollection, conversation.id);

      // Clean conversation data to remove undefined values
      const cleanedConversation = this.cleanConversationData(conversation);

      const conversationData = {
        ...cleanedConversation,
        userId: userId,
        lastUpdated: new Date().toISOString(), // Use consistent field name
        updatedAt: serverTimestamp(), // Keep for Firebase ordering
        createdAt: cleanedConversation.createdAt || new Date().toISOString()
      };

      await setDoc(conversationRef, conversationData, { merge: true });
      console.log('✅ Conversation saved to Firebase:', conversation.id);
      return conversationData;
    } catch (error) {
      console.error('❌ Error saving conversation:', error);
      console.error('Error details:', {
        code: error.code,
        message: error.message,
        conversationId: conversation.id,
        userId: userId
      });
      throw error;
    }
  }

  /**
   * Clean conversation data to remove undefined values
   */
  cleanConversationData(conversation) {
    if (!conversation || typeof conversation !== 'object') {
      return {
        id: Date.now().toString(),
        title: 'New Conversation',
        messages: [],
        createdAt: new Date().toISOString(),
        lastUpdated: new Date().toISOString()
      };
    }

    const cleaned = {};

    // Only include defined values
    Object.keys(conversation).forEach(key => {
      const value = conversation[key];
      if (value !== undefined && value !== null) {
        if (Array.isArray(value)) {
          // Clean array items
          cleaned[key] = value.map(item => {
            if (typeof item === 'object' && item !== null) {
              return this.cleanObject(item);
            }
            return item !== undefined && item !== null ? item : null;
          }).filter(item => item !== null);
        } else if (typeof value === 'object') {
          // Clean object properties
          const cleanedObj = this.cleanObject(value);
          if (Object.keys(cleanedObj).length > 0) {
            cleaned[key] = cleanedObj;
          }
        } else {
          cleaned[key] = value;
        }
      }
    });

    // Ensure required fields have default values
    return {
      id: cleaned.id || Date.now().toString(),
      title: cleaned.title || 'New Conversation',
      messages: cleaned.messages || [],
      createdAt: cleaned.createdAt || new Date().toISOString(),
      lastUpdated: cleaned.lastUpdated || new Date().toISOString(),
      ...cleaned
    };
  }

  /**
   * Clean object properties recursively
   */
  cleanObject(obj) {
    if (!obj || typeof obj !== 'object') return {};

    const cleaned = {};
    Object.keys(obj).forEach(key => {
      const value = obj[key];
      if (value !== undefined && value !== null) {
        if (typeof value === 'object' && !Array.isArray(value)) {
          const cleanedNested = this.cleanObject(value);
          if (Object.keys(cleanedNested).length > 0) {
            cleaned[key] = cleanedNested;
          }
        } else {
          cleaned[key] = value;
        }
      }
    });
    return cleaned;
  }

  /**
   * Get all conversations for a user
   */
  async getUserConversations(userId) {
    if (!db || !userId) {
      console.log('❌ Cannot get conversations: missing db or userId');
      return [];
    }

    try {
      console.log('📥 Getting conversations for user:', userId);
      const conversationsRef = collection(db, this.conversationsCollection);

      // Use simple query without orderBy to avoid index requirement
      const q = query(
        conversationsRef,
        where('userId', '==', userId),
        limit(100) // Increased limit since we'll sort in memory
      );

      const querySnapshot = await getDocs(q);
      const conversations = [];

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        conversations.push({
          id: doc.id,
          ...data
        });
        console.log('📄 Found conversation:', {
          id: doc.id,
          title: data.title,
          messageCount: data.messages?.length || 0,
          userId: data.userId,
          lastUpdated: data.lastUpdated || data.updatedAt
        });
      });

      // Sort conversations by lastUpdated/updatedAt in memory (most recent first)
      conversations.sort((a, b) => {
        const dateA = new Date(a.lastUpdated || a.updatedAt || a.createdAt || 0);
        const dateB = new Date(b.lastUpdated || b.updatedAt || b.createdAt || 0);
        return dateB - dateA; // Descending order (newest first)
      });

      // Limit to 50 most recent conversations
      const limitedConversations = conversations.slice(0, 50);

      console.log(`✅ Retrieved ${limitedConversations.length} conversations for user (sorted by date):`, userId);
      return limitedConversations;
    } catch (error) {
      console.error('❌ Error getting user conversations:', error);
      console.error('Error details:', {
        code: error.code,
        message: error.message,
        userId: userId
      });

      // If the error is still about indexes, try an even simpler query
      if (error.code === 'failed-precondition') {
        console.log('🔄 Retrying with basic query (no sorting)...');
        try {
          const basicQuery = query(
            collection(db, this.conversationsCollection),
            where('userId', '==', userId)
          );

          const basicSnapshot = await getDocs(basicQuery);
          const basicConversations = [];

          basicSnapshot.forEach((doc) => {
            basicConversations.push({
              id: doc.id,
              ...doc.data()
            });
          });

          // Sort in memory
          basicConversations.sort((a, b) => {
            const dateA = new Date(a.lastUpdated || a.updatedAt || a.createdAt || 0);
            const dateB = new Date(b.lastUpdated || b.updatedAt || b.createdAt || 0);
            return dateB - dateA;
          });

          console.log(`✅ Retrieved ${basicConversations.length} conversations with basic query`);
          return basicConversations.slice(0, 50);
        } catch (basicError) {
          console.error('❌ Basic query also failed:', basicError);
          return [];
        }
      }

      return [];
    }
  }

  /**
   * Get a specific conversation
   */
  async getConversation(conversationId) {
    if (!db || !conversationId) return null;

    try {
      const conversationRef = doc(db, this.conversationsCollection, conversationId);
      const conversationSnap = await getDoc(conversationRef);
      
      if (conversationSnap.exists()) {
        return {
          id: conversationSnap.id,
          ...conversationSnap.data()
        };
      }
      return null;
    } catch (error) {
      console.error('❌ Error getting conversation:', error);
      return null;
    }
  }

  /**
   * Update conversation
   */
  async updateConversation(conversationId, updates) {
    if (!db || !conversationId || !updates) return null;

    try {
      const conversationRef = doc(db, this.conversationsCollection, conversationId);
      const updateData = {
        ...updates,
        updatedAt: serverTimestamp()
      };

      await updateDoc(conversationRef, updateData);
      console.log('✅ Conversation updated:', conversationId);
      return updateData;
    } catch (error) {
      console.error('❌ Error updating conversation:', error);
      throw error;
    }
  }

  /**
   * Delete conversation from Firebase and local storage
   */
  async deleteConversation(userId, conversationId) {
    if (!db || !userId || !conversationId) return false;

    try {
      // Delete from Firebase
      const conversationRef = doc(db, this.conversationsCollection, conversationId);
      await deleteDoc(conversationRef);

      // Update local storage immediately
      const localConversations = JSON.parse(localStorage.getItem('conversationHistory') || '[]');
      const updatedConversations = localConversations.filter(conv => conv.id !== conversationId);
      localStorage.setItem('conversationHistory', JSON.stringify(updatedConversations));

      console.log('✅ Conversation deleted from Firebase and local storage:', conversationId);
      return true;
    } catch (error) {
      console.error('❌ Error deleting conversation:', error);
      throw error;
    }
  }

  /**
   * Rename conversation in Firebase and local storage
   */
  async renameConversation(userId, conversationId, newTitle) {
    if (!db || !userId || !conversationId || !newTitle) return false;

    try {
      // Update in Firebase
      const conversationRef = doc(db, this.conversationsCollection, conversationId);
      await updateDoc(conversationRef, {
        title: newTitle,
        updatedAt: serverTimestamp()
      });

      // Update local storage immediately
      const localConversations = JSON.parse(localStorage.getItem('conversationHistory') || '[]');
      const updatedConversations = localConversations.map(conv =>
        conv.id === conversationId
          ? { ...conv, title: newTitle, updatedAt: new Date().toISOString() }
          : conv
      );
      localStorage.setItem('conversationHistory', JSON.stringify(updatedConversations));

      console.log('✅ Conversation renamed in Firebase and local storage:', conversationId);
      return true;
    } catch (error) {
      console.error('❌ Error renaming conversation:', error);
      throw error;
    }
  }

  /**
   * Sync conversations with Firebase (Firebase is the source of truth)
   */
  async syncConversations(userId, localConversations = []) {
    if (!db || !userId) return [];

    try {
      console.log('🔄 Syncing conversations with Firebase (Firebase as source of truth)...');

      // Get all conversations from Firebase (this is the authoritative source)
      const firebaseConversations = await this.getUserConversations(userId);

      // If we have local conversations that don't exist in Firebase, save them
      if (Array.isArray(localConversations) && localConversations.length > 0) {
        const firebaseConversationIds = new Set(firebaseConversations.map(c => c.id));

        const newLocalConversations = localConversations.filter(conv =>
          !firebaseConversationIds.has(conv.id) && conv.userId === userId
        );

        if (newLocalConversations.length > 0) {
          console.log(`📤 Uploading ${newLocalConversations.length} new local conversations to Firebase...`);
          const uploadPromises = newLocalConversations.map(conversation =>
            this.saveConversation(userId, conversation)
          );
          await Promise.all(uploadPromises);

          // Get updated conversations from Firebase
          const updatedFirebaseConversations = await this.getUserConversations(userId);

          // Update local storage with Firebase data
          localStorage.setItem('conversationHistory', JSON.stringify(updatedFirebaseConversations));

          console.log(`✅ Sync completed: ${updatedFirebaseConversations.length} total conversations`);
          return updatedFirebaseConversations;
        }
      }

      // Update local storage with Firebase data (Firebase is source of truth)
      localStorage.setItem('conversationHistory', JSON.stringify(firebaseConversations));

      console.log(`✅ Sync completed: ${firebaseConversations.length} conversations loaded from Firebase`);
      return firebaseConversations;

    } catch (error) {
      console.error('❌ Error syncing conversations:', error);
      // On error, return local conversations as fallback but don't update Firebase
      return Array.isArray(localConversations) ? localConversations : [];
    }
  }

  /**
   * Real-time conversation state synchronization
   */
  async performRealTimeSync(userId, action, conversationData) {
    if (!db || !userId) return false;

    try {
      switch (action) {
        case 'create':
        case 'update':
          await this.saveConversation(userId, conversationData);
          break;

        case 'delete':
          await this.deleteConversation(userId, conversationData.id);
          break;

        case 'rename':
          await this.renameConversation(userId, conversationData.id, conversationData.title);
          break;

        default:
          console.warn('Unknown sync action:', action);
          return false;
      }

      console.log(`✅ Real-time sync completed: ${action} for conversation ${conversationData.id}`);
      return true;

    } catch (error) {
      console.error(`❌ Real-time sync failed for ${action}:`, error);
      throw error;
    }
  }

  /**
   * Clean up old conversations (keep last 30 days)
   */
  async cleanupOldConversations(userId, daysToKeep = 30) {
    if (!db || !userId) return 0;

    try {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - daysToKeep);

      // Get all user conversations first, then filter in memory to avoid index issues
      const allConversations = await this.getUserConversations(userId);
      const oldConversations = allConversations.filter(conv => {
        const updatedAt = new Date(conv.lastUpdated || conv.updatedAt || conv.createdAt || 0);
        return updatedAt < cutoffDate;
      });

      if (oldConversations.length === 0) {
        console.log('✅ No old conversations to clean up');
        return 0;
      }

      const deletePromises = oldConversations.map(conv =>
        deleteDoc(doc(db, this.conversationsCollection, conv.id))
      );

      await Promise.all(deletePromises);
      console.log(`✅ Cleaned up ${deletePromises.length} old conversations`);

      return deletePromises.length;
    } catch (error) {
      console.error('❌ Error cleaning up conversations:', error);
      return 0;
    }
  }

  /**
   * Get conversation statistics for user
   */
  async getConversationStats(userId) {
    if (!db || !userId) return null;

    try {
      const conversations = await this.getUserConversations(userId);
      
      const stats = {
        totalConversations: conversations.length,
        totalMessages: conversations.reduce((sum, conv) => sum + (conv.messages?.length || 0), 0),
        lastActivity: conversations.length > 0 ? conversations[0].updatedAt : null,
        averageMessagesPerConversation: conversations.length > 0 
          ? Math.round(conversations.reduce((sum, conv) => sum + (conv.messages?.length || 0), 0) / conversations.length)
          : 0
      };

      return stats;
    } catch (error) {
      console.error('❌ Error getting conversation stats:', error);
      return null;
    }
  }
}

// Export singleton instance
const firebaseStorageService = new FirebaseStorageService();
export default firebaseStorageService;
