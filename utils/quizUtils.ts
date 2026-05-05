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

const htmlEntities: Record<string, string> = {
  amp: "&",
  quot: '"',
  apos: "'",
  ldquo: '"',
  rdquo: '"',
  lsquo: "'",
  rsquo: "'",
  eacute: "é",
  Eacute: "É",
  uuml: "ü",
  Uuml: "Ü",
  ouml: "ö",
  Ouml: "Ö",
  auml: "ä",
  Auml: "Ä",
  nbsp: " ",
};

export const decodeText = (text: string): string => {
  return text.replace(/&(#x?[0-9a-fA-F]+|[a-zA-Z]+);/g, (match, entity) => {
    if (entity.startsWith("#x")) {
      return String.fromCodePoint(parseInt(entity.slice(2), 16));
    }

    if (entity.startsWith("#")) {
      return String.fromCodePoint(parseInt(entity.slice(1), 10));
    }

    return htmlEntities[entity] || match;
  });
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
