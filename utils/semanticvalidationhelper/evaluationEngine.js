import { callLLM } from "./openrouterClient.js";

export async function evaluateLLMResponse(
  question,
  context,
  expectedAnswer,
  actualAnswer
) {

  const prompt = `
You are evaluating a chatbot answer.

Question:
${question}

Ground Truth:
${expectedAnswer}

Context:
${context}

Bot Answer:
${actualAnswer}

Score between 0 and 1:

1. answer_relevancy
2. hallucination (1 = no hallucination)
3. context_precision
4. context_recall

Return ONLY valid JSON:
{
  "answer_relevancy": 0.0,
  "hallucination": 0.0,
  "context_precision": 0.0,
  "context_recall": 0.0
}
`;

  const raw = await callLLM([
    { role: "system", content: "You are a strict AI evaluator. Return JSON only." },
    { role: "user", content: prompt }
  ]);

  const jsonMatch = raw.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error("Invalid evaluator response.");
  }

  return JSON.parse(jsonMatch[0]);
}