import { Message, Content, Context } from "~/lib/Chat/types";
import { getChatResponse } from "~/lib/AI/modelConnector";
import { generateId } from "~/lib/utils";
import { parseTaggedResponse } from "~/lib/AI/responseUtils";
import { useChatStore } from "~/stores/chatStore";

export function createMessage(message: string, content: Content[], sender: "user" | "ai"): Message {
  return {
    id: generateId().toString(),
    message,
    content,
    sender,
    timestamp: new Date(),
    status: "sent",
  };
}

export async function sendMessage(messages: Message[]): Promise<Message> {
  const { context, setContext } = useChatStore();
  const lastMessages = messages.slice(-3);
  const response = await getChatResponse("google", lastMessages, context);
  const [message, content] = parseTaggedResponse(response);
  return createMessage(message, content, "ai");
}
