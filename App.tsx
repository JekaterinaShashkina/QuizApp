import { useEffect, useState } from "react";
import { initDB, insertQuestions } from "./database/db";
import QuizScreen from "./screens/QuizScreen";
import { TriviaSettings } from "./services/TriviaApi";
import { SettingsScreen } from "./screens/SettingsScreen";

export default function App() {
  const [settings, setSettings] = useState<TriviaSettings | null>(null);

  if (!settings) {
    return <SettingsScreen onStart={setSettings} />;
  }

  // useEffect(() => {
  //   const setupDatabase = async () => {
  //     try {
  //       await initDB();
  //       await insertQuestions();
  //     } catch (error) {
  //       console.log("DB error:", error);
  //     }
  //   };
  //   setupDatabase();
  // }, []);

  return <QuizScreen />;
}
