import * as React from "react";
import ChatInterface from "~/components/Chat/chatinterface";
import { generateId, formatTime, type Message } from "~/components/Chat/types";

export default function Screen() {
  const [messages, setMessages] = React.useState<Message[]>([
    {
      id: "1",
      content: "Hallo! 👋 Ich bin dein AI Personal Trainer. Wie kann ich dir heute helfen?",
      sender: "ai",
      timestamp: formatTime(new Date()),
    },
  ]);
  const [isTyping, setIsTyping] = React.useState(false);

  const handleSendMessage = React.useCallback((content: string) => {
    const userMessage: Message = {
      id: generateId(),
      content,
      sender: "user",
      timestamp: formatTime(new Date()),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const aiMessage: Message = {
        id: generateId(),
        content: "Ich verstehe dein Anliegen. Lass uns gemeinsam daran arbeiten! 💪",
        sender: "ai",
        timestamp: formatTime(new Date()),
      };
      setMessages((prev) => [...prev, aiMessage]);
      setIsTyping(false);
    }, 1500);
  }, []);

  return <ChatInterface messages={messages} isTyping={isTyping} onSendMessage={handleSendMessage} />;
}
