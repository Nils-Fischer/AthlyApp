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

function extractMessageContent(message: CoreMessage): string {
  if (message.role !== "assistant" && message.role !== "user") {
    throw new Error("Message is not an assistant or user message");
  }
  return message.content instanceof Array
    ? message.content
        .filter((content) => content.type === "text")
        .map((content) => content.text.trim())
        .join("\n")
    : message.content;
}

export function extractAssistantContent(assistantMessage: CoreAssistantMessage): {
  message: string;
  newRoutine: Routine | undefined;
} {
  if (assistantMessage.role !== "assistant") {
    throw new Error("Message is not an assistant message");
  }
  const message = extractMessageContent(assistantMessage);
  const newRoutine =
    assistantMessage.role === "assistant" && assistantMessage.content instanceof Array
      ? ((
          assistantMessage.content.find(
            (content) => content.type === "tool-call" && content.toolName === "createRoutine"
          ) as ToolCallPart | undefined
        )?.args as Routine | undefined)
      : undefined;

  return { message, newRoutine };
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
  return { message: extractMessageContent(userMessage), images };
}
