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
import { Link, router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PhoneInput } from "@/components/ui/phone-input";
import { colors, spacing } from "@/constants/theme";
import { useAuth } from "@/components/auth-provider";

export default function UserLogin() {
  const { signIn, guestSignIn } = useAuth();
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedCountry, setSelectedCountry] = useState({
    code: "+1",
    name: "United States",
    flag: "🇺🇸",
  });

  const handleLogin = async () => {
    if (!phoneNumber || !password) {
      setError("Please enter both phone number and password");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // Combine country code and phone number
      const fullPhoneNumber = `${selectedCountry.code}${phoneNumber}`;
      await signIn(fullPhoneNumber, password, "user");
    } catch (err) {
      setError("Invalid phone number or password");
    } finally {
      setLoading(false);
    }
  };

  const handleGuestLogin = async () => {
    setLoading(true);
    try {
      await guestSignIn();
    } catch (err) {
      setError("Failed to login as guest");
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

          <Text style={styles.title}>User Login</Text>

          {error ? <Text style={styles.errorText}>{error}</Text> : null}

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
            placeholder="Enter your password"
            secureTextEntry
            containerStyle={styles.inputContainer}
          />

          <Button
            onPress={handleLogin}
            style={styles.loginButton}
            disabled={loading}
          >
            <Text style={styles.buttonText}>
              {loading ? "Logging in..." : "Login"}
            </Text>
          </Button>

          <Button
            variant="outline"
            onPress={handleGuestLogin}
            style={styles.guestButton}
            disabled={loading}
          >
            <Text style={styles.guestButtonText}>Continue as Guest</Text>
          </Button>

          <View style={styles.footer}>
            <Text style={styles.footerText}>{"Don't have an account?"} </Text>
            <Link href="/user/signup" asChild>
              <TouchableOpacity>
                <Text style={styles.signupLink}>Sign Up</Text>
              </TouchableOpacity>
            </Link>
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
  loginButton: {
    width: "100%",
    backgroundColor: colors.blue,
    marginBottom: spacing.md,
  },
  buttonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: "600",
  },
  guestButton: {
    width: "100%",
    borderColor: colors.blue,
    marginBottom: spacing.xl,
  },
  guestButtonText: {
    color: colors.blue,
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
  signupLink: {
    color: colors.blue,
    fontWeight: "600",
  },
});
