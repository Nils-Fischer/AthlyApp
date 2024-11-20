import * as React from "react";
import ChatInterface from "~/components/Chat/chatinterface";
import { Message } from "~/components/Chat/types";
import { createMessage, getAnswer } from "~/lib/chatUtils";
import { Routine } from "~/lib/types";
import { useExerciseStore } from "~/stores/exerciseStore";

const initialMessages = [
  createMessage("Hallo! 👋 Ich bin dein AI Personal Trainer. Wie kann ich dir heute helfen?", "ai"),
];

export default function Screen() {
  const exerciseStore = useExerciseStore();
  const exerciseList = exerciseStore.exercises.map((exercise) => `${exercise.id} - ${exercise.name}`).join("\n");

  const [messages, setMessages] = React.useState<Message[]>(initialMessages);
  const [isTyping, setIsTyping] = React.useState(false);

  const handleSendMessage = React.useCallback(
    async (content: string) => {
      const userMessage: Message = createMessage(content, "user");

      setMessages((prev) => [...prev, userMessage]);
      setIsTyping(true);

      const { aiMessage, routine } = await getAnswer(exerciseList, content);

      setMessages((prev) => [...prev, aiMessage]);
    },
    [exerciseList]
  );

  return <ChatInterface messages={messages} isTyping={isTyping} onSendMessage={handleSendMessage} />;
}
