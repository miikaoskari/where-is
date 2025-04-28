import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedTextInput } from "@/components/ThemedTextInput";
import React, { useState } from "react";
import { Text, StyleSheet, Button, Alert, KeyboardAvoidingView, TouchableOpacity, View, Image } from "react-native";
import MapView from "react-native-maps";

export default function EditItem() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [imageUri, setImageUri] = useState<string | null>(null);

  const handleAddImage = () => {
    // Simulate adding an image
    setImageUri("https://placehold.co/600x400.png");
  };

  const handleSave = () => {
    if (!title || !description) {
      Alert.alert("Error", "Please fill in all fields.");
      return;
    }
    Alert.alert("Success", "Item saved successfully!");
    // Add logic to save the item
  };

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#D0D0D0', dark: '#353636' }}
      headerImage={
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: 37.78825,
            longitude: -122.4324,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
        />
      }
    >
      <KeyboardAvoidingView style={styles.container}>
        <ThemedText type="title">Edit Item</ThemedText>
        <ThemedTextInput
          placeholder="Item Name"
          value={title}
          onChangeText={setTitle}
          style={styles.input}
        />
        <ThemedTextInput
          placeholder="Description"
          value={description}
          onChangeText={setDescription}
          style={styles.input}
          multiline
        />

        <View style={styles.imageSection}>
          {imageUri ? (
            <Image source={{ uri: imageUri }} style={styles.image} />
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
      </KeyboardAvoidingView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  imageSection: {
    alignItems: "center",
    marginVertical: 16,
  },
  image: {
    width: 150,
    height: 150,
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
  map: {
    width: "100%",
    height: "100%",
  },
});