import React from "react";
import { StyleSheet, View } from "react-native";
import MapView, { Marker } from "react-native-maps";

const alerts = [
  {
    id: "1",
    ambulanceId: "A101",
    location: "Riyadh",
    latitude: 24.7136,
    longitude: 46.6753,
    priority: "high",
  },
  {
    id: "2",
    ambulanceId: "A102",
    location: "Jeddah",
    latitude: 21.4858,
    longitude: 39.1925,
    priority: "medium", 
  },
];

export default function AlertsMap() {
  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: 23.8859,
          longitude: 45.0792,
          latitudeDelta: 10,
          longitudeDelta: 10,
        }}
      >
        {alerts.map((alert) => (
          <Marker
            key={alert.id}
            coordinate={{
              latitude: alert.latitude,
              longitude: alert.longitude,
            }}
            title={`Ambulance #${alert.ambulanceId}`}
            description={`Priority: ${alert.priority}`}
            pinColor={
              alert.priority === "high"
                ? "red"
                : alert.priority === "medium"
                ? "orange"
                : "green"
            }
          />
        ))}
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderRadius: 20,
    height: 200,
  },
  map: {
    width: "100%",
    height: 200,
  },
});
