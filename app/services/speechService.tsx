import * as Speech from "expo-speech";
import { locale } from "./locale";

export class SpeechService {
  static speak(text: string) {
    Speech.speak(text, { language: locale });
  }
}
