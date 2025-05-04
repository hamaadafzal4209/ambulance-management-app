"use client";

import { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  StatusBar,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { colors, spacing } from "@/constants/theme";
import { useAuth } from "@/components/auth-provider";
import { MaterialIcons, Feather, FontAwesome } from "@expo/vector-icons";
import AlertsMap from "@/components/common/AlertsMap";

export default function DriverDashboard() {
  const { user, signOut } = useAuth();
  const [isAvailable, setIsAvailable] = useState(true);
  const [currentLocation] = useState({
    latitude: 37.78825,
    longitude: -122.4324,
  });

  const [emergencies] = useState([
    {
      id: "1",
      type: "Heart Attack",
      location: "456 Market St, San Francisco",
      patientName: "Sarah Johnson",
      distance: "0.8 miles",
      time: "3 min",
      status: "new",
    },
    {
      id: "2",
      type: "Accident",
      location: "789 Mission St, San Francisco",
      patientName: "Robert Chen",
      distance: "1.2 miles",
      time: "5 min",
      status: "assigned",
    },
  ]);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={"white"} barStyle={"dark-content"} />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Driver Dashboard</Text>
        <TouchableOpacity onPress={() => signOut()}>
          <Feather name="log-out" size={22} color={colors.danger} />
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
      >
        <Card style={styles.statusCard}>
          <CardContent>
            <View style={styles.statusContainer}>
              <View>
                <Text style={styles.statusLabel}>Availability Status</Text>
                <Text
                  style={[
                    styles.statusValue,
                    { color: isAvailable ? colors.success : colors.mediumGray },
                  ]}
                >
                  {isAvailable ? "Available" : "Unavailable"}
                </Text>
              </View>
              <Switch
                value={isAvailable}
                onValueChange={setIsAvailable}
                trackColor={{ false: colors.lightGray, true: colors.success }}
                thumbColor={colors.white}
              />
            </View>
          </CardContent>
        </Card>

        {Platform.OS !== "web" && (
          <View style={styles.mapContainer}>
            <AlertsMap />
          </View>
        )}

        <Text style={styles.sectionTitle}>Emergency Requests</Text>

        {emergencies.map((emergency) => (
          <Card key={emergency.id} style={styles.emergencyCard}>
            <CardHeader>
              <View style={styles.emergencyHeader}>
                <View style={styles.emergencyType}>
                  <MaterialIcons
                    name="error-outline"
                    size={16}
                    color={colors.red}
                  />
                  <Text style={styles.emergencyTypeText}>{emergency.type}</Text>
                </View>
                <View
                  style={[
                    styles.statusBadge,
                    {
                      backgroundColor:
                        emergency.status === "new" ? colors.red : colors.blue,
                    },
                  ]}
                >
                  <Text style={styles.statusBadgeText}>
                    {emergency.status === "new" ? "New" : "Assigned"}
                  </Text>
                </View>
              </View>
            </CardHeader>
            <CardContent>
              <View style={styles.emergencyDetails}>
                <View style={styles.emergencyDetail}>
                  <Feather name="map-pin" size={16} color={colors.mediumGray} />
                  <Text style={styles.emergencyDetailText}>
                    {emergency.location}
                  </Text>
                </View>
                <View style={styles.emergencyDetail}>
                  <FontAwesome
                    name="user"
                    size={16}
                    color={colors.mediumGray}
                  />
                  <Text style={styles.emergencyDetailText}>
                    {emergency.patientName}
                  </Text>
                </View>
                <View style={styles.emergencyMetrics}>
                  <View style={styles.emergencyMetric}>
                    <Text style={styles.metricValue}>{emergency.distance}</Text>
                    <Text style={styles.metricLabel}>Distance</Text>
                  </View>
                  <View style={styles.emergencyMetric}>
                    <Text style={styles.metricValue}>{emergency.time}</Text>
                    <Text style={styles.metricLabel}>ETA</Text>
                  </View>
                </View>

                {emergency.status === "new" ? (
                  <View style={styles.actionButtons}>
                    <Button
                      variant="outline"
                      style={styles.rejectButton}
                      onPress={() => {}}
                    >
                      <Text style={styles.rejectButtonText}>Reject</Text>
                    </Button>
                    <Button
                      style={styles.acceptButton}
                      onPress={() => router.push("/driver/navigation")}
                    >
                      <Text style={styles.acceptButtonText}>Accept</Text>
                    </Button>
                  </View>
                ) : (
                  <Button
                    style={styles.navigateButton}
                    onPress={() => router.push("/driver/navigation")}
                  >
                    <Text style={styles.navigateButtonText}>Navigate</Text>
                  </Button>
                )}
              </View>
            </CardContent>
          </Card>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.lightGray,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    backgroundColor: colors.white,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: colors.darkGray,
  },
  signOutText: {
    color: colors.red,
    fontWeight: "500",
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: spacing.md,
  },
  statusCard: {
    marginBottom: spacing.md,
  },
  statusContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  statusLabel: {
    fontSize: 14,
    color: colors.mediumGray,
    marginBottom: 4,
  },
  statusValue: {
    fontSize: 16,
    fontWeight: "600",
  },
  mapContainer: {
    marginBottom: spacing.lg,
  },
  map: {
    height: 200,
    borderRadius: 12,
    overflow: "hidden",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: spacing.md,
    color: colors.darkGray,
  },
  emergencyCard: {
    marginBottom: spacing.md,
  },
  emergencyHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  emergencyType: {
    flexDirection: "row",
    alignItems: "center",
  },
  emergencyTypeText: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.darkGray,
    marginLeft: spacing.xs,
  },
  statusBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: 4,
  },
  statusBadgeText: {
    fontSize: 12,
    fontWeight: "500",
    color: colors.white,
  },
  emergencyDetails: {
    gap: spacing.sm,
  },
  emergencyDetail: {
    flexDirection: "row",
    alignItems: "center",
  },
  emergencyDetailText: {
    marginLeft: spacing.sm,
    fontSize: 14,
    color: colors.darkGray,
  },
  emergencyMetrics: {
    flexDirection: "row",
    marginVertical: spacing.sm,
  },
  emergencyMetric: {
    flex: 1,
    alignItems: "center",
    padding: spacing.sm,
    backgroundColor: colors.lightGray,
    borderRadius: 8,
    marginHorizontal: 2,
  },
  metricValue: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.darkGray,
  },
  metricLabel: {
    fontSize: 12,
    color: colors.mediumGray,
  },
  actionButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: spacing.sm,
  },
  rejectButton: {
    flex: 1,
    marginRight: spacing.xs,
    borderColor: colors.red,
  },
  rejectButtonText: {
    color: colors.red,
  },
  acceptButton: {
    flex: 1,
    marginLeft: spacing.xs,
    backgroundColor: colors.success,
  },
  acceptButtonText: {
    color: colors.white,
  },
  navigateButton: {
    backgroundColor: colors.blue,
    marginTop: spacing.sm,
  },
  navigateButtonText: {
    color: colors.white,
  },
});
