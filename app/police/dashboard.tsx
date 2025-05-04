"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
  Animated,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "@/components/auth-provider";
import { borderRadius, colors, shadows, spacing } from "@/constants/theme";
import { Feather, Ionicons, MaterialIcons } from "@expo/vector-icons";
import AlertsMap from "@/components/common/AlertsMap";

// Mock data for emergency routes
const mockEmergencyRoutes = [
  {
    id: "1",
    ambulanceId: "A-123",
    patientName: "Sarah Johnson",
    emergencyType: "Heart Attack",
    eta: "5 min",
    status: "In Progress",
    location: {
      latitude: 37.785,
      longitude: -122.43,
    },
    destination: {
      latitude: 37.795,
      longitude: -122.425,
      name: "SF General Hospital",
    },
    route: [
      { latitude: 37.785, longitude: -122.43 },
      { latitude: 37.787, longitude: -122.428 },
      { latitude: 37.79, longitude: -122.427 },
      { latitude: 37.795, longitude: -122.425 },
    ],
    congestionPoints: [
      { latitude: 37.787, longitude: -122.428, severity: "high" },
    ],
    signalsClear: false,
    isAcknowledged: false,
    isNew: true,
  },
  {
    id: "2",
    ambulanceId: "A-456",
    patientName: "Robert Chen",
    emergencyType: "Accident",
    eta: "12 min",
    status: "In Progress",
    location: {
      latitude: 37.79,
      longitude: -122.435,
    },
    destination: {
      latitude: 37.795,
      longitude: -122.425,
      name: "SF General Hospital",
    },
    route: [
      { latitude: 37.79, longitude: -122.435 },
      { latitude: 37.792, longitude: -122.432 },
      { latitude: 37.794, longitude: -122.428 },
      { latitude: 37.795, longitude: -122.425 },
    ],
    congestionPoints: [],
    signalsClear: true,
    isAcknowledged: true,
    isNew: false,
  },
  {
    id: "3",
    ambulanceId: "A-789",
    patientName: "Maria Garcia",
    emergencyType: "Breathing Difficulty",
    eta: "8 min",
    status: "In Progress",
    location: {
      latitude: 37.775,
      longitude: -122.42,
    },
    destination: {
      latitude: 37.78,
      longitude: -122.41,
      name: "UCSF Medical Center",
    },
    route: [
      { latitude: 37.775, longitude: -122.42 },
      { latitude: 37.777, longitude: -122.415 },
      { latitude: 37.78, longitude: -122.41 },
    ],
    congestionPoints: [
      { latitude: 37.777, longitude: -122.415, severity: "medium" },
    ],
    signalsClear: false,
    isAcknowledged: false,
    isNew: true,
  },
];

