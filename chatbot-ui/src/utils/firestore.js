import { getFirestore, collection, addDoc, updateDoc, deleteDoc, doc, getDocs, query, where } from 'firebase/firestore';
import { app } from '../firebase';

const db = getFirestore(app);

export const saveConversation = async (userId, chatId, messages, title) => {
  try {
    const conversationsRef = collection(db, 'conversations');
    await addDoc(conversationsRef, {
      userId,
      chatId,
      messages,
      title,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error saving conversation:', error);
  }
};

export const getConversations = async (userId) => {
  try {
    const conversationsRef = collection(db, 'conversations');
    const q = query(conversationsRef, where('userId', '==', userId));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error getting conversations:', error);
    return [];
  }
};