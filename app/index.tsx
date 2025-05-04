"use client";

import { useOnboarding } from "@/components/onboarding-provider";
import { SplashScreen } from "@/components/splash-screen";
import { borderRadius, colors, shadows, spacing } from "@/constants/theme";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { Link, router } from "expo-router";
import React, { useEffect } from "react";
import {
  Image,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Home() {
  const { hasCompletedOnboarding, isLoading } = useOnboarding();

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!hasCompletedOnboarding) {
        router.replace("/onboarding");
      }
    }, 3000);

    return () => clearTimeout(timer);
  }, [hasCompletedOnboarding]);

  if (isLoading || !hasCompletedOnboarding) {
    return <SplashScreen />;
  }

  const RoleButton = ({
    title,
    route,
    icon,
    gradientColors,
  }: {
    title: string;
    route: string;
    icon: React.ReactNode;
    gradientColors: string[];
  }) => (
    <Link href={route} asChild>
      <TouchableOpacity style={styles.buttonWrapper}>
        <LinearGradient
          colors={gradientColors}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.gradientButton}
        >
          <View style={styles.buttonContent}>
            <View style={styles.iconContainer}>{icon}</View>
            <Text style={styles.buttonText}>{title}</Text>
          </View>
        </LinearGradient>
      </TouchableOpacity>
    </Link>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Image
          source={require("@/assets/ambulance-logo.png")}
          style={styles.logo}
          resizeMode="contain"
        />
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Smart Ambulance</Text>
          <Text style={styles.subtitle}>Emergency Response System</Text>
        </View>
      </View>

      <View style={styles.content}>
        <Text style={styles.sectionTitle}>Select your role to continue</Text>

        <View style={styles.buttonContainer}>
          <RoleButton
            title="User / Patient"
            route="/user/login"
            icon={<Ionicons name="person" size={24} color={colors.white} />}
            gradientColors={["#1976d2", "#64b5f6"]}
          />

          <RoleButton
            title="Ambulance Driver"
            route="/driver/login"
            icon={<Ionicons name="medkit" size={24} color={colors.white} />}
            gradientColors={["#e53935", "#ff8a80"]}
          />

          <RoleButton
            title="Hospital Dashboard"
            route="/hospital/login"
            icon={<Ionicons name="medical" size={24} color={colors.white} />}
            gradientColors={["#1976d2", "#5e35b1"]}
          />

          <RoleButton
            title="Traffic Police"
            route="/police/login"
            icon={
              <Ionicons
                name="shield-checkmark"
                size={24}
                color={colors.white}
              />
            }
            gradientColors={["#e53935", "#d81b60"]}
          />
        </View>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          © 2025 Smart Ambulance Management System
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0,0,0,0.05)",
  },
  logo: {
    width: 60,
    height: 60,
    marginRight: spacing.md,
  },
  titleContainer: {
    flex: 1,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: colors.darkGray,
  },
  subtitle: {
    fontSize: 14,
    color: colors.mediumGray,
  },
  content: {
    flex: 1,
    padding: spacing.lg,
    justifyContent: "center",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.darkGray,
    marginBottom: spacing.xl,
    textAlign: "center",
  },
  buttonContainer: {
    width: "100%",
    maxWidth: 320,
    alignSelf: "center",
    gap: spacing.lg,
  },
  buttonWrapper: {
    borderRadius: borderRadius.lg,
    overflow: "hidden",
    ...shadows.md,
  },
  gradientButton: {
    width: "100%",
    paddingVertical: spacing.md,
  },
  buttonContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    paddingHorizontal: spacing.lg,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.2)",
    alignItems: "center",
    justifyContent: "center",
    marginRight: spacing.md,
  },
  buttonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: "600",
  },
  footer: {
    padding: spacing.md,
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "rgba(0,0,0,0.05)",
  },
  footerText: {
    fontSize: 12,
    color: colors.mediumGray,
    fontFamily: Platform.OS === "ios" ? "SF Pro Text" : "sans-serif",
  },
});
