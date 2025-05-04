"use client";

import { useAuth } from "@/components/auth-provider";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { borderRadius, colors, shadows, spacing } from "@/constants/theme";
import {
  Feather,
  FontAwesome5,
  Ionicons,
  MaterialIcons,
} from "@expo/vector-icons";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
  Animated,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// Mock data for incoming ambulances
const mockIncomingAmbulances = [
  {
    id: "1",
    ambulanceId: "A-123",
    patientName: "Sarah Johnson",
    condition: "Critical",
    bloodGroup: "A+",
    emergencyType: "Heart Attack",
    eta: "5 min",
    location: {
      latitude: 37.785,
      longitude: -122.43,
    },
    vitals: {
      heartRate: 125,
      bloodPressure: "160/95",
      oxygenLevel: 92,
    },
    notes: "Patient experiencing severe chest pain and shortness of breath.",
    isAcknowledged: false,
    isPrepared: false,
    isNew: true,
  },
  {
    id: "2",
    ambulanceId: "A-456",
    patientName: "Robert Chen",
    condition: "Stable",
    bloodGroup: "O-",
    emergencyType: "Accident",
    eta: "12 min",
    location: {
      latitude: 37.79,
      longitude: -122.435,
    },
    vitals: {
      heartRate: 85,
      bloodPressure: "130/80",
      oxygenLevel: 98,
    },
    notes: "Minor injuries from car accident. Conscious and responsive.",
    isAcknowledged: true,
    isPrepared: false,
    isNew: false,
  },
  {
    id: "3",
    ambulanceId: "A-789",
    patientName: "Maria Garcia",
    condition: "Needs Oxygen",
    bloodGroup: "B+",
    emergencyType: "Breathing Difficulty",
    eta: "8 min",
    location: {
      latitude: 37.775,
      longitude: -122.42,
    },
    vitals: {
      heartRate: 110,
      bloodPressure: "145/90",
      oxygenLevel: 88,
    },
    notes: "Patient with COPD exacerbation. Requires immediate oxygen therapy.",
    isAcknowledged: false,
    isPrepared: false,
    isNew: true,
  },
];

