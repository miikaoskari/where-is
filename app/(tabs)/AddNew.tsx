import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedTextInput } from "@/components/ThemedTextInput";
import { IconSymbol } from "@/components/ui/IconSymbol";
import React, { useState } from "react";
import { StyleSheet, Button, ScrollView, View, Text, Alert, KeyboardAvoidingView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

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
        <IconSymbol
          size={310}
          color="#808080"
          name="chevron.left.forwardslash.chevron.right"
          style={styles.headerImage}
        />
      }>
      <KeyboardAvoidingView>
        <ThemedText type="defaultSemiBold">Title</ThemedText>
        <ThemedTextInput value={title} onChangeText={setTitle}/>
        <ThemedText type="defaultSemiBold">Description</ThemedText>
        <ThemedTextInput value={description} onChangeText={setDescription}/>

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
});