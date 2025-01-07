import Anthropic from "@anthropic-ai/sdk";
import OpenAI from "openai";
import { APIPromise } from "openai/core";
import { APIPromise as AnthropicAPIPromise } from "@anthropic-ai/sdk/core";
import { GenerateContentResult, GoogleGenerativeAI, Schema } from "@google/generative-ai";

export async function createAPICall(
  provider: "openai" | "anthropic" | "google",
  prompt: string,
  context?: string,
  schema?: Schema
): Promise<string> {
  const errorMessage = "Etwas ist schief gelaufen. Bitte versuche es erneut.";
  try {
    switch (provider) {
      case "openai":
        const openaiAnswer = await createOpenAIRequest(prompt);
        if (!openaiAnswer.choices?.[0]?.message?.content) {
          console.error("Invalid OpenAI response format", openaiAnswer);
          return errorMessage;
        }
        return openaiAnswer.choices[0].message.content;
      case "anthropic":
        const anthropicAnswer = await createAnthropicRequest(prompt);
        if (anthropicAnswer.content[0]?.type === "text") {
          return anthropicAnswer.content[0].text;
        } else {
          console.error("Tool use error");
          return errorMessage;
        }
      case "google":
        const googleAnswer = await createGoogleRequest(prompt, context, schema);
        return googleAnswer.response.text();
    }
  } catch (error) {
    console.error("Error generating AI response:", error);
    return errorMessage;
  }
}

function createGoogleRequest(prompt: string, context?: string, schema?: Schema): Promise<GenerateContentResult> {
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
    responseMimeType: schema ? "application/json" : "text/plain",
    responseSchema: schema ? schema : undefined,
  };

  const chat = model.startChat({
    generationConfig,
    history: [
      {
        role: "user",
        parts: [
          { text: context ? context : "You are Alex, a knowledgeable and friendly personal trainer AI." },
          { text: prompt },
        ],
      },
    ],
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
