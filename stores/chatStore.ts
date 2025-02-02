import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Message } from "~/lib/Chat/types";

const INITIAL_MESSAGE: Message = {
  id: "welcome",
  message: "Hey! Ich bin Alex dein AI Coach. Wie kann ich dir helfen?",
  content: [],
  sender: "ai",
  timestamp: new Date().toISOString(),
  status: "sent",
};

interface ChatState {
  messages: Message[];
  context: string;
  addMessage: (message: Message) => void;
  updateMessageStatus: (messageId: string, status: "sent" | "sending" | "failed") => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  clearMessages: () => void;
  setContext: (context: string) => void;
}

export const useChatStore = create<ChatState>()(
  persist(
    (set) => ({
      messages: [INITIAL_MESSAGE],
      context: "",
      isLoading: false,
      addMessage: (message) =>
        set((state) => ({
          messages: [...state.messages, message],
        })),
      clearMessages: () =>
        set({
          messages: [INITIAL_MESSAGE],
        }),
      setIsLoading: (loading) =>
        set({
          isLoading: loading,
        }),
      updateMessageStatus: (messageId, status) =>
        set((state) => ({
          messages: state.messages.map((message) => (message.id === messageId ? { ...message, status } : message)),
        })),
      setContext: (context) =>
        set({
          context,
        }),
    }),
    {
      name: "chat-storage",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
