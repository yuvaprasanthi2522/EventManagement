import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="AddEvent" options={{ title: "Add Event" }} />
      <Stack.Screen name="EditEvent" options={{ title: "Edit Event" }} />
      <Stack.Screen name="Details" options={{ title: "Event Details" }} />
      {/* <Stack.Screen name="modal" options={{ presentation: "modal" }} /> */}
    </Stack>
  );
}
