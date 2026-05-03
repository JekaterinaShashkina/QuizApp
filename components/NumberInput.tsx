import { View, TextInput, Pressable, Text, StyleSheet } from "react-native";
import { COLORS } from "../constants/ui";

type NumberInputProps = {
  value: number;
  onChange: (val: number) => void;
};

export const NumberInput = ({ value, onChange }: NumberInputProps) => {
  const increase = () => onChange(value + 1);
  const decrease = () => onChange(value > 1 ? value - 1 : 1);

  return (
    <View style={styles.container}>
      <Pressable style={styles.button} onPress={decrease}>
        <Text style={styles.btnText}>-</Text>
      </Pressable>

      <TextInput
        style={styles.input}
        value={String(value)}
        keyboardType="number-pad"
        onChangeText={(text) => {
          const num = Number(text);
          if (!isNaN(num)) onChange(num);
        }}
      />

      <Pressable style={styles.button} onPress={increase}>
        <Text style={styles.btnText}>+</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: COLORS.PRIMARY_BORDER,
    backgroundColor: COLORS.SELECTED_BACKGROUND,
    borderRadius: 10,
    padding: 10,
    width: 80,
    textAlign: "center",
    fontSize: 18,
  },
  button: {
    backgroundColor: COLORS.SECONDARY_BACKGROUND,
    padding: 12,
    borderRadius: 10,
  },
  btnText: {
    fontSize: 20,
    fontWeight: "700",
  },
});
