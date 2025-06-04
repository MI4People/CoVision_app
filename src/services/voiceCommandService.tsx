import Voice from "@react-native-voice/voice";
import { DeviceEventEmitter } from "react-native";
import { Audio, AVPlaybackNativeSource } from "expo-av";
import { ValidCommands } from "@/src/services/constants";

export const newCommandRecognizedEvent = "new.command.recognized";

export class VoiceCommandService {
  static async init() {
    await this.start();
    Voice.onSpeechResults = (event) => {
      const spoken = event.value?.at(-1)?.toLowerCase() || "";

      if (spoken.includes(ValidCommands.NewTest)) {
        this.emitNewCommandEvent(ValidCommands.NewTest);
        this.restart();
      }

      if (spoken.includes(ValidCommands.LastResult)) {
        this.emitNewCommandEvent(ValidCommands.LastResult);
        this.restart();
      }
    };
  }

  static async restart() {
    await this.stop();
    await this.start();
  }

  static async start() {
    try {
      await Voice.start("de-DE");
    } catch (err) {
      console.error("failed to start voice recognition:", err);
    }
  }

  static async stop() {
    try {
      await Voice.stop();
    } catch (err) {
      console.error("failed to stop voice recognition:", err);
    }
  }

  static async deinit() {
    try {
      await Voice.stop();
      await Voice.destroy();
      Voice.removeAllListeners();
    } catch (err) {
      console.error("failed to stop voice recognition:", err);
    }
  }

  private static emitNewCommandEvent(command: string) {
    const newCommandSound = require("../../assets/sounds/new-command.mp3");
    this.playSound(newCommandSound);
    DeviceEventEmitter.emit(newCommandRecognizedEvent, command);
  }

  private static async playSound(source: AVPlaybackNativeSource) {
    const { sound } = await Audio.Sound.createAsync(source);

    await sound.playAsync();
    sound.setOnPlaybackStatusUpdate((status) => {
      if (status.isLoaded && status.didJustFinish) {
        sound.unloadAsync();
      }
    });
  }
}
