import Anthropic from "@anthropic-ai/sdk";
import { Exercise } from "~/lib/types";
import { ChatContext } from "./types";
import OpenAI from "openai";
import { APIPromise } from "openai/core";
import { APIPromise as AnthropicAPIPromise } from "@anthropic-ai/sdk/core";

export async function getPrompt(
  provider: "openai" | "anthropic",
  userQuery: string,
  context: ChatContext,
  summary: string,
  exercises: Exercise[]
): Promise<string> {
  const exerciseList = exercises.map((exercise) => `${exercise.id} - ${exercise.name}`).join("\n");
  const system = "You are Alex, a knowledgeable and friendly personal trainer AI.";
  console.log("User query:", userQuery);

  const errorMessage = "Etwas ist schief gelaufen. Bitte versuche es erneut.";
  try {
    switch (provider) {
      case "openai":
        const openaiAnswer = await createOpenAIRequest(context, system, userQuery, summary, exerciseList);
        if (!openaiAnswer.choices?.[0]?.message?.content) {
          console.error("Invalid OpenAI response format", openaiAnswer);
          return errorMessage;
        }
        return openaiAnswer.choices[0].message.content;
      case "anthropic":
        const anthropicAnswer = await createAnthropicRequest(context, system, userQuery, summary, exerciseList);
        if (anthropicAnswer.content[0]?.type === "text") {
          return anthropicAnswer.content[0].text;
        } else {
          console.error("Tool use error");
          return errorMessage;
        }
    }
  } catch (error) {
    console.error("Error generating AI response:", error);
    return errorMessage;
  }
}

function createOpenAIRequest(
  context: ChatContext,
  system: string,
  message: string,
  summary: string,
  exerciseList: string
): APIPromise<OpenAI.Chat.Completions.ChatCompletion> {
  const api_key = process.env.EXPO_PUBLIC_OPENAI_API_KEY;
  if (!api_key) {
    console.error("Missing OpenAI key");
    throw Error("OpenAI API Key missing");
  }
  const openai = new OpenAI({ apiKey: api_key });
  switch (context.type) {
    case "knowledge":
      console.log("Knowledge prompt");
      return openai.chat.completions.create(
        createOpenAIMessage(1000, system, promptForKnowledgeQuery(message, summary))
      );
    case "routine_creation":
      console.log("Routine creation prompt");
      return openai.chat.completions.create(
        createOpenAIMessage(1000, system, promptForRoutineCreation(message, exerciseList, summary))
      );
  }
}

function createOpenAIMessage(
  max_tokens: number,
  system: string,
  message: string
): OpenAI.Chat.Completions.ChatCompletionCreateParamsNonStreaming {
  return {
    model: "gpt-4o-mini",
    max_completion_tokens: max_tokens,
    messages: [
      { role: "system", content: system },
      {
        role: "user",
        content: message,
      },
    ],
  };
}

function createAnthropicRequest(
  context: ChatContext,
  system: string,
  message: string,
  summary: string,
  exerciseList: string
): AnthropicAPIPromise<Anthropic.Messages.Message> {
  const api_key = process.env.EXPO_PUBLIC_ANTHROPIC_API_KEY;
  if (!api_key) {
    console.error("Missing Antropic key");
    throw Error("Antropic API Key missing");
  }
  const anthropic = new Anthropic({ apiKey: api_key });

  switch (context.type) {
    case "knowledge":
      console.log("Knowledge prompt");
      return anthropic.messages.create(createAnthropicMessage(1000, system, promptForKnowledgeQuery(message, summary)));
    case "routine_creation":
      console.log("Routine creation prompt");
      return anthropic.messages.create(
        createAnthropicMessage(1000, system, promptForRoutineCreation(message, exerciseList, summary))
      );
  }
}

function createAnthropicMessage(
  max_tokens: number,
  system: string,
  message: string
): Anthropic.Messages.MessageCreateParamsNonStreaming {
  return {
    model: "claude-3-5-haiku-20241022",
    max_tokens: max_tokens,
    temperature: 0,
    system: system,
    messages: [
      {
        role: "user",
        content: [
          {
            type: "text",
            text: message,
          },
        ],
      },
    ],
  };
}

export function promptForKnowledgeQuery(userQuery: string, summary: string): string {
  return `You are Alex, a knowledgeable and friendly personal trainer AI. Your task is to provide personalized fitness advice to users from various cultural backgrounds. 

  Summary of the conversation so far:
  <summary>
  ${summary}
  </summary>

  When responding to users, consider their cultural context and the conversation history. Here's the user's message:
  <user_query>
  ${userQuery}
  </user_query>

  Before responding, analyze the query and conversation within the <analysis> tags:
  1. Review the conversation history to maintain context
  2. Identify the user's language, region, fitness level, and any limitations mentioned
  3. Determine the specific fitness topic being discussed
  4. Consider relevant scientific background for your response

  Based on your analysis, provide an appropriate response following these guidelines:

  1. For fitness questions:
  a. Provide a direct, concise answer
  b. Simplify technical concepts using familiar references
  c. Include scientific backing when relevant
  d. Offer practical, actionable advice

  2. Format your response as a casual text message, matching the user's language style and formality, and wrap all text meant for the user in <text> tags.

  3. Apply these localization rules:
  - Use region-appropriate measurements (metric/imperial)
  - Answer in the user's language

  After your response, provide a concise chat summary within <summary> tags that captures the conversation flow,
  including prior context, your latest recommendations, and any pending actions.
  Focus on the progression of topics and key decisions while emphasizing your latest response.
  This summary will serve as context for the next interaction, replacing the need for full conversation history.

  Remember to:
  1. Reference previous interactions when relevant
  2. Maintain consistency with any previously given advice
  3. Include both <text> tags for user response and <summary> tags for context
  4. Keep responses brief and conversational
  5. Focus on evidence-based information
  6. Acknowledge when certain questions might need professional medical advice`;
}

export function promptForRoutineCreation(userQuery: string, summary: string, exerciseList: string): string {
  return `You are Alex, a knowledgeable and friendly personal trainer AI. Your task is to provide personalized fitness advice and workout routines to users from various cultural backgrounds. 

  Summary of the conversation so far:
  <summary>
  ${summary}
  </summary>

  You have access to the following list of exercises:
  <exercise_list>
  ${exerciseList}
  </exercise_list>

  When responding to users, consider their cultural context and the conversation history. Here's the user's message:
  <user_query>
  ${userQuery}
  </user_query>

  Before responding, analyze the query and conversation within the <analysis> tags:
  1. Review the conversation history to maintain context
  2. Identify the user's language, region, fitness level, goals, and any limitations mentioned
  3. For workout requests, list potential exercises that match the user's needs
  4. For workout requests, outline the structure of the routine before generating the JSON

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

  After your response, provide a concise chat summary within <summary> tags that captures the conversation flow,
  including prior context, your latest recommendations, and any pending actions.
  Focus on the progression of topics and key decisions while emphasizing your latest response.
  This summary will serve as context for the next interaction, replacing the need for full conversation history.

  Remember to:
  1. Reference previous interactions when relevant
  2. Maintain consistency with any previously given advice
  3. Include both <text> tags for user response and <summary> tags for context
  4. Keep responses brief and conversational`;
}
