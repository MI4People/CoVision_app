import { StyleSheet, View } from "react-native";
import { useFindTestFrameProcessor } from "@/src/lib/identifyTest/identifyTest";
import { Info } from "@/src/components/Info/Info";
import { useAppFlow } from "@/src/lib/appFlow/useAppFlow";
import { CameraFinder } from "@/src/components/CameraFinder/CameraFinder";

export default function TestIdentifier() {
  const { identified, negative, state } = useAppFlow();

  const findTestInFrame = useFindTestFrameProcessor(() => {
    identified();
    setTimeout(() => {
      negative();
    }, 5000);
  });

  return (
    <View style={styles.container}>
      <CameraFinder
        frameProcessor={findTestInFrame}
        isActive={state === "identifying"}
      />
      <Info style={styles.info} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "relative",
    height: "100%",
  },
  info: {
    position: "absolute",
    bottom: 80,
    left: 0,
    right: 0,
  },
});
