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

export function speakDistance(object, direction, distance_label) {
  // if (!message) return;
  // speak(message);

  if (!object) return;

  let message = `${object} ahead`;

  if (distance_label) {
    message += `, ${distance_label}`;
  }

  if (direction && direction !== "center") {
    message += `${object} on your ${direction}`;
  }

  speak(message);
}
