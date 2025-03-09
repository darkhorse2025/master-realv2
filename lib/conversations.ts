interface Conversation {
    id: string; // Unique ID for react rendering and loggin purposes
    role: string; // "user" or "assistant"
    text: string; // User or assistant message
    timestamp: string; // ISO string for message time
    isFinal: boolean; // Whether the transcription is final
    status?: "speaking" | "processing" | "final"; // Status for real-time conversation states
  }
import firebaseConfig from '@/config/firebase.config';
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, push } from 'firebase/database';

initializeApp(firebaseConfig);
const database = getDatabase();

interface Conversation {
    id: string; // Unique ID for react rendering and loggin purposes
    role: string; // "user" or "assistant"
    text: string; // User or assistant message
    timestamp: string; // ISO string for message time
    isFinal: boolean; // Whether the transcription is final
    status?: "speaking" | "processing" | "final"; // Status for real-time conversation states
  }

const saveConversation = async (conversation: Conversation) => {
    try {
        await push(ref(database, 'conversations'), conversation);
        console.log("Conversation saved to Firebase");
    } catch (error) {
        console.error("Error saving conversation to Firebase:", error);
    }
};
  
  export type { Conversation };
  export { saveConversation };lndpsdsd e