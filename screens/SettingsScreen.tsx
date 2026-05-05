import { useEffect, useState } from "react";
import {
  difficulties,
  questionTypes,
  TriviaSettings,
} from "../services/TriviaApi";
import { StyleSheet, Text, ScrollView, View, TextInput } from "react-native";
import { NumberInput } from "../components/NumberInput";
import { StyledButton } from "../components/StyledButton";
import {
  fetchTriviaCategories,
  TriviaCategory,
} from "../services/TriviaCategory";
import { OptionButton } from "../components/OptionButton";
import CategoryPicker from "../components/CategoryPicker";
import { COLORS } from "../constants/ui";

type SettingsScreenProps = {
  onStart: (settings: TriviaSettings) => void;
};

export const SettingsScreen = ({ onStart }: SettingsScreenProps) => {
  const [amount, setAmount] = useState(5);
  const [difficulty, setDifficulty] =
    useState<TriviaSettings["difficulty"]>("");
  const [type, setType] = useState<TriviaSettings["type"]>("");

  const [categories, setCategories] = useState<TriviaCategory[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState(false);
  const [category, setCategory] = useState("");

  const [categoryModalVisible, setCategoryModalVisible] = useState(false);
  const [username, setUsername] = useState("");

  const startQuiz = () => {
    onStart({
      username: username.trim() || "Anonymous",
      amount: Number(amount),
      category,
      difficulty,
      type,
    });
  };

  const handleDifficultyChange = (value: TriviaSettings["difficulty"]) => {
    setDifficulty(value);
  };

  const handleTypeChange = (value: TriviaSettings["type"]) => {
    setType(value);
  };

  useEffect(() => {
    const loadCategories = async () => {
      try {
        setCategoriesLoading(true);

        const result = await fetchTriviaCategories();
        setCategories(result);
      } catch (error) {
        console.error("Error loading categories:", error);
      } finally {
        setCategoriesLoading(false);
      }
    };

    loadCategories();
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>QuizApp</Text>
      <Text style={styles.subtitle}>Vali viktoriini seaded</Text>
      <Text style={styles.label}>Kasutaja nimi</Text>
      <TextInput
        style={styles.input}
        value={username}
        onChangeText={setUsername}
        placeholder="Sisesta nimi"
        placeholderTextColor={COLORS.PLACEHOLDER}
      />
      <Text style={styles.label}>Küsimuste arv</Text>
      <NumberInput value={amount} onChange={setAmount} />

      <Text style={styles.label}>Raskusteaste</Text>
      <View style={styles.row}>
        {difficulties.map((item) => (
          <OptionButton
            key={item || "any"}
            label={item ? item[0].toUpperCase() + item.slice(1) : "Any"}
            selected={difficulty === item}
            onPress={() => handleDifficultyChange(item)}
          />
        ))}
      </View>

      <Text style={styles.label}>Tüüp</Text>
      <View style={styles.row}>
        {questionTypes.map((item) => (
          <OptionButton
            key={item || "any"}
            label={item ? item[0].toUpperCase() + item.slice(1) : "Any"}
            selected={type === item}
            onPress={() => handleTypeChange(item)}
          />
        ))}
      </View>
      <Text style={styles.label}>Kategooria</Text>
      <View style={styles.pickerBox}>
        <CategoryPicker
          categories={categories}
          selectedCategory={category}
          onSelect={setCategory}
          visible={categoryModalVisible}
          onOpen={() => setCategoryModalVisible(true)}
          onClose={() => setCategoryModalVisible(false)}
        />
      </View>
      <StyledButton
        title="Alusta viktoriini"
        onPress={startQuiz}
        style={styles.startButton}
      ></StyledButton>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: COLORS.PRIMARY_BACKGROUND,
    padding: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 36,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    textAlign: "center",
    color: COLORS.SUBTITLE_TEXT,
    marginBottom: 32,
  },
  label: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 10,
    marginTop: 16,
  },
  row: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  selectedOption: {
    backgroundColor: COLORS.SELECTED_BACKGROUND,
  },
  optionText: {
    fontSize: 16,
    fontWeight: "500",
  },
  startButton: {
    marginTop: 32,
    alignSelf: "center",
  },
  pickerBox: {
    width: "100%",
    backgroundColor: COLORS.SECONDARY_BACKGROUND,
    borderRadius: 14,
    overflow: "hidden",
    marginBottom: 16,
  },
  input: {
    width: "80%",
    backgroundColor: COLORS.SECONDARY_BACKGROUND,
    borderWidth: 1,
    borderColor: COLORS.PRIMARY_BORDER,
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 16,
    fontSize: 16,
    color: COLORS.PRIMARY_TEXT,
    marginTop: 8,
    marginBottom: 20,
  },
});
