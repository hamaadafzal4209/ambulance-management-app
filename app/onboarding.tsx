"use client"

import { useOnboarding } from "@/components/onboarding-provider"
import { borderRadius, colors, spacing } from "@/constants/theme"
import { LinearGradient } from "expo-linear-gradient"
import { router } from "expo-router"
import { useEffect, useRef, useState } from "react"
import {
  Animated,
  Dimensions,
  Image,
  Platform,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import Swiper from "react-native-swiper"

const { width } = Dimensions.get("window")

const onboardingData = [
  {
    id: "1",
    title: "Quick Booking",
    subtitle: "Request an ambulance in just a few taps",
    image: require("@/assets/onboarding-booking.png"),
    gradientColors: ["#1976d2", "#64b5f6"],
  },
  {
    id: "2",
    title: "Real-time Tracking",
    subtitle: "Track ambulance location with live ETA updates",
    image: require("@/assets/onboarding-tracking.png"),
    gradientColors: ["#e53935", "#ff8a80"],
  },
  {
    id: "3",
    title: "24/7 Emergency Support",
    subtitle: "Medical assistance available around the clock",
    image: require("@/assets/onboarding-support.png"),
    gradientColors: ["#1976d2", "#5e35b1"],
  },
]

export default function Onboarding() {
  const { completeOnboarding } = useOnboarding()
  const [currentIndex, setCurrentIndex] = useState(0)
  const swiperRef = useRef<any>(null)

  const fadeAnim = useRef(new Animated.Value(1)).current
  const translateYAnim = useRef(new Animated.Value(0)).current
  const scaleAnim = useRef(new Animated.Value(1)).current
  const imageAnim = useRef(new Animated.Value(0)).current

  useEffect(() => {
    Animated.spring(imageAnim, {
      toValue: 1,
      friction: 8,
      tension: 40,
      useNativeDriver: true,
    }).start()

    return () => {
      imageAnim.setValue(0)
    }
  }, [currentIndex])

  const handleNext = () => {
    if (currentIndex < onboardingData.length - 1) {
      swiperRef.current?.scrollBy(1)
    } else {
      handleComplete()
    }
  }

  const handleSkip = () => {
    handleComplete()
  }

  const handleComplete = async () => {
    await completeOnboarding()
    router.replace("/")
  }

  const handleIndexChanged = (index: number) => {
    imageAnim.setValue(0)

    Animated.sequence([
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.timing(translateYAnim, {
          toValue: 20,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 0.95,
          duration: 150,
          useNativeDriver: true,
        }),
      ]),
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 350,
          useNativeDriver: true,
        }),
        Animated.timing(translateYAnim, {
          toValue: 0,
          duration: 350,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 350,
          useNativeDriver: true,
        }),
        Animated.spring(imageAnim, {
          toValue: 1,
          friction: 8,
          tension: 40,
          useNativeDriver: true,
        }),
      ]),
    ]).start()

    setCurrentIndex(index)
  }

  const renderSlide = (item: (typeof onboardingData)[0], index: number) => {
    return (
      <View key={item.id} style={styles.slide}>
        <Animated.View
          style={[
            styles.imageContainer,
            {
              transform: [
                { scale: imageAnim },
                {
                  translateY: imageAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [50, 0],
                  }),
                },
              ],
              opacity: imageAnim,
            },
          ]}
        >
          <Image source={item.image} style={styles.image} resizeMode="contain" />
          <LinearGradient colors={["transparent", "rgba(255,255,255,0.8)"]} style={styles.imageOverlay} />
        </Animated.View>

        <Animated.View
          style={[
            styles.contentContainer,
            {
              opacity: fadeAnim,
              transform: [{ translateY: translateYAnim }, { scale: scaleAnim }],
            },
          ]}
        >
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.subtitle}>{item.subtitle}</Text>
        </Animated.View>
      </View>
    )
  }

  const currentItem = onboardingData[currentIndex]

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent={Platform.OS === "android"} />

      <View style={styles.header}>
        <View style={styles.placeholder} />
        <TouchableOpacity onPress={handleSkip} style={styles.skipButton}>
          <Text style={styles.skipText}>Skip</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.swiperContainer}>
        <Swiper
          ref={swiperRef}
          style={styles.swiper}
          showsButtons={false}
          loop={false}
          autoplay={false}
          onIndexChanged={handleIndexChanged}
          dot={<View style={styles.dot} />}
          activeDot={
            <LinearGradient
              colors={currentItem.gradientColors}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.activeDot}
            />
          }
          paginationStyle={styles.pagination}
        >
          {onboardingData.map(renderSlide)}
        </Swiper>
      </View>

      <View style={styles.footer}>
        <TouchableOpacity onPress={handleNext} style={styles.nextButtonContainer}>
          <LinearGradient
            colors={currentItem.gradientColors}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.nextButton}
          >
            <Text style={styles.nextButtonText}>
              {currentIndex === onboardingData.length - 1 ? "Get Started" : "Next"}
            </Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.sm,
  },
  placeholder: {
    width: 40,
  },
  skipButton: {
    padding: spacing.sm,
    backgroundColor: colors.lightGray,
    borderRadius: 16,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  skipText: {
    color: colors.blue,
    fontSize: 12,
    fontWeight: "500",
  },
  swiperContainer: {
    flex: 1,
  },
  swiper: {
    // Empty style to override default styles
  },
  slide: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: spacing.lg,
  },
  imageContainer: {
    width: width * 0.8,
    height: width * 0.8,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: spacing.xl,
  },
  image: {
    width: "100%",
    height: "100%",
  },
  imageOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: "30%",
    borderRadius: borderRadius.xl,
  },
  contentContainer: {
    alignItems: "center",
    width: "100%",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: spacing.md,
    textAlign: "center",
    color: colors.darkGray,
    fontFamily: Platform.OS === "ios" ? "SF Pro Display" : "sans-serif",
  },
  subtitle: {
    fontSize: 16,
    color: colors.mediumGray,
    textAlign: "center",
    lineHeight: 24,
    fontFamily: Platform.OS === "ios" ? "SF Pro Text" : "sans-serif",
    paddingBottom: 50,
    maxWidth: "80%",
  },
  pagination: {
    bottom: 10,
  },
  dot: {
    backgroundColor: "#E0E0E0",
    width: 8,
    height: 8,
    borderRadius: 4,
    marginLeft: 4,
    marginRight: 4,
  },
  activeDot: {
    width: 24,
    height: 8,
    borderRadius: 4,
    marginLeft: 4,
    marginRight: 4,
  },
  footer: {
    padding: spacing.lg,
    alignItems: "center",
  },
  nextButtonContainer: {
    width: "100%",
    borderRadius: borderRadius.lg,
    overflow: "hidden",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  nextButton: {
    paddingVertical: spacing.md,
    alignItems: "center",
    justifyContent: "center",
  },
  nextButtonText: {
    color: colors.white,
    fontSize: 18,
    fontWeight: "600",
    fontFamily: Platform.OS === "ios" ? "SF Pro Text" : "sans-serif",
  },
})
