import type React from "react"
import {
  Pressable,
  Text,
  StyleSheet,
  type PressableProps,
  type StyleProp,
  type ViewStyle,
  type TextStyle,
} from "react-native"
import { colors, borderRadius } from "@/constants/theme"

interface ButtonProps extends PressableProps {
  variant?: "primary" | "secondary" | "outline" | "ghost"
  size?: "sm" | "md" | "lg"
  style?: StyleProp<ViewStyle>
  textStyle?: StyleProp<TextStyle>
  children: React.ReactNode
}

export function Button({ variant = "primary", size = "md", style, textStyle, children, ...props }: ButtonProps) {
  const buttonStyles = [styles.button, styles[variant], styles[`${size}Button`], style]

  const textStyles = [styles.text, styles[`${variant}Text`], styles[`${size}Text`], textStyle]

  return (
    <Pressable style={({ pressed }) => [...buttonStyles, pressed && styles.pressed]} {...props}>
      {typeof children === "string" ? <Text style={textStyles}>{children}</Text> : children}
    </Pressable>
  )
}

const styles = StyleSheet.create({
  button: {
    alignItems: "center",
    justifyContent: "center",
    borderRadius: borderRadius.md,
  },
  primary: {
    backgroundColor: colors.blue,
  },
  secondary: {
    backgroundColor: colors.red,
  },
  outline: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: colors.blue,
  },
  ghost: {
    backgroundColor: "transparent",
  },
  smButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  mdButton: {
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  lgButton: {
    paddingVertical: 14,
    paddingHorizontal: 20,
  },
  text: {
    fontWeight: "600",
  },
  primaryText: {
    color: colors.white,
  },
  secondaryText: {
    color: colors.white,
  },
  outlineText: {
    color: colors.blue,
  },
  ghostText: {
    color: colors.blue,
  },
  smText: {
    fontSize: 14,
  },
  mdText: {
    fontSize: 16,
  },
  lgText: {
    fontSize: 18,
  },
  pressed: {
    opacity: 0.8,
  },
})
