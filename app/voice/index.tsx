import React, { useEffect } from "react";
import {
  View,
  Button,
  StyleSheet,
  Text,
  DeviceEventEmitter,
} from "react-native";

import {
  VoiceCommandService,
  newCommandRecognizedEvent,
} from "../services/voiceCommandService";
import { SpeechService } from "../services/speechService";

export default function VoiceScreen() {
  const [recognizedText, setRecognizedText] = React.useState<string>("");
 
  useEffect(() => {
    const sub = DeviceEventEmitter.addListener(
      newCommandRecognizedEvent,
      setRecognizedText,
    );

    VoiceCommandService.init();

    return () => {
      VoiceCommandService.deinit().then(() => {
        sub.remove();
      });
    };
  }, []);

  return (
    <View style={styles.container}>
      <Button title="Negativ" onPress={() => SpeechService.speak("Ihr Test ist negativ!")} />
      <Button title="Positiv" onPress={() => SpeechService.speak("Ihr Test ist positiv!")} />
      <Button
        title="Nicht analysiert"
        onPress={() => SpeechService.speak("Ihr Test konnte nicht analysiert werden!")}
      />

      <View style={styles.spacer} />
      <Text style={styles.logText}>🗣️ Letztes Kommando:</Text>
      <Text style={styles.logText}>{recognizedText}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    gap: 20,
    paddingHorizontal: 20,
  },
  spacer: {
    height: 30,
  },
  logText: {
    marginTop: 10,
    fontSize: 16,
    color: "#555",
    textAlign: "center",
  },
});
