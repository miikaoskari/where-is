import React from 'react';
import { Stack } from 'expo-router';

export default function ModalLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen
        name="EditItem"
        options={{
        }}
      />
      <Stack.Screen
        name="AddNew"
        options={{
        }}
      />
    </Stack>
  );
}