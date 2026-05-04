import * as SQLite from "expo-sqlite";

export const db = SQLite.openDatabaseSync("quiz.db");

export const initDB = async (): Promise<void> => {
  await db.execAsync(`DROP TABLE IF EXISTS high_scores;`);

  await db.execAsync(`
      CREATE TABLE IF NOT EXISTS high_scores (
        id INTEGER PRIMARY KEY NOT NULL,
        username TEXT,
        score INTEGER NOT NULL,
        totalQuestions INTEGER NOT NULL,        
        percentage INTEGER NOT NULL,
        correctAnswers INTEGER NOT NULL,
        wrongAnswers INTEGER NOT NULL,
        duration INTEGER NOT NULL,
        createdAt TEXT NOT NULL
      );
    `);
};

export const saveHighScore = async (
  score: number,
  totalQuestions: number,
  correctAnswers: number,
  wrongAnswers: number,
  duration: number,
  username: string,
): Promise<void> => {
  const percentage = Math.round((score / totalQuestions) * 100);
  const createdAt = new Date().toISOString();

  await db.runAsync(
    `INSERT INTO high_scores (score, totalQuestions, correctAnswers, wrongAnswers, percentage, createdAt, duration, username)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      score,
      totalQuestions,
      correctAnswers,
      wrongAnswers,
      percentage,
      createdAt,
      duration,
      username,
    ],
  );
};

export const getHighScores = async () => {
  return await db.getAllAsync(
    `SELECT * FROM high_scores
     ORDER BY percentage DESC, score DESC, createdAt ASC
     LIMIT 5`,
  );
};
