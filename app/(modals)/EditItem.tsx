import { ThemedText } from "@/components/ThemedText";
import { ThemedTextInput } from "@/components/ThemedTextInput";
import React, { useState, useEffect, useRef, useMemo } from "react";
import {
  Text,
  StyleSheet,
  Button,
  Alert,
  KeyboardAvoidingView,
  TouchableOpacity,
  View,
  Image,
  Platform,
  useColorScheme,
} from "react-native";
import MapView, { Marker } from "react-native-maps";
import { updateItem } from "@/database/database";
import { ThemedView } from "@/components/ThemedView";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import * as Haptics from "expo-haptics";
import { useLocalSearchParams } from "expo-router";
import { getItemById, getItemPhotoByItemId, getItemLocationByItemId, deleteItem } from "@/database/database";
import { useRouter } from "expo-router";
import { 
  pickImage, 
  takePhoto, 
  handleMapPress, 
  showImageSourceOptions, 
  createInitialRegionFromLocation, 
  validateItemForm
} from "@/utils/itemFormUtils";

interface Item {
  id: number;
  name: string;
  description: string;
  created_at: string;
}

interface Location {
  id: number;
  item_id: number;
  latitude: number;
  longitude: number;
}

interface Photo {
  id: number;
  item_id: number;
  photo_uri: string;
}

export default function EditItem() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState<string | undefined>(undefined);
  const [latitude, setLatitude] = useState<number | undefined>(undefined);
  const [longitude, setLongitude] = useState<number | undefined>(undefined);
  const [initialRegion, setInitialRegion] = useState<any>(null);

  const { id } = useLocalSearchParams<{ id: string }>();
  const itemId = id ? parseInt(id) : undefined;
  const [isLoading, setIsLoading] = useState(true);

  const router = useRouter();

  const bottomSheetRef = useRef(null);
  const snapPoints = useMemo(() => ["25%", "75%"], []);
  const isDarkMode = useColorScheme() === "dark";

  useEffect(() => {
    const loadItem = async () => {
      if (!itemId) return;
      
      setIsLoading(true);
      try {
        // Fetch item details
        const item = await getItemById(itemId) as Item;
        if (item) {
          setTitle(item.name);
          setDescription(item.description);
          
          // Fetch associated photo if exists
          const photo = await getItemPhotoByItemId(itemId) as Photo;
          if (photo) {
            setImage(photo.photo_uri);
          }
          
          // Fetch associated location if exists
          const locations = await getItemLocationByItemId(itemId) as Location;
          if (locations) {
            setLatitude(locations.latitude);
            setLongitude(locations.longitude);
            
            // Update map initial region using utility function
            setInitialRegion(createInitialRegionFromLocation(locations.latitude, locations.longitude));
          }
        }
      } catch (error) {
        console.error("Error loading item:", error);
        Alert.alert("Error", "Failed to load item details");
      } finally {
        setIsLoading(false);
      }
    };
    
    loadItem();
  }, [itemId]);

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
      if (!itemId) {
        Alert.alert("Error", "Item ID is not valid.");
        return;
      }
      await updateItem(itemId, title, description, image, latitude, longitude);

    } catch (error) {
      console.error("Error saving item:", error);
      Alert.alert("Error", "Failed to save the item.");
    }
  };

  const onMapLongPress = (event: any) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    handleMapPress(event, setLatitude, setLongitude);
  };

  const handleDelete = () => {
    if (!itemId) return;
    
    Alert.alert("Delete?", "Are you sure you want to delete the item?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            await deleteItem(itemId);
            Alert.alert("Success", "Item deleted successfully");
            // Navigate back after deletion
            router.back();
          } catch (error) {
            console.error("Error deleting item:", error);
            Alert.alert("Error", "Failed to delete item");
          }
        },
      },
    ]);
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
            {latitude && longitude && (
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
              <ThemedText type="title">Edit Item</ThemedText>
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

              <TouchableOpacity
                style={styles.deleteButton}
                onPress={handleDelete}
              >
                <ThemedText type="default" darkColor="red" lightColor="red">
                  Delete
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
  deleteButton: {
    backgroundColor: "#F2F2F7",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
  },
});
