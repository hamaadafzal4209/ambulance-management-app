"use client";

import { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PhoneInput } from "@/components/ui/phone-input";
import { colors, spacing } from "@/constants/theme";
import { useAuth } from "@/components/auth-provider";

export default function UserSignup() {
  const { signUp } = useAuth();
  const [name, setName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedCountry, setSelectedCountry] = useState({
    code: "+1",
    name: "United States",
    flag: "🇺🇸",
  });

  const handleSignup = async () => {
    if (!name || !phoneNumber || !password || !confirmPassword) {
      setError("Please fill in all fields");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // Combine country code and phone number
      const fullPhoneNumber = `${selectedCountry.code}${phoneNumber}`;
      await signUp(name, fullPhoneNumber, password, "user");
    } catch (err) {
      setError("Failed to create account");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>

        <View style={styles.content}>
          <Image
            source={require("@/assets/ambulance-logo.png")}
            style={styles.logo}
            resizeMode="contain"
          />

          <Text style={styles.title}>Create Account</Text>

          {error ? <Text style={styles.errorText}>{error}</Text> : null}

          <Input
            label="Full Name"
            value={name}
            onChangeText={setName}
            placeholder="Enter your full name"
            containerStyle={styles.inputContainer}
          />

          <PhoneInput
            label="Phone Number"
            value={phoneNumber}
            onChangeText={setPhoneNumber}
            selectedCountry={selectedCountry}
            onSelectCountry={setSelectedCountry}
            placeholder="Enter your phone number"
            containerStyle={styles.inputContainer}
          />

          <Input
            label="Password"
            value={password}
            onChangeText={setPassword}
            placeholder="Create a password"
            secureTextEntry
            containerStyle={styles.inputContainer}
          />

          <Input
            label="Confirm Password"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            placeholder="Confirm your password"
            secureTextEntry
            containerStyle={styles.inputContainer}
          />

          <Button
            onPress={handleSignup}
            style={styles.signupButton}
            disabled={loading}
          >
            <Text style={styles.buttonText}>
              {loading ? "Creating Account..." : "Create Account"}
            </Text>
          </Button>

          <View style={styles.footer}>
            <Text style={styles.footerText}>Already have an account? </Text>
            <TouchableOpacity onPress={() => router.replace("/user/login")}>
              <Text style={styles.loginLink}>Login</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  backButton: {
    padding: spacing.md,
  },
  backButtonText: {
    color: colors.blue,
    fontSize: 16,
  },
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: spacing.xl,
    paddingTop: 0
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: spacing.sm,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: spacing.xl,
    color: colors.darkGray,
  },
  errorText: {
    color: colors.red,
    marginBottom: spacing.md,
    textAlign: "center",
  },
  inputContainer: {
    marginBottom: spacing.lg,
    width: "100%",
  },
  signupButton: {
    width: "100%",
    backgroundColor: colors.blue,
    marginBottom: spacing.xl,
  },
  buttonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: "600",
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
  },
  footerText: {
    color: colors.mediumGray,
  },
  loginLink: {
    color: colors.blue,
    fontWeight: "600",
  },
});
