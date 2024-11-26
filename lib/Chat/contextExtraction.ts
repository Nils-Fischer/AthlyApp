import { Message } from "./types";
import { ChatContext } from "./types";

export function analyzeChatContext(messages: Message[]): ChatContext {
  // Look at last 3-5 messages for context
  const recentMessages = messages.slice(-5);

  // Combine all message content for analysis
  const combinedContent = recentMessages
    .flatMap((msg) => msg.content)
    .map((section) => section.content)
    .join(" ")
    .toLowerCase();

  // Routine creation patterns
  const routinePatterns = [
    "trainingsplan",
    "routine",
    "workout plan",
    "erstelle",
    "plan für mich",
    "trainingsroutine",
    "wochenplan",
    "split",
    "trainingstage",
  ];

  // Check for routine creation context
  const hasRoutineIntent = routinePatterns.some((pattern) => combinedContent.includes(pattern));

  if (hasRoutineIntent) {
    return {
      type: "routine_creation",
      confidence: 0.8,
      requiresData: {
        userProfile: false,
        exerciseDatabse: true,
        existingRoutines: false,
      },
    };
  }

  // Default case if no clear context is found
  return {
    type: "knowledge",
    confidence: 0.3,
    requiresData: {
      userProfile: false,
      exerciseDatabse: false,
      existingRoutines: false,
    },
  };
}
