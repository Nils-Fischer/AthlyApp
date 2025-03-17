import { FilePart, ImagePart, TextPart } from "ai";
import { randomUUID } from "expo-crypto";
import { UserChatMessage, WorkoutSession } from "../types";
import * as FileSystem from "expo-file-system";
import { Audio } from "expo-av";

export async function createUserMessage(
  message: string,
  images: string[],
  audioUrl?: string
): Promise<UserChatMessage> {
  const text: TextPart = { type: "text", text: message };
  const image: ImagePart[] = images.map((image) => ({ type: "image", image }));

  // Process audio if provided
  let content: (TextPart | ImagePart | FilePart)[] = [text, ...image];
  if (audioUrl) {
    const audioPart = await audioUrlToFilePart(audioUrl);
    content.push(audioPart);
  }

  return {
    id: randomUUID(),
    createdAt: new Date(),
    role: "user",
    message: message,
    images: images,
    technicalMessage: {
      role: "user",
      content: content,
    },
    status: "sent",
  };
}

/**
 * Converts an audio URL to a base64 FilePart for API upload
 * @param audioURL Local file URL of the audio recorded with Expo Audio
 * @returns A FilePart object with base64 data and mime type
 */
async function audioUrlToFilePart(audioURL: string): Promise<FilePart> {
  try {
    // Check if the file exists
    const fileInfo = await FileSystem.getInfoAsync(audioURL);
    if (!fileInfo.exists) {
      throw new Error("Audio-Datei existiert nicht");
    }

    // Read the file as base64
    const base64Audio = await FileSystem.readAsStringAsync(audioURL, {
      encoding: FileSystem.EncodingType.Base64,
    });

    // Return the FilePart object
    return {
      type: "file",
      data: base64Audio,
      mimeType: "audio/aac",
    };
  } catch (error) {
    console.error("Fehler beim Konvertieren der Audio-Datei:", error);
    throw error;
  }
}

export { audioUrlToFilePart };

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
