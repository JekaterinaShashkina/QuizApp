import { useEffect, useRef, useState } from "react";
import { View, Text, StyleSheet, Animated, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { saveHighScore } from "../database/db";
import { ShuffledQuestion } from "../types/Question";
import ResultScreen from "./ResultScreen";
import { fetchTriviaQuestions, TriviaSettings } from "../services/TriviaApi";
import { prepareApiQuestions } from "../utils/quizUtils";
import { StyledButton } from "../components/StyledButton";
import { COLORS } from "../constants/ui";
import { Ionicons } from "@expo/vector-icons";

const QUESTION_TIME = 10;

type QuizScreenProps = {
  settings: TriviaSettings;
  onBack: () => void;
};

export const QuizScreen = ({ settings, onBack }: QuizScreenProps) => {
  const [questions, setQuestions] = useState<ShuffledQuestion[]>([]);
  const [index, setIndex] = useState<number>(0);
  const [score, setScore] = useState<number>(0);
  const [wrongAnswers, setWrongAnswers] = useState<number>(0);
  const [unansweredAnswers, setUnansweredAnswers] = useState<number>(0);
  const [quizFinished, setQuizFinished] = useState<boolean>(false);
  const [timeLeft, setTimeLeft] = useState<number>(QUESTION_TIME);
  const [resultSaved, setResultSaved] = useState<boolean>(false);

  const progressAnim = useRef(new Animated.Value(1)).current;
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [startTime] = useState(Date.now());

  const loadQuestions = async (): Promise<void> => {
    try {
      setIsLoading(true);
      setErrorMessage("");

      const result = await fetchTriviaQuestions(settings);
      const preparedQuestions = prepareApiQuestions(result);

      setQuestions(preparedQuestions);
    } catch (error: any) {
      setErrorMessage(
        error.message || "Küsimusi ei leidnud. Proovi midagi teist",
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadQuestions();
  }, []);

  useEffect(() => {
    if (questions.length > 0 && !quizFinished) {
      startTimer();
    }
    return () => {
      stopTimer();
    };
  }, [index, questions.length, quizFinished]);

  useEffect(() => {
    const saveResult = async () => {
      if (quizFinished && questions.length > 0 && !resultSaved) {
        try {
          const duration = Math.floor((Date.now() - startTime) / 1000);

          await saveHighScore(
            score,
            questions.length,
            score, // correctAnswers
            wrongAnswers,
            duration,
            settings.username,
          );
          setResultSaved(true);
        } catch (error) {
          console.error("Error saving high score:", error);
        }
      }
    };
    saveResult();
  }, [
    quizFinished,
    resultSaved,
    score,
    wrongAnswers,
    questions.length,
    startTime,
    settings.username,
  ]);

  const stopTimer = (): void => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    progressAnim.stopAnimation();
  };

  const startTimer = (): void => {
    stopTimer();

    setTimeLeft(QUESTION_TIME);
    progressAnim.setValue(1);

    Animated.timing(progressAnim, {
      toValue: 0,
      duration: QUESTION_TIME * 1000,
      useNativeDriver: false,
    }).start();

    intervalRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          stopTimer();
          handleTimeout();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleTimeout = async (): Promise<void> => {
    setUnansweredAnswers((prev) => prev + 1);

    if (index < questions.length - 1) {
      setIndex((prev) => prev + 1);
    } else {
      await finishQuiz(score);
    }
  };

  const answer = async (selected: string): Promise<void> => {
    stopTimer();

    const current = questions[index];
    const isCorrect = selected === current.correct;
    const finalScore = isCorrect ? score + 1 : score;

    if (isCorrect) {
      setScore((prev) => prev + 1);
    } else {
      setWrongAnswers((prev) => prev + 1);
    }

    if (index < questions.length - 1) {
      setIndex((prev) => prev + 1);
    } else {
      await finishQuiz(finalScore);
    }
  };

  const finishQuiz = async (finalScore: number): Promise<void> => {
    stopTimer();

    setScore(finalScore);
    setQuizFinished(true);
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.loading}>Laadingut...</Text>
      </SafeAreaView>
    );
  }
  if (errorMessage) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Pressable onPress={onBack}>
            <Ionicons name="arrow-back" size={26} color={COLORS.PRIMARY_TEXT} />
          </Pressable>
        </View>
        <View style={styles.content}>
          <Text style={styles.errorTitle}>Küsimusi ei leitud</Text>
          <Text style={styles.errorText}>{errorMessage}</Text>
          <Text style={styles.errorHint}>
            Proovi valida kategooria Any, raskusaste Any või tüüp Any.
          </Text>
          <StyledButton
            title="Tagasi seadetesse"
            onPress={onBack}
            style={styles.backButton}
          />
        </View>
      </SafeAreaView>
    );
  }

  if (quizFinished) {
    return (
      <ResultScreen
        score={score}
        totalQuestions={questions.length}
        correctAnswers={score}
        wrongAnswers={wrongAnswers}
        unansweredAnswers={unansweredAnswers}
        duration={Math.floor((Date.now() - startTime) / 1000)}
        onRestart={onBack}
      />
    );
  }

  const current = questions[index];

  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0%", "100%"],
  });

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={onBack}>
          <Ionicons name="arrow-back" size={26} color={COLORS.PRIMARY_TEXT} />
        </Pressable>
      </View>
      <View style={styles.content}>
        <Text style={styles.counter}>
          Question {index + 1} / {questions.length}
        </Text>

        <Text style={[styles.timerText, timeLeft <= 3 && styles.timerWarning]}>
          Time left: {timeLeft}s
        </Text>

        <View style={styles.progressBarBackground}>
          <Animated.View
            style={[styles.progressBarFill, { width: progressWidth }]}
          />
        </View>
        <View style={styles.questionContainer}>
          <Text style={styles.question}>{current.question}</Text>
        </View>
        {current.options.map((option, optionIndex) => (
          <View key={optionIndex} style={styles.buttonWrapper}>
            <StyledButton
              title={option}
              onPress={() => answer(option)}
              style={styles.answerButton}
            />
          </View>
        ))}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.PRIMARY_BACKGROUND,
  },
  content: {
    flex: 1,
    paddingTop: 50,
    paddingHorizontal: 20,
  },
  loading: {
    marginTop: 50,
    textAlign: "center",
    fontSize: 18,
  },
  counter: {
    fontSize: 16,
    marginBottom: 10,
    textAlign: "center",
    color: COLORS.SUBTITLE_TEXT,
  },
  timerText: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 10,
    textAlign: "center",
    color: COLORS.PRIMARY_TEXT,
  },
  timerWarning: {
    color: COLORS.PRIMARY_RED,
  },
  progressBarBackground: {
    height: 10,
    backgroundColor: COLORS.SECONDARY_BACKGROUND,
    borderRadius: 999,
    overflow: "hidden",
    marginBottom: 30,
  },
  progressBarFill: {
    height: "100%",
    backgroundColor: COLORS.PRIMARY_ACTIVE_BUTTON,
    borderRadius: 14,
  },
  question: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 30,
    textAlign: "center",
    color: COLORS.PRIMARY_TEXT,
  },
  questionContainer: {
    minHeight: 120,
    justifyContent: "center",
    marginBottom: 30,
  },
  buttonWrapper: {
    marginBottom: 15,
  },
  errorTitle: {
    fontSize: 26,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 12,
  },
  errorText: {
    fontSize: 16,
    textAlign: "center",
    color: COLORS.PRIMARY_RED,
    marginBottom: 10,
  },
  errorHint: {
    fontSize: 15,
    textAlign: "center",
    color: COLORS.PRIMARY_RED,
  },
  backButton: {
    marginTop: 24,
  },
  answerButton: {
    width: "100%",
  },
  header: {
    position: "absolute",
    top: 50,
    left: 20,
    zIndex: 10,
  },
  backText: {
    fontSize: 24,
    color: COLORS.PRIMARY_TEXT,
  },
});
