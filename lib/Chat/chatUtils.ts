import { Exercise, Routine } from "../types";
import { generateId, parseJSON } from "../utils";
import { Message } from "~/lib/Chat/types";
import { TaggedSection } from "~/lib/Chat/types";
import { createAPICall } from "~/lib/AI/modelConnector";
import { analyzeChatContext } from "./contextExtraction";
import { prompts } from "~/lib/AI/promptTemplates";
import { parseTaggedResponse } from "~/lib/AI/responseUtils";

const formatTime = (date: Date) => {
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
};

export function createTextMessage(content: string, sender: "user" | "ai"): Message {
  return createMessage([{ tag: "text", content }], sender);
}

export function createMessage(content: TaggedSection[], sender: "user" | "ai"): Message {
  return {
    id: generateId().toString(),
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
  const taggedSections = parseTaggedResponse(response);
  const analysis = taggedSections.find((section) => section.tag === "analysis")?.content;
  const newSummary = taggedSections.find((section) => section.tag === "summary")?.content;
  console.log("analysis", analysis);
  console.log("summary", newSummary);
  return createMessage(taggedSections, "ai");
}

function generateResponse(messages: Message[], summary: string, exercises: Exercise[]) {
  const context = analyzeChatContext(messages);
  const lastMessage = messages.at(-1);
  const messageContent = lastMessage?.content.find((section) => section.tag === "text")?.content;
  if (!messageContent) throw Error("No message content found");

  const exerciseList = exercises.map((exercise) => `${exercise.id} - ${exercise.name}`).join("\n");

  switch (context.type) {
    case "knowledge":
      const knowledgePrompt = prompts.promptForKnowledgeQuery(messageContent, summary);
      return createAPICall("openai", knowledgePrompt);
    case "routine_creation":
      const routineCreationPrompt = prompts.promptForRoutineCreation(messageContent, summary, exerciseList);
      return createAPICall("openai", routineCreationPrompt);
    default:
      throw Error("Invalid context type");
  }
}
