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

export function speakDistance(distance, direction = "center") {
  let message = "Obstacle ahead";

  if (distance === "near") {
    message = "Obstacle is very close";
  } else if (distance === "medium") {
    message = "Obstacle is about two metres ahead";
  } else if (distance === "far") {
    message = "Obstacle is far ahead";
  }

  if (direction !== "center") {
    message += ` on your ${direction}`;
  }

  speak(message); //spoken distance-aware feedback
}
