import { ThemedText } from "@/components/ThemedText";
import { ThemedTextInput } from "@/components/ThemedTextInput";
import React, { useState, useEffect, useRef, useMemo } from "react";
import {
  Text,
  StyleSheet,
  Button,
  KeyboardAvoidingView,
  TouchableOpacity,
  View,
  Image,
  Platform,
  useColorScheme,
} from "react-native";
import MapView, { Marker } from "react-native-maps";
import { createItem } from "@/database/database";
import { ThemedView } from "@/components/ThemedView";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import * as Haptics from 'expo-haptics';
import { useRouter } from "expo-router";
import {
  pickImage,
  takePhoto,
  handleMapPress,
  showImageSourceOptions,
  getCurrentLocation,
  validateItemForm
} from "@/utils/itemFormUtils";

export default function AddNew() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState<string | undefined>(undefined);
  const [latitude, setLatitude] = useState<number | undefined>(undefined);
  const [longitude, setLongitude] = useState<number | undefined>(undefined);
  const [initialRegion, setInitialRegion] = useState<any>(null);

  const bottomSheetRef = useRef(null);
  const snapPoints = useMemo(() => ["25%", "75%"], []);
  const isDarkMode = useColorScheme() === "dark";

  const router = useRouter();

  useEffect(() => {
    const loadCurrentLocation = async () => {
      const location = await getCurrentLocation();
      if (location) {
        setInitialRegion(location);
      }
    };
    
    loadCurrentLocation();
  }, []);

  const handlePickImage = async () => {
    const uri = await pickImage();
    if (uri) setImage(uri);
  };

  const handleTakePhoto = async () => {
    const uri = await takePhoto();
    if (uri) setImage(uri);
  };

  const handleAddImage = () => {
    showImageSourceOptions(handleTakePhoto, handlePickImage);
  };

  const handleSave = async () => {
    if (!validateItemForm(title, description)) return;

    try {
      await createItem(title, description, image, latitude, longitude);
      router.back();
    } catch (error) {
      console.error("Error saving item:", error);
      alert("Failed to save the item.");
    }
  };

  const onMapLongPress = (event: any) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    handleMapPress(event, setLatitude, setLongitude);
  };

  return (
    <GestureHandlerRootView>
      <ThemedView lightColor="#FFFFFF" darkColor="#1C1C1E" style={{ flex: 1 }}>
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          keyboardVerticalOffset={100}
        >
          <MapView
            style={StyleSheet.absoluteFillObject}
            showsUserLocation={true}
            initialRegion={initialRegion}
            onLongPress={onMapLongPress}
          >
            {latitude !== undefined && longitude !== undefined && (
              <Marker coordinate={{ latitude, longitude }} />
            )}
          </MapView>

          <BottomSheet
            ref={bottomSheetRef}
            index={1}
            snapPoints={snapPoints}
            enablePanDownToClose={false}
            keyboardBehavior="interactive"
            backgroundStyle={{
              backgroundColor: isDarkMode ? "#1C1C1E" : "#FFFFFF",
            }}
          >
            <BottomSheetView style={styles.sheetContent}>
              <ThemedText type="title">Add New Item</ThemedText>

              <ThemedTextInput
                placeholder="Item Name"
                value={title}
                onChangeText={setTitle}
              />
              <ThemedTextInput
                placeholder="Description"
                value={description}
                onChangeText={setDescription}
              />

              <View style={styles.imageSection}>
                {image ? (
                  <Image source={{ uri: image }} style={styles.image} />
                ) : (
                  <Text style={styles.placeholderText}>No image selected</Text>
                )}
                <Button title="Add Image" onPress={handleAddImage} />
              </View>

              <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                <ThemedText type="default" darkColor="black" lightColor="white">
                  Save
                </ThemedText>
              </TouchableOpacity>
            </BottomSheetView>
          </BottomSheet>
        </KeyboardAvoidingView>
      </ThemedView>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 32,
  },
  content: {
    paddingHorizontal: 16,
    paddingTop: 24,
    gap: 12,
  },
  map: {
    width: "100%",
    aspectRatio: 4 / 3,
  },
  imageSection: {
    alignItems: "center",
    marginVertical: 16,
  },
  image: {
    width: "100%",
    aspectRatio: 4 / 3,
    borderRadius: 8,
    marginBottom: 8,
  },
  placeholderText: {
    fontSize: 14,
    color: "#888",
    marginBottom: 8,
  },
  saveButton: {
    backgroundColor: "#007AFF",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  sheetContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 32,
    gap: 12,
  },
});
