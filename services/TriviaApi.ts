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

const responseCodeMessages: Record<number, string> = {
  1: "Valitud seadistusega ei leitud piisavalt küsimusi.",
  2: "Viktoriini seadistus on vigane. Küsimuste arv peab olema 1-50.",
  3: "OpenTDB sessiooni tokenit ei leitud.",
  4: "OpenTDB sessiooni küsimused on otsas.",
  5: "OpenTDB piirab päringuid. Oota hetk ja proovi uuesti.",
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
    throw new Error("Küsimuste laadimine ebaõnnestus.");
  }

  const data: TriviaApiResponse = await response.json();

  if (data.response_code !== 0) {
    throw new Error(
      responseCodeMessages[data.response_code] || "Küsimusi ei leitud.",
    );
  }

  return data.results;
};
