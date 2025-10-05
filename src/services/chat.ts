import { 
  collection, 
  doc, 
  addDoc, 
  query, 
  orderBy, 
  onSnapshot, 
  updateDoc, 
  arrayUnion,
  serverTimestamp,
  where,
  getDocs,
  getDoc
} from 'firebase/firestore';
import { db } from './firebase';
import type { ChatMessage, Conversation } from '../types';

export class ChatService {
  // Create a new conversation
  static async createConversation(
    participants: string[], 
    type: 'direct' | 'service_request',
    serviceRequestId?: string
  ): Promise<string> {
    const conversationData = {
      participants,
      type,
      serviceRequestId: serviceRequestId || null,
      isActive: true,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      metadata: {}
    };

    const docRef = await addDoc(collection(db, 'conversations'), conversationData);
    return docRef.id;
  }

  // Send a message in a conversation
  static async sendMessage(
    conversationId: string,
    senderId: string,
    content: string,
    type: 'text' | 'image' | 'file' | 'location' | 'quote' = 'text',
    metadata?: any
  ): Promise<void> {
    const messageData = {
      conversationId,
      senderId,
      content,
      type,
      timestamp: serverTimestamp(),
      readBy: [senderId],
      metadata: metadata || {}
    };

    // Add message to messages collection
    await addDoc(collection(db, 'messages'), messageData);

    // Update conversation's last message and timestamp
    const conversationRef = doc(db, 'conversations', conversationId);
    await updateDoc(conversationRef, {
      updatedAt: serverTimestamp()
    });
  }

  // Get conversations for a user
  static getUserConversations(userId: string, callback: (conversations: Conversation[]) => void) {
    const q = query(
      collection(db, 'conversations'),
      where('participants', 'array-contains', userId),
      orderBy('updatedAt', 'desc')
    );

    return onSnapshot(q, async (snapshot) => {
      const conversations: Conversation[] = [];
      
      for (const docSnap of snapshot.docs) {
        const data = docSnap.data();
        
        // Get last message for this conversation
        const lastMessageQuery = query(
          collection(db, 'messages'),
          where('conversationId', '==', docSnap.id),
          orderBy('timestamp', 'desc')
        );
        
        const lastMessageSnapshot = await getDocs(lastMessageQuery);
        const lastMessage = lastMessageSnapshot.docs[0]?.data() as ChatMessage;

        conversations.push({
          id: docSnap.id,
          participants: data.participants,
          type: data.type,
          serviceRequestId: data.serviceRequestId,
          isActive: data.isActive,
          createdAt: data.createdAt?.toDate?.()?.toISOString() || data.createdAt,
          updatedAt: data.updatedAt?.toDate?.()?.toISOString() || data.updatedAt,
          lastMessage: lastMessage ? {
            ...lastMessage,
            timestamp: (lastMessage.timestamp as any)?.toDate?.()?.toISOString() || lastMessage.timestamp
          } : undefined,
          metadata: data.metadata
        });
      }
      
      callback(conversations);
    });
  }

  // Get messages for a conversation (real-time)
  static getConversationMessages(
    conversationId: string, 
    callback: (messages: ChatMessage[]) => void
  ) {
    const q = query(
      collection(db, 'messages'),
      where('conversationId', '==', conversationId),
      orderBy('timestamp', 'asc')
    );

    return onSnapshot(q, (snapshot) => {
      const messages: ChatMessage[] = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        timestamp: (doc.data().timestamp as any)?.toDate?.()?.toISOString() || doc.data().timestamp
      } as ChatMessage));
      
      callback(messages);
    });
  }

  // Mark messages as read
  static async markAsRead(conversationId: string, userId: string): Promise<void> {
    const q = query(
      collection(db, 'messages'),
      where('conversationId', '==', conversationId),
      where('readBy', 'not-in', [[userId]])
    );

    const snapshot = await getDocs(q);
    
    const updatePromises = snapshot.docs.map(doc => 
      updateDoc(doc.ref, {
        readBy: arrayUnion(userId)
      })
    );

    await Promise.all(updatePromises);
  }

  // Find or create direct conversation between two users
  static async findOrCreateDirectConversation(user1Id: string, user2Id: string): Promise<string> {
    // Check if conversation already exists
    const q = query(
      collection(db, 'conversations'),
      where('type', '==', 'direct'),
      where('participants', 'in', [
        [user1Id, user2Id],
        [user2Id, user1Id]
      ])
    );

    const snapshot = await getDocs(q);
    
    if (!snapshot.empty) {
      return snapshot.docs[0].id;
    }

    // Create new conversation
    return this.createConversation([user1Id, user2Id], 'direct');
  }

  // Get unread message count for user
  static async getUnreadCount(userId: string): Promise<number> {
    const q = query(
      collection(db, 'messages'),
      where('readBy', 'not-in', [[userId]])
    );

    const snapshot = await getDocs(q);
    return snapshot.size;
  }
}