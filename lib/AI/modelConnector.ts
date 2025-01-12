import Anthropic from "@anthropic-ai/sdk";
import OpenAI from "openai";
import { APIPromise } from "openai/core";
import { APIPromise as AnthropicAPIPromise } from "@anthropic-ai/sdk/core";
import { GenerateContentResult, GoogleGenerativeAI, Part, Schema } from "@google/generative-ai";
import { prompts } from "./promptTemplates";
import { useExerciseStore } from "~/stores/exerciseStore";
import { Message } from "../Chat/types";
import { GoogleAIFileManager } from "@google/generative-ai/server";
import { Image as ImageType } from "~/lib/types";

function isImage(content: any): content is ImageType {
  return content && "uri" in content;
}

export async function getChatResponse(
  provider: "openai" | "anthropic" | "google",
  messages: Message[],
  context: string
): Promise<string> {
  const errorMessage = "Etwas ist schief gelaufen. Bitte versuche es erneut.";
  try {
    switch (provider) {
      case "google":
        const googleAnswer = await createGeminiTextRequest(messages, context);
        return googleAnswer.response.text();
      case "openai":
        return "Not implemented";
      case "anthropic":
        return "Not implemented";
      default:
        throw Error("Invalid provider");
    }
  } catch (error) {
    console.error("Error generating AI response:", error);
    return errorMessage;
  }
}

async function uploadToGemini(fileManager: GoogleAIFileManager, path: string, mimeType: string) {
  const uploadResult = await fileManager.uploadFile(path, {
    mimeType,
    displayName: path,
  });
  const file = uploadResult.file;
  console.log(`Uploaded file ${file.displayName} as: ${file.name}`);
  return file;
}

async function createGeminiTextRequest(messages: Message[], context?: string): Promise<GenerateContentResult> {
  const api_key = process.env.EXPO_PUBLIC_GOOGLE_API_KEY;
  if (!api_key) {
    console.error("Missing Google API key");
    throw Error("Google API Key missing");
  }
  const genAI = new GoogleGenerativeAI(api_key);
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });

  const generationConfig = {
    temperature: 1,
    topP: 0.95,
    topK: 40,
    maxOutputTokens: 32768,
  };

  const { exercises } = useExerciseStore();
  const exerciseList = exercises?.map((exercise) => `${exercise.id} - ${exercise.name}`).join("\n") || "";
  const prompt = prompts.promptForChatAnswer(exerciseList);
  const initalParts: Part[] = [{ text: prompt }];

  if (context) {
    initalParts.push({ text: context });
  }

  const oldMessages = messages.slice(0, -1);
  const newMessage = messages.at(-1);
  if (!newMessage) throw Error("No new message found");

  const fileManager = new GoogleAIFileManager(api_key);
  const images = await Promise.all(
    newMessage.content
      .filter(isImage)
      .map((content) => uploadToGemini(fileManager, content.uri, `image/${content.type}`))
  );

  const chat = model.startChat({
    generationConfig,
    history: [
      {
        role: "user",
        parts: initalParts,
      },
      ...oldMessages.map((message) => ({
        role: message.sender == "ai" ? "model" : "user",
        parts: [{ text: message.message + message.content.map((content) => content.toString()).join("\n") }],
      })),
      {
        role: "user",
        parts: [...images.map((image) => ({ fileData: { mimeType: image.mimeType, fileUri: image.uri } }))],
      },
    ],
  });

  const result = chat.sendMessage(newMessage.message);
  return result;
}

function createGoogleJsonRequest(prompt: string, context?: string, schema?: Schema): Promise<GenerateContentResult> {
  const api_key = process.env.EXPO_PUBLIC_GOOGLE_API_KEY;
  if (!api_key) {
    console.error("Missing Google API key");
    throw Error("Google API Key missing");
  }
  const genAI = new GoogleGenerativeAI(api_key);
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });

  const generationConfig = {
    temperature: 1,
    topP: 0.95,
    topK: 40,
    maxOutputTokens: 32768,
    responseMimeType: "application/json",
    responseSchema: schema,
  };

  const chat = model.startChat({
    generationConfig,
    history: context
      ? [
          {
            role: "user",
            parts: [{ text: context }],
          },
        ]
      : [],
  });

  const result = chat.sendMessage(prompt);
  return result;
}

function createOpenAIRequest(prompt: string): APIPromise<OpenAI.Chat.Completions.ChatCompletion> {
  const api_key = process.env.EXPO_PUBLIC_OPENAI_API_KEY;
  if (!api_key) {
    console.error("Missing OpenAI key");
    throw Error("OpenAI API Key missing");
  }
  const openai = new OpenAI({ apiKey: api_key });

  return openai.chat.completions.create(createOpenAIMessage(5000, prompt));
}

function createOpenAIMessage(
  max_tokens: number,
  prompt: string
): OpenAI.Chat.Completions.ChatCompletionCreateParamsNonStreaming {
  return {
    model: "gpt-4o-mini",
    max_completion_tokens: max_tokens,
    messages: [
      { role: "system", content: "You are Alex, a knowledgeable and friendly personal trainer AI." },
      {
        role: "user",
        content: prompt,
      },
    ],
  };
}

function createAnthropicRequest(prompt: string): AnthropicAPIPromise<Anthropic.Messages.Message> {
  const api_key = process.env.EXPO_PUBLIC_ANTHROPIC_API_KEY;
  if (!api_key) {
    console.error("Missing Antropic key");
    throw Error("Antropic API Key missing");
  }
  const anthropic = new Anthropic({ apiKey: api_key });

  return anthropic.messages.create(createAnthropicMessage(5000, prompt));
}

function createAnthropicMessage(
  max_tokens: number,
  prompt: string
): Anthropic.Messages.MessageCreateParamsNonStreaming {
  return {
    model: "claude-3-5-haiku-20241022",
    max_tokens: max_tokens,
    temperature: 0,
    system: "You are Alex, a knowledgeable and friendly personal trainer AI.",
    messages: [
      {
        role: "user",
        content: [
          {
            type: "text",
            text: prompt,
          },
        ],
      },
    ],
  };
}
