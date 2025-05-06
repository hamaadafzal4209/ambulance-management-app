"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import AsyncStorage from "@react-native-async-storage/async-storage"

type OnboardingContextType = {
  hasCompletedOnboarding: boolean
  isLoading: boolean
  completeOnboarding: () => Promise<void>
  resetOnboarding: () => Promise<void>
}

const OnboardingContext = createContext<OnboardingContextType>({
  hasCompletedOnboarding: false,
  isLoading: true,
  completeOnboarding: async () => {},
  resetOnboarding: async () => {},
})

const ONBOARDING_COMPLETED_KEY = "onboarding_completed"

export function OnboardingProvider({ children }: { children: ReactNode }) {
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const checkOnboardingStatus = async () => {
      try {
        const value = await AsyncStorage.getItem(ONBOARDING_COMPLETED_KEY)
        setHasCompletedOnboarding(value === "true")
      } catch (error) {
        console.error("Failed to load onboarding status:", error)
      } finally {
        setIsLoading(false)
      }
    }

    checkOnboardingStatus()
  }, [])
  
  const completeOnboarding = async () => {
    try {
      await AsyncStorage.setItem(ONBOARDING_COMPLETED_KEY, "true")
      setHasCompletedOnboarding(true)
    } catch (error) {
      console.error("Failed to save onboarding status:", error)
    }
  }

  const resetOnboarding = async () => {
    try {
      await AsyncStorage.removeItem(ONBOARDING_COMPLETED_KEY)
      setHasCompletedOnboarding(false)
    } catch (error) {
      console.error("Failed to reset onboarding status:", error)
    }
  }

  return (
    <OnboardingContext.Provider
      value={{
        hasCompletedOnboarding,
        isLoading,
        completeOnboarding,
        resetOnboarding,
      }}
    >
      {children}
    </OnboardingContext.Provider>
  )
}

export function useOnboarding() {
  return useContext(OnboardingContext)
}
