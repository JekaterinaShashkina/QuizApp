export type TriviaCategory = {
  id: number;
  name: string;
};

type CategoriesResponse = {
  trivia_categories: TriviaCategory[];
};

export const fetchTriviaCategories = async (): Promise<TriviaCategory[]> => {
  const response = await fetch("https://opentdb.com/api_category.php");

  if (!response.ok) {
    throw new Error("Kategooriate laadimine ebaõnnestus.");
  }

  const data: CategoriesResponse = await response.json();

  return data.trivia_categories;
};
