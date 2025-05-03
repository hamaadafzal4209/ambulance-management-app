import { forwardRef } from "react"
import {
  TextInput,
  View,
  Text,
  StyleSheet,
  type TextInputProps,
  type StyleProp,
  type ViewStyle,
  type TextStyle,
} from "react-native"
import { colors, borderRadius, fontSize } from "@/constants/theme"

interface InputProps extends TextInputProps {
  label?: string
  error?: string
  containerStyle?: StyleProp<ViewStyle>
  labelStyle?: StyleProp<TextStyle>
  inputStyle?: StyleProp<ViewStyle>
  errorStyle?: StyleProp<TextStyle>
}

export const Input = forwardRef<TextInput, InputProps>(
  ({ label, error, containerStyle, labelStyle, inputStyle, errorStyle, ...props }, ref) => {
    return (
      <View style={[styles.container, containerStyle]}>
        {label && <Text style={[styles.label, labelStyle]}>{label}</Text>}
        <TextInput
          ref={ref}
          style={[styles.input, error ? styles.inputError : null, inputStyle]}
          placeholderTextColor={colors.mediumGray}
          {...props}
        />
        {error && <Text style={[styles.error, errorStyle]}>{error}</Text>}
      </View>
    )
  },
)

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
  },
  inputError: {
    borderColor: colors.danger,
  },
  error: {
    fontSize: fontSize.xs,
    color: colors.danger,
    marginTop: 4,
  },
})
