import { ThemedText } from "@/components/ThemedText";
import { ThemedTextInput } from "@/components/ThemedTextInput";
import React, { useState, useEffect, useRef, useMemo } from "react";
import { Text, StyleSheet, Button, Alert, KeyboardAvoidingView, TouchableOpacity, View, Image, ScrollView, Platform } from "react-native";
import MapView, { Marker } from "react-native-maps";
import * as ImagePicker from 'expo-image-picker';
import { createItem } from "@/database/database";
import * as Location from 'expo-location';
import { ThemedView } from "@/components/ThemedView";
import BottomSheet from '@gorhom/bottom-sheet';

export default function AddNew() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState<string | undefined>(undefined);
  const [latitude, setLatitude] = useState<number | undefined>(undefined);
  const [longitude, setLongitude] = useState<number | undefined>(undefined);
  const [initialRegion, setInitialRegion] = useState<any>(null);

  const bottomSheetRef = useRef(null);
  const snapPoints = useMemo(() => ['25%', '75%'], []);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert("Permission Denied", "Location permission is required to use this feature.");
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setInitialRegion({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      });
    })();
  }, []);

  const handleAddImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images', 'videos'],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    console.log(result);

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const handleSave = async () => {
    if (!title || !description) {
        Alert.alert("Error", "Please fill in all fields.");
        return;
    }

    try {
        await createItem(title, description, image, latitude, longitude);

        Alert.alert("Success", "Item saved successfully!");
        setTitle("");
        setDescription("");
        setImage(undefined);
    } catch (error) {
        console.error("Error saving item:", error);
        Alert.alert("Error", "Failed to save the item.");
    }
  };

  const handleMapPress = (event: any) => {
    const { latitude, longitude } = event.nativeEvent.coordinate;
    setLatitude(latitude);
    setLongitude(longitude);
  };

return (
  <ThemedView lightColor="#FFFFFF" darkColor="#1C1C1E" style={{ flex: 1 }}>
  <KeyboardAvoidingView
    style={{ flex: 1 }}
    behavior={Platform.OS === "ios" ? "padding" : undefined}
    keyboardVerticalOffset={100}
  >
    <ScrollView contentContainerStyle={[styles.scrollContainer]}>
      <MapView
        style={styles.map}
        showsUserLocation={true}
        initialRegion={initialRegion}
        onLongPress={handleMapPress}
      >
        {latitude && longitude && (
          <Marker coordinate={{ latitude, longitude }} />
        )}
      </MapView>

      <View style={styles.content}>
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
          multiline
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
      </View>
    </ScrollView>
  </KeyboardAvoidingView>
  </ThemedView>
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
});
