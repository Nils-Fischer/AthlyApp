import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { CoreAssistantMessage } from "ai";
import { ChatMessage } from "~/lib/types";
import { createUserMessage, toChatMessage } from "~/lib/Chat/chatUtils";
import { randomUUID } from "expo-crypto";

const API_URL = "https://api-proxy-worker.nils-fischer7.workers.dev";

const INITIAL_MESSAGE: ChatMessage = {
  id: randomUUID(),
  role: "assistant",
  content: [
    { type: "text", text: "No Analysis" },
    { type: "text", text: "Hey! Ich bin Alex, dein AI Coach. Wie kann ich dir helfen?" },
  ],
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
        console.log("sendMessage called with message:", message);
        get().setError(null);

        const chatMessage = createUserMessage(message, images);
        set((state) => ({
          messages: [...state.messages, chatMessage],
        }));

        try {
          set({ isLoading: true });
          console.log("setIsLoading(true) in sendMessage");

          console.log("Fetching API with message:", message, "and context:", get().context);
          const lastMessages = get().messages.slice(-5);
          const response = await fetch(`${API_URL}/api/chat`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              provider: "google",
              messages: lastMessages,
              data: data,
              context: get().context,
            }),
          });
          console.log("API response received:", response);

          const responseBody = await response.text();

          if (!response.ok) {
            console.error("API error response:", response.status, responseBody);
            set({ error: responseBody || "Failed to send message" });
            set((state) => ({
              messages: state.messages.map((msg) => (msg.id === chatMessage.id ? { ...msg, status: "failed" } : msg)),
            }));
            set({ isLoading: false });
            return;
          }

          console.log("responseText", responseBody);
          const result = JSON.parse(responseBody).response as CoreAssistantMessage;
          set((state) => ({
            messages: [...state.messages, toChatMessage(result)],
          }));

          lastMessages.forEach((message) => get().updateMessageStatus(message.id, "sent"));
        } catch (error) {
          const errorMsg = error instanceof Error ? error.message : "Unexpected error occurred";
          console.error("sendMessage error:", errorMsg, error);
          set({ error: errorMsg });
          set((state) => ({
            messages: state.messages.map((msg) => (msg.id === chatMessage.id ? { ...msg, status: "failed" } : msg)),
          }));
          console.error("Failed to send message:", error);
        } finally {
          set({ isLoading: false });
          console.log("setIsLoading(false) in finally block");
        }
      },
    }),
    {
      name: "chat-storage",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