export default function HospitalDashboard() {
  const { user, signOut } = useAuth();
  const [hospitalLocation] = useState({
    latitude: 37.78825,
    longitude: -122.4324,
  });
  const [incomingAmbulances, setIncomingAmbulances] = useState(
    mockIncomingAmbulances
  );
  const [selectedAmbulance, setSelectedAmbulance] = useState(
    incomingAmbulances[0]
  );
  const [notificationCount, setNotificationCount] = useState(2);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    // Check for new ambulances and show notification
    const newAmbulances = incomingAmbulances.filter((amb) => amb.isNew).length;
    if (newAmbulances > 0) {
      setShowNotification(true);
      Animated.sequence([
        Animated.timing(notificationAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.delay(3000),
        Animated.timing(notificationAnim, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setShowNotification(false);
      });
    }
  }, []);

  const handleAcknowledge = (id: string) => {
    setIncomingAmbulances((prev) =>
      prev.map((amb) =>
        amb.id === id ? { ...amb, isAcknowledged: true, isNew: false } : amb
      )
    );
    setNotificationCount((prev) => Math.max(0, prev - 1));
  };

  const handlePrepareER = (id: string) => {
    setIncomingAmbulances((prev) =>
      prev.map((amb) => (amb.id === id ? { ...amb, isPrepared: true } : amb))
    );
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

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.hospitalName}>
            {user?.name || "General Hospital"}
          </Text>
          <Text style={styles.headerSubtitle}>
            Emergency Response Dashboard
          </Text>
        </View>
        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.iconButton}>
            <Ionicons
              name="notifications-outline"
              size={22}
              color={colors.darkGray}
            />
            {notificationCount > 0 && (
              <View style={styles.notificationBadge}>
                <Text style={styles.notificationBadgeText}>
                  {notificationCount}
                </Text>
              </View>
            )}
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton}>
            <Feather name="settings" size={22} color={colors.darkGray} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton} onPress={() => signOut()}>
            <Feather name="log-out" size={22} color={colors.danger} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Notification popup */}
      {showNotification && (
        <Animated.View
          style={[
            styles.notificationPopup,
            {
              opacity: notificationAnim,
              transform: [
                {
                  translateY: notificationAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [-50, 0],
                  }),
                },
              ],
            },
          ]}
        >
          <MaterialIcons name="warning" size={18} />
          <Text style={styles.notificationText}>
            New emergency ambulances incoming!
          </Text>
        </Animated.View>
      )}

      {/* Navigation Tabs */}
      <View style={styles.tabBar}>
        <TouchableOpacity
          style={[styles.tabItem, styles.activeTab]}
          onPress={() => {}}
        >
          <MaterialIcons name="dashboard" size={20} color={colors.blue} />
          <Text style={[styles.tabText, styles.activeTabText]}>Dashboard</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.tabItem}
          onPress={() => router.push("/hospital/real-time-updates")}
        >
          <MaterialIcons
            name="monitor-heart"
            size={20}
            color={colors.mediumGray}
          />
          <Text style={styles.tabText}>Real-Time</Text>
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
        {/* Map Section */}
        {/* <View style={styles.mapSection}>
          <Text style={styles.sectionTitle}>Incoming Ambulances</Text>
          <CustomMapView
            style={styles.map}
            markers={[
              {
                id: "hospital",
                coordinate: hospitalLocation,
                title: "Hospital",
                type: "hospital",
              },
              ...incomingAmbulances.map((ambulance) => ({
                id: ambulance.id,
                coordinate: ambulance.location,
                title: `Ambulance ${ambulance.ambulanceId}`,
                type: "ambulance",
              })),
            ]}
            initialRegion={{
              ...hospitalLocation,
              latitudeDelta: 0.02,
              longitudeDelta: 0.02,
            }}
          />
        </View> */}

        {/* Incoming Ambulances Section */}
        <Text style={styles.sectionTitle}>Incoming Emergencies</Text>

        {incomingAmbulances.map((ambulance) => (
          <Card
            key={ambulance.id}
            style={[
              styles.ambulanceCard,
              ambulance.isNew && styles.newAmbulanceCard,
            ]}
          >
            <CardHeader>
              <View style={styles.ambulanceHeader}>
                <View style={styles.ambulanceHeaderLeft}>
                  <View
                    style={[
                      styles.conditionIndicator,
                      {
                        backgroundColor: getConditionColor(ambulance.condition),
                      },
                    ]}
                  />
                  <View>
                    <Text style={styles.ambulanceId}>
                      Ambulance #{ambulance.ambulanceId}
                    </Text>
                    <Text style={styles.patientName}>
                      {ambulance.patientName}
                    </Text>
                  </View>
                </View>
                <View style={styles.etaContainer}>
                  <Feather name="clock" size={14} color={colors.mediumGray} />
                  <Text style={styles.etaText}>ETA: {ambulance.eta}</Text>
                </View>
              </View>
            </CardHeader>

            <CardContent>
              <View style={styles.ambulanceDetails}>
                <View style={styles.detailRow}>
                  <View style={styles.detailItem}>
                    <MaterialIcons
                      name="warning"
                      size={16}
                      color={colors.mediumGray}
                    />
                    <Text style={styles.detailText}>
                      {ambulance.emergencyType}
                    </Text>
                  </View>
                  <View style={styles.detailItem}>
                    <FontAwesome5 name="tint" size={16} color={colors.red} />
                    <Text style={styles.detailText}>
                      {ambulance.bloodGroup}
                    </Text>
                  </View>
                </View>

                <View style={styles.vitalsContainer}>
                  <View style={styles.vitalItem}>
                    <FontAwesome5
                      name="heartbeat"
                      size={16}
                      color={colors.red}
                    />
                    <Text style={styles.vitalValue}>
                      {ambulance.vitals.heartRate}
                    </Text>
                    <Text style={styles.vitalLabel}>BPM</Text>
                  </View>
                  <View style={styles.vitalItem}>
                    <MaterialIcons
                      name="monitor-heart"
                      size={16}
                      color={colors.blue}
                    />
                    <Text style={styles.vitalValue}>
                      {ambulance.vitals.bloodPressure}
                    </Text>
                    <Text style={styles.vitalLabel}>BP</Text>
                  </View>
                  <View style={styles.vitalItem}>
                    <MaterialIcons
                      name="warning"
                      size={16}
                      color={
                        ambulance.vitals.oxygenLevel < 95
                          ? colors.warning
                          : colors.success
                      }
                    />
                    <Text style={styles.vitalValue}>
                      {ambulance.vitals.oxygenLevel}%
                    </Text>
                    <Text style={styles.vitalLabel}>O₂</Text>
                  </View>
                </View>

                <Text style={styles.notesText}>{ambulance.notes}</Text>

                <View style={styles.actionButtons}>
                  <Button
                    variant={ambulance.isAcknowledged ? "outline" : "primary"}
                    style={[
                      styles.actionButton,
                      ambulance.isAcknowledged
                        ? styles.acknowledgedButton
                        : null,
                    ]}
                    onPress={() => handleAcknowledge(ambulance.id)}
                    disabled={ambulance.isAcknowledged}
                  >
                    <Text
                      style={[
                        styles.actionButtonText,
                        ambulance.isAcknowledged
                          ? styles.acknowledgedButtonText
                          : null,
                      ]}
                    >
                      {ambulance.isAcknowledged
                        ? "Acknowledged"
                        : "Acknowledge"}
                    </Text>
                  </Button>

                  <Button
                    variant={ambulance.isPrepared ? "outline" : "primary"}
                    style={[
                      styles.actionButton,
                      styles.prepareButton,
                      ambulance.isPrepared ? styles.preparedButton : null,
                    ]}
                    onPress={() => handlePrepareER(ambulance.id)}
                    disabled={ambulance.isPrepared}
                  >
                    <Text
                      style={[
                        styles.actionButtonText,
                        ambulance.isPrepared ? styles.preparedButtonText : null,
                      ]}
                    >
                      {ambulance.isPrepared ? "ER Prepared" : "Prepare ER"}
                    </Text>
                  </Button>
                </View>
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
  headerLeft: {
    flex: 1,
  },
  hospitalName: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.darkGray,
  },
  headerSubtitle: {
    fontSize: 12,
    color: colors.mediumGray,
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconButton: {
    padding: spacing.sm,
    marginLeft: spacing.sm,
    position: "relative",
  },
  notificationBadge: {
    position: "absolute",
    top: 2,
    right: 2,
    backgroundColor: colors.red,
    borderRadius: 10,
    width: 16,
    height: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  notificationBadgeText: {
    color: colors.white,
    fontSize: 10,
    fontWeight: "bold",
  },
  notificationPopup: {
    position: "absolute",
    top: 90,
    left: spacing.lg,
    right: spacing.lg,
    backgroundColor: colors.blue,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    flexDirection: "row",
    alignItems: "center",
    zIndex: 100,
    ...shadows.md,
  },
  notificationText: {
    color: colors.white,
    marginLeft: spacing.sm,
    fontSize: 14,
    fontWeight: "500",
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
  },
  mapSection: {
    marginBottom: spacing.md,
  },
  map: {
    height: 200,
    borderRadius: borderRadius.lg,
    overflow: "hidden",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: spacing.sm,
    color: colors.darkGray,
  },
  ambulanceCard: {
    marginBottom: spacing.md,
    borderLeftWidth: 4,
    borderLeftColor: colors.blue,
  },
  newAmbulanceCard: {
    borderLeftColor: colors.red,
    backgroundColor: "rgba(229, 57, 53, 0.05)",
  },
  ambulanceHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  ambulanceHeaderLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  conditionIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: spacing.sm,
  },
  ambulanceId: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.darkGray,
  },
  patientName: {
    fontSize: 14,
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
  ambulanceDetails: {
    gap: spacing.sm,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  detailItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  detailText: {
    marginLeft: spacing.xs,
    fontSize: 14,
    color: colors.darkGray,
  },
  vitalsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: colors.lightGray,
    borderRadius: borderRadius.md,
    padding: spacing.sm,
    marginVertical: spacing.xs,
  },
  vitalItem: {
    alignItems: "center",
    justifyContent: "center",
  },
  vitalValue: {
    fontSize: 16,
    fontWeight: "bold",
    color: colors.darkGray,
    marginTop: 2,
  },
  vitalLabel: {
    fontSize: 12,
    color: colors.mediumGray,
  },
  notesText: {
    fontSize: 14,
    color: colors.darkGray,
    fontStyle: "italic",
  },
  actionButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: spacing.sm,
  },
  actionButton: {
    flex: 1,
    marginHorizontal: 4,
  },
  prepareButton: {
    backgroundColor: colors.success,
  },
  actionButtonText: {
    color: colors.white,
    fontWeight: "500",
  },
  acknowledgedButton: {
    borderColor: colors.blue,
  },
  acknowledgedButtonText: {
    color: colors.blue,
  },
  preparedButton: {
    borderColor: colors.success,
  },
  preparedButtonText: {
    color: colors.success,
  },
});
