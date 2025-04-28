import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedTextInput } from "@/components/ThemedTextInput";
import { IconSymbol } from "@/components/ui/IconSymbol";
import React, { useState } from "react";
import { StyleSheet, Button, ScrollView, View, Text, Alert, KeyboardAvoidingView } from "react-native";
import MapView from "react-native-maps";
import { TextInput } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ThemedButton } from "@/components/ThemedButton";

export default function AddNew() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const handleAddImage = () => {
    Alert.alert("Add Image", "Image picker functionality goes here.");
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
        <MapView style={styles.map} initialRegion={{
          latitude: 37.78825,
          longitude: -122.4324,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}></MapView>
      }>
      <KeyboardAvoidingView style={styles.kaview}>
        <ThemedText type="title">New Item</ThemedText>
        <ThemedTextInput placeholder="Title" value={title} onChangeText={setTitle}/>
        <ThemedTextInput placeholder="Description" value={description} onChangeText={setDescription}/>

        <Button title="Add Image" onPress={handleAddImage} />
        <Button title="Save" onPress={handleSave} />
      </KeyboardAvoidingView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    color: '#808080',
    bottom: -90,
    left: -35,
    position: 'absolute',
  },
  map: {
    width: '100%',
    height: '100%',
  },
  kaview: {
    flex: 1,
    gap: 6,
  },
});