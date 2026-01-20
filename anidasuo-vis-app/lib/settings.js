import AsyncStorage from "@react-native-async-storage/async-storage";

const DEFAULT_SETTINGS = {
  speechEnabled: true,
  hapticsEnabled: true,
  speechRate: 0.9,
};

export async function getSettings() {
  const saved = await AsyncStorage.getItem("anidasuo_settings");
  return saved ? JSON.parse(saved) : DEFAULT_SETTINGS;
}

export async function saveSettings(settings) {
  await AsyncStorage.setItem("anidasuo_settings", JSON.stringify(settings));
}
