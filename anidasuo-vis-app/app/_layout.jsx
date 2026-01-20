import colors from "@/constants/colors";
import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: "#004AAD",
        },
        headerTintColor: "#fff",
        headerTitleStyle: {
          fontSize: 20,
          fontWeight: "bold",
        },
        contentStyle: {
          paddingHorizontal: 0,
          paddingTop: 0,
          backgroundColor: colors.backgroundLight,
        },
      }}
    >
      <Stack.Screen name="index" options={{ title: "Anidasuo Vis-App" }} />
      {/* <Stack.Screen name="notes" options={{ headerTitle: "Notes" }} /> */}
    </Stack>
  );
}
