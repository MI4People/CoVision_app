import { useAppFlow } from "@/src/lib/appFlow/useAppFlow";
import { AccessibilityInfo, StyleProp, Text, TextStyle } from "react-native";
import { useEffect, useRef } from "react";
import { AppState } from "@/src/lib/appFlow/appFlow";

interface InfoProps {
  style?: TextStyle;
}

const generalAnnouncement = `Diese App kann Coronatests und Schwangerschaftstests analysieren und liest die Ergebnisse vor. 
    Bitte halte dein Smartphone über einen Test. 
    Coronatests können automatisch erkannt werden. 
    Zum manuellen Starten der Analyse bitte auf den Bildschirm doppeltippen.`;

const announcements: Record<AppState, string> = {
  identifying: "Suche Test. Platzieren Sie den Test vor der Kamera",
  waitingForResults: "Analyse gestartet. Prüfe Ergebnisse",
  resultPositive: "Ihr Test ist positiv",
  resultNegative: "Ihr Test ist negativ",
  error: "Test nicht gefunden. Bitte versuchen Sie es erneut",
};

export const Info = ({ style }: InfoProps) => {
  const { state } = useAppFlow();

  const firstTime = useRef(true);

  useEffect(() => {
    if (firstTime.current) {
      AccessibilityInfo.announceForAccessibility(
        generalAnnouncement + " " + announcements[state],
      );
      firstTime.current = false;
      return;
    }
    AccessibilityInfo.announceForAccessibility(announcements[state]);
  }, [state]);

  if (!announcements[state]) return null;

  return (
    <Text style={info(style)} role="alert">
      {firstTime.current
        ? generalAnnouncement + " " + announcements[state]
        : announcements[state]}
    </Text>
  );
};

const info = (outerStyles?: TextStyle): StyleProp<TextStyle> => ({
  textAlign: "center",
  backgroundColor: "#fff",
  ...outerStyles,
});
