import { Message, Content } from "~/lib/Chat/types";
import { getChatResponse } from "~/lib/AI/modelConnector";
import { generateId } from "~/lib/utils";
import { parseTaggedResponse } from "~/lib/AI/responseUtils";
import { Routine } from "../types";
import { UserProfile } from "../types";

export function createMessage(message: string, content: Content[], sender: "user" | "ai"): Message {
  return {
    id: generateId().toString(),
    message,
    content,
    sender,
    timestamp: new Date().toISOString(),
    status: "sent",
  };
}

export async function sendMessage(
  messages: Message[],
  exerciseList: string,
  routines: Routine[],
  profile: UserProfile,
  context?: string
): Promise<Message> {
  const lastMessages = messages.slice(-3);
  const response = await getChatResponse("google", lastMessages, exerciseList, routines, profile, context);
  console.log("Response:", response);
  const [message, content] = parseTaggedResponse(response);
  return createMessage(message, content, "ai");
}
