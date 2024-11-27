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

export async function getAnswer(messages: Message[], summary: string, exercises: Exercise[]): Promise<Message> {
  const response = await generateResponse(messages, summary, exercises);
  const taggedSections = parseResponse(response);
  const analysis = taggedSections.find((section) => section.tag === "analysis")?.content;
  const newSummary = taggedSections.find((section) => section.tag === "summary")?.content;
  console.log("analysis", analysis);
  console.log("summary", newSummary);
  return createMessage(taggedSections, "ai");
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
  const context = analyzeChatContext(messages);
  const lastMessage = messages.at(-1);
  const messageContent = lastMessage?.content.find((section) => section.tag === "text")?.content;
  if (!messageContent) throw Error("No message content found");
  return getPrompt("openai", messageContent, context, summary, exercises);
}
