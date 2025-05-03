import React from "react"
import { View, TextInput, Text, StyleSheet, type TextInputProps } from "react-native"
import { colors, borderRadius, fontSize } from "@/constants/theme"
import { CountrySelector, type Country } from "./country-selector"

interface PhoneInputProps extends Omit<TextInputProps, "value" | "onChangeText"> {
  label?: string
  error?: string
  containerStyle?: any
  labelStyle?: any
  inputStyle?: any
  errorStyle?: any
  value: string
  onChangeText: (text: string) => void
  selectedCountry: Country
  onSelectCountry: (country: Country) => void
}

export function PhoneInput({
  label,
  error,
  containerStyle,
  labelStyle,
  inputStyle,
  errorStyle,
  value,
  onChangeText,
  selectedCountry,
  onSelectCountry,
  ...props
}: PhoneInputProps) {
  return (
    <View style={[styles.container, containerStyle]}>
      {label && <Text style={[styles.label, labelStyle]}>{label}</Text>}
      <View style={styles.inputContainer}>
        <CountrySelector
          selectedCountry={selectedCountry}
          onSelect={onSelectCountry}
          containerStyle={styles.countrySelector}
        />
        <TextInput
          style={[styles.input, error ? styles.inputError : null, inputStyle]}
          value={value}
          onChangeText={onChangeText}
          keyboardType="phone-pad"
          placeholderTextColor={colors.mediumGray}
          {...props}
        />
      </View>
      {error && <Text style={[styles.error, errorStyle]}>{error}</Text>}
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
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  countrySelector: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    padding: 12,
    fontSize: fontSize.md,
    color: colors.textPrimary,
    height: 48,
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
