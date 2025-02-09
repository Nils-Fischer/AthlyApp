import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { CoreAssistantMessage } from "ai";
import { ChatMessage } from "~/lib/types";
import { createUserMessage, extractAssistantContent, toChatMessage } from "~/lib/Chat/chatUtils";
import { randomUUID } from "expo-crypto";

const API_URL = "https://api-proxy-worker.nils-fischer7.workers.dev";

const INITIAL_MESSAGE: ChatMessage = {
  id: randomUUID(),
  role: "assistant",
  content: [{ type: "text", text: "Hey! Ich bin Alex, dein AI Coach. Wie kann ich dir helfen?" }],
  createdAt: new Date(),
  status: "sent",
};

interface MessageData {
  [key: string]: any;
}

interface ChatState {
  messages: ChatMessage[];
  context: string;
  error: string | null;
  sendMessage: (message: string, images: string[], data: MessageData) => Promise<void>;
  updateMessageStatus: (messageId: string, status: "sent" | "sending" | "failed") => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  clearMessages: () => void;
  setContext: (context: string) => void;
  setError: (error: string | null) => void;
}

export const useChatStore = create<ChatState>()(
  persist(
    (set, get) => ({
      messages: [INITIAL_MESSAGE],
      context: "",
      error: null,
      isLoading: false,
      clearMessages: () =>
        set({
          messages: [INITIAL_MESSAGE],
        }),
      setIsLoading: (loading) =>
        set({
          isLoading: loading,
        }),
      setError: (error: string | null) =>
        set({
          error,
        }),
      updateMessageStatus: (messageId, status) =>
        set((state) => ({
          messages: state.messages.map((message) => (message.id === messageId ? { ...message, status } : message)),
        })),
      setContext: (context) =>
        set({
          context,
        }),
      sendMessage: async (message: string, images: string[], data: MessageData) => {
        get().setError(null);

        const chatMessage = createUserMessage(message, images);
        set((state) => ({
          messages: [...state.messages, chatMessage],
        }));

        try {
          set({ isLoading: true });

          const response = await fetch(`${API_URL}/api/chat`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Accept-Encoding": "gzip, deflate",
            },
            body: JSON.stringify({
              provider: "google",
              messages: get().messages.slice(-5),
              data: data,
              context: get().context,
            }),
          });

          if (!response.ok) {
            const errorText = await response.text();
            set({ error: errorText || "Failed to send message" });
            set((state) => ({
              messages: state.messages.map((msg) => (msg.id === chatMessage.id ? { ...msg, status: "failed" } : msg)),
            }));
            set({ isLoading: false });
            return;
          }

          const responseText = await response.text();
          console.log("responseText", responseText);
          const result = JSON.parse(responseText).response as CoreAssistantMessage;
          console.log(extractAssistantContent(result));
          set((state) => ({
            messages: [...state.messages, toChatMessage(result)],
          }));

          get().updateMessageStatus(chatMessage.id, "sent");
        } catch (error) {
          const errorMsg = error instanceof Error ? error.message : "Unexpected error occurred";
          set({ error: errorMsg });
          set((state) => ({
            messages: state.messages.map((msg) => (msg.id === chatMessage.id ? { ...msg, status: "failed" } : msg)),
          }));
          console.error("Failed to send message:", error);
        } finally {
          set({ isLoading: false });
        }
      },
    }),
    {
      name: "chat-storage",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
