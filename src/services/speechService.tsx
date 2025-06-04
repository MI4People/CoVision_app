import * as Speech from "expo-speech";

export class SpeechService {
  static speak(text: string) {
    Speech.speak(text, { language: "de-DE" });
  }
}
