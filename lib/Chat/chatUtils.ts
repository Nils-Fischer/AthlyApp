import { ChatMessage, Routine } from "~/lib/types";
import {
  AssistantContent,
  AssistantMessage,
  CoreAssistantMessage,
  CoreMessage,
  CoreUserMessage,
  DataContent,
  ImagePart,
  TextPart,
  ToolCallPart,
  UserContent,
} from "ai";
import { randomUUID } from "expo-crypto";

export function toChatMessage(message: CoreMessage): ChatMessage {
  return {
    ...message,
    id: randomUUID(),
    createdAt: new Date(),
    status: "sent",
  };
}

export function createUserMessage(message: string, images: string[]): ChatMessage {
  const text: TextPart = { type: "text", text: message };
  const image: ImagePart[] = images.map((image) => ({ type: "image", image }));
  return {
    id: randomUUID(),
    createdAt: new Date(),
    role: "user",
    content: [text, ...image],
    status: "sent",
  };
}

export function unwrapUserMessage(message: CoreMessage): {
  message: string;
  images: string[];
} {
  if (message.role !== "user") {
    throw new Error("Message is not a user message");
  }
  const content = message.content as UserContent;
  if (typeof content === "string") {
    return { message: content, images: [] };
  }
  const text = content.filter((content) => content.type === "text").map((content) => content.text.trim());
  const images = content.filter((content) => content.type === "image").map((content) => content.image.toString());
  return { message: text.join("\n"), images };
}

export function extractMessageContent(message: CoreMessage): string[] {
  if (message.role !== "assistant" && message.role !== "user") {
    throw new Error("Message is not an assistant or user message");
  }
  const content =
    message.content instanceof Array
      ? message.content.filter((content) => content.type === "text").map((content) => content.text.trim())
      : [message.content];
  return content.map((content) => content.replaceAll(/<\/?(?:analysis|text|createRoutine)>/g, "").trim());
}

export function extractUserContent(userMessage: CoreUserMessage): {
  message: string;
  images: (DataContent | URL)[];
} {
  if (userMessage.role !== "user") {
    throw new Error("Message is not a user message");
  }
  const images: (DataContent | URL)[] =
    userMessage.role === "user" && userMessage.content instanceof Array
      ? (userMessage.content.filter((content) => content.type === "image") as ImagePart[]).map((image) => image.image)
      : [];
  return { message: extractMessageContent(userMessage).join("\n"), images };
}
