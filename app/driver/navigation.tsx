"use client";

import { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CustomMapView } from "@/components/ui/map-view";
import { colors, spacing } from "@/constants/theme";
import { Ionicons, Feather } from "@expo/vector-icons";

export default function DriverNavigation() {
  const [driverLocation, setDriverLocation] = useState({
    latitude: 37.78025,
    longitude: -122.4352,
  });
  const [patientLocation] = useState({
    latitude: 37.78825,
    longitude: -122.4324,
  });
  const [hospitalLocation] = useState({
    latitude: 37.795,
    longitude: -122.425,
  });
  const [eta, setEta] = useState("5 min");
  const [status, setStatus] = useState("Driving to patient");
  const [patientInfo] = useState({
    name: "Sarah Johnson",
    emergencyType: "Heart Attack",
    condition: "Unknown",
    notes: "",
  });

  // Simulate driver movement
  useEffect(() => {
    const interval = setInterval(() => {
      if (status === "Driving to patient") {
        setDriverLocation((prev) => ({
          latitude:
            prev.latitude + (patientLocation.latitude - prev.latitude) * 0.1,
          longitude:
            prev.longitude + (patientLocation.longitude - prev.longitude) * 0.1,
        }));

        // Update ETA
        const distance = Math.sqrt(
          Math.pow(patientLocation.latitude - driverLocation.latitude, 2) +
            Math.pow(patientLocation.longitude - driverLocation.longitude, 2)
        );

        const newEta = Math.max(1, Math.floor(distance * 1000));
        setEta(`${newEta} min`);

        // Update status based on distance
        if (distance < 0.001) {
          setStatus("Arrived at patient");
          clearInterval(interval);
        }
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [driverLocation, patientLocation, status]);

  // Calculate route
  const route =
    status === "Driving to patient"
      ? [
          driverLocation,
          { latitude: 37.782, longitude: -122.434 },
          { latitude: 37.785, longitude: -122.433 },
          patientLocation,
        ]
      : [
          patientLocation,
          { latitude: 37.79, longitude: -122.43 },
          { latitude: 37.792, longitude: -122.428 },
          hospitalLocation,
        ];

  const handlePickupPatient = () => {
    setStatus("Driving to hospital");

    // Reset ETA for hospital route
    setEta("12 min");

    // Start moving to hospital (in a real app, this would be more sophisticated)
    const interval = setInterval(() => {
      setDriverLocation((prev) => ({
        latitude:
          prev.latitude + (hospitalLocation.latitude - prev.latitude) * 0.05,
        longitude:
          prev.longitude + (hospitalLocation.longitude - prev.longitude) * 0.05,
      }));

      // Update ETA
      const distance = Math.sqrt(
        Math.pow(hospitalLocation.latitude - driverLocation.latitude, 2) +
          Math.pow(hospitalLocation.longitude - driverLocation.longitude, 2)
      );

      const newEta = Math.max(1, Math.floor(distance * 800));
      setEta(`${newEta} min`);

      // Update status based on distance
      if (distance < 0.005) {
        setStatus("Arrived at hospital");
        clearInterval(interval);
      }
    }, 2000);
  };

  const handleUpdateCondition = (condition: string) => {
    // In a real app, this would update the state and send to backend
    console.log(`Updated patient condition to ${condition}`);
  };

  const handleCompleteTrip = () => {
    router.replace("/driver/dashboard");
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color={colors.darkGray} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Navigation</Text>
        <View style={styles.placeholder} />
      </View>

      {/* <View style={styles.mapContainer}>
        <CustomMapView
          markers={[
            {
              id: "driver",
              coordinate: driverLocation,
              title: "Your Location",
              type: "ambulance",
            },
            {
              id: "patient",
              coordinate: patientLocation,
              title: "Patient Location",
              type: "user",
            },
            {
              id: "hospital",
              coordinate: hospitalLocation,
              title: "Hospital",
              type: "hospital",
            },
          ]}
          route={route}
          initialRegion={{
            latitude: (driverLocation.latitude + patientLocation.latitude) / 2,
            longitude:
              (driverLocation.longitude + patientLocation.longitude) / 2,
            latitudeDelta: 0.02,
            longitudeDelta: 0.02,
          }}
        />
      </View> */}

      <ScrollView   showsVerticalScrollIndicator={false}  style={styles.content}>
        <Card style={styles.statusCard}>
          <CardContent>
            <View style={styles.statusContainer}>
              <View style={styles.statusIndicator}>
                <View style={styles.statusDot} />
                <Text style={styles.statusText}>{status}</Text>
              </View>
              <View style={styles.etaContainer}>
                <Feather name="clock" size={16} color={colors.white} />
                <Text style={styles.etaText}>ETA: {eta}</Text>
              </View>
            </View>
          </CardContent>
        </Card>

        <Text style={styles.sectionTitle}>Patient Information</Text>

        <Card style={styles.patientCard}>
          <CardContent>
            <View style={styles.patientInfo}>
              <View style={styles.patientDetail}>
                <Feather name="user" size={16} color={colors.mediumGray} />
                <Text style={styles.patientDetailText}>{patientInfo.name}</Text>
              </View>
              <View style={styles.patientDetail}>
                <Feather name="map-pin" size={16} color={colors.mediumGray} />
                <Text style={styles.patientDetailText}>
                  123 Market St, San Francisco, CA
                </Text>
              </View>
              <View style={styles.emergencyType}>
                <Text style={styles.emergencyTypeText}>
                  {patientInfo.emergencyType}
                </Text>
              </View>
            </View>
          </CardContent>
        </Card>

        {status === "Arrived at patient" && (
          <>
            <Text style={styles.sectionTitle}>Update Patient Condition</Text>

            <View style={styles.conditionButtons}>
              <TouchableOpacity
                style={[
                  styles.conditionButton,
                  patientInfo.condition === "Stable" &&
                    styles.selectedCondition,
                ]}
                onPress={() => handleUpdateCondition("Stable")}
              >
                <Text style={styles.conditionButtonText}>Stable</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.conditionButton,
                  patientInfo.condition === "Critical" &&
                    styles.selectedCondition,
                ]}
                onPress={() => handleUpdateCondition("Critical")}
              >
                <Text style={styles.conditionButtonText}>Critical</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.conditionButton,
                  patientInfo.condition === "Unconscious" &&
                    styles.selectedCondition,
                ]}
                onPress={() => handleUpdateCondition("Unconscious")}
              >
                <Text style={styles.conditionButtonText}>Unconscious</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.conditionButton,
                  patientInfo.condition === "Needs Oxygen" &&
                    styles.selectedCondition,
                ]}
                onPress={() => handleUpdateCondition("Needs Oxygen")}
              >
                <Text style={styles.conditionButtonText}>Needs Oxygen</Text>
              </TouchableOpacity>
            </View>

            <Button style={styles.pickupButton} onPress={handlePickupPatient}>
              <View style={styles.buttonContent}>
                <Feather name="check" size={16} color={colors.white} />
                <Text style={styles.buttonText}>Confirm Pickup</Text>
              </View>
            </Button>
          </>
        )}

        {status === "Arrived at hospital" && (
          <Button style={styles.completeButton} onPress={handleCompleteTrip}>
            <View style={styles.buttonContent}>
              <Feather name="check" size={16} color={colors.white} />
              <Text style={styles.buttonText}>Complete Trip</Text>
            </View>
          </Button>
        )}
      </ScrollView>
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
    justifyContent: "space-between",
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  backButton: {
    padding: spacing.xs,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.darkGray,
  },
  placeholder: {
    width: 24,
  },
  mapContainer: {
    height: 300,
  },
  content: {
    flex: 1,
    padding: spacing.md,
  },
  statusCard: {
    marginBottom: spacing.md,
    backgroundColor: colors.red,
  },
  statusContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  statusIndicator: {
    flexDirection: "row",
    alignItems: "center",
  },
  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.white,
    marginRight: spacing.sm,
  },
  statusText: {
    color: colors.white,
    fontWeight: "600",
    fontSize: 16,
  },
  etaContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: 4,
  },
  etaText: {
    color: colors.white,
    marginLeft: spacing.xs,
    fontWeight: "500",
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginTop: spacing.md,
    marginBottom: spacing.sm,
    color: colors.darkGray,
  },
  patientCard: {
    marginBottom: spacing.md,
  },
  patientInfo: {
    gap: spacing.sm,
  },
  patientDetail: {
    flexDirection: "row",
    alignItems: "center",
  },
  patientDetailText: {
    marginLeft: spacing.sm,
    fontSize: 14,
    color: colors.darkGray,
  },
  emergencyType: {
    backgroundColor: "rgba(229, 57, 53, 0.1)",
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: 4,
    alignSelf: "flex-start",
  },
  emergencyTypeText: {
    color: colors.red,
    fontWeight: "500",
  },
  conditionButtons: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  conditionButton: {
    backgroundColor: colors.lightGray,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: "transparent",
  },
  selectedCondition: {
    borderColor: colors.blue,
    backgroundColor: "rgba(25, 118, 210, 0.1)",
  },
  conditionButtonText: {
    color: colors.darkGray,
    fontWeight: "500",
  },
  pickupButton: {
    backgroundColor: colors.success,
    marginBottom: spacing.xl,
  },
  completeButton: {
    backgroundColor: colors.success,
    marginBottom: spacing.xl,
  },
  buttonContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  buttonText: {
    color: colors.white,
    marginLeft: spacing.xs,
    fontWeight: "600",
  },
});
