export const difficulties = ["", "easy", "medium", "hard"] as const;
export type TriviaDifficulty = (typeof difficulties)[number];

export const questionTypes = ["", "multiple", "boolean"] as const;
export type TriviaType = (typeof questionTypes)[number];

export type TriviaSettings = {
  amount: number;
  category: string;
  difficulty: TriviaDifficulty;
  type: TriviaType;
  username: string;
};

export type ApiQuestion = {
  category: string;
  type: "multiple" | "boolean";
  difficulty: string;
  question: string;
  correct_answer: string;
  incorrect_answers: string[];
};

type TriviaApiResponse = {
  response_code: number;
  results: ApiQuestion[];
};

export const fetchTriviaQuestions = async (
  settings: TriviaSettings,
): Promise<ApiQuestion[]> => {
  const params = new URLSearchParams();

  params.append("amount", String(settings.amount));

  if (settings.category) {
    params.append("category", settings.category);
  }

  if (settings.difficulty) {
    params.append("difficulty", settings.difficulty);
  }

  if (settings.type) {
    params.append("type", settings.type);
  }

  const response = await fetch(
    `https://opentdb.com/api.php?${params.toString()}`,
  );

  if (!response.ok) {
    throw new Error("Failed to load questions");
  }

  const data: TriviaApiResponse = await response.json();

  if (data.response_code !== 0) {
    throw new Error("No questions found for these settings");
  }

  return data.results;
};
