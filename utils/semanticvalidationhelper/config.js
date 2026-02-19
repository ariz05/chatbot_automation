import dotenv from "dotenv";
dotenv.config();

export const CONFIG = {
  model: process.env.OPENROUTER_MODEL || "openai/gpt-4o-mini",
  temperature: 0,
  maxTokens: 500,
  timeout: 30000,
  strictMode: process.env.STRICT_MODE === "false"
};

export const THRESHOLDS = {
  answer_relevancy: CONFIG.strictMode ? 0.7 : 0.5,
  hallucination: CONFIG.strictMode ? 0.7 : 0.5,
  context_precision: CONFIG.strictMode ? 0.7 : 0.5,
  context_recall: CONFIG.strictMode ? 0.7 : 0.5
};

if (!process.env.OPENROUTER_API_KEY) {
  throw new Error("OPENROUTER_API_KEY is missing.");
}