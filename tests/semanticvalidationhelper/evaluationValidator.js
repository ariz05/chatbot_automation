import { evaluateLLMResponse } from "./evaluationEngine.js";
import { THRESHOLDS } from "./config.js";

export async function validateResponse(data) {

  const scores = await evaluateLLMResponse(data);

  const pass =
    scores.answer_relevancy >= THRESHOLDS.answer_relevancy &&
    scores.hallucination >= THRESHOLDS.hallucination;

  return { pass, scores };
}

module.exports = { validateResponse };