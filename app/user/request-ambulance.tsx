"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dropdown } from "@/components/ui/dropdown";
import { Input } from "@/components/ui/input";
import { NumericInput } from "@/components/ui/numeric-input";
import { Toggle } from "@/components/ui/toggle";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import AlertsMap from "@/components/common/AlertsMap";
import { colors, spacing } from "@/constants/theme";
import { Feather, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";

const emergencyTypes = [
  {
    id: "accident",
    label: "Accident",
    iconLib: Feather,
    iconName: "alert-triangle",
  },
  {
    id: "heart_attack",
    label: "Heart Attack",
    iconLib: Ionicons,
    iconName: "heart",
  },
  {
    id: "breathing",
    label: "Breathing Problem",
    iconLib: MaterialCommunityIcons,
    iconName: "lungs",
  },
  {
    id: "injury",
    label: "Injury/Bleeding",
    iconLib: Feather,
    iconName: "activity",
  },
  {
    id: "unconscious",
    label: "Unconscious Person",
    iconLib: Feather,
    iconName: "user-x",
  },
  {
    id: "other",
    label: "Other Emergency",
    iconLib: Ionicons,
    iconName: "alert-circle",
  },
];

// Form field options for dropdowns
const vehicleTypes = [
  { value: "car", label: "Car" },
  { value: "motorcycle", label: "Motorcycle" },
  { value: "truck", label: "Truck" },
  { value: "bus", label: "Bus" },
  { value: "other", label: "Other" },
];

const breathingDifficultyTypes = [
  { value: "asthma", label: "Asthma" },
  { value: "copd", label: "COPD" },
  { value: "unknown", label: "Unknown" },
  { value: "other", label: "Other" },
];

const injuryLocations = [
  { value: "head", label: "Head" },
  { value: "arm", label: "Arm" },
  { value: "leg", label: "Leg" },
  { value: "torso", label: "Torso" },
  { value: "multiple", label: "Multiple" },
];

const injuryTypes = [
  { value: "bleeding", label: "Bleeding" },
  { value: "fracture", label: "Fracture" },
  { value: "burn", label: "Burn" },
  { value: "laceration", label: "Laceration" },
];

export default function RequestAmbulance() {
  const [currentStep, setCurrentStep] = useState(1);
  const [location, setLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [address, setAddress] = useState("");
  const [addressDetails, setAddressDetails] = useState("");
  const [selectedEmergency, setSelectedEmergency] = useState<string | null>(
    null
  );
  const [additionalInfo, setAdditionalInfo] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Dynamic form fields based on emergency type
  const [emergencyDetails, setEmergencyDetails] = useState<{
    // Accident fields
    vehicleType: string | null;
    injuredCount: string;
    criticalInjuries: boolean;
    trafficObstruction: boolean;
    // Heart attack fields
    isConscious: boolean;
    patientAge: string;
    priorHeartDisease: boolean;
    cprPerformed: boolean;
    // Breathing fields
    breathingDifficultyType: string | null;
    oxygenAvailable: boolean;
    isWheezing: boolean;
    medicalConditions: string;
    // Injury fields
    injuryLocation: string | null;
    injuryType: string | null;
    bleedingControlled: boolean;
    sharpObjectCause: boolean;
    // Unconscious fields
    timeUnconscious: string;
    isBreathingNormally: boolean;
    responsiveToPain: boolean;
    hadSeizure: boolean;
    // Other fields
    emergencyDescription: string;
    isLifeThreatening: boolean;
  }>({
    // Accident fields
    vehicleType: null,
    injuredCount: "",
    criticalInjuries: false,
    trafficObstruction: false,
    // Heart attack fields
    isConscious: true,
    patientAge: "",
    priorHeartDisease: false,
    cprPerformed: false,
    // Breathing fields
    breathingDifficultyType: null,
    oxygenAvailable: false,
    isWheezing: false,
    medicalConditions: "",
    // Injury fields
    injuryLocation: null,
    injuryType: null,
    bleedingControlled: false,
    sharpObjectCause: false,
    // Unconscious fields
    timeUnconscious: "",
    isBreathingNormally: true,
    responsiveToPain: false,
    hadSeizure: false,
    // Other fields
    emergencyDescription: "",
    isLifeThreatening: false,
  });

  useEffect(() => {
    // Simulate getting current location
    setTimeout(() => {
      setLocation({
        latitude: 37.78825,
        longitude: -122.4324,
      });
      setAddress("123 Market St, San Francisco, CA");
    }, 1000);
  }, []);

  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    } else {
      handleSubmit();
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    } else {
      router.back();
    }
  };

  const handleSubmit = () => {
    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      router.push("/user/tracking");
    }, 2000);
  };

  const renderStepOne = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>Confirm Your Location</Text>
      <Text style={styles.stepDescription}>
        {
          " We'll send an ambulance to this location. Please confirm or adjust if needed."
        }
      </Text>

      {Platform.OS !== "web" && (
        <View style={styles.mapContainer}>
          <AlertsMap />
        </View>
      )}

      <View style={styles.locationInfo}>
        <Feather name="map-pin" size={20} color={colors.blue} />
        <Text style={styles.locationText}>
          {address || "Detecting your location..."}
        </Text>
      </View>

      <Input
        label="Address Details (Optional)"
        placeholder="Apartment number, floor, landmark, etc."
        multiline
        numberOfLines={3}
        textAlignVertical="top"
        value={addressDetails}
        onChangeText={setAddressDetails}
      />
    </View>
  );

  const renderDynamicFields = () => {
    if (!selectedEmergency) return null;

    switch (selectedEmergency) {
      case "accident":
        return (
          <View style={styles.dynamicFields}>
            <Text style={styles.dynamicFieldsTitle}>Accident Details</Text>
            <Dropdown
              label="Type of vehicle involved"
              options={vehicleTypes}
              value={emergencyDetails.vehicleType}
              onValueChange={(value) =>
                setEmergencyDetails({ ...emergencyDetails, vehicleType: value })
              }
            />
            <NumericInput
              label="Number of people injured"
              value={emergencyDetails.injuredCount}
              onChangeText={(value) =>
                setEmergencyDetails({
                  ...emergencyDetails,
                  injuredCount: value,
                })
              }
              placeholder="Enter number"
              min={0}
            />
            <Toggle
              label="Are any injuries critical?"
              value={emergencyDetails.criticalInjuries}
              onValueChange={(value) =>
                setEmergencyDetails({
                  ...emergencyDetails,
                  criticalInjuries: value,
                })
              }
            />
            <Toggle
              label="Are vehicles obstructing traffic?"
              value={emergencyDetails.trafficObstruction}
              onValueChange={(value) =>
                setEmergencyDetails({
                  ...emergencyDetails,
                  trafficObstruction: value,
                })
              }
            />
          </View>
        );

      case "heart_attack":
        return (
          <View style={styles.dynamicFields}>
            <Text style={styles.dynamicFieldsTitle}>Heart Attack Details</Text>
            <Toggle
              label="Is the patient conscious?"
              value={emergencyDetails.isConscious}
              onValueChange={(value) =>
                setEmergencyDetails({ ...emergencyDetails, isConscious: value })
              }
            />
            <NumericInput
              label="Age of the patient"
              value={emergencyDetails.patientAge}
              onChangeText={(value) =>
                setEmergencyDetails({ ...emergencyDetails, patientAge: value })
              }
              placeholder="Enter age"
              min={0}
              max={120}
            />
            <Toggle
              label="Any prior history of heart disease?"
              value={emergencyDetails.priorHeartDisease}
              onValueChange={(value) =>
                setEmergencyDetails({
                  ...emergencyDetails,
                  priorHeartDisease: value,
                })
              }
            />
            <Toggle
              label="Is CPR being performed?"
              value={emergencyDetails.cprPerformed}
              onValueChange={(value) =>
                setEmergencyDetails({
                  ...emergencyDetails,
                  cprPerformed: value,
                })
              }
            />
          </View>
        );

      case "breathing":
        return (
          <View style={styles.dynamicFields}>
            <Text style={styles.dynamicFieldsTitle}>
              Breathing Problem Details
            </Text>
            <Dropdown
              label="Type of breathing difficulty"
              options={breathingDifficultyTypes}
              value={emergencyDetails.breathingDifficultyType}
              onValueChange={(value) =>
                setEmergencyDetails({
                  ...emergencyDetails,
                  breathingDifficultyType: value,
                })
              }
            />
            <Toggle
              label="Is oxygen currently available?"
              value={emergencyDetails.oxygenAvailable}
              onValueChange={(value) =>
                setEmergencyDetails({
                  ...emergencyDetails,
                  oxygenAvailable: value,
                })
              }
            />
            <Toggle
              label="Is the patient wheezing or gasping?"
              value={emergencyDetails.isWheezing}
              onValueChange={(value) =>
                setEmergencyDetails({ ...emergencyDetails, isWheezing: value })
              }
            />
            <Input
              label="Known medical conditions?"
              value={emergencyDetails.medicalConditions}
              onChangeText={(value) =>
                setEmergencyDetails({
                  ...emergencyDetails,
                  medicalConditions: value,
                })
              }
              placeholder="Enter any known conditions"
            />
          </View>
        );

      case "injury":
        return (
          <View style={styles.dynamicFields}>
            <Text style={styles.dynamicFieldsTitle}>Injury Details</Text>
            <Dropdown
              label="Injury location on body"
              options={injuryLocations}
              value={emergencyDetails.injuryLocation}
              onValueChange={(value) =>
                setEmergencyDetails({
                  ...emergencyDetails,
                  injuryLocation: value,
                })
              }
            />
            <Dropdown
              label="Injury type"
              options={injuryTypes}
              value={emergencyDetails.injuryType}
              onValueChange={(value) =>
                setEmergencyDetails({ ...emergencyDetails, injuryType: value })
              }
            />
            <Toggle
              label="Is bleeding controlled?"
              value={emergencyDetails.bleedingControlled}
              onValueChange={(value) =>
                setEmergencyDetails({
                  ...emergencyDetails,
                  bleedingControlled: value,
                })
              }
            />
            <Toggle
              label="Was the injury caused by a sharp object?"
              value={emergencyDetails.sharpObjectCause}
              onValueChange={(value) =>
                setEmergencyDetails({
                  ...emergencyDetails,
                  sharpObjectCause: value,
                })
              }
            />
          </View>
        );

      case "unconscious":
        return (
          <View style={styles.dynamicFields}>
            <Text style={styles.dynamicFieldsTitle}>
              Unconscious Person Details
            </Text>
            <Input
              label="Estimated time unconscious"
              value={emergencyDetails.timeUnconscious}
              onChangeText={(value) =>
                setEmergencyDetails({
                  ...emergencyDetails,
                  timeUnconscious: value,
                })
              }
              placeholder="e.g. 5 minutes, unknown"
            />
            <Toggle
              label="Is the person breathing normally?"
              value={emergencyDetails.isBreathingNormally}
              onValueChange={(value) =>
                setEmergencyDetails({
                  ...emergencyDetails,
                  isBreathingNormally: value,
                })
              }
            />
            <Toggle
              label="Is the person responsive to pain?"
              value={emergencyDetails.responsiveToPain}
              onValueChange={(value) =>
                setEmergencyDetails({
                  ...emergencyDetails,
                  responsiveToPain: value,
                })
              }
            />
            <Toggle
              label="Has the person experienced a seizure?"
              value={emergencyDetails.hadSeizure}
              onValueChange={(value) =>
                setEmergencyDetails({ ...emergencyDetails, hadSeizure: value })
              }
            />
          </View>
        );

      case "other":
        return (
          <View style={styles.dynamicFields}>
            <Text style={styles.dynamicFieldsTitle}>Emergency Details</Text>
            <Input
              label="Describe the emergency"
              value={emergencyDetails.emergencyDescription}
              onChangeText={(value) =>
                setEmergencyDetails({
                  ...emergencyDetails,
                  emergencyDescription: value,
                })
              }
              placeholder="Please provide details about the emergency"
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
            <Toggle
              label="Is this life-threatening?"
              value={emergencyDetails.isLifeThreatening}
              onValueChange={(value) =>
                setEmergencyDetails({
                  ...emergencyDetails,
                  isLifeThreatening: value,
                })
              }
            />
          </View>
        );

      default:
        return null;
    }
  };

  const renderStepTwo = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>Emergency Type</Text>
      <Text style={styles.stepDescription}>
        Select the type of emergency to help us send the right assistance.
      </Text>

      <ScrollView style={styles.emergencyTypesContainer}>
        <View style={styles.emergencyGrid}>
          {emergencyTypes.map((type) => {
            const IconComponent = type.iconLib;

            return (
              <TouchableOpacity
                key={type.id}
                style={[
                  styles.emergencyType,
                  selectedEmergency === type.id && styles.selectedEmergencyType,
                ]}
                onPress={() => setSelectedEmergency(type.id)}
              >
                <IconComponent
                  name={type.iconName}
                  size={24}
                  color={
                    selectedEmergency === type.id
                      ? colors.blue
                      : colors.darkGray
                  }
                  style={styles.emergencyIcon}
                />
                <Text
                  style={[
                    styles.emergencyLabel,
                    selectedEmergency === type.id &&
                      styles.selectedEmergencyLabel,
                  ]}
                >
                  {type.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {renderDynamicFields()}

        <Input
          label="Additional Information (Optional)"
          placeholder="Any other details that might help emergency responders..."
          multiline
          numberOfLines={4}
          textAlignVertical="top"
          value={additionalInfo}
          onChangeText={setAdditionalInfo}
        />
      </ScrollView>
    </View>
  );

  // Helper function to render emergency details in summary
  const renderEmergencyDetailsSummary = () => {
    if (!selectedEmergency) return null;

    const renderField = (label: string, value: any) => {
      if (value === null || value === "") return null;

      let displayValue = value;
      if (typeof value === "boolean") {
        displayValue = value ? "Yes" : "No";
      }

      return (
        <View style={styles.summaryDetailItem}>
          <Text style={styles.summaryDetailLabel}>{label}:</Text>
          <Text style={styles.summaryDetailValue}>{displayValue}</Text>
        </View>
      );
    };

    switch (selectedEmergency) {
      case "accident":
        return (
          <View style={styles.summaryDetails}>
            {renderField(
              "Vehicle type",
              vehicleTypes.find((v) => v.value === emergencyDetails.vehicleType)
                ?.label
            )}
            {renderField("People injured", emergencyDetails.injuredCount)}
            {renderField(
              "Critical injuries",
              emergencyDetails.criticalInjuries
            )}
            {renderField(
              "Traffic obstruction",
              emergencyDetails.trafficObstruction
            )}
          </View>
        );
      case "heart_attack":
        return (
          <View style={styles.summaryDetails}>
            {renderField("Patient conscious", emergencyDetails.isConscious)}
            {renderField("Patient age", emergencyDetails.patientAge)}
            {renderField(
              "Prior heart disease",
              emergencyDetails.priorHeartDisease
            )}
            {renderField("CPR being performed", emergencyDetails.cprPerformed)}
          </View>
        );
      case "breathing":
        return (
          <View style={styles.summaryDetails}>
            {renderField(
              "Breathing difficulty type",
              breathingDifficultyTypes.find(
                (b) => b.value === emergencyDetails.breathingDifficultyType
              )?.label
            )}
            {renderField("Oxygen available", emergencyDetails.oxygenAvailable)}
            {renderField("Wheezing/gasping", emergencyDetails.isWheezing)}
            {renderField(
              "Medical conditions",
              emergencyDetails.medicalConditions
            )}
          </View>
        );
      case "injury":
        return (
          <View style={styles.summaryDetails}>
            {renderField(
              "Injury location",
              injuryLocations.find(
                (l) => l.value === emergencyDetails.injuryLocation
              )?.label
            )}
            {renderField(
              "Injury type",
              injuryTypes.find((t) => t.value === emergencyDetails.injuryType)
                ?.label
            )}
            {renderField(
              "Bleeding controlled",
              emergencyDetails.bleedingControlled
            )}
            {renderField(
              "Caused by sharp object",
              emergencyDetails.sharpObjectCause
            )}
          </View>
        );
      case "unconscious":
        return (
          <View style={styles.summaryDetails}>
            {renderField("Time unconscious", emergencyDetails.timeUnconscious)}
            {renderField(
              "Breathing normally",
              emergencyDetails.isBreathingNormally
            )}
            {renderField(
              "Responsive to pain",
              emergencyDetails.responsiveToPain
            )}
            {renderField("Experienced seizure", emergencyDetails.hadSeizure)}
          </View>
        );
      case "other":
        return (
          <View style={styles.summaryDetails}>
            {renderField(
              "Emergency description",
              emergencyDetails.emergencyDescription
            )}
            {renderField(
              "Life-threatening",
              emergencyDetails.isLifeThreatening
            )}
          </View>
        );
      default:
        return null;
    }
  };

  const renderStepThree = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>Confirm Request</Text>
      <Text style={styles.stepDescription}>
        Please review your emergency request details before submitting.
      </Text>

      <Card style={styles.summaryCard}>
        <CardContent>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Location:</Text>
            <Text style={styles.summaryValue}>{address}</Text>
            {addressDetails ? (
              <Text style={styles.summaryValue}>{addressDetails}</Text>
            ) : null}
          </View>

          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Emergency Type:</Text>
            <Text style={styles.summaryValue}>
              {emergencyTypes.find((t) => t.id === selectedEmergency)?.label ||
                "Not specified"}
            </Text>

            {renderEmergencyDetailsSummary()}
          </View>

          {additionalInfo ? (
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Additional Info:</Text>
              <Text style={styles.summaryValue}>{additionalInfo}</Text>
            </View>
          ) : null}
        </CardContent>
      </Card>

      <View style={styles.disclaimerContainer}>
        <Feather name="alert-triangle" size={20} color={colors.warning} />
        <Text style={styles.disclaimerText}>
          By submitting this request, you confirm this is a genuine emergency
          requiring immediate medical assistance.
        </Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <Feather name="arrow-left" size={24} color={colors.darkGray} />
        </TouchableOpacity>
        <View style={styles.stepIndicator}>
          {[1, 2, 3].map((step) => (
            <View
              key={step}
              style={[
                styles.stepDot,
                currentStep === step && styles.activeStepDot,
                currentStep > step && styles.completedStepDot,
              ]}
            />
          ))}
        </View>
        <View style={styles.placeholder} />
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
      >
        {currentStep === 1 && renderStepOne()}
        {currentStep === 2 && renderStepTwo()}
        {currentStep === 3 && renderStepThree()}
      </ScrollView>

      <View style={styles.footer}>
        <Button
          onPress={handleNext}
          style={[styles.nextButton, currentStep === 3 && styles.submitButton]}
          disabled={isLoading}
        >
          <Text style={styles.nextButtonText}>
            {isLoading
              ? "Processing..."
              : currentStep === 3
              ? "Request Ambulance"
              : "Next"}
          </Text>
        </Button>
      </View>
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
  stepIndicator: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
  },
  stepDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.lightGray,
  },
  activeStepDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.blue,
  },
  completedStepDot: {
    backgroundColor: colors.success,
  },
  placeholder: {
    width: 24,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  stepContainer: {
    gap: spacing.lg,
  },
  stepTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: colors.darkGray,
  },
  stepDescription: {
    fontSize: 16,
    color: colors.mediumGray,
    // marginBottom: spacing.md,
  },
  mapContainer: {
    height: 200,
    borderRadius: 12,
  },
  loadingMap: {
    height: 200,
    backgroundColor: colors.lightGray,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 12,
  },
  locationInfo: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.lightGray,
    padding: spacing.md,
    borderRadius: 8,
    marginBottom: spacing.md,
  },
  locationText: {
    marginLeft: spacing.sm,
    flex: 1,
    color: colors.darkGray,
  },
  emergencyTypesContainer: {
    // maxHeight: 300,
  },
  emergencyGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  emergencyType: {
    width: "47%",
    backgroundColor: colors.lightGray,
    borderRadius: 12,
    padding: spacing.md,
    alignItems: "center",
    borderWidth: 2,
    borderColor: "transparent",
  },
  selectedEmergencyType: {
    borderColor: colors.blue,
    backgroundColor: "rgba(25, 118, 210, 0.1)",
  },
  emergencyIcon: {
    fontSize: 24,
    marginBottom: spacing.sm,
  },
  emergencyLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: colors.darkGray,
    textAlign: "center",
  },
  selectedEmergencyLabel: {
    color: colors.blue,
    fontWeight: "600",
  },
  dynamicFields: {
    backgroundColor: colors.lightGray,
    borderRadius: 12,
    padding: spacing.md,
    marginBottom: spacing.lg,
  },
  dynamicFieldsTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.darkGray,
    marginBottom: spacing.md,
  },
  summaryCard: {
    marginBottom: spacing.lg,
  },
  summaryItem: {
    marginBottom: spacing.md,
  },
  summaryLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.mediumGray,
    marginBottom: spacing.xs,
  },
  summaryValue: {
    fontSize: 16,
    color: colors.darkGray,
  },
  summaryDetails: {
    marginTop: spacing.sm,
    marginLeft: spacing.md,
    borderLeftWidth: 2,
    borderLeftColor: colors.lightGray,
    paddingLeft: spacing.md,
  },
  summaryDetailItem: {
    marginBottom: spacing.xs,
    flexDirection: "row",
  },
  summaryDetailLabel: {
    fontSize: 14,
    color: colors.mediumGray,
    marginRight: spacing.xs,
  },
  summaryDetailValue: {
    fontSize: 14,
    color: colors.darkGray,
    flex: 1,
  },
  disclaimerContainer: {
    flexDirection: "row",
    backgroundColor: "rgba(255, 152, 0, 0.1)",
    padding: spacing.md,
    borderRadius: 8,
    alignItems: "flex-start",
  },
  disclaimerText: {
    marginLeft: spacing.sm,
    flex: 1,
    fontSize: 14,
    color: colors.darkGray,
  },
  footer: {
    padding: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  nextButton: {
    backgroundColor: colors.blue,
  },
  submitButton: {
    backgroundColor: colors.red,
  },
  nextButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: "600",
  },
});
