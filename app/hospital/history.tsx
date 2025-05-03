"use client";

import { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { colors, spacing, borderRadius, shadows } from "@/constants/theme";
import { Feather } from "@expo/vector-icons";

const mockEmergencyHistory = [
  {
    id: "1",
    date: "2023-05-15",
    time: "08:45 AM",
    ambulanceId: "A-123",
    patientName: "Sarah Johnson",
    condition: "Critical",
    emergencyType: "Heart Attack",
    arrivalTime: "09:12 AM",
    responseTime: "27 min",
    outcome: "Admitted to ICU",
  },
  {
    id: "2",
    date: "2023-05-14",
    time: "14:30 PM",
    ambulanceId: "A-456",
    patientName: "Robert Chen",
    condition: "Stable",
    emergencyType: "Accident",
    arrivalTime: "14:52 PM",
    responseTime: "22 min",
    outcome: "Treated and discharged",
  },
  {
    id: "3",
    date: "2023-05-14",
    time: "10:15 AM",
    ambulanceId: "A-789",
    patientName: "Maria Garcia",
    condition: "Needs Oxygen",
    emergencyType: "Breathing Difficulty",
    arrivalTime: "10:35 AM",
    responseTime: "20 min",
    outcome: "Admitted to general ward",
  },
  {
    id: "4",
    date: "2023-05-13",
    time: "19:20 PM",
    ambulanceId: "A-234",
    patientName: "James Wilson",
    condition: "Critical",
    emergencyType: "Stroke",
    arrivalTime: "19:42 PM",
    responseTime: "22 min",
    outcome: "Admitted to ICU",
  },
  {
    id: "5",
    date: "2023-05-12",
    time: "11:05 AM",
    ambulanceId: "A-567",
    patientName: "Emily Davis",
    condition: "Stable",
    emergencyType: "Fracture",
    arrivalTime: "11:30 AM",
    responseTime: "25 min",
    outcome: "Treated and discharged",
  },
];

export default function EmergencyHistory() {
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedDateFilter, setSelectedDateFilter] = useState("All");
  const [selectedConditionFilter, setSelectedConditionFilter] = useState("All");
  const [expandedItem, setExpandedItem] = useState<string | null>(null);

  const dateFilters = [
    "All",
    "Today",
    "Yesterday",
    "Last 7 days",
    "Last 30 days",
  ];
  const conditionFilters = ["All", "Critical", "Stable", "Needs Oxygen"];

  const filteredHistory = mockEmergencyHistory.filter((item) => {
    // Search filter
    const matchesSearch =
      item.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.ambulanceId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.emergencyType.toLowerCase().includes(searchQuery.toLowerCase());

    // Date filter
    let matchesDate = true;
    const itemDate = new Date(item.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const last7Days = new Date(today);
    last7Days.setDate(last7Days.getDate() - 7);

    const last30Days = new Date(today);
    last30Days.setDate(last30Days.getDate() - 30);

    if (selectedDateFilter === "Today") {
      matchesDate = itemDate.toDateString() === today.toDateString();
    } else if (selectedDateFilter === "Yesterday") {
      matchesDate = itemDate.toDateString() === yesterday.toDateString();
    } else if (selectedDateFilter === "Last 7 days") {
      matchesDate = itemDate >= last7Days;
    } else if (selectedDateFilter === "Last 30 days") {
      matchesDate = itemDate >= last30Days;
    }

    // Condition filter
    const matchesCondition =
      selectedConditionFilter === "All" ||
      item.condition === selectedConditionFilter;

    return matchesSearch && matchesDate && matchesCondition;
  });

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

  const toggleItemExpansion = (id: string) => {
    setExpandedItem(expandedItem === id ? null : id);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Feather name="arrow-left" size={24} color={colors.darkGray} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Emergency History</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Navigation Tabs */}
      <View style={styles.tabBar}>
        <TouchableOpacity
          style={styles.tabItem}
          onPress={() => router.replace("/hospital/dashboard")}
        >
          <Feather name="layout" size={20} color={colors.mediumGray} />{" "}
          <Text style={styles.tabText}>Dashboard</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.tabItem}
          onPress={() => router.push("/hospital/real-time-updates")}
        >
          <Feather name="activity" size={20} color={colors.mediumGray} />{" "}
          <Text style={styles.tabText}>Real-Time</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabItem, styles.activeTab]}
          onPress={() => {}}
        >
          <Feather name="list" size={20} color={colors.blue} />{" "}
          <Text style={[styles.tabText, styles.activeTabText]}>History</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <View style={styles.searchContainer}>
          <View style={styles.searchInputContainer}>
            <Feather
              name="search"
              size={18}
              color={colors.mediumGray}
              style={styles.searchIcon}
            />
            <Input
              placeholder="Search by name, ID, or type..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              containerStyle={styles.searchInput}
              inputStyle={styles.input}
            />
          </View>
          <TouchableOpacity
            style={[
              styles.filterButton,
              showFilters && styles.filterButtonActive,
            ]}
            onPress={() => setShowFilters(!showFilters)}
          >
            <Feather
              name="filter"
              size={18}
              color={showFilters ? colors.white : colors.darkGray}
            />
          </TouchableOpacity>
        </View>

        {/* Filters */}
        {showFilters && (
          <View style={styles.filtersContainer}>
            <View style={styles.filterSection}>
              <Text style={styles.filterLabel}>Date Range</Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.filterOptions}
              >
                {dateFilters.map((filter) => (
                  <TouchableOpacity
                    key={filter}
                    style={[
                      styles.filterOption,
                      selectedDateFilter === filter &&
                        styles.filterOptionSelected,
                    ]}
                    onPress={() => setSelectedDateFilter(filter)}
                  >
                    <Text
                      style={[
                        styles.filterOptionText,
                        selectedDateFilter === filter &&
                          styles.filterOptionTextSelected,
                      ]}
                    >
                      {filter}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            <View style={styles.filterSection}>
              <Text style={styles.filterLabel}>Patient Condition</Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.filterOptions}
              >
                {conditionFilters.map((filter) => (
                  <TouchableOpacity
                    key={filter}
                    style={[
                      styles.filterOption,
                      selectedConditionFilter === filter &&
                        styles.filterOptionSelected,
                    ]}
                    onPress={() => setSelectedConditionFilter(filter)}
                  >
                    <Text
                      style={[
                        styles.filterOptionText,
                        selectedConditionFilter === filter &&
                          styles.filterOptionTextSelected,
                      ]}
                    >
                      {filter}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          </View>
        )}

        {/* Results count */}
        <View style={styles.resultsHeader}>
          <Text style={styles.resultsCount}>
            {filteredHistory.length} Records Found
          </Text>
        </View>

        {/* History List */}
        <FlatList
          data={filteredHistory}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
          renderItem={({ item }) => (
            <Card style={styles.historyCard}>
              <TouchableOpacity onPress={() => toggleItemExpansion(item.id)}>
                <CardContent>
                  <View style={styles.historyCardHeader}>
                    <View style={styles.historyCardLeft}>
                      <View
                        style={[
                          styles.conditionIndicator,
                          {
                            backgroundColor: getConditionColor(item.condition),
                          },
                        ]}
                      />
                      <View>
                        <Text style={styles.patientName}>
                          {item.patientName}
                        </Text>
                        <Text style={styles.ambulanceId}>
                          Ambulance #{item.ambulanceId}
                        </Text>
                      </View>
                    </View>
                    <View style={styles.historyCardRight}>
                      <View style={styles.dateContainer}>
                        <Feather
                          name="calendar"
                          size={14}
                          color={colors.mediumGray}
                        />
                        <Text style={styles.dateText}>
                          {formatDate(item.date)}
                        </Text>
                      </View>
                      <Feather
                        name="chevron-down"
                        size={18}
                        color={colors.mediumGray}
                        style={[
                          styles.expandIcon,
                          expandedItem === item.id && styles.expandIconRotated,
                        ]}
                      />
                    </View>
                  </View>

                  <View style={styles.basicInfo}>
                    <View style={styles.infoItem}>
                      <Feather
                        name="alert-triangle"
                        size={14}
                        color={colors.mediumGray}
                      />
                      <Text style={styles.infoText}>{item.emergencyType}</Text>
                    </View>
                    <View style={styles.infoItem}>
                      <Feather
                        name="clock"
                        size={14}
                        color={colors.mediumGray}
                      />
                      <Text style={styles.infoText}>{item.time}</Text>
                    </View>
                  </View>

                  {expandedItem === item.id && (
                    <View style={styles.expandedContent}>
                      <View style={styles.divider} />

                      <View style={styles.detailsGrid}>
                        <View style={styles.detailItem}>
                          <Text style={styles.detailLabel}>Condition</Text>
                          <Text
                            style={[
                              styles.detailValue,
                              { color: getConditionColor(item.condition) },
                            ]}
                          >
                            {item.condition}
                          </Text>
                        </View>

                        <View style={styles.detailItem}>
                          <Text style={styles.detailLabel}>Arrival Time</Text>
                          <Text style={styles.detailValue}>
                            {item.arrivalTime}
                          </Text>
                        </View>

                        <View style={styles.detailItem}>
                          <Text style={styles.detailLabel}>Response Time</Text>
                          <Text style={styles.detailValue}>
                            {item.responseTime}
                          </Text>
                        </View>

                        <View style={styles.detailItem}>
                          <Text style={styles.detailLabel}>Outcome</Text>
                          <Text style={styles.detailValue}>{item.outcome}</Text>
                        </View>
                      </View>

                      <TouchableOpacity
                        style={styles.viewDetailsButton}
                        onPress={() => {
                          // Navigate to detailed view
                          console.log(`View details for ${item.id}`);
                        }}
                      >
                        <Text style={styles.viewDetailsText}>
                          View Full Details
                        </Text>
                      </TouchableOpacity>
                    </View>
                  )}
                </CardContent>
              </TouchableOpacity>
            </Card>
          )}
        />
      </View>
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
    padding: spacing.md,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: spacing.md,
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.white,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.sm,
    ...shadows.sm,
  },
  searchIcon: {
    marginRight: spacing.xs,
  },
  searchInput: {
    flex: 1,
    marginBottom: 0,
  },
  input: {
    borderWidth: 0,
    backgroundColor: "transparent",
    height: 40,
  },
  filterButton: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.md,
    backgroundColor: colors.white,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: spacing.sm,
    ...shadows.sm,
  },
  filterButtonActive: {
    backgroundColor: colors.blue,
  },
  filtersContainer: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.md,
    ...shadows.sm,
  },
  filterSection: {
    marginBottom: spacing.sm,
  },
  filterLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: colors.darkGray,
    marginBottom: spacing.xs,
  },
  filterOptions: {
    flexDirection: "row",
  },
  filterOption: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
    backgroundColor: colors.lightGray,
    marginRight: spacing.xs,
  },
  filterOptionSelected: {
    backgroundColor: colors.blue,
  },
  filterOptionText: {
    fontSize: 12,
    color: colors.darkGray,
  },
  filterOptionTextSelected: {
    color: colors.white,
    fontWeight: "500",
  },
  resultsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.sm,
  },
  resultsCount: {
    fontSize: 14,
    color: colors.mediumGray,
  },
  listContainer: {
    paddingBottom: spacing.xl,
  },
  historyCard: {
    marginBottom: spacing.md,
    borderLeftWidth: 4,
    borderLeftColor: colors.blue,
  },
  historyCardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  historyCardLeft: {
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
  historyCardRight: {
    flexDirection: "row",
    alignItems: "center",
  },
  dateContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: spacing.sm,
  },
  dateText: {
    fontSize: 12,
    color: colors.mediumGray,
    marginLeft: 4,
  },
  expandIcon: {
    transition: "0.3s",
  },
  expandIconRotated: {
    transform: [{ rotate: "180deg" }],
  },
  basicInfo: {
    flexDirection: "row",
    marginTop: spacing.sm,
  },
  infoItem: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: spacing.md,
  },
  infoText: {
    fontSize: 12,
    color: colors.darkGray,
    marginLeft: 4,
  },
  expandedContent: {
    marginTop: spacing.md,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginBottom: spacing.md,
  },
  detailsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  detailItem: {
    width: "50%",
    marginBottom: spacing.sm,
  },
  detailLabel: {
    fontSize: 12,
    color: colors.mediumGray,
  },
  detailValue: {
    fontSize: 14,
    fontWeight: "500",
    color: colors.darkGray,
  },
  viewDetailsButton: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: spacing.sm,
    backgroundColor: colors.lightGray,
    borderRadius: borderRadius.md,
    marginTop: spacing.sm,
  },
  viewDetailsText: {
    fontSize: 14,
    color: colors.blue,
    fontWeight: "500",
  },
});
