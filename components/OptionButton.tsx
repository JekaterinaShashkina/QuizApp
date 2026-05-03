import { Pressable, StyleSheet, Text } from "react-native";
import { COLORS } from "../constants/ui";

type OptionButtonProps = {
  label: string;
  selected: boolean;
  onPress: () => void;
};

export const OptionButton = ({
  label,
  selected,
  onPress,
}: OptionButtonProps) => {
  return (
    <Pressable
      style={[styles.option, selected && styles.selected]}
      onPress={onPress}
    >
      <Text style={styles.text}>{label || "Any"}</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  option: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.PRIMARY_BORDER,
    backgroundColor: COLORS.SECONDARY_BACKGROUND,
  },
  selected: {
    backgroundColor: COLORS.SELECTED_BACKGROUND,
  },
  text: {
    fontSize: 16,
    fontWeight: "500",
  },
});
