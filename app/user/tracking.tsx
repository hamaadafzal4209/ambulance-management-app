"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { colors, spacing } from "@/constants/theme";
import {
  FontAwesome5,
  Ionicons,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function TrackingScreen() {
  const [ambulanceLocation, setAmbulanceLocation] = useState({
    latitude: 37.78025,
    longitude: -122.4352,
  });
  const [userLocation] = useState({
    latitude: 37.78825,
    longitude: -122.4324,
  });
  const [eta, setEta] = useState("8 min");
  const [status, setStatus] = useState("Ambulance dispatched");
  const [driverInfo] = useState({
    name: "Michael Johnson",
    phone: "+1 (555) 123-4567",
    ambulanceId: "A-123",
  });

  // Simulate ambulance movement
  useEffect(() => {
    const interval = setInterval(() => {
      setAmbulanceLocation((prev) => ({
        latitude: prev.latitude + (userLocation.latitude - prev.latitude) * 0.1,
        longitude:
          prev.longitude + (userLocation.longitude - prev.longitude) * 0.1,
      }));

      // Update ETA
      const distance = Math.sqrt(
        Math.pow(userLocation.latitude - ambulanceLocation.latitude, 2) +
          Math.pow(userLocation.longitude - ambulanceLocation.longitude, 2)
      );

      const newEta = Math.max(1, Math.floor(distance * 1000));
      setEta(`${newEta} min`);

      // Update status based on distance
      if (distance < 0.001) {
        setStatus("Ambulance arrived");
        clearInterval(interval);
      } else if (distance < 0.003) {
        setStatus("Ambulance nearby");
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [ambulanceLocation, userLocation]);

  // Calculate route
  const route = [
    ambulanceLocation,
    { latitude: 37.785, longitude: -122.434 },
    { latitude: 37.787, longitude: -122.433 },
    userLocation,
  ];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color={colors.darkGray} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Ambulance Tracking</Text>
        <View style={styles.placeholder} />
      </View>

      {/* {Platform.OS !== "web" && (
        <View style={styles.mapContainer}>
          <CustomMapView
            markers={[
              {
                id: "user",
                coordinate: userLocation,
                title: "Your Location",
                type: "user",
              },
              {
                id: "ambulance",
                coordinate: ambulanceLocation,
                title: "Ambulance",
                type: "ambulance",
              },
            ]}
            route={route}
            initialRegion={{
              latitude:
                (userLocation.latitude + ambulanceLocation.latitude) / 2,
              longitude:
                (userLocation.longitude + ambulanceLocation.longitude) / 2,
              latitudeDelta: 0.02,
              longitudeDelta: 0.02,
            }}
          />
        </View>
      )} */}

      <ScrollView style={styles.content}>
        <Card style={styles.statusCard}>
          <CardContent>
            <View style={styles.statusContainer}>
              <View style={styles.statusIndicator}>
                <View style={styles.statusDot} />
                <Text style={styles.statusText}>{status}</Text>
              </View>
              <View style={styles.etaContainer}>
                <Ionicons name="time" size={16} color={colors.mediumGray} />
                <Text style={styles.etaText}>ETA: {eta}</Text>
              </View>
            </View>
          </CardContent>
        </Card>

        <Text style={styles.sectionTitle}>Driver Information</Text>

        <Card style={styles.driverCard}>
          <CardContent>
            <View style={styles.driverInfo}>
              <View style={styles.driverAvatar}>
                <Text style={styles.driverInitials}>
                  {driverInfo.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </Text>
              </View>
              <View style={styles.driverDetails}>
                <Text style={styles.driverName}>{driverInfo.name}</Text>
                <Text style={styles.ambulanceId}>
                  Ambulance #{driverInfo.ambulanceId}
                </Text>
                <View style={styles.phoneContainer}>
                  <FontAwesome5
                    name="phone-alt"
                    size={14}
                    color={colors.blue}
                  />
                  <Text style={styles.phoneNumber}>{driverInfo.phone}</Text>
                </View>
              </View>
            </View>
          </CardContent>
        </Card>

        <Text style={styles.sectionTitle}>Emergency Details</Text>

        <Card style={styles.detailsCard}>
          <CardContent>
            <View style={styles.detailItem}>
              <MaterialCommunityIcons
                name="map-marker"
                size={16}
                color={colors.mediumGray}
              />
              <Text style={styles.detailText}>
                123 Market St, San Francisco, CA
              </Text>
            </View>
            <View style={styles.detailItem}>
              <MaterialCommunityIcons
                name="alert-triangle"
                size={16}
                color={colors.mediumGray}
              />
              <Text style={styles.detailText}>Accident</Text>
            </View>
          </CardContent>
        </Card>

        <View style={styles.buttonContainer}>
          <Button
            variant="outline"
            style={styles.cancelButton}
            onPress={() => router.replace("/user/dashboard")}
          >
            <Text style={styles.cancelButtonText}>Cancel Request</Text>
          </Button>

          <Button style={styles.callButton} onPress={() => {}}>
            <View style={styles.callButtonContent}>
              <FontAwesome5 name="phone-alt" size={16} color={colors.white} />
              <Text style={styles.callButtonText}>Call Driver</Text>
            </View>
          </Button>
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
    height: 250,
  },
  content: {
    flex: 1,
    padding: spacing.md,
  },
  statusCard: {
    marginBottom: spacing.md,
    backgroundColor: colors.blue,
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
  driverCard: {
    marginBottom: spacing.md,
  },
  driverInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  driverAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: colors.blue,
    alignItems: "center",
    justifyContent: "center",
    marginRight: spacing.md,
  },
  driverInitials: {
    color: colors.white,
    fontSize: 18,
    fontWeight: "bold",
  },
  driverDetails: {
    flex: 1,
  },
  driverName: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.darkGray,
    marginBottom: 2,
  },
  ambulanceId: {
    fontSize: 14,
    color: colors.mediumGray,
    marginBottom: 4,
  },
  phoneContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  phoneNumber: {
    fontSize: 14,
    color: colors.blue,
    marginLeft: spacing.xs,
  },
  detailsCard: {
    marginBottom: spacing.xl,
  },
  detailItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: spacing.sm,
  },
  detailText: {
    marginLeft: spacing.sm,
    fontSize: 14,
    color: colors.darkGray,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: spacing.xl,
  },
  cancelButton: {
    flex: 1,
    marginRight: spacing.sm,
    borderColor: colors.red,
  },
  cancelButtonText: {
    color: colors.red,
  },
  callButton: {
    flex: 1,
    marginLeft: spacing.sm,
    backgroundColor: colors.blue,
  },
  callButtonContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  callButtonText: {
    color: colors.white,
    marginLeft: spacing.xs,
  },
});
