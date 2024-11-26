import Anthropic from "@anthropic-ai/sdk";
import { Exercise, Routine } from "../types";
import { parseJSON } from "../utils";
import { Message } from "~/lib/Chat/types";
import { TaggedSection } from "~/lib/Chat/types";
import { getPrompt } from "~/lib/Chat/promptTemplates";
import { analyzeChatContext } from "./contextExtraction";

const generateId = () => Math.random().toString(36).substr(2, 9);

const formatTime = (date: Date) => {
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
};

export function createTextMessage(content: string, sender: "user" | "ai"): Message {
  return createMessage([{ tag: "text", content }], sender);
}

export function createMessage(content: TaggedSection[], sender: "user" | "ai"): Message {
  return {
    id: generateId(),
    content,
    sender,
    timestamp: formatTime(new Date()),
  };
}

const errorMessage: Message = createMessage(
  [{ tag: "text", content: "Etwas ist schief gelaufen. Bitte versuche es erneut." }],
  "ai"
);

export async function getAnswer(
  messages: Message[],
  summary: string,
  exercises: Exercise[]
): Promise<{ aiMessage: Message }> {
  try {
    const response = await generateResponse(messages, summary, exercises);

    if (response.content[0]?.type === "text") {
      const taggedSections = parseResponse(response.content[0].text);
      const analysis = taggedSections.find((section) => section.tag === "analysis")?.content;
      const summary = taggedSections.find((section) => section.tag === "summary")?.content;
      console.log("analysis", analysis);
      console.log("summary", summary);
      const aiMessage: Message = createMessage(taggedSections, "ai");

      return { aiMessage };
    } else {
      console.error("Tool use error");
      return { aiMessage: errorMessage };
    }
  } catch (error) {
    console.error("Error generating AI response:", error);
    return { aiMessage: errorMessage };
  }
}

function parseResponse(text: string): TaggedSection[] {
  const regex = /<(.*?)>([^]*?)<\/.*?>/g;

  return Array.from(text.matchAll(regex))
    .filter((match) => match[1] && match[2])
    .map((match): TaggedSection => {
      // Add explicit return type here
      const tag = match[1] as "text" | "routine" | "analysis" | "summary";
      const content = match[2].trim();

      switch (tag) {
        case "routine":
          const routine = parseJSON<Routine>(content);
          if (routine) {
            routine.id = parseInt(generateId());
          }
          return { tag, content: routine ?? null };
        case "text":
          return { tag, content };
        case "analysis":
          return { tag, content };
        case "summary":
          return { tag, content };
        default:
          console.error("Invalid tag in response:", tag);
          return { tag: "unknown", content } as TaggedSection;
      }
    });
}

function generateResponse(messages: Message[], summary: string, exercises: Exercise[]) {
  const api_key = process.env.EXPO_PUBLIC_ANTHROPIC_API_KEY;
  if (!api_key) {
    console.error("Missing Antropic key");
    throw Error("Antropic API Key missing");
  }
  const anthropic = new Anthropic({
    apiKey: api_key,
  });
  const context = analyzeChatContext(messages);
  const lastMessage = messages.at(-1);
  const messageContent = lastMessage?.content.find((section) => section.tag === "text")?.content;
  if (!messageContent) throw Error("No message content found");
  const prompt = getPrompt(messageContent, context, summary, exercises);

  return anthropic.messages.create(prompt);
}