export default function PoliceDashboard() {
  const { user, signOut } = useAuth();
  const [policeLocation] = useState({
    latitude: 37.78825,
    longitude: -122.4324,
  });
  const [emergencyRoutes, setEmergencyRoutes] = useState(mockEmergencyRoutes);
  const [selectedRoute, setSelectedRoute] = useState(mockEmergencyRoutes[0]);
  const [notificationCount, setNotificationCount] = useState(2);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    // Check for new routes and show notification
    const newRoutes = emergencyRoutes.filter((route) => route.isNew).length;
    if (newRoutes > 0) {
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
    setEmergencyRoutes((prev) =>
      prev.map((route) =>
        route.id === id
          ? { ...route, isAcknowledged: true, isNew: false }
          : route
      )
    );
    setNotificationCount((prev) => Math.max(0, prev - 1));
  };

  const handleClearRoute = (id: string) => {
    setEmergencyRoutes((prev) =>
      prev.map((route) =>
        route.id === id ? { ...route, signalsClear: true } : route
      )
    );
  };

  const handleMarkComplete = (id: string) => {
    setEmergencyRoutes((prev) => prev.filter((route) => route.id !== id));
  };

  const getCongestionMarkers = () => {
    return selectedRoute.congestionPoints.map((point, index) => ({
      id: `congestion-${selectedRoute.id}-${index}`,
      coordinate: point,
      title: `Traffic Congestion`,
      type: point.severity === "high" ? "police" : "user",
    }));
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.policeName}>
            {user?.name || "Traffic Control"}
          </Text>
          <Text style={styles.headerSubtitle}>Emergency Route Management</Text>
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
          <MaterialIcons name="warning" size={18} color={colors.white} />
          <Text style={styles.notificationText}>
            New emergency routes need clearance!
          </Text>
        </Animated.View>
      )}

      {/* Navigation Tabs */}
      <View style={styles.tabBar}>
        <TouchableOpacity
          style={[styles.tabItem, styles.activeTab]}
          onPress={() => {}}
        >
          <MaterialIcons name="dashboard" size={20} color={colors.red} />
          <Text style={[styles.tabText, styles.activeTabText]}>Map View</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.tabItem}
          onPress={() => router.push("/police/alerts")}
        >
          <MaterialIcons name="warning" size={20} color={colors.darkGray} />
          <Text style={styles.tabText}>Alerts</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.tabItem}
          onPress={() => router.push("/police/history")}
        >
          <Feather name="list" size={20} color={colors.darkGray} />
          <Text style={styles.tabText}>History</Text>
        </TouchableOpacity>
      </View>

      <ScrollView>
        <View style={styles.content}>
          {/* Map Section */}
            {Platform.OS !== "web" && (
                 <View style={styles.mapContainer}>
                   <AlertsMap />
                 </View>
               )}

          {/* Emergency Routes Section */}
          <Text style={styles.sectionTitle}>Active Emergency Routes</Text>

          {emergencyRoutes.map((route) => (
            <Card
              key={route.id}
              style={[
                styles.routeCard,
                route.isNew && styles.newRouteCard,
                selectedRoute.id === route.id && styles.selectedRouteCard,
              ]}
            >
              <CardContent>
                <TouchableOpacity
                  style={styles.routeHeader}
                  onPress={() => setSelectedRoute(route)}
                >
                  <View style={styles.routeHeaderLeft}>
                    <View
                      style={[
                        styles.statusIndicator,
                        {
                          backgroundColor: route.signalsClear
                            ? colors.success
                            : colors.warning,
                        },
                      ]}
                    />
                    <View>
                      <Text style={styles.ambulanceId}>
                        Ambulance #{route.ambulanceId}
                      </Text>
                      <Text style={styles.emergencyType}>
                        {route.emergencyType}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.etaContainer}>
                    <Feather name="clock" size={14} color={colors.darkGray} />
                    <Text style={styles.etaText}>ETA: {route.eta}</Text>
                  </View>
                </TouchableOpacity>

                <View style={styles.routeDetails}>
                  <View style={styles.detailItem}>
                    <Feather name="map-pin" size={16} color={colors.darkGray} />
                    <Text style={styles.detailText}>
                      To: {route.destination.name}
                    </Text>
                  </View>

                  {route.congestionPoints.length > 0 && (
                    <View style={styles.congestionAlert}>
                      <MaterialIcons
                        name="warning"
                        size={16}
                        color={colors.warning}
                      />
                      <Text style={styles.congestionText}>
                        {route.congestionPoints.length} congestion point
                        {route.congestionPoints.length > 1 ? "s" : ""} detected
                      </Text>
                    </View>
                  )}
                </View>

                <View style={styles.actionButtons}>
                  <Button
                    variant={route.isAcknowledged ? "outline" : "primary"}
                    style={[
                      styles.actionButton,
                      route.isAcknowledged ? styles.acknowledgedButton : null,
                    ]}
                    onPress={() => handleAcknowledge(route.id)}
                    disabled={route.isAcknowledged}
                  >
                    <Text
                      style={[
                        styles.actionButtonText,
                        route.isAcknowledged
                          ? styles.acknowledgedButtonText
                          : null,
                      ]}
                    >
                      {route.isAcknowledged ? "Acknowledged" : "Acknowledge"}
                    </Text>
                  </Button>

                  <Button
                    variant={route.signalsClear ? "outline" : "primary"}
                    style={[
                      styles.actionButton,
                      styles.clearButton,
                      route.signalsClear ? styles.clearedButton : null,
                    ]}
                    onPress={() => handleClearRoute(route.id)}
                    disabled={route.signalsClear}
                  >
                    <Text
                      style={[
                        styles.actionButtonText,
                        route.signalsClear ? styles.clearedButtonText : null,
                      ]}
                    >
                      {route.signalsClear ? "Signals Cleared" : "Clear Signals"}
                    </Text>
                  </Button>

                  <Button
                    style={[styles.actionButton, styles.completeButton]}
                    onPress={() => handleMarkComplete(route.id)}
                  >
                    <Text style={styles.actionButtonText}>Complete</Text>
                  </Button>
                </View>
              </CardContent>
            </Card>
          ))}
        </View>
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
  policeName: {
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
    backgroundColor: colors.red,
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
    padding: spacing.md,
  },
  mapContainer: {
    height: 200,
    borderRadius: borderRadius.lg,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  mapOverlay: {
    position: "absolute",
    bottom: spacing.md,
    left: spacing.md,
    right: spacing.md,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    borderRadius: borderRadius.md,
    padding: spacing.sm,
    ...shadows.sm,
  },
  mapOverlayContent: {
    padding: spacing.xs,
  },
  mapOverlayTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: colors.darkGray,
    marginBottom: spacing.xs,
  },
  mapOverlayDetail: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  mapOverlayText: {
    fontSize: 14,
    color: colors.darkGray,
    marginLeft: spacing.xs,
  },
  mapOverlayStatus: {
    marginTop: spacing.xs,
    backgroundColor: colors.lightGray,
    paddingVertical: 2,
    paddingHorizontal: spacing.sm,
    borderRadius: borderRadius.sm,
    alignSelf: "flex-start",
  },
  mapOverlayStatusText: {
    fontSize: 12,
    color: colors.darkGray,
    fontWeight: "500",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: spacing.sm,
    color: colors.darkGray,
  },
  routeCard: {
    marginBottom: spacing.md,
    backgroundColor: colors.white,
    borderLeftWidth: 4,
    borderLeftColor: colors.blue,
    ...shadows.sm,
  },
  newRouteCard: {
    borderLeftColor: colors.red,
    backgroundColor: "rgba(229, 57, 53, 0.05)",
  },
  selectedRouteCard: {
    borderWidth: 2,
    borderColor: colors.red,
  },
  routeHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.sm,
  },
  routeHeaderLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  statusIndicator: {
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
  emergencyType: {
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
  routeDetails: {
    gap: spacing.sm,
    marginBottom: spacing.sm,
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
  congestionAlert: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 152, 0, 0.1)",
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: borderRadius.sm,
  },
  congestionText: {
    marginLeft: spacing.xs,
    fontSize: 14,
    color: colors.warning,
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
  clearButton: {
    backgroundColor: colors.warning,
  },
  completeButton: {
    backgroundColor: colors.success,
  },
  actionButtonText: {
    color: colors.white,
    fontWeight: "500",
    fontSize: 12,
  },
  acknowledgedButton: {
    borderColor: colors.blue,
  },
  acknowledgedButtonText: {
    color: colors.blue,
  },
  clearedButton: {
    borderColor: colors.success,
  },
  clearedButtonText: {
    color: colors.success,
  },
});
