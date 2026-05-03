import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { getHighScores } from '../database/db';

type ResultsScreenProps = {
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  wrongAnswers: number;
  unansweredAnswers: number;
  onRestart: () => void;
};

type HighScore = {
  id: number;
  score: number;
  totalQuestions: number;
  percentage: number;
  createdAt: string;
};

export default function ResultsScreen({
  score,
  totalQuestions,
  correctAnswers,
  wrongAnswers,
  unansweredAnswers,
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
        console.error('Error loading high scores:', error);
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
      </View>

      <Text style={styles.highScoreTitle}>Parimad tulemused</Text>

      <View style={styles.highScoreBox}>
        {highScores.length === 0 ? (
          <Text style={styles.emptyText}>Tulemusi veel pole</Text>
        ) : (
          highScores.map((item, index) => (
            <View key={item.id} style={styles.row}>
              <Text style={styles.rowText}>
                {index + 1}. {item.score}/{item.totalQuestions}
              </Text>
              <Text style={styles.rowText}>{item.percentage}%</Text>
            </View>
          ))
        )}
      </View>

      <Pressable style={styles.button} onPress={onRestart}>
        <Text style={styles.buttonText}>Alusta uuesti</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 30,
  },
  card: {
    backgroundColor: '#f3f7ff',
    borderRadius: 16,
    paddingVertical: 30,
    paddingHorizontal: 20,
    alignItems: 'center',
    marginBottom: 25,
  },
  mainResult: {
    fontSize: 36,
    fontWeight: '700',
    marginBottom: 8,
  },
  percent: {
    fontSize: 24,
    color: '#2563eb',
    fontWeight: '600',
  },
  statsBox: {
    backgroundColor: '#f8f8f8',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
  },
  statText: {
    fontSize: 18,
    marginBottom: 10,
  },
  highScoreTitle: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 12,
  },
  highScoreBox: {
    backgroundColor: '#f8f8f8',
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  rowText: {
    fontSize: 17,
  },
  button: {
    backgroundColor: '#2563eb',
    paddingVertical: 16,
    borderRadius: 12,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '600',
  },
});