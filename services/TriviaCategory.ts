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
    throw new Error("Failed to load categories");
  }

  const data: CategoriesResponse = await response.json();

  return data.trivia_categories;
};
