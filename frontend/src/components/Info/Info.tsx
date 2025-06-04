import { useAppFlow } from "@/src/lib/appFlow/useAppFlow";
import { AccessibilityInfo, StyleProp, Text, TextStyle } from "react-native";
import { useEffect } from "react";
import { AppState } from "@/src/lib/appFlow/appFlow";

interface InfoProps {
  style?: TextStyle;
}

const announcements: Record<AppState, string> = {
  identifying: "Suche Test. Platzieren Sie den Test vor der Kamera",
  waitingForResults: "Test gefunden. Prüfe Ergebnisse",
  resultPositive: "Ihr Test ist positiv",
  resultNegative: "Ihr Test ist negativ",
  error: "Test nicht gefunden. Bitte versuchen Sie es erneut",
};

export const Info = ({ style }: InfoProps) => {
  const { state } = useAppFlow();

  useEffect(() => {
    AccessibilityInfo.announceForAccessibility(announcements[state]);
  }, [state]);

  if (!announcements[state]) return null;

  return (
    <Text style={info(style)} role="alert">
      {announcements[state]}
    </Text>
  );
};

const info = (outerStyles?: TextStyle): StyleProp<TextStyle> => ({
  textAlign: "center",
  backgroundColor: "#fff",
  ...outerStyles,
});
