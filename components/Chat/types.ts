export interface Message {
  id: string;
  content: string;
  sender: "user" | "ai";
  timestamp: string;
}

export const generateId = () => Math.random().toString(36).substr(2, 9);

export const formatTime = (date: Date) => {
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
};
