import { ImagePart, TextPart } from "ai";
import { randomUUID } from "expo-crypto";
import { UserChatMessage, WorkoutSession } from "../types";

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

export function createWorkoutReviewMessage(session: WorkoutSession): UserChatMessage {
  const sessionAsText: TextPart = { type: "text", text: JSON.stringify(session, null, 2) };
  return {
    id: randomUUID(),
    createdAt: new Date(),
    role: "user",
    message: "Mein heutiges Training",
    images: [],
    workoutSession: session,
    technicalMessage: {
      role: "user",
      content: [sessionAsText],
    },
    status: "sent",
  };
}
