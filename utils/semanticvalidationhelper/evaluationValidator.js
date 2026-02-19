import { evaluateLLMResponse } from "./evaluationEngine.js";
import { THRESHOLDS } from "./config.js";

export async function validateResponse({
  question,
  context,
  expectedAnswer,
  actualAnswer
}) {

  const scores = await evaluateLLMResponse({
  question,
  context,
  expectedAnswer,
  actualAnswer
});

  const pass =
    scores.answer_relevancy >= THRESHOLDS.answer_relevancy &&
    scores.hallucination >= THRESHOLDS.hallucination;

  return { pass, scores };
}

module.exports = { validateResponse };