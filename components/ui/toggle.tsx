import { View, Text, StyleSheet, TouchableOpacity, type StyleProp, type ViewStyle, type TextStyle } from "react-native"
import { colors, spacing, borderRadius } from "@/constants/theme"

interface ToggleProps {
  label: string
  value: boolean
  onValueChange: (value: boolean) => void
  containerStyle?: StyleProp<ViewStyle>
  labelStyle?: StyleProp<TextStyle>
}

export function Toggle({ label, value, onValueChange, containerStyle, labelStyle }: ToggleProps) {
  return (
    <View style={[styles.container, containerStyle]}>
      <Text style={[styles.label, labelStyle]}>{label}</Text>
      <View style={styles.toggleContainer}>
        <TouchableOpacity
          style={[styles.option, value === false && styles.optionSelected]}
          onPress={() => onValueChange(false)}
        >
          <Text style={[styles.optionText, value === false && styles.optionTextSelected]}>No</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.option, value === true && styles.optionSelected]}
          onPress={() => onValueChange(true)}
        >
          <Text style={[styles.optionText, value === true && styles.optionTextSelected]}>Yes</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.md,
  },
  label: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  toggleContainer: {
    flexDirection: "row",
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: "hidden",
  },
  option: {
    flex: 1,
    paddingVertical: spacing.sm,
    alignItems: "center",
    backgroundColor: colors.white,
  },
  optionSelected: {
    backgroundColor: colors.blue,
  },
  optionText: {
    color: colors.textPrimary,
    fontWeight: "500",
  },
  optionTextSelected: {
    color: colors.white,
  },
})
