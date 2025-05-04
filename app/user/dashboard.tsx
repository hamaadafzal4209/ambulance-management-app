"use client";
import { useAuth } from "@/components/auth-provider";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { colors, spacing } from "@/constants/theme";
import { Feather, FontAwesome5 } from "@expo/vector-icons";
import { router } from "expo-router";
import {
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function UserDashboard() {
  const { user, signOut } = useAuth();

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={"white"} barStyle={"dark-content"} />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Dashboard</Text>
        <TouchableOpacity style={styles.iconButton} onPress={() => signOut()}>
          <Feather name="log-out" size={22} color={colors.danger} />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
      >
        <Card style={styles.welcomeCard}>
          <CardContent>
            <View style={styles.welcomeContent}>
              <View style={styles.welcomeIcon}>
                <Feather name="user" size={24} color={colors.white} />
              </View>
              <View style={styles.welcomeTextContainer}>
                <Text style={styles.welcomeText}>
                  Welcome, {user?.name || "Guest"}
                </Text>
                <Text style={styles.welcomeSubtext}>
                  Need emergency assistance?
                </Text>
              </View>
            </View>
          </CardContent>
        </Card>

        <Button
          style={styles.emergencyButton}
          onPress={() => router.push("/user/request-ambulance")}
        >
          <View style={styles.emergencyButtonContent}>
            <FontAwesome5 name="ambulance" size={24} color={colors.white} />
            <Text style={styles.emergencyButtonText}>Request Ambulance</Text>
          </View>
        </Button>

        <Text style={styles.sectionTitle}>Quick Actions</Text>

        <View style={styles.actionsContainer}>
          <Card style={styles.actionCard} variant="outlined">
            <CardContent>
              <TouchableOpacity
                style={styles.actionContent}
                onPress={() => router.push("/user/history")}
              >
                <View
                  style={[styles.actionIcon, { backgroundColor: colors.blue }]}
                >
                  <Feather name="clock" size={20} color={colors.white} />
                </View>
                <Text style={styles.actionText}>Request History</Text>
              </TouchableOpacity>
            </CardContent>
          </Card>

          <Card style={styles.actionCard} variant="outlined">
            <CardContent>
              <TouchableOpacity
                style={styles.actionContent}
                onPress={() => router.push("/user/profile")}
              >
                <View
                  style={[styles.actionIcon, { backgroundColor: colors.red }]}
                >
                  <Feather name="user" size={20} color={colors.white} />
                </View>
                <Text style={styles.actionText}>My Profile</Text>
              </TouchableOpacity>
            </CardContent>
          </Card>
        </View>

        <Text style={styles.sectionTitle}>Recent Activity</Text>

        {[1, 2].map((item) => (
          <Card key={item} style={styles.activityCard}>
            <CardHeader>
              <View style={styles.activityHeader}>
                <View style={styles.activityStatus}>
                  <View
                    style={[
                      styles.statusDot,
                      {
                        backgroundColor:
                          item === 1 ? colors.success : colors.blue,
                      },
                    ]}
                  />
                  <Text style={styles.statusText}>
                    {item === 1 ? "Completed" : "Requested"}
                  </Text>
                </View>
                <Text style={styles.activityDate}>
                  {item === 1 ? "2 days ago" : "Today"}
                </Text>
              </View>
            </CardHeader>
            <CardContent>
              <View style={styles.activityDetails}>
                <View style={styles.activityDetail}>
                  <Feather name="map-pin" size={16} color={colors.mediumGray} />
                  <Text style={styles.activityDetailText}>
                    {item === 1 ? "123 Main St, City" : "Current Location"}
                  </Text>
                </View>
                <View style={styles.activityDetail}>
                  <Feather name="clock" size={16} color={colors.mediumGray} />
                  <Text style={styles.activityDetailText}>
                    {item === 1 ? "May 1, 2025 - 14:30" : "May 3, 2025 - 09:15"}
                  </Text>
                </View>
                <View style={styles.activityDetail}>
                  <FontAwesome5
                    name="ambulance"
                    size={16}
                    color={colors.mediumGray}
                  />
                  <Text style={styles.activityDetailText}>
                    {item === 1 ? "Ambulance #A-123" : "Searching..."}
                  </Text>
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
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: colors.darkGray,
  },
  signOutText: {
    color: colors.blue,
    fontWeight: "500",
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: spacing.md,
  },
  welcomeCard: {
    marginBottom: spacing.md,
    backgroundColor: colors.blue,
  },
  welcomeContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconButton: {
    padding: spacing.sm,
    marginLeft: spacing.sm,
    position: "relative",
  },
  welcomeIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    alignItems: "center",
    justifyContent: "center",
    marginRight: spacing.md,
  },
  welcomeTextContainer: {
    flex: 1,
  },
  welcomeText: {
    color: colors.white,
    fontSize: 18,
    fontWeight: "bold",
  },
  welcomeSubtext: {
    color: "rgba(255, 255, 255, 0.8)",
    fontSize: 14,
  },
  emergencyButton: {
    backgroundColor: colors.red,
    marginBottom: spacing.lg,
    paddingVertical: spacing.md,
  },
  emergencyButtonContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  emergencyButtonText: {
    color: colors.white,
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: spacing.md,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: spacing.md,
    color: colors.darkGray,
  },
  actionsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: spacing.lg,
  },
  actionCard: {
    flex: 1,
    marginHorizontal: spacing.xs,
  },
  actionContent: {
    alignItems: "center",
    padding: spacing.sm,
  },
  actionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.sm,
  },
  actionText: {
    fontSize: 14,
    color: colors.darkGray,
    textAlign: "center",
  },
  activityCard: {
    marginBottom: spacing.md,
  },
  activityHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  activityStatus: {
    flexDirection: "row",
    alignItems: "center",
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: spacing.xs,
  },
  statusText: {
    fontSize: 14,
    fontWeight: "500",
    color: colors.darkGray,
  },
  activityDate: {
    fontSize: 12,
    color: colors.mediumGray,
  },
  activityDetails: {
    gap: spacing.sm,
  },
  activityDetail: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  activityDetailText: {
    fontSize: 14,
    color: colors.darkGray,
  },
});
