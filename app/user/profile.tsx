"use client";

import { useAuth } from "@/components/auth-provider";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { colors, spacing } from "@/constants/theme";
import { Feather, Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Profile() {
  const { user, signOut } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    name: user?.name || "John Doe",
    email: user?.email || "john.doe@example.com",
    phone: "+1 (555) 123-4567",
    address: "123 Main St, San Francisco, CA",
    bloodGroup: "O+",
    emergencyContact: "Jane Doe",
    emergencyPhone: "+1 (555) 987-6543",
    emergencyRelation: "Spouse",
  });

  const [notifications, setNotifications] = useState({
    emergencyAlerts: true,
    statusUpdates: true,
    promotions: false,
  });

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    // In a real app, this would save to backend
    setIsEditing(false);
    Alert.alert("Success", "Profile updated successfully");
  };

  const handleInputChange = (field: string, value: string) => {
    setProfileData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleToggleNotification = (field: keyof typeof notifications) => {
    setNotifications((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
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
        <Text style={styles.headerTitle}>My Profile</Text>
        <TouchableOpacity
          onPress={isEditing ? handleSave : handleEdit}
          style={styles.editButton}
        >
          {isEditing ? (
            <Feather name="save" size={20} color={colors.blue} />
          ) : (
            <Feather name="edit" size={20} color={colors.blue} />
          )}
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
      >
        <View style={styles.profileHeader}>
          <View style={styles.avatarContainer}>
            <Text style={styles.avatarText}>
              {profileData.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </Text>
          </View>
          <Text style={styles.profileName}>{profileData.name}</Text>
          <Text style={styles.profileEmail}>{profileData.email}</Text>
        </View>

        <Text style={styles.sectionTitle}>Personal Information</Text>
        <Card style={styles.infoCard}>
          <CardContent>
            {isEditing ? (
              <View style={styles.editForm}>
                <Input
                  label="Full Name"
                  value={profileData.name}
                  onChangeText={(value) => handleInputChange("name", value)}
                />
                <Input
                  label="Email"
                  value={profileData.email}
                  onChangeText={(value) => handleInputChange("email", value)}
                  keyboardType="email-address"
                />
                <Input
                  label="Phone Number"
                  value={profileData.phone}
                  onChangeText={(value) => handleInputChange("phone", value)}
                  keyboardType="phone-pad"
                />
                <Input
                  label="Address"
                  value={profileData.address}
                  onChangeText={(value) => handleInputChange("address", value)}
                />
                <Input
                  label="Blood Group"
                  value={profileData.bloodGroup}
                  onChangeText={(value) =>
                    handleInputChange("bloodGroup", value)
                  }
                />
              </View>
            ) : (
              <View style={styles.infoList}>
                <View style={styles.infoItem}>
                  <View style={styles.infoIcon}>
                    <Feather name="user" size={16} color={colors.blue} />
                  </View>
                  <View style={styles.infoContent}>
                    <Text style={styles.infoLabel}>Full Name</Text>
                    <Text style={styles.infoValue}>{profileData.name}</Text>
                  </View>
                </View>

                <View style={styles.infoItem}>
                  <View style={styles.infoIcon}>
                    <Feather name="mail" size={16} color={colors.blue} />
                  </View>
                  <View style={styles.infoContent}>
                    <Text style={styles.infoLabel}>Email</Text>
                    <Text style={styles.infoValue}>{profileData.email}</Text>
                  </View>
                </View>

                <View style={styles.infoItem}>
                  <View style={styles.infoIcon}>
                    <Feather name="phone" size={16} color={colors.blue} />
                  </View>
                  <View style={styles.infoContent}>
                    <Text style={styles.infoLabel}>Phone Number</Text>
                    <Text style={styles.infoValue}>{profileData.phone}</Text>
                  </View>
                </View>

                <View style={styles.infoItem}>
                  <View style={styles.infoIcon}>
                    <Feather name="map-pin" size={16} color={colors.blue} />
                  </View>
                  <View style={styles.infoContent}>
                    <Text style={styles.infoLabel}>Address</Text>
                    <Text style={styles.infoValue}>{profileData.address}</Text>
                  </View>
                </View>

                <View style={styles.infoItem}>
                  <View style={styles.infoIcon}>
                    <Feather name="heart" size={16} color={colors.blue} />
                  </View>
                  <View style={styles.infoContent}>
                    <Text style={styles.infoLabel}>Blood Group</Text>
                    <Text style={styles.infoValue}>
                      {profileData.bloodGroup}
                    </Text>
                  </View>
                </View>
              </View>
            )}
          </CardContent>
        </Card>

        <Text style={styles.sectionTitle}>Emergency Contact</Text>
        <Card style={styles.infoCard}>
          <CardContent>
            {isEditing ? (
              <View style={styles.editForm}>
                <Input
                  label="Emergency Contact Name"
                  value={profileData.emergencyContact}
                  onChangeText={(value) =>
                    handleInputChange("emergencyContact", value)
                  }
                />
                <Input
                  label="Emergency Contact Phone"
                  value={profileData.emergencyPhone}
                  onChangeText={(value) =>
                    handleInputChange("emergencyPhone", value)
                  }
                  keyboardType="phone-pad"
                />
                <Input
                  label="Relationship"
                  value={profileData.emergencyRelation}
                  onChangeText={(value) =>
                    handleInputChange("emergencyRelation", value)
                  }
                />
              </View>
            ) : (
              <View style={styles.infoList}>
                <View style={styles.infoItem}>
                  <View style={styles.infoIcon}>
                    <Feather name="user" size={16} color={colors.blue} />
                  </View>
                  <View style={styles.infoContent}>
                    <Text style={styles.infoLabel}>Name</Text>
                    <Text style={styles.infoValue}>
                      {profileData.emergencyContact}
                    </Text>
                  </View>
                </View>

                <View style={styles.infoItem}>
                  <View style={styles.infoIcon}>
                    <Feather name="phone" size={16} color={colors.blue} />
                  </View>
                  <View style={styles.infoContent}>
                    <Text style={styles.infoLabel}>Phone Number</Text>
                    <Text style={styles.infoValue}>
                      {profileData.emergencyPhone}
                    </Text>
                  </View>
                </View>

                <View style={styles.infoItem}>
                  <View style={styles.infoIcon}>
                    <Feather name="heart" size={16} color={colors.blue} />
                  </View>
                  <View style={styles.infoContent}>
                    <Text style={styles.infoLabel}>Relationship</Text>
                    <Text style={styles.infoValue}>
                      {profileData.emergencyRelation}
                    </Text>
                  </View>
                </View>
              </View>
            )}
          </CardContent>
        </Card>

        <Text style={styles.sectionTitle}>Notifications</Text>
        <Card style={styles.infoCard}>
          <CardContent>
            <View style={styles.notificationItem}>
              <View style={styles.notificationInfo}>
                <View style={styles.infoIcon}>
                  <Feather name="bell" size={16} color={colors.blue} />
                </View>
                <Text style={styles.notificationText}>Emergency Alerts</Text>
              </View>
              <Switch
                value={notifications.emergencyAlerts}
                onValueChange={() =>
                  handleToggleNotification("emergencyAlerts")
                }
                trackColor={{ false: colors.lightGray, true: colors.blue }}
                thumbColor={colors.white}
              />
            </View>

            <View style={styles.notificationItem}>
              <View style={styles.notificationInfo}>
                <View style={styles.infoIcon}>
                  <Feather name="bell" size={16} color={colors.blue} />
                </View>
                <Text style={styles.notificationText}>Status Updates</Text>
              </View>
              <Switch
                value={notifications.statusUpdates}
                onValueChange={() => handleToggleNotification("statusUpdates")}
                trackColor={{ false: colors.lightGray, true: colors.blue }}
                thumbColor={colors.white}
              />
            </View>

            <View style={styles.notificationItem}>
              <View style={styles.notificationInfo}>
                <View style={styles.infoIcon}>
                  <Feather name="bell" size={16} color={colors.blue} />
                </View>
                <Text style={styles.notificationText}>Promotions & News</Text>
              </View>
              <Switch
                value={notifications.promotions}
                onValueChange={() => handleToggleNotification("promotions")}
                trackColor={{ false: colors.lightGray, true: colors.blue }}
                thumbColor={colors.white}
              />
            </View>
          </CardContent>
        </Card>

        <Text style={styles.sectionTitle}>Account</Text>
        <Card style={styles.infoCard}>
          <CardContent>
            <TouchableOpacity style={styles.accountOption}>
              <View style={styles.accountOptionLeft}>
                <View
                  style={[
                    styles.infoIcon,
                    { backgroundColor: "rgba(25, 118, 210, 0.1)" },
                  ]}
                >
                  <Feather name="shield" size={16} color={colors.blue} />
                </View>
                <Text style={styles.accountOptionText}>Privacy Settings</Text>
              </View>
              <Feather
                name="chevron-right"
                size={16}
                color={colors.mediumGray}
              />
            </TouchableOpacity>

            <TouchableOpacity style={styles.accountOption}>
              <View style={styles.accountOptionLeft}>
                <View
                  style={[
                    styles.infoIcon,
                    { backgroundColor: "rgba(25, 118, 210, 0.1)" },
                  ]}
                >
                  <Feather name="shield" size={16} color={colors.blue} />
                </View>
                <Text style={styles.accountOptionText}>Change Password</Text>
              </View>
              <Feather
                name="chevron-right"
                size={16}
                color={colors.mediumGray}
              />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.accountOption}
              onPress={() => signOut()}
            >
              <View style={styles.accountOptionLeft}>
                <View
                  style={[
                    styles.infoIcon,
                    { backgroundColor: "rgba(229, 57, 53, 0.1)" },
                  ]}
                >
                  <Feather name="shield" size={16} color={colors.blue} />
                </View>
                <Text style={[styles.accountOptionText, { color: colors.red }]}>
                  Sign Out
                </Text>
              </View>
              <Feather
                name="chevron-right"
                size={16}
                color={colors.mediumGray}
              />
            </TouchableOpacity>
          </CardContent>
        </Card>

        <View style={styles.versionContainer}>
          <Text style={styles.versionText}>Smart Ambulance v1.0.0</Text>
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
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    backgroundColor: colors.white,
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
  editButton: {
    padding: spacing.xs,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: spacing.md,
  },
  profileHeader: {
    alignItems: "center",
    marginBottom: spacing.xl,
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.blue,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: spacing.md,
  },
  avatarText: {
    fontSize: 32,
    fontWeight: "bold",
    color: colors.white,
  },
  profileName: {
    fontSize: 20,
    fontWeight: "bold",
    color: colors.darkGray,
    marginBottom: spacing.xs,
  },
  profileEmail: {
    fontSize: 14,
    color: colors.mediumGray,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: spacing.sm,
    marginTop: spacing.md,
    color: colors.darkGray,
  },
  infoCard: {
    marginBottom: spacing.md,
  },
  infoList: {
    gap: spacing.md,
  },
  infoItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  infoIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "rgba(25, 118, 210, 0.1)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: spacing.md,
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 12,
    color: colors.mediumGray,
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 14,
    color: colors.darkGray,
  },
  editForm: {
    gap: spacing.md,
  },
  notificationItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: spacing.sm,
  },
  notificationInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  notificationText: {
    fontSize: 14,
    color: colors.darkGray,
    marginLeft: spacing.md,
  },
  accountOption: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: spacing.md,
  },
  accountOptionLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  accountOptionText: {
    fontSize: 14,
    color: colors.darkGray,
    marginLeft: spacing.md,
  },
  versionContainer: {
    alignItems: "center",
    marginVertical: spacing.xl,
  },
  versionText: {
    fontSize: 12,
    color: colors.mediumGray,
  },
});
