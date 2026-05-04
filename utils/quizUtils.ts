import { ApiQuestion } from "../services/TriviaApi";
import { ShuffledQuestion } from "../types/Question";

export const shuffleArray = <T>(array: T[]): T[] => {
  const shuffled = [...array];

  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  return shuffled;
};

export const decodeText = (text: string): string => {
  return text
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&amp;/g, "&")
    .replace(/&eacute;/g, "é");
};

export const prepareApiQuestions = (
  data: ApiQuestion[],
): ShuffledQuestion[] => {
  return data.map((item, index) => ({
    id: index + 1,
    question: decodeText(item.question),
    correct: decodeText(item.correct_answer),
    options: shuffleArray([
      decodeText(item.correct_answer),
      ...item.incorrect_answers.map((answer) => decodeText(answer)),
    ]),
  }));
};
