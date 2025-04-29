import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedTextInput } from "@/components/ThemedTextInput";
import React, { useState } from "react";
import { Text, StyleSheet, Button, Alert, KeyboardAvoidingView, TouchableOpacity, View, Image } from "react-native";
import MapView from "react-native-maps";
import * as ImagePicker from 'expo-image-picker';

export default function EditItem() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState<string | null>(null);

  const handleAddImage = async () => {
    // No permissions request is necessary for launching the image library
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

  const handleSave = () => {
    if (!title || !description) {
      Alert.alert("Error", "Please fill in all fields.");
      return;
    }
    Alert.alert("Success", "Item saved successfully!");
    // Add logic to save the item
  };

  const handleDelete = () => {
    Alert.alert(
      "Delete?",
      "Are you sure you want to delete the item?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Delete", style: "destructive", onPress: () => console.log("Item deleted") },
      ]
    );
  }

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
          lightColor="#F2F2F2"
          darkColor="#2C2C2C"
          placeholderLightColor="#888888"
          placeholderDarkColor="#CCCCCC"
        />
        <ThemedTextInput
          placeholder="Description"
          value={description}
          onChangeText={setDescription}
          multiline
          lightColor="#F2F2F2"
          darkColor="#2C2C2C"
          placeholderLightColor="#888888"
          placeholderDarkColor="#CCCCCC"
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

        <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
          <ThemedText type="default" darkColor="red" lightColor="red">
            Delete
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
  deleteButton: {
    backgroundColor: "#F2F2F7",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  map: {
    width: "100%",
    height: "100%",
  },
});