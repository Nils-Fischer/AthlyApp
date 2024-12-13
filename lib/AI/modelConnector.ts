import Anthropic from "@anthropic-ai/sdk";
import OpenAI from "openai";
import { APIPromise } from "openai/core";
import { APIPromise as AnthropicAPIPromise } from "@anthropic-ai/sdk/core";

export async function createAPICall(provider: "openai" | "anthropic", prompt: string): Promise<string> {
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
    }
  } catch (error) {
    console.error("Error generating AI response:", error);
    return errorMessage;
  }
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
