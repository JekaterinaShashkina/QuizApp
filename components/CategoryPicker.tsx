import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { TriviaCategory } from "../services/TriviaCategory";
import { StyledButton } from "./StyledButton";
import { COLORS } from "../constants/ui";

type Props = {
  categories: TriviaCategory[];
  selectedCategory: string;
  onSelect: (value: string) => void;
  visible: boolean;
  onClose: () => void;
  onOpen: () => void;
};

export default function CategoryPicker({
  categories,
  selectedCategory,
  onSelect,
  visible,
  onClose,
  onOpen,
}: Props) {
  const selectedName =
    categories.find((item) => String(item.id) === selectedCategory)?.name ||
    "Any";

  return (
    <>
      <Pressable style={styles.selectBox} onPress={onOpen}>
        <Text style={styles.selectText}>{selectedName}</Text>
        <Text style={styles.arrow}>▼</Text>
      </Pressable>

      <Modal visible={visible} transparent animationType="slide">
        <View style={styles.overlay}>
          <View style={styles.modalBox}>
            <Text style={styles.title}>Vali kategooria</Text>

            <ScrollView>
              <Pressable
                style={[
                  styles.option,
                  selectedCategory === "" && styles.selectedOption,
                ]}
                onPress={() => {
                  onSelect("");
                  onClose();
                }}
              >
                <Text style={styles.optionText}>Any</Text>
              </Pressable>

              {categories.map((item) => {
                const value = String(item.id);
                const selected = selectedCategory === value;

                return (
                  <Pressable
                    key={item.id}
                    style={[styles.option, selected && styles.selectedOption]}
                    onPress={() => {
                      onSelect(value);
                      onClose();
                    }}
                  >
                    <Text style={styles.optionText}>{item.name}</Text>
                  </Pressable>
                );
              })}
            </ScrollView>

            <StyledButton title="Sulge" onPress={onClose} />
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  selectBox: {
    width: "100%",
    backgroundColor: COLORS.SECONDARY_BACKGROUND,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: COLORS.PRIMARY_BORDER,
    paddingVertical: 14,
    paddingHorizontal: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  selectText: {
    fontSize: 16,
    fontWeight: "600",
  },
  arrow: {
    fontSize: 14,
    color: COLORS.SUBTITLE_TEXT,
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "center",
    padding: 24,
  },
  modalBox: {
    maxHeight: "80%",
    backgroundColor: COLORS.PRIMARY_BACKGROUND,
    borderRadius: 20,
    padding: 18,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 14,
    textAlign: "center",
  },
  option: {
    paddingVertical: 14,
    paddingHorizontal: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.PRIMARY_BORDER,
    marginBottom: 8,
    backgroundColor: COLORS.SECONDARY_BACKGROUND,
  },
  selectedOption: {
    backgroundColor: COLORS.SELECTED_BACKGROUND,
  },
  optionText: {
    fontSize: 16,
    fontWeight: "500",
  },
});
