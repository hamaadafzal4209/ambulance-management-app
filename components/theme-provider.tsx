"use client"

import { colors } from "@/constants/theme"
import { createContext, useContext, type ReactNode } from "react"
import { useColorScheme } from "react-native"

type ThemeContextType = {
  theme: "light" | "dark"
  colors: typeof colors
}

const ThemeContext = createContext<ThemeContextType>({
  theme: "light",
  colors,
})

export function ThemeProvider({ children }: { children: ReactNode }) {
  const colorScheme = useColorScheme()
  const theme = colorScheme === "dark" ? "dark" : "light"

  // For now, we're using the same colors for both themes
  // In a real app, you might want to have different colors for dark mode
  const value = {
    theme,
    colors,
  }

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export function useTheme() {
  return useContext(ThemeContext)
}
