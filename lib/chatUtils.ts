import Anthropic from "@anthropic-ai/sdk";
import { Routine } from "./types";
import { parseJSON } from "./utils";
import { Message } from "~/components/Chat/types";

interface ParsedResponse {
  mainText: string;
  analyses: string[];
  routines: (Routine | null)[];
}

const generateId = () => Math.random().toString(36).substr(2, 9);

const formatTime = (date: Date) => {
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
};

export function createMessage(content: string, sender: "user" | "ai"): Message {
  return {
    id: generateId(),
    content,
    sender,
    timestamp: formatTime(new Date()),
  };
}

const errorMessage: Message = createMessage("Etwas ist schief gelaufen. Bitte versuche es erneut.", "ai");

export async function getAnswer(
  exerciseList: string,
  userQuery: string
): Promise<{ aiMessage: Message; routine: Routine | null }> {
  try {
    const response = await generateResponse(exerciseList, userQuery);

    if (response.content[0]?.type === "text") {
      const { mainText, analyses, routines } = parseResponse(response.content[0].text);
      const aiMessage: Message = createMessage(mainText, "ai");

      return { aiMessage, routine: routines[0] };
    } else {
      console.error("Tool use error");
      return { aiMessage: errorMessage, routine: null };
    }
  } catch (error) {
    console.error("Error generating AI response:", error);
    return { aiMessage: errorMessage, routine: null };
  }
}

function parseResponse(text: string): ParsedResponse {
  const extractTagContent = (text: string, tagName: string): string[] => {
    const regex = new RegExp(`<${tagName}>(.*?)<\/${tagName}>`, "gs");
    const matches: string[] = [];

    text.replace(regex, (match, content) => {
      matches.push(content.trim());
      return "";
    });

    return matches;
  };

  // Extract content from tags
  const analyses = extractTagContent(text, "analysis");
  const routines = extractTagContent(text, "routine").map((routine) => parseJSON<Routine>(routine));

  // Remove all tagged content for clean text
  const cleanText = text.replace(/<\w+>.*?<\/\w+>/gs, "").trim();

  // Log extracted content
  if (analyses.length > 0) {
    console.log("Analysis:", analyses);
  }

  if (routines.length > 0) {
    console.log("Routines:", routines);
  }

  return { mainText: cleanText, analyses, routines };
}

function generateResponse(exerciseList: string, userQuery: string) {
  const api_key = process.env.ANTHROPIC_API_KEY || "invalid";
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

    3. Format your response as a casual text message, matching the user's language style and formality.

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
