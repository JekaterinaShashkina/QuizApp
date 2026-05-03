import { Pressable, ViewStyle, Text, StyleSheet } from "react-native";
import { COLORS } from "../constants/ui";

type StyledButtonProps = {
  title: string;
  onPress: () => void;
  style?: ViewStyle;
};

export const StyledButton = ({ title, onPress, style }: StyledButtonProps) => {
  return (
    <Pressable style={[styles.button, style]} onPress={onPress}>
      <Text style={styles.text}>{title}</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: COLORS.PRIMARY_ACTIVE_BUTTON,
    paddingVertical: 16,
    paddingHorizontal: 28,
    borderRadius: 14,
    minWidth: 180,
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    color: COLORS.BUTTON_TEXT,
    fontSize: 18,
    fontWeight: "700",
    textAlign: "center",
  },
});
