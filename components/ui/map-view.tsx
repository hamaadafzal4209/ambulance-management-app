import { StyleSheet, View, type StyleProp, type ViewStyle } from "react-native";
import MapView, {
  Marker,
  Polyline,
  PROVIDER_GOOGLE,
  type Region,
  type MapViewProps,
} from "react-native-maps";
import { colors } from "@/constants/theme";

interface CustomMapViewProps extends MapViewProps {
  style?: StyleProp<ViewStyle>;
  markers?: Array<{
    id: string;
    coordinate: {
      latitude: number;
      longitude: number;
    };
    title?: string;
    description?: string;
    type?: "user" | "ambulance" | "hospital" | "police";
  }>;
  route?: Array<{
    latitude: number;
    longitude: number;
  }>;
  initialRegion?: Region;
}

export function CustomMapView({
  style,
  markers,
  route,
  initialRegion,
  ...props
}: CustomMapViewProps) {
  const defaultRegion = {
    latitude: 37.78825,
    longitude: -122.4324,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  };

  const getMarkerColor = (
    type?: "user" | "ambulance" | "hospital" | "police"
  ) => {
    switch (type) {
      case "user":
        return colors.blue;
      case "ambulance":
        return colors.red;
      case "hospital":
        return colors.success;
      case "police":
        return colors.warning;
      default:
        return colors.blue;
    }
  };

  return (
    <View style={[styles.container, style]}>
      <MapView
        style={styles.map}
        provider={PROVIDER_GOOGLE}
        initialRegion={initialRegion || defaultRegion}
        {...props}
      >
        {markers?.map((marker) => (
          <Marker
            key={marker.id}
            coordinate={marker.coordinate}
            title={marker.title}
            description={marker.description}
            pinColor={getMarkerColor(marker.type)}
          />
        ))}

        {route && route.length > 1 && (
          <Polyline
            coordinates={route}
            strokeColor={colors.blue}
            strokeWidth={4}
          />
        )}
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    overflow: "hidden",
  },
  map: {
    width: "100%",
    height: "100%",
  },
});
