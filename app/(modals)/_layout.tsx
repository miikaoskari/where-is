import React from 'react';
import { Stack, useNavigation } from 'expo-router';
import { Button } from 'react-native';

export default function ModalLayout() {
  const navigation = useNavigation();

  return (
    <Stack
      screenOptions={{
        headerShown: true,
        headerBackButtonMenuEnabled: true,
        headerLeft: () => (
          <Button
            title="Back"
            onPress={() => navigation.goBack()}
          />
        ),
      }}
    >
      <Stack.Screen
        name="EditItem"
        options={{
          title: "Edit Item",
        }}
      />
      <Stack.Screen
        name="AddNew"
        options={{
          title: "Add New Item",
        }}
      />
    </Stack>
  );
}