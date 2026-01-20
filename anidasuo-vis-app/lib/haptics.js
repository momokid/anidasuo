import * as Haptics from "expo-haptics";
import { getSettings } from "./settings";

export async function warnHaptics() {
  const settings = await getSettings();

  if (!settings.hapticsEnabled) return; // 🔺 NEW: haptics toggle support

  Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
}
