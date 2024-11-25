import Anthropic from "@anthropic-ai/sdk";
import { Routine } from "./types";
import { parseJSON } from "./utils";
import { Message } from "~/components/Chat/types";
import { TaggedSection } from "~/components/Chat/types";

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

export async function getAnswer(exerciseList: string, userQuery: string): Promise<{ aiMessage: Message }> {
  try {
    const response = await generateResponse(exerciseList, userQuery);

    if (response.content[0]?.type === "text") {
      const taggedSections = parseResponse(response.content[0].text);
      const analysis = taggedSections.find((section) => section.tag === "analysis")?.content;
      console.log(analysis);
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
    .map((match) => {
      const tag = match[1];
      const content = match[2];
      if (tag === "routine") {
        const routine = parseJSON<Routine>(content);
        if (routine) {
          routine.id = parseInt(generateId());
        }
        return { tag, content: routine };
      }
      return { tag, content };
    });
}

function generateResponse(exerciseList: string, userQuery: string) {
  const api_key = process.env.EXPO_PUBLIC_ANTHROPIC_API_KEY;
  if (!api_key) {
    console.error("Missing Antropic key");
    throw Error("Antropic API Key missing");
  }
  const anthropic = new Anthropic({
    apiKey: api_key,
  });
  return anthropic.messages.create({
    model: "claude-3-5-haiku-20241022",
    max_tokens: 1513,
    temperature: 0,
    system: "You are a professional personal Trainer called Alex.",
    messages: [
      {
        role: "user",
        content: [
          {
            type: "text",
            text: `You are Alex, a knowledgeable and friendly personal trainer AI. Your task is to provide personalized fitness advice and workout routines to users from various cultural backgrounds. You have access to the following list of exercises:
    <exercise_list>
    ${exerciseList}
    </exercise_list>

    When responding to users, consider their cultural context and localize your advice accordingly. Here's the user's message:

    <user_query>
    ${userQuery}
    </user_query>

    Before responding, analyze the user's query and plan your response within the <analysis> tags:

    1. Identify the user's language, region, fitness level, goals, and any limitations mentioned.
    2. For workout requests, list potential exercises from the exercise list that match the user's needs.
    3. For workout requests, outline the structure of the routine before generating the JSON.

    Based on your analysis, provide an appropriate response following these guidelines:

    1. If it's a workout request:
    a. Generate a localized routine in this JSON format and wrap it in <routine> tags:
        {
            "id": number,
            "name": "Routine Name",
            "description": "Routine description",
            "frequency": number,
            "workouts": [
            {
                "id": number,
                "name": "Workout Name",
                "description": "Workout description",
                "duration": number,
                "exercises": [
                {
                    "exerciseId": number,
                    "alternatives": [number],
                    "sets": number,
                    "reps": number
                }
                ]
            }
            ]
        }
    b. Provide a brief, explanation of the routine.

    2. If it's a fitness question:
    a. Provide a direct, concise answer.
    b. Simplify technical concepts using familiar references.

    3. Format your response as a casual text message, matching the user's language style and formality, and wrap all text meant for the user in <text> tags.

    4. Apply these localization rules:
    - Use region-appropriate measurements (metric/imperial)
    - Match local greeting styles
    - Respect cultural exercise preferences
    - Answer in the user's language

    Remember to keep your responses brief and sound like a local trainer. Ensure all JSON is valid and follows the specified structure.`,
          },
        ],
      },
    ],
  });
}
