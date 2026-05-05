import { useEffect, useState } from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { getHighScores } from "../database/db";
import { StyledButton } from "../components/StyledButton";
import { COLORS } from "../constants/ui";

type ResultsScreenProps = {
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  wrongAnswers: number;
  unansweredAnswers: number;
  duration: number;
  onRestart: () => void;
};

type HighScore = {
  id: number;
  username: string;
  score: number;
  totalQuestions: number;
  percentage: number;
  correctAnswers: number;
  wrongAnswers: number;
  duration: number;
  createdAt: string;
};

export default function ResultsScreen({
  score,
  totalQuestions,
  correctAnswers,
  wrongAnswers,
  unansweredAnswers,
  duration,
  onRestart,
}: ResultsScreenProps) {
  const [highScores, setHighScores] = useState<HighScore[]>([]);

  const percentage = Math.round((score / totalQuestions) * 100);

  useEffect(() => {
    const loadHighScores = async () => {
      try {
        const result = await getHighScores();
        setHighScores(result as HighScore[]);
      } catch (error) {
        console.error("Error loading high scores:", error);
      }
    };

    loadHighScores();
  }, [score, totalQuestions]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tulemused</Text>

      <View style={styles.card}>
        <Text style={styles.mainResult}>
          {score} / {totalQuestions}
        </Text>
        <Text style={styles.percent}>{percentage}%</Text>
      </View>

      <View style={styles.statsBox}>
        <Text style={styles.statText}>Õiged vastused: {correctAnswers}</Text>
        <Text style={styles.statText}>Valed vastused: {wrongAnswers}</Text>
        <Text style={styles.statText}>Vastamata: {unansweredAnswers}</Text>
        <Text style={styles.statText}>Kokku küsimusi: {totalQuestions}</Text>
        <Text style={styles.statText}>Aeg: {duration} s</Text>
      </View>

      <Text style={styles.highScoreTitle}>Parimad tulemused</Text>

      <View style={styles.highScoreBox}>
        {highScores.length === 0 ? (
          <Text style={styles.emptyText}>Tulemusi veel pole</Text>
        ) : (
          highScores.map((item, index) => (
            <View key={item.id} style={styles.row}>
              <Text style={styles.nameText}>
                {index + 1}. {item.username || "Anonymous"}
              </Text>
              <Text style={styles.scoreText}>
                {item.score}/{item.totalQuestions}
              </Text>
              <Text style={styles.durationText}>{item.duration}s</Text>
              <Text style={styles.percentText}>{item.percentage}%</Text>
            </View>
          ))
        )}
      </View>
      <StyledButton
        title="Alusta uuesti"
        onPress={onRestart}
        style={styles.button}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.PRIMARY_BACKGROUND,
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 30,
    color: COLORS.PRIMARY_TEXT,
  },
  card: {
    backgroundColor: COLORS.SELECTED_BACKGROUND,
    borderRadius: 20,
    paddingVertical: 30,
    paddingHorizontal: 20,
    alignItems: "center",
    marginBottom: 25,
  },
  mainResult: {
    fontSize: 36,
    fontWeight: "700",
    marginBottom: 8,
    color: COLORS.PRIMARY_TEXT,
  },
  percent: {
    fontSize: 24,
    color: COLORS.PRIMARY_ACTIVE_BUTTON,
    fontWeight: "700",
  },
  statsBox: {
    backgroundColor: COLORS.SECONDARY_BACKGROUND,
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
  },
  statText: {
    fontSize: 17,
    marginBottom: 10,
    color: COLORS.PRIMARY_TEXT,
  },
  highScoreTitle: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 12,
    color: COLORS.PRIMARY_TEXT,
  },
  highScoreBox: {
    backgroundColor: COLORS.SECONDARY_BACKGROUND,
    borderRadius: 20,
    padding: 16,
    marginBottom: 24,
  },
  emptyText: {
    fontSize: 16,
    color: COLORS.SUBTITLE_TEXT,
  },
  row: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 12,
  },
  placeText: {
    width: 26,
    fontSize: 16,
    color: COLORS.PRIMARY_TEXT,
  },
  nameText: {
    width: 105,
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.PRIMARY_TEXT,
  },
  scoreText: {
    flex: 0.7,
    fontSize: 16,
    textAlign: "center",
    color: COLORS.PRIMARY_TEXT,
  },
  durationText: {
    flex: 0.7,
    fontSize: 16,
    textAlign: "center",
    color: COLORS.SUBTITLE_TEXT,
  },
  percentText: {
    flex: 0.7,
    fontSize: 16,
    textAlign: "right",
    fontWeight: "700",
    color: COLORS.PRIMARY_ACTIVE_BUTTON,
  },
  button: {
    width: "100%",
  },
});
