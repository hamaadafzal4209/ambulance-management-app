import type React from "react"
import { View, StyleSheet, type StyleProp, type ViewStyle } from "react-native"
import { colors, borderRadius, shadows } from "@/constants/theme"

interface CardProps {
  children: React.ReactNode
  style?: StyleProp<ViewStyle>
  variant?: "elevated" | "outlined" | "filled"
}

export function Card({ children, style, variant = "elevated" }: CardProps) {
  return <View style={[styles.card, styles[variant], style]}>{children}</View>
}

interface CardContentProps {
  children: React.ReactNode
  style?: StyleProp<ViewStyle>
}

export function CardContent({ children, style }: CardContentProps) {
  return <View style={[styles.content, style]}>{children}</View>
}

interface CardHeaderProps {
  children: React.ReactNode
  style?: StyleProp<ViewStyle>
}

export function CardHeader({ children, style }: CardHeaderProps) {
  return <View style={[styles.header, style]}>{children}</View>
}

interface CardFooterProps {
  children: React.ReactNode
  style?: StyleProp<ViewStyle>
}

export function CardFooter({ children, style }: CardFooterProps) {
  return <View style={[styles.footer, style]}>{children}</View>
}

const styles = StyleSheet.create({
  card: {
    borderRadius: borderRadius.lg,
    backgroundColor: colors.cardBackground,
    overflow: "hidden",
  },
  elevated: {
    ...shadows.md,
  },
  outlined: {
    borderWidth: 1,
    borderColor: colors.border,
  },
  filled: {
    backgroundColor: colors.lightGray,
  },
  header: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  content: {
    padding: 16,
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
})
