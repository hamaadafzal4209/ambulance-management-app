"use client";

import { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Animated,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { Card, CardContent } from "@/components/ui/card";
import { colors, spacing, borderRadius, shadows } from "@/constants/theme";
import { Feather } from "@expo/vector-icons";

// Mock data for patients
const mockPatients = [
  {
    id: "1",
    ambulanceId: "A-123",
    patientName: "Sarah Johnson",
    condition: "Critical",
    bloodGroup: "A+",
    emergencyType: "Heart Attack",
    eta: "2 min",
    vitals: {
      heartRate: 125,
      heartRateTrend: "up",
      bloodPressure: "160/95",
      bloodPressureTrend: "up",
      oxygenLevel: 92,
      oxygenLevelTrend: "down",
      temperature: 38.2,
      temperatureTrend: "up",
    },
    lastUpdated: "Just now",
    notes: "Patient experiencing severe chest pain and shortness of breath.",
  },
  {
    id: "2",
    ambulanceId: "A-456",
    patientName: "Robert Chen",
    condition: "Stable",
    bloodGroup: "O-",
    emergencyType: "Accident",
    eta: "8 min",
    vitals: {
      heartRate: 85,
      heartRateTrend: "stable",
      bloodPressure: "130/80",
      bloodPressureTrend: "stable",
      oxygenLevel: 98,
      oxygenLevelTrend: "stable",
      temperature: 37.1,
      temperatureTrend: "stable",
    },
    lastUpdated: "2 min ago",
    notes: "Minor injuries from car accident. Conscious and responsive.",
  },
  {
    id: "3",
    ambulanceId: "A-789",
    patientName: "Maria Garcia",
    condition: "Needs Oxygen",
    bloodGroup: "B+",
    emergencyType: "Breathing Difficulty",
    eta: "5 min",
    vitals: {
      heartRate: 110,
      heartRateTrend: "up",
      bloodPressure: "145/90",
      bloodPressureTrend: "stable",
      oxygenLevel: 88,
      oxygenLevelTrend: "down",
      temperature: 37.8,
      temperatureTrend: "up",
    },
    lastUpdated: "1 min ago",
    notes: "Patient with COPD exacerbation. Requires immediate oxygen therapy.",
  },
];

export default function RealTimeUpdates() {
  const [patients, setPatients] = useState(mockPatients);
  const [refreshing, setRefreshing] = useState(false);
  const [rotateAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    // Simulate real-time updates
    const interval = setInterval(() => {
      setPatients((prev) =>
        prev.map((patient) => ({
          ...patient,
          vitals: {
            ...patient.vitals,
            heartRate: simulateVitalChange(patient.vitals.heartRate, 5),
            oxygenLevel: simulateVitalChange(
              patient.vitals.oxygenLevel,
              2,
              true
            ),
            bloodPressure: simulateBloodPressureChange(
              patient.vitals.bloodPressure
            ),
          },
          lastUpdated: "Just now",
        }))
      );
    }, 15000);

    return () => clearInterval(interval);
  }, []);

  const simulateVitalChange = (
    value: number,
    maxChange: number,
    isOxygen = false
  ) => {
    const change =
      Math.floor(Math.random() * maxChange) * (Math.random() > 0.5 ? 1 : -1);
    let newValue = value + change;

    // Ensure oxygen stays within bounds
    if (isOxygen) {
      newValue = Math.min(Math.max(newValue, 70), 100);
    }

    return newValue;
  };

  const simulateBloodPressureChange = (bp: string) => {
    const [systolic, diastolic] = bp.split("/").map(Number);
    const newSystolic =
      systolic + Math.floor(Math.random() * 5) * (Math.random() > 0.5 ? 1 : -1);
    const newDiastolic =
      diastolic +
      Math.floor(Math.random() * 3) * (Math.random() > 0.5 ? 1 : -1);
    return `${newSystolic}/${newDiastolic}`;
  };

  const handleRefresh = () => {
    setRefreshing(true);

    // Animate the refresh icon
    Animated.timing(rotateAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start(() => {
      rotateAnim.setValue(0);
    });

    // Simulate refresh
    setTimeout(() => {
      setPatients((prev) =>
        prev.map((patient) => ({
          ...patient,
          vitals: {
            ...patient.vitals,
            heartRate: simulateVitalChange(patient.vitals.heartRate, 5),
            oxygenLevel: simulateVitalChange(
              patient.vitals.oxygenLevel,
              2,
              true
            ),
            bloodPressure: simulateBloodPressureChange(
              patient.vitals.bloodPressure
            ),
          },
          lastUpdated: "Just now",
        }))
      );
      setRefreshing(false);
    }, 1000);
  };

  const getConditionColor = (condition: string) => {
    switch (condition) {
      case "Critical":
        return colors.danger;
      case "Needs Oxygen":
        return colors.warning;
      case "Stable":
        return colors.success;
      default:
        return colors.blue;
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "up":
        return <Feather name="arrow-up" size={12} color={colors.danger} />;
      case "down":
        return <Feather name="arrow-down" size={12} color={colors.warning} />;
      default:
        return null;
    }
  };

  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Feather name="arrow-left" size={24} color={colors.darkGray} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Real-Time Updates</Text>
        <TouchableOpacity onPress={handleRefresh} disabled={refreshing}>
          <Animated.View style={{ transform: [{ rotate: spin }] }}>
            <Feather name="refresh-cw" size={20} color={colors.blue} />
          </Animated.View>
        </TouchableOpacity>
      </View>

      <View style={styles.tabBar}>
        <TouchableOpacity
          style={styles.tabItem}
          onPress={() => router.replace("/hospital/dashboard")}
        >
          <Feather name="layout" size={20} color={colors.mediumGray} />
          <Text style={styles.tabText}>Dashboard</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabItem, styles.activeTab]}
          onPress={() => {}}
        >
          <Feather name="activity" size={20} color={colors.blue} />
          <Text style={[styles.tabText, styles.activeTabText]}>Real-Time</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.tabItem}
          onPress={() => router.push("/hospital/history")}
        >
          <Feather name="list" size={20} color={colors.mediumGray} />
          <Text style={styles.tabText}>History</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
      >
        <Text style={styles.sectionTitle}>Live Patient Vitals</Text>

        {patients.map((patient) => (
          <Card key={patient.id} style={styles.patientCard}>
            <CardContent>
              <View style={styles.patientHeader}>
                <View style={styles.patientInfo}>
                  <View
                    style={[
                      styles.conditionIndicator,
                      { backgroundColor: getConditionColor(patient.condition) },
                    ]}
                  />
                  <View>
                    <Text style={styles.patientName}>
                      {patient.patientName}
                    </Text>
                    <Text style={styles.ambulanceId}>
                      Ambulance #{patient.ambulanceId}
                    </Text>
                  </View>
                </View>
                <View style={styles.etaContainer}>
                  <Feather name="clock" size={14} color={colors.mediumGray} />
                  <Text style={styles.etaText}>ETA: {patient.eta}</Text>
                </View>
              </View>

              <View style={styles.statusRow}>
                <View style={styles.statusItem}>
                  <Text style={styles.statusLabel}>
                    {patient.emergencyType}
                  </Text>
                </View>
                <View style={styles.statusItem}>
                  <Feather name="droplet" size={14} color={colors.red} />
                  <Text style={styles.statusValue}>{patient.bloodGroup}</Text>
                </View>
                <View style={styles.statusItem}>
                  <Text
                    style={[
                      styles.statusValue,
                      { color: getConditionColor(patient.condition) },
                    ]}
                  >
                    {patient.condition}
                  </Text>
                </View>
              </View>

              <View style={styles.vitalsGrid}>
                <View style={styles.vitalCard}>
                  <View style={styles.vitalHeader}>
                    <Feather name="heart" size={16} color={colors.red} />{" "}
                    <Text style={styles.vitalLabel}>Heart Rate</Text>
                    {getTrendIcon(patient.vitals.heartRateTrend)}
                  </View>
                  <Text style={styles.vitalValue}>
                    {patient.vitals.heartRate}{" "}
                    <Text style={styles.vitalUnit}>BPM</Text>
                  </Text>
                </View>

                <View style={styles.vitalCard}>
                  <View style={styles.vitalHeader}>
                    <Feather name="activity" size={16} color={colors.blue} />{" "}
                    <Text style={styles.vitalLabel}>Blood Pressure</Text>
                    {getTrendIcon(patient.vitals.bloodPressureTrend)}
                  </View>
                  <Text style={styles.vitalValue}>
                    {patient.vitals.bloodPressure}{" "}
                    <Text style={styles.vitalUnit}>mmHg</Text>
                  </Text>
                </View>

                <View style={styles.vitalCard}>
                  <View style={styles.vitalHeader}>
                    <Feather
                      name="alert-triangle"
                      size={16}
                      color={
                        patient.vitals.oxygenLevel < 95
                          ? colors.warning
                          : colors.success
                      }
                    />
                    <Text style={styles.vitalLabel}>Oxygen Level</Text>
                    {getTrendIcon(patient.vitals.oxygenLevelTrend)}
                  </View>
                  <Text style={styles.vitalValue}>
                    {patient.vitals.oxygenLevel}%{" "}
                    <Text style={styles.vitalUnit}>SpO₂</Text>
                  </Text>
                </View>

                <View style={styles.vitalCard}>
                  <View style={styles.vitalHeader}>
                    <Feather
                      name="alert-triangle"
                      size={16}
                      color={
                        patient.vitals.temperature > 37.5
                          ? colors.warning
                          : colors.success
                      }
                    />
                    <Text style={styles.vitalLabel}>Temperature</Text>
                    {getTrendIcon(patient.vitals.temperatureTrend)}
                  </View>
                  <Text style={styles.vitalValue}>
                    {patient.vitals.temperature}°{" "}
                    <Text style={styles.vitalUnit}>C</Text>
                  </Text>
                </View>
              </View>

              <View style={styles.notesContainer}>
                <Text style={styles.notesText}>{patient.notes}</Text>
              </View>

              <View style={styles.updateInfo}>
                <Feather name="clock" size={12} color={colors.mediumGray} />
                <Text style={styles.updateText}>
                  Last updated: {patient.lastUpdated}
                </Text>
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
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    ...shadows.sm,
  },
  backButton: {
    padding: spacing.xs,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.darkGray,
  },
  tabBar: {
    flexDirection: "row",
    backgroundColor: colors.white,
    paddingVertical: spacing.xs,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  tabItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: spacing.sm,
    flexDirection: "row",
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: colors.blue,
  },
  tabText: {
    fontSize: 14,
    color: colors.mediumGray,
    marginLeft: spacing.xs,
  },
  activeTabText: {
    color: colors.blue,
    fontWeight: "500",
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: spacing.md,
    paddingBottom: spacing.xl,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: spacing.md,
    color: colors.darkGray,
  },
  patientCard: {
    marginBottom: spacing.md,
    borderLeftWidth: 4,
    borderLeftColor: colors.blue,
  },
  patientHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.sm,
  },
  patientInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  conditionIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: spacing.sm,
  },
  patientName: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.darkGray,
  },
  ambulanceId: {
    fontSize: 12,
    color: colors.mediumGray,
  },
  etaContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.lightGray,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: borderRadius.sm,
  },
  etaText: {
    fontSize: 12,
    color: colors.darkGray,
    marginLeft: 4,
    fontWeight: "500",
  },
  statusRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: spacing.sm,
  },
  statusItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  statusLabel: {
    fontSize: 12,
    color: colors.darkGray,
    fontWeight: "500",
  },
  statusValue: {
    fontSize: 12,
    color: colors.darkGray,
    fontWeight: "500",
    marginLeft: 4,
  },
  vitalsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: spacing.sm,
  },
  vitalCard: {
    width: "48%",
    backgroundColor: colors.white,
    borderRadius: borderRadius.md,
    padding: spacing.sm,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  vitalHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 2,
  },
  vitalLabel: {
    fontSize: 12,
    color: colors.mediumGray,
    marginLeft: 4,
    flex: 1,
  },
  vitalValue: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.darkGray,
  },
  vitalUnit: {
    fontSize: 12,
    fontWeight: "normal",
    color: colors.mediumGray,
  },
  notesContainer: {
    backgroundColor: colors.lightGray,
    borderRadius: borderRadius.md,
    padding: spacing.sm,
    marginBottom: spacing.sm,
  },
  notesText: {
    fontSize: 14,
    color: colors.darkGray,
    fontStyle: "italic",
  },
  updateInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  updateText: {
    fontSize: 12,
    color: colors.mediumGray,
    marginLeft: 4,
  },
});
