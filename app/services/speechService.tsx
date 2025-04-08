import * as Speech from "expo-speech";
import { Locale } from "@/app/services/constants";

export class SpeechService {
    static speak(text: string) {
        Speech.speak(text, { language: Locale.German });
      };
}
