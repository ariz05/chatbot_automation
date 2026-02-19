import { evaluateLLMResponse } from "./evaluationEngine.js";
import { THRESHOLDS } from "./config.js";

export async function validateResponse(question,
  context,
  expectedAnswer,
  actualMessage) {

  const scores = await evaluateLLMResponse(question,
    context,
    expectedAnswer,
    actualMessage);

  const pass =
    scores.answer_relevancy >= THRESHOLDS.answer_relevancy &&
    scores.hallucination >= THRESHOLDS.hallucination &&
    scores.context_precision >= THRESHOLDS.context_precision &&
    scores.context_recall >= THRESHOLDS.context_recall;

  return { pass, scores };
}

module.exports = { validateResponse };