import OpenAI from "openai";
import { CONFIG } from "./config.js";

export const openrouter = new OpenAI({
  apiKey: process.env.OPENROUTER_API_KEY,
  baseURL: "https://openrouter.ai/api/v1"
});

export async function callLLM(messages) {
  const response = await openrouter.chat.completions.create({
    model: CONFIG.model,
    messages,
    temperature: CONFIG.temperature,
    max_tokens: CONFIG.maxTokens
  });

  return response.choices[0].message.content;
}