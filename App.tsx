import { useEffect, useState } from "react";
import { initDB } from "./database/db";
import { QuizScreen } from "./screens/QuizScreen";
import { TriviaSettings } from "./services/TriviaApi";
import { SettingsScreen } from "./screens/SettingsScreen";

export default function App() {
  const [settings, setSettings] = useState<TriviaSettings | null>(null);

  useEffect(() => {
    const setupDatabase = async () => {
      try {
        await initDB();
      } catch (error) {
        console.log("DB error:", error);
      }
    };
    setupDatabase();
  }, []);

  if (!settings) {
    return <SettingsScreen onStart={setSettings} />;
  }

  return <QuizScreen settings={settings} onBack={() => setSettings(null)} />;
}
