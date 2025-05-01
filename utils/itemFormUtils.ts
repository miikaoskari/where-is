import * as ImagePicker from "expo-image-picker";
import * as Location from "expo-location";
import { Alert } from "react-native";
import * as Haptics from "expo-haptics";

export const pickImage = async (): Promise<string | undefined> => {
  let result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsEditing: true,
    aspect: [4, 3],
    quality: 1,
  });

  if (!result.canceled) {
    return result.assets[0].uri;
  }
  return undefined;
};

export const takePhoto = async (): Promise<string | undefined> => {
  const { status } = await ImagePicker.requestCameraPermissionsAsync();
  if (status !== "granted") {
    Alert.alert("Permission required", "Camera permission is needed.");
    return undefined;
  }

  const result = await ImagePicker.launchCameraAsync({
    allowsEditing: true,
    aspect: [4, 3],
    quality: 1,
  });

  if (!result.canceled) {
    return result.assets[0].uri;
  }
  return undefined;
};

export const handleMapPress = (event: any, setLatitude: (lat: number) => void, setLongitude: (lng: number) => void) => {
  const { latitude, longitude } = event.nativeEvent.coordinate;
  setLatitude(latitude);
  setLongitude(longitude);
  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
};

export const showImageSourceOptions = (
  onTakePhoto: () => void,
  onPickImage: () => void
) => {
  Alert.alert("Add Image", "Choose a source", [
    { text: "Take Photo", onPress: onTakePhoto },
    { text: "Choose from Library", onPress: onPickImage },
    { text: "Cancel", style: "cancel" },
  ]);
};

export const getCurrentLocation = async () => {
  let { status } = await Location.requestForegroundPermissionsAsync();
  if (status !== "granted") {
    Alert.alert(
      "Permission Denied",
      "Location permission is required to use this feature."
    );
    return null;
  }

  let location = await Location.getCurrentPositionAsync({});
  return {
    latitude: location.coords.latitude,
    longitude: location.coords.longitude,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  };
};

export const createInitialRegionFromLocation = (latitude: number, longitude: number) => {
  return {
    latitude: latitude - 0.0015, // offset upwards
    longitude: longitude,
    latitudeDelta: 0.005,
    longitudeDelta: 0.005,
  };
};

export const validateItemForm = (title: string, description: string): boolean => {
  if (!title || !description) {
    Alert.alert("Error", "Please fill in all fields.");
    return false;
  }
  return true;
};
