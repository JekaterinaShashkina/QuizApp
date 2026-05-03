import * as SQLite from 'expo-sqlite';

export const db = SQLite.openDatabaseSync('quiz.db');

export const initDB = async (): Promise<void> => {
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS questions (
      id INTEGER PRIMARY KEY NOT NULL,
      question TEXT NOT NULL,
      optionA TEXT NOT NULL,
      optionB TEXT NOT NULL,
      optionC TEXT NOT NULL,
      correct TEXT NOT NULL
    );
  `);

    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS high_scores (
        id INTEGER PRIMARY KEY NOT NULL,
        score INTEGER NOT NULL,
        totalQuestions INTEGER NOT NULL,
        percentage INTEGER NOT NULL,
        createdAt TEXT NOT NULL
      );
    `);
};

export const insertQuestions = async (): Promise<void> => {
  const result = await db.getFirstAsync<{ count: number }>(
    `SELECT COUNT(*) as count FROM questions`
  );

  if (result && result.count > 0) {
    return;
  }

  const questions = [
    ['What is the capital of France?', 'Paris', 'Lyon', 'Marseille', 'Paris'],
    ['What is the capital of Germany?', 'Berlin', 'Munich', 'Cologne', 'Berlin'],
    ['What is the capital of Spain?', 'Madrid', 'Barcelona', 'Valencia', 'Madrid'],
    ['What is the capital of Italy?', 'Rome', 'Milan', 'Venice', 'Rome'],
    ['What is the capital of Estonia?', 'Tallinn', 'Tartu', 'Narva', 'Tallinn'],
  ];

  for (const [question, optionA, optionB, optionC, correct] of questions) {
    await db.runAsync(
      `INSERT INTO questions (question, optionA, optionB, optionC, correct)
       VALUES (?, ?, ?, ?, ?)`,
      [question, optionA, optionB, optionC, correct]
    );
  }
};

export const saveHighScore = async (
  score: number,
  totalQuestions: number
): Promise<void> => {
  const percentage = Math.round((score / totalQuestions) * 100);
  const createdAt = new Date().toISOString();

  await db.runAsync(
    `INSERT INTO high_scores (score, totalQuestions, percentage, createdAt)
     VALUES (?, ?, ?, ?)`,
    [score, totalQuestions, percentage, createdAt]
  );
};

export const getHighScores = async () => {
  return await db.getAllAsync(
    `SELECT * FROM high_scores
     ORDER BY percentage DESC, score DESC, createdAt ASC
     LIMIT 5`
  );
};