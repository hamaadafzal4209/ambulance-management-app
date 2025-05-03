"use client"

import { View, Text, StyleSheet, Image, Animated, Easing } from "react-native"
import { useEffect, useRef } from "react"
import { colors } from "@/constants/theme"

export function SplashScreen() {
  const pulseAnim = useRef(new Animated.Value(1)).current
  const rotateAnim = useRef(new Animated.Value(0)).current

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.1,
          duration: 800,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 800,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ]),
    ).start()

    Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 2000,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    ).start()
  }, [pulseAnim, rotateAnim])

  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  })

  return (
    <View style={styles.container}>
      <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
        <Image source={require("@/assets/ambulance-logo.png")} style={styles.logo} resizeMode="contain" />
      </Animated.View>
      <Text style={styles.title}>Smart Ambulance</Text>
      <Text style={styles.subtitle}>Emergency Response System</Text>

      <Animated.View style={[styles.loadingIndicator, { transform: [{ rotate: spin }] }]} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  logo: {
    width: 150,
    height: 150,
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: colors.darkGray,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    color: colors.mediumGray,
    marginBottom: 40,
  },
  loadingIndicator: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 3,
    borderColor: colors.lightGray,
    borderTopColor: colors.red,
    marginTop: 20,
  },
})
