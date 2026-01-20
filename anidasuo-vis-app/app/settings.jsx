import colors from "@/constants/colors";
import Slider from "@react-native-community/slider";
import { useEffect, useState } from "react";
import { StyleSheet, Switch, Text, View } from "react-native";
import { getSettings, saveSettings } from "../lib/settings";
import { Stack } from "expo-router";

export default function SettingsScreen() {
  const [settings, setSettings] = useState(null);

  useEffect(() => {
    getSettings().then(setSettings);
  }, []);

  if (!settings) return null;

  const update = (key, value) => {
    const updated = { ...settings, [key]: value };
    setSettings(updated);
    saveSettings(updated);
  };

  return (
    <View style={styles.container}>
        <Stack />
      <Text style={styles.title}>Settings</Text>

      <View style={styles.row}>
        <Text style={styles.text}>Speech</Text>
        <Switch
          value={settings.speechEnabled}
          onValueChange={(v) => update("speechEnabled", v)}
        />
      </View>

      <View style={styles.row}>
        <Text style={styles.text}>Haptics</Text>
        <Switch
          value={settings.hapticsEnabled}
          onValueChange={(v) => update("hapticsEnabled", v)}
        />
      </View>

      <Text style={styles.text}>Speech Rate</Text>
      <Slider
        minimumValue={0.5}
        maximumValue={1.2}
        value={settings.speechRate}
        onValueChange={(v) => update("speechRate", v)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: colors.primary,
  },
  title: {
    fontSize: 26,
    color: "#fff",
    marginBottom: 20,
    fontWeight: "bold",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 10,
  },
  text: {
    color: "#fff",
    fontSize: 18,
  },
});
