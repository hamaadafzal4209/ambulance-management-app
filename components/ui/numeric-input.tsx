import { View, Text, StyleSheet, TextInput, type StyleProp, type ViewStyle, type TextStyle } from "react-native"
import { colors, borderRadius, fontSize } from "@/constants/theme"

interface NumericInputProps {
  label: string
  value: string
  onChangeText: (text: string) => void
  placeholder?: string
  containerStyle?: StyleProp<ViewStyle>
  labelStyle?: StyleProp<TextStyle>
  inputStyle?: StyleProp<ViewStyle>
  min?: number
  max?: number
}

export function NumericInput({
  label,
  value,
  onChangeText,
  placeholder = "Enter a number",
  containerStyle,
  labelStyle,
  inputStyle,
  min,
  max,
}: NumericInputProps) {
  const handleChange = (text: string) => {
    // Only allow numbers
    if (text === "" || /^\d+$/.test(text)) {
      // Check min/max if provided
      if (text === "") {
        onChangeText(text)
      } else {
        const num = Number.parseInt(text, 10)
        if ((min === undefined || num >= min) && (max === undefined || num <= max)) {
          onChangeText(text)
        }
      }
    }
  }

  return (
    <View style={[styles.container, containerStyle]}>
      <Text style={[styles.label, labelStyle]}>{label}</Text>
      <TextInput
        style={[styles.input, inputStyle]}
        value={value}
        onChangeText={handleChange}
        placeholder={placeholder}
        keyboardType="numeric"
        placeholderTextColor={colors.mediumGray}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
    width: "100%",
  },
  label: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    marginBottom: 6,
  },
  input: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    padding: 12,
    fontSize: fontSize.md,
    color: colors.textPrimary,
    height: 48,
  },
})
