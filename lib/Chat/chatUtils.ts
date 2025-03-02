import { CoreMessage, CoreUserMessage, DataContent, ImagePart, TextPart, UserContent } from "ai";
import { randomUUID } from "expo-crypto";
import { UserChatMessage } from "../types";

export function createUserMessage(message: string, images: string[]): UserChatMessage {
  const text: TextPart = { type: "text", text: message };
  const image: ImagePart[] = images.map((image) => ({ type: "image", image }));
  return {
    id: randomUUID(),
    createdAt: new Date(),
    role: "user",
    message: message,
    images: images,
    technicalMessage: {
      role: "user",
      content: [text, ...image],
    },
    status: "sent",
  };
}
