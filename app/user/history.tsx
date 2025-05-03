"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { colors, spacing } from "@/constants/theme";
import { Feather, FontAwesome5, Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const historyData = [
  {
    id: "1",
    date: "May 3, 2025",
    time: "09:15 AM",
    location: "123 Market St, San Francisco, CA",
    emergencyType: "Accident",
    status: "Completed",
    ambulanceId: "A-123",
    driverName: "Michael Johnson",
    hospitalName: "SF General Hospital",
    notes: "Patient transported successfully. Minor injuries treated.",
  },
  {
    id: "2",
    date: "April 28, 2025",
    time: "14:30 PM",
    location: "456 Mission St, San Francisco, CA",
    emergencyType: "Heart Attack",
    status: "Completed",
    ambulanceId: "A-456",
    driverName: "Sarah Williams",
    hospitalName: "UCSF Medical Center",
    notes:
      "Emergency response successful. Patient stabilized during transport.",
  },
  {
    id: "3",
    date: "April 15, 2025",
    time: "18:45 PM",
    location: "789 Howard St, San Francisco, CA",
    emergencyType: "Breathing Difficulty",
    status: "Completed",
    ambulanceId: "A-789",
    driverName: "David Chen",
    hospitalName: "SF General Hospital",
    notes: "Oxygen administered during transport. Patient condition improved.",
  },
  {
    id: "4",
    date: "March 22, 2025",
    time: "11:20 AM",
    location: "101 California St, San Francisco, CA",
    emergencyType: "Injury/Bleeding",
    status: "Completed",
    ambulanceId: "A-234",
    driverName: "Lisa Rodriguez",
    hospitalName: "Kaiser Permanente",
    notes: "Bleeding controlled. Patient transported for further treatment.",
  },
];

export default function History() {
  const [selectedItem, setSelectedItem] = useState<string | null>(null);

  const toggleDetails = (id: string) => {
    setSelectedItem(selectedItem === id ? null : id);
  };

  const renderHistoryItem = ({ item }: { item: (typeof historyData)[0] }) => {
    const isExpanded = selectedItem === item.id;

    return (
      <Card style={styles.historyCard}>
        <TouchableOpacity onPress={() => toggleDetails(item.id)}>
          <CardHeader>
            <View style={styles.historyHeader}>
              <View style={styles.historyHeaderLeft}>
                <Text style={styles.historyDate}>{item.date}</Text>
                <View style={styles.statusContainer}>
                  <View
                    style={[
                      styles.statusDot,
                      { backgroundColor: colors.success },
                    ]}
                  />
                  <Text style={styles.statusText}>{item.status}</Text>
                </View>
              </View>
              <Feather
                name="chevron-right"
                size={20}
                color={colors.mediumGray}
                style={{
                  transform: [{ rotate: isExpanded ? "90deg" : "0deg" }],
                }}
              />
            </View>
          </CardHeader>
        </TouchableOpacity>

        <CardContent>
          <View style={styles.historyBasicInfo}>
            <View style={styles.infoItem}>
              <Feather name="clock" size={16} color={colors.mediumGray} />
              <Text style={styles.infoText}>{item.time}</Text>
            </View>
            <View style={styles.infoItem}>
              <Feather name="map-pin" size={16} color={colors.mediumGray} />
              <Text style={styles.infoText}>{item.location}</Text>
            </View>
            <View style={styles.infoItem}>
              <Feather
                name="alert-triangle"
                size={16}
                color={colors.mediumGray}
              />
              <Text style={styles.infoText}>{item.emergencyType}</Text>
            </View>
          </View>

          {isExpanded && (
            <View style={styles.expandedDetails}>
              <View style={styles.divider} />
              <Text style={styles.detailsTitle}>Additional Details</Text>
              <View style={styles.detailsGrid}>
                <View style={styles.detailItem}>
                  <Text style={styles.detailLabel}>Ambulance ID</Text>
                  <Text style={styles.detailValue}>{item.ambulanceId}</Text>
                </View>
                <View style={styles.detailItem}>
                  <Text style={styles.detailLabel}>Driver</Text>
                  <Text style={styles.detailValue}>{item.driverName}</Text>
                </View>
                <View style={styles.detailItem}>
                  <Text style={styles.detailLabel}>Hospital</Text>
                  <Text style={styles.detailValue}>{item.hospitalName}</Text>
                </View>
              </View>
              <View style={styles.notesContainer}>
                <Text style={styles.notesLabel}>Notes</Text>
                <Text style={styles.notesText}>{item.notes}</Text>
              </View>
            </View>
          )}
        </CardContent>
      </Card>
    );
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
        <Text style={styles.headerTitle}>Request History</Text>
        <View style={styles.placeholder} />
      </View>

      {historyData.length > 0 ? (
        <FlatList
          data={historyData}
          renderItem={renderHistoryItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <FontAwesome5 name="ambulance" size={64} color={colors.lightGray} />
          <Text style={styles.emptyTitle}>No History Yet</Text>
          <Text style={styles.emptyText}>
            Your ambulance request history will appear here
          </Text>
        </View>
      )}
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
  placeholder: {
    width: 24,
  },
  listContent: {
    padding: spacing.md,
  },
  historyCard: {
    marginBottom: spacing.md,
  },
  historyHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  historyHeaderLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  historyDate: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.darkGray,
    marginRight: spacing.md,
  },
  statusContainer: {
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
    color: colors.success,
    fontWeight: "500",
  },
  historyBasicInfo: {
    gap: spacing.xs,
  },
  infoItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: spacing.xs,
  },
  infoText: {
    marginLeft: spacing.sm,
    fontSize: 14,
    color: colors.darkGray,
  },
  expandedDetails: {
    marginTop: spacing.md,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginBottom: spacing.md,
  },
  detailsTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.darkGray,
    marginBottom: spacing.md,
  },
  detailsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: spacing.md,
  },
  detailItem: {
    width: "50%",
    marginBottom: spacing.md,
  },
  detailLabel: {
    fontSize: 12,
    color: colors.mediumGray,
    marginBottom: 2,
  },
  detailValue: {
    fontSize: 14,
    color: colors.darkGray,
    fontWeight: "500",
  },
  notesContainer: {
    backgroundColor: colors.lightGray,
    padding: spacing.md,
    borderRadius: 8,
  },
  notesLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.darkGray,
    marginBottom: spacing.xs,
  },
  notesText: {
    fontSize: 14,
    color: colors.darkGray,
    lineHeight: 20,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: spacing.xl,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.darkGray,
    marginTop: spacing.md,
    marginBottom: spacing.sm,
  },
  emptyText: {
    fontSize: 14,
    color: colors.mediumGray,
    textAlign: "center",
  },
});
