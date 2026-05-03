import { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  Button,
  StyleSheet,
  SafeAreaView,
  Animated,
} from 'react-native';
import { db, saveHighScore } from '../database/db';
import { Question, ShuffledQuestion } from '../types/Question';
import ResultScreen from './ResultScreen';

const QUESTION_TIME = 10;
const MAX_QUESTIONS = 10;

export default function QuizScreen() {
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

  useEffect(() => {
    const loadQuestions = async () => {
      try {
        const result = await db.getAllAsync('SELECT * FROM questions');
      const preparedQuestions = prepareQuestions(result as Question[]);
      setQuestions(preparedQuestions);
      } catch (error: any) {
        console.error('Error:', error);
      }
    };

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
          await saveHighScore(score, questions.length);
          setResultSaved(true);
        } catch (error) {
          console.error('Error saving high score:', error);
        }
      }
    };

    saveResult();
  }, [quizFinished, resultSaved, score, questions.length]);

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

  const goToNextQuestion = (): void => {
    if (index < questions.length - 1) {
      setIndex((prev) => prev + 1);
    } else {
      setQuizFinished(true);
    }
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

  const shuffleArray = <T,>(array: T[]): T[] => {
    const shuffled = [...array];

    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }

    return shuffled;
  };

    const prepareQuestions = (data: Question[]): ShuffledQuestion[] => {
      const uniqueQuestions = data.filter(
        (item, index, self) =>
          index === self.findIndex((q) => q.question === item.question)
      );

      const mapped = uniqueQuestions.map((item) => ({
        id: item.id,
        question: item.question,
        correct: item.correct,
        options: shuffleArray([item.optionA, item.optionB, item.optionC]),
      }));

      const shuffledQuestions = shuffleArray(mapped);

      return shuffledQuestions.slice(0, MAX_QUESTIONS);
    };
const finishQuiz = async (finalScore: number): Promise<void> => {
  stopTimer();

//   try {
//     await saveHighScore(finalScore, questions.length);
//   } catch (error) {
//     console.error('Error saving high score:', error);
//   }

  setScore(finalScore);
  setQuizFinished(true);
};

  const restartQuiz = async (): Promise<void> =>{
    stopTimer();

      try {
        const result = await db.getAllAsync('SELECT * FROM questions');
        const preparedQuestions = prepareQuestions(result as Question[]);
        setQuestions(preparedQuestions);
      } catch (error: any) {
        console.error('Error:', error);
      }

    setIndex(0);
    setScore(0);
    setWrongAnswers(0);
    setUnansweredAnswers(0);
    setQuizFinished(false);
    setTimeLeft(QUESTION_TIME);
    progressAnim.setValue(1);
    setResultSaved(false);
  };

  if (questions.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.loading}>Laadingut...</Text>
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
        onRestart={restartQuiz}
      />
    );
  }

  const current = questions[index];

  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.counter}>
          Question {index + 1} / {questions.length}
        </Text>

        <Text
          style={[
            styles.timerText,
            timeLeft <= 3 && styles.timerWarning,
          ]}
        >
          Time left: {timeLeft}s
        </Text>

        <View style={styles.progressBarBackground}>
          <Animated.View
            style={[styles.progressBarFill, { width: progressWidth }]}
          />
        </View>

        <Text style={styles.question}>{current.question}</Text>

        {current.options.map((option, optionIndex) => (
          <View key={optionIndex} style={styles.buttonWrapper}>
            <Button title={option} onPress={() => answer(option)} />
          </View>
        ))}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
    paddingTop: 50,
    paddingHorizontal: 20,
  },
  loading: {
    marginTop: 50,
    textAlign: 'center',
    fontSize: 18,
  },
  counter: {
    fontSize: 16,
    marginBottom: 10,
    textAlign: 'center',
    color: '#666',
  },
  timerText: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
    textAlign: 'center',
    color: '#222',
  },
  timerWarning: {
    color: 'red',
  },
  progressBarBackground: {
    height: 10,
    backgroundColor: '#ddd',
    borderRadius: 999,
    overflow: 'hidden',
    marginBottom: 30,
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#2196F3',
    borderRadius: 999,
  },
  question: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 30,
    textAlign: 'center',
  },
  buttonWrapper: {
    marginBottom: 15,
  },
});