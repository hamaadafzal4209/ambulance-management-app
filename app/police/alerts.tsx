"use client";

import { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { colors, spacing, borderRadius, shadows } from "@/constants/theme";
import { AntDesign, Feather, MaterialIcons } from "@expo/vector-icons";

// Mock data for emergency alerts
const mockEmergencyAlerts = [
  {
    id: "1",
    ambulanceId: "A-123",
    patientName: "Sarah Johnson",
    emergencyType: "Heart Attack",
    eta: "5 min",
    status: "Critical",
    location: "Market St & 4th St",
    destination: "SF General Hospital",
    timestamp: "Just now",
    isAcknowledged: false,
    isRouteCleared: false,
    priority: "high",
  },
  {
    id: "2",
    ambulanceId: "A-456",
    patientName: "Robert Chen",
    emergencyType: "Accident",
    eta: "12 min",
    status: "Stable",
    location: "Mission St & 7th St",
    destination: "SF General Hospital",
    timestamp: "5 min ago",
    isAcknowledged: true,
    isRouteCleared: false,
    priority: "medium",
  },
  {
    id: "3",
    ambulanceId: "A-789",
    patientName: "Maria Garcia",
    emergencyType: "Breathing Difficulty",
    eta: "8 min",
    status: "Needs Oxygen",
    location: "Howard St & 3rd St",
    destination: "UCSF Medical Center",
    timestamp: "2 min ago",
    isAcknowledged: false,
    isRouteCleared: false,
    priority: "high",
  },
  {
    id: "4",
    ambulanceId: "A-234",
    patientName: "James Wilson",
    emergencyType: "Stroke",
    eta: "15 min",
    status: "Critical",
    location: "Van Ness Ave & Geary Blvd",
    destination: "Kaiser Permanente",
    timestamp: "10 min ago",
    isAcknowledged: true,
    isRouteCleared: true,
    priority: "completed",
  },
];

export default function AlertsScreen() {
  const [alerts, setAlerts] = useState(mockEmergencyAlerts);

  const handleAcknowledge = (id: string) => {
    setAlerts((prev) =>
      prev.map((alert) =>
        alert.id === id ? { ...alert, isAcknowledged: true } : alert
      )
    );
  };

  const handleClearRoute = (id: string) => {
    setAlerts((prev) =>
      prev.map((alert) =>
        alert.id === id ? { ...alert, isRouteCleared: true } : alert
      )
    );
  };

  const handleMarkComplete = (id: string) => {
    setAlerts((prev) =>
      prev.map((alert) =>
        alert.id === id ? { ...alert, priority: "completed" } : alert
      )
    );
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return colors.red;
      case "medium":
        return colors.warning;
      case "low":
        return colors.blue;
      case "completed":
        return colors.success;
      default:
        return colors.mediumGray;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Critical":
        return colors.red;
      case "Needs Oxygen":
        return colors.warning;
      case "Stable":
        return colors.success;
      default:
        return colors.blue;
    }
  };

  // Filter alerts by priority
  const highPriorityAlerts = alerts.filter(
    (alert) => alert.priority === "high"
  );
  const mediumPriorityAlerts = alerts.filter(
    (alert) => alert.priority === "medium"
  );
  const completedAlerts = alerts.filter(
    (alert) => alert.priority === "completed"
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Feather name="arrow-left" size={24} color={colors.darkGray} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Live Alerts</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Navigation Tabs */}
      <View style={styles.tabBar}>
        <TouchableOpacity
          style={styles.tabItem}
          onPress={() => router.replace("/police/dashboard")}
        >
          <MaterialIcons name="dashboard" size={20} color={colors.darkGray} />
          <Text style={styles.tabText}>Map View</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabItem, styles.activeTab]}
          onPress={() => {}}
        >
          <MaterialIcons name="warning" size={20} color={colors.red} />
          <Text style={[styles.tabText, styles.activeTabText]}>Alerts</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.tabItem}
          onPress={() => router.push("/police/history")}
        >
          <Feather name="list" size={20} color={colors.darkGray} />
          <Text style={styles.tabText}>History</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
      >
        {/* High Priority Alerts */}
        {highPriorityAlerts.length > 0 && (
          <>
            <View style={styles.sectionHeader}>
              <MaterialIcons name="warning" size={18} color={colors.red} />
              <Text style={styles.sectionTitle}>High Priority</Text>
            </View>

            {highPriorityAlerts.map((alert) => (
              <Card
                key={alert.id}
                style={[styles.alertCard, styles.highPriorityCard]}
              >
                <CardContent>
                  <View style={styles.alertHeader}>
                    <View style={styles.alertHeaderLeft}>
                      <Text style={styles.ambulanceId}>
                        Ambulance #{alert.ambulanceId}
                      </Text>
                      <View
                        style={[
                          styles.statusBadge,
                          { backgroundColor: getStatusColor(alert.status) },
                        ]}
                      >
                        <Text style={styles.statusText}>{alert.status}</Text>
                      </View>
                    </View>
                    <View style={styles.timestampContainer}>
                      <Feather
                        name="clock"
                        size={14}
                        color={colors.mediumGray}
                      />
                      <Text style={styles.timestampText}>
                        {alert.timestamp}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.alertDetails}>
                    <View style={styles.detailItem}>
                      <MaterialIcons
                        name="warning"
                        size={16}
                        color={colors.red}
                      />
                      <Text style={styles.detailText}>
                        {alert.emergencyType}
                      </Text>
                    </View>

                    <View style={styles.detailItem}>
                      <Feather
                        name="map-pin"
                        size={16}
                        color={colors.darkGray}
                      />
                      <Text style={styles.detailText}>{alert.location}</Text>
                    </View>

                    <View style={styles.detailItem}>
                      <Feather name="clock" size={16} color={colors.darkGray} />
                      <Text style={styles.detailText}>
                        ETA: {alert.eta} to {alert.destination}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.actionButtons}>
                    <Button
                      variant={alert.isAcknowledged ? "outline" : "primary"}
                      style={[
                        styles.actionButton,
                        alert.isAcknowledged ? styles.acknowledgedButton : null,
                      ]}
                      onPress={() => handleAcknowledge(alert.id)}
                      disabled={alert.isAcknowledged}
                    >
                      <Text
                        style={[
                          styles.actionButtonText,
                          alert.isAcknowledged
                            ? styles.acknowledgedButtonText
                            : null,
                        ]}
                      >
                        {alert.isAcknowledged ? "Acknowledged" : "Acknowledge"}
                      </Text>
                    </Button>

                    <Button
                      variant={alert.isRouteCleared ? "outline" : "primary"}
                      style={[
                        styles.actionButton,
                        styles.clearButton,
                        alert.isRouteCleared ? styles.clearedButton : null,
                      ]}
                      onPress={() => handleClearRoute(alert.id)}
                      disabled={alert.isRouteCleared || !alert.isAcknowledged}
                    >
                      <Text
                        style={[
                          styles.actionButtonText,
                          alert.isRouteCleared
                            ? styles.clearedButtonText
                            : null,
                        ]}
                      >
                        {alert.isRouteCleared ? "Route Cleared" : "Clear Route"}
                      </Text>
                    </Button>

                    <Button
                      style={[styles.actionButton, styles.completeButton]}
                      onPress={() => handleMarkComplete(alert.id)}
                      disabled={!alert.isRouteCleared}
                    >
                      <Text style={styles.actionButtonText}>Mark Complete</Text>
                    </Button>
                  </View>
                </CardContent>
              </Card>
            ))}
          </>
        )}

        {/* Medium Priority Alerts */}
        {mediumPriorityAlerts.length > 0 && (
          <>
            <View style={styles.sectionHeader}>
              <MaterialIcons name="warning" size={18} color={colors.warning} />
              <Text style={styles.sectionTitle}>Medium Priority</Text>
            </View>

            {mediumPriorityAlerts.map((alert) => (
              <Card
                key={alert.id}
                style={[styles.alertCard, styles.mediumPriorityCard]}
              >
                <CardContent>
                  <View style={styles.alertHeader}>
                    <View style={styles.alertHeaderLeft}>
                      <Text style={styles.ambulanceId}>
                        Ambulance #{alert.ambulanceId}
                      </Text>
                      <View
                        style={[
                          styles.statusBadge,
                          { backgroundColor: getStatusColor(alert.status) },
                        ]}
                      >
                        <Text style={styles.statusText}>{alert.status}</Text>
                      </View>
                    </View>
                    <View style={styles.timestampContainer}>
                      <Feather
                        name="clock"
                        size={14}
                        color={colors.mediumGray}
                      />
                      <Text style={styles.timestampText}>
                        {alert.timestamp}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.alertDetails}>
                    <View style={styles.detailItem}>
                      <MaterialIcons
                        name="warning"
                        size={16}
                        color={colors.warning}
                      />
                      <Text style={styles.detailText}>
                        {alert.emergencyType}
                      </Text>
                    </View>

                    <View style={styles.detailItem}>
                      <Feather
                        name="map-pin"
                        size={16}
                        color={colors.darkGray}
                      />
                      <Text style={styles.detailText}>{alert.location}</Text>
                    </View>

                    <View style={styles.detailItem}>
                      <Feather name="clock" size={16} color={colors.darkGray} />
                      <Text style={styles.detailText}>
                        ETA: {alert.eta} to {alert.destination}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.actionButtons}>
                    <Button
                      variant={alert.isAcknowledged ? "outline" : "primary"}
                      style={[
                        styles.actionButton,
                        alert.isAcknowledged ? styles.acknowledgedButton : null,
                      ]}
                      onPress={() => handleAcknowledge(alert.id)}
                      disabled={alert.isAcknowledged}
                    >
                      <Text
                        style={[
                          styles.actionButtonText,
                          alert.isAcknowledged
                            ? styles.acknowledgedButtonText
                            : null,
                        ]}
                      >
                        {alert.isAcknowledged ? "Acknowledged" : "Acknowledge"}
                      </Text>
                    </Button>

                    <Button
                      variant={alert.isRouteCleared ? "outline" : "primary"}
                      style={[
                        styles.actionButton,
                        styles.clearButton,
                        alert.isRouteCleared ? styles.clearedButton : null,
                      ]}
                      onPress={() => handleClearRoute(alert.id)}
                      disabled={alert.isRouteCleared || !alert.isAcknowledged}
                    >
                      <Text
                        style={[
                          styles.actionButtonText,
                          alert.isRouteCleared
                            ? styles.clearedButtonText
                            : null,
                        ]}
                      >
                        {alert.isRouteCleared ? "Route Cleared" : "Clear Route"}
                      </Text>
                    </Button>

                    <Button
                      style={[styles.actionButton, styles.completeButton]}
                      onPress={() => handleMarkComplete(alert.id)}
                      disabled={!alert.isRouteCleared}
                    >
                      <Text style={styles.actionButtonText}>Mark Complete</Text>
                    </Button>
                  </View>
                </CardContent>
              </Card>
            ))}
          </>
        )}

        {/* Completed Alerts */}
        {completedAlerts.length > 0 && (
          <>
            <View style={styles.sectionHeader}>
              <AntDesign name="checkcircle" size={18} color={colors.success} />
              <Text style={styles.sectionTitle}>Completed</Text>
            </View>

            {completedAlerts.map((alert) => (
              <Card
                key={alert.id}
                style={[styles.alertCard, styles.completedCard]}
              >
                <CardContent>
                  <View style={styles.alertHeader}>
                    <View style={styles.alertHeaderLeft}>
                      <Text style={styles.ambulanceId}>
                        Ambulance #{alert.ambulanceId}
                      </Text>
                      <View
                        style={[
                          styles.statusBadge,
                          { backgroundColor: getStatusColor(alert.status) },
                        ]}
                      >
                        <Text style={styles.statusText}>{alert.status}</Text>
                      </View>
                    </View>
                    <View style={styles.timestampContainer}>
                      <Feather
                        name="clock"
                        size={14}
                        color={colors.mediumGray}
                      />
                      <Text style={styles.timestampText}>
                        {alert.timestamp}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.alertDetails}>
                    <View style={styles.detailItem}>
                      <MaterialIcons
                        name="warning"
                        size={16}
                        color={colors.darkGray}
                      />
                      <Text style={styles.detailText}>
                        {alert.emergencyType}
                      </Text>
                    </View>

                    <View style={styles.detailItem}>
                      <Feather
                        name="map-pin"
                        size={16}
                        color={colors.darkGray}
                      />
                      <Text style={styles.detailText}>{alert.location}</Text>
                    </View>

                    <View style={styles.detailItem}>
                      <Feather name="clock" size={16} color={colors.darkGray} />
                      <Text style={styles.detailText}>
                        ETA: {alert.eta} to {alert.destination}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.completedStatus}>
                    <AntDesign
                      name="checkcircle"
                      size={18}
                      color={colors.success}
                    />
                    <Text style={styles.completedText}>
                      Route Cleared Successfully
                    </Text>
                  </View>
                </CardContent>
              </Card>
            ))}
          </>
        )}
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
    ...shadows.sm,
  },
  backButton: {
    padding: spacing.xs,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
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
    borderBottomColor: colors.red,
  },
  tabText: {
    fontSize: 14,
    color: colors.mediumGray,
    marginLeft: spacing.xs,
  },
  activeTabText: {
    color: colors.red,
    fontWeight: "500",
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: spacing.md,
    paddingBottom: spacing.xl,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: spacing.sm,
    marginTop: spacing.md,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.darkGray,
    marginLeft: spacing.xs,
  },
  alertCard: {
    marginBottom: spacing.md,
    borderLeftWidth: 4,
    backgroundColor: colors.white,
    ...shadows.sm,
  },
  highPriorityCard: {
    borderLeftColor: colors.red,
    backgroundColor: "rgba(229, 57, 53, 0.05)",
  },
  mediumPriorityCard: {
    borderLeftColor: colors.warning,
    backgroundColor: "rgba(255, 152, 0, 0.05)",
  },
  completedCard: {
    borderLeftColor: colors.success,
    backgroundColor: "rgba(76, 175, 80, 0.05)",
  },
  alertHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.sm,
  },
  alertHeaderLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  ambulanceId: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.darkGray,
    marginRight: spacing.sm,
  },
  statusBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: 4,
  },
  statusText: {
    fontSize: 10,
    fontWeight: "500",
    color: colors.white,
  },
  timestampContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  timestampText: {
    fontSize: 12,
    color: colors.mediumGray,
    marginLeft: 4,
  },
  alertDetails: {
    marginBottom: spacing.md,
  },
  detailItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: spacing.xs,
  },
  detailText: {
    fontSize: 14,
    color: colors.darkGray,
    marginLeft: spacing.sm,
  },
  actionButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  actionButton: {
    flex: 1,
    marginHorizontal: 2,
  },
  actionButtonText: {
    color: colors.white,
    fontSize: 12,
    fontWeight: "500",
  },
  clearButton: {
    backgroundColor: colors.warning,
  },
  completeButton: {
    backgroundColor: colors.success,
  },
  acknowledgedButton: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: colors.blue,
  },
  acknowledgedButtonText: {
    color: colors.blue,
  },
  clearedButton: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: colors.success,
  },
  clearedButtonText: {
    color: colors.success,
  },
  completedStatus: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(76, 175, 80, 0.1)",
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
  },
  completedText: {
    color: colors.success,
    marginLeft: spacing.xs,
    fontWeight: "500",
  },
});
