import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AssistantChatMessage, ChatMessage, ChatResponse, Routine, WorkoutSession } from "~/lib/types";
import { createUserMessage, createWorkoutReviewMessage } from "~/lib/Chat/chatUtils";
import { randomUUID } from "expo-crypto";
import { CoreMessage } from "ai";

const API_URL = "https://api-proxy-worker.nils-fischer7.workers.dev";

const INITIAL_MESSAGE_TEXT = "Hey! Ich bin Alex, dein AI Coach. Wie kann ich dir helfen?";

const INITIAL_TECHNICAL_MESSAGE =
  "<thinking>Das ist meine erste Nachricht an den Nutzer. Ich muss mich erst einmal selbst vorstellen.</thinking><text>Hey! Ich bin Alex, dein AI Coach. Wie kann ich dir helfen?</text>";

const INITIAL_CHAT_MESSAGE: AssistantChatMessage = {
  role: "assistant",
  id: randomUUID(),
  createdAt: new Date(),
  status: "sent",
  message: INITIAL_MESSAGE_TEXT,
  technicalMessage: [
    {
      role: "assistant",
      content: [{ type: "text", text: INITIAL_TECHNICAL_MESSAGE }],
    },
  ],
};

interface ChatState {
  messages: ChatMessage[];
  context: string;
  error: string | null;
  sendChatMessage: (
    message: string,
    images: string[],
    userRoutines: Routine[],
    userInfo: string,
    audioUrl?: string
  ) => Promise<{ text: string; routine?: Routine } | undefined>;
  sendWorkoutReviewMessage: (
    session: WorkoutSession,
    userRoutines: Routine[],
    userInfo: string
  ) => Promise<{ text: string; routine?: Routine } | undefined>;
  sendMessage: (
    message: ChatMessage,
    userRoutines: Routine[],
    userInfo: string,
    endpoint: string
  ) => Promise<{ text: string; routine?: Routine } | undefined>;
  updateMessageStatus: (messageId: string, status: "sent" | "sending" | "failed") => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  clearMessages: () => void;
  setContext: (context: string) => void;
  setError: (error: string | null) => void;
  deleteMessage: (messageId: string) => void;
  resendMessage: (
    messageId: string,
    userRoutines: Routine[],
    userInfo: string
  ) => Promise<{ text: string; routine?: Routine } | undefined>;
}

export const useChatStore = create<ChatState>()(
  persist(
    (set, get) => ({
      messages: [INITIAL_CHAT_MESSAGE],
      context: "",
      error: null,
      isLoading: false,
      clearMessages: () =>
        set({
          messages: [INITIAL_CHAT_MESSAGE],
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
      deleteMessage: (messageId) =>
        set((state) => ({
          messages: state.messages.filter((message) => message.id !== messageId),
        })),
      resendMessage: (messageId, userRoutines, userInfo) => {
        const messageToResend = get().messages.find((m) => m.id === messageId);
        if (!messageToResend || messageToResend.role === "assistant") return Promise.resolve(undefined);

        get().deleteMessage(messageId);
        return messageToResend.workoutSession
          ? get().sendWorkoutReviewMessage(messageToResend.workoutSession, userRoutines, userInfo)
          : get().sendChatMessage(messageToResend.message, messageToResend.images, userRoutines, userInfo);
      },
      sendChatMessage: async (
        message: string,
        images: string[],
        userRoutines: Routine[],
        userInfo: string,
        audioUrl?: string
      ) => {
        const chatMessage = await createUserMessage(message, images, audioUrl);
        return get().sendMessage(chatMessage, userRoutines, userInfo, "chat");
      },
      sendWorkoutReviewMessage: async (session: WorkoutSession, userRoutines: Routine[], userInfo: string) => {
        const chatMessage = createWorkoutReviewMessage(session);
        return get().sendMessage(chatMessage, userRoutines, userInfo, "workout-review");
      },
      sendMessage: async (message: ChatMessage, userRoutines: Routine[], userInfo: string, endpoint: string) => {
        console.log("sendMessage called with message:", message);
        get().setError(null);

        set((state) => ({
          messages: [...state.messages, message],
        }));

        try {
          set({ isLoading: true });

          console.log("Fetching API with message:", JSON.stringify(message, null, 2));
          const lastMessages = get().messages.slice(-10);

          const lastTechnicalMessages: CoreMessage[] = lastMessages.map((message) => message.technicalMessage).flat();

          const response = await fetch(`${API_URL}/api/${endpoint}`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              provider: "google",
              messages: lastTechnicalMessages,
              userInfo: userInfo,
              userRoutines: userRoutines,
              chatContext: get().context,
            }),
          });
          console.log("API response received:", response);

          const responseBody = await response.text();

          if (!response.ok) {
            console.error("API error response:", response.status, responseBody);
            set({ error: responseBody || "Failed to send message" });
            set((state) => ({
              messages: state.messages.map((msg) => (msg.id === message.id ? { ...msg, status: "failed" } : msg)),
            }));
            set({ isLoading: false });
            return undefined;
          }

          console.log("responseText", responseBody);
          console.log(
            "responseBody",
            JSON.stringify((JSON.parse(responseBody).response as ChatResponse).completeResponse, null, 2)
          );
          const {
            text,
            routine,
            errorType,
            errorMessage,
            completeResponse: completeMessage,
          } = JSON.parse(responseBody).response as ChatResponse;

          if (errorType) {
            set({ error: errorMessage });
            console.error("error", errorMessage);
            set((state) => ({
              messages: state.messages.map((msg) => (msg.id === message.id ? { ...msg, status: "failed" } : msg)),
            }));
            return undefined;
          }

          console.log("completeMessage", completeMessage);
          console.log("text", text);

          if (text && completeMessage) {
            const newMessage: AssistantChatMessage = {
              role: "assistant",
              id: randomUUID(),
              createdAt: new Date(),
              status: "sent",
              message: text,
              routine: routine,
              technicalMessage: completeMessage,
            };
            set((state) => ({
              messages: [...state.messages, newMessage],
            }));

            lastMessages.forEach((message) => get().updateMessageStatus(message.id, "sent"));
            return { text, routine };
          } else {
            throw new Error("No text or technical message received");
          }
        } catch (error) {
          const errorMsg = error instanceof Error ? error.message : "Unexpected error occurred";
          console.error("sendMessage error:", errorMsg, error);
          set({ error: errorMsg });
          set((state) => ({
            messages: state.messages.map((msg) => (msg.id === message.id ? { ...msg, status: "failed" } : msg)),
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
