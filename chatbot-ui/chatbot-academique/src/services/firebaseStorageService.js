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
    if (!db || !userId || !conversation) return null;

    try {
      const conversationRef = doc(db, this.conversationsCollection, conversation.id);
      const conversationData = {
        ...conversation,
        userId: userId,
        updatedAt: serverTimestamp(),
        createdAt: conversation.createdAt || serverTimestamp()
      };

      await setDoc(conversationRef, conversationData, { merge: true });
      console.log('✅ Conversation saved:', conversation.id);
      return conversationData;
    } catch (error) {
      console.error('❌ Error saving conversation:', error);
      throw error;
    }
  }

  /**
   * Get all conversations for a user
   */
  async getUserConversations(userId) {
    if (!db || !userId) return [];

    try {
      const conversationsRef = collection(db, this.conversationsCollection);
      const q = query(
        conversationsRef,
        where('userId', '==', userId),
        orderBy('updatedAt', 'desc'),
        limit(50) // Limit to last 50 conversations
      );

      const querySnapshot = await getDocs(q);
      const conversations = [];
      
      querySnapshot.forEach((doc) => {
        conversations.push({
          id: doc.id,
          ...doc.data()
        });
      });

      console.log(`✅ Retrieved ${conversations.length} conversations for user`);
      return conversations;
    } catch (error) {
      console.error('❌ Error getting user conversations:', error);
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
   * Delete conversation
   */
  async deleteConversation(conversationId) {
    if (!db || !conversationId) return false;

    try {
      const conversationRef = doc(db, this.conversationsCollection, conversationId);
      await deleteDoc(conversationRef);
      console.log('✅ Conversation deleted:', conversationId);
      return true;
    } catch (error) {
      console.error('❌ Error deleting conversation:', error);
      throw error;
    }
  }

  /**
   * Sync local conversations with Firebase
   */
  async syncConversations(userId, localConversations) {
    if (!db || !userId || !Array.isArray(localConversations)) return [];

    try {
      console.log('🔄 Syncing conversations with Firebase...');
      
      // Get existing conversations from Firebase
      const firebaseConversations = await this.getUserConversations(userId);
      const firebaseConversationIds = new Set(firebaseConversations.map(c => c.id));

      // Save local conversations that don't exist in Firebase
      const syncPromises = localConversations.map(async (conversation) => {
        if (!firebaseConversationIds.has(conversation.id)) {
          return this.saveConversation(userId, conversation);
        }
        return null;
      });

      await Promise.all(syncPromises);

      // Return all conversations (Firebase + newly synced)
      const allConversations = await this.getUserConversations(userId);
      console.log(`✅ Sync completed: ${allConversations.length} total conversations`);
      
      return allConversations;
    } catch (error) {
      console.error('❌ Error syncing conversations:', error);
      return localConversations; // Return local conversations as fallback
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

      const conversationsRef = collection(db, this.conversationsCollection);
      const q = query(
        conversationsRef,
        where('userId', '==', userId),
        where('updatedAt', '<', cutoffDate)
      );

      const querySnapshot = await getDocs(q);
      const deletePromises = [];

      querySnapshot.forEach((doc) => {
        deletePromises.push(deleteDoc(doc.ref));
      });

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
