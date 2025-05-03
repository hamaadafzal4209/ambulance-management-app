import { Stack } from "expo-router"
import { ThemeProvider } from "@/components/theme-provider"
import { AuthProvider } from "@/components/auth-provider"
import { OnboardingProvider } from "@/components/onboarding-provider"
import { StatusBar } from "expo-status-bar"
import { GestureHandlerRootView } from "react-native-gesture-handler"
import { View } from "react-native"
export default function RootLayout() {
  global.setImmediate = ((fn: (...args: any[]) => void, ...args: any[]) => setTimeout(fn, 0, ...args)) as any  

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AuthProvider>
        <ThemeProvider>
          <OnboardingProvider>
            <View style={{ flex: 1 }}>
              <StatusBar style="auto" />
              <Stack screenOptions={{ headerShown: false }} />
            </View>
          </OnboardingProvider>
        </ThemeProvider>
      </AuthProvider>
    </GestureHandlerRootView>
  )
}
