import * as Speech from "expo-speech";
import { getSettings } from "./settings";

export async function speak(text) {
  const settings = await getSettings();

  if (!settings.speechEnabled || !text) return;

  Speech.stop(); //stop ongoing speech before speaking again

  Speech.speak(text, {
    rate: settings.speechRate,
    pitch: 1.0,
  });
}

export function speakDistance(message) {
  if (!message) return;
  speak(message);
}
