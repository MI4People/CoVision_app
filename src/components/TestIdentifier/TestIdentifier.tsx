import { Pressable, StyleSheet } from "react-native";
import { useFindTestFrameProcessor } from "@/src/lib/identifyTest/identifyTest";
import { Info } from "@/src/components/Info/Info";
import { useAppFlow } from "@/src/lib/appFlow/useAppFlow";
import { CameraFinder } from "@/src/components/CameraFinder/CameraFinder";
import { useCamera } from "@/src/components/CameraFinder/useCamera";
import { identifierService } from "@/src/services/identifierService/identifierService";
import { useCallback } from "react";

const useHandleIdentification = (
  positive: () => void,
  negative: () => void,
  error: () => void,
) =>
  useCallback(
    (result: "positive" | "negative" | "unknown") => {
      if (result === "positive") {
        return positive();
      }

      if (result === "negative") {
        return negative();
      }

      error();
    },
    [error, negative, positive],
  );

export default function TestIdentifier() {
  const { identified, error, negative, positive, reset, state } = useAppFlow();
  const camera = useCamera();

  const handleIdentification = useHandleIdentification(
    positive,
    negative,
    error,
  );

  const identify = useCallback(async () => {
    if (state !== "identifying") {
      return;
    }
    identified();
    console.log("take photo");
    const path = await camera.takePhoto();
    const result = await identifierService.identifyTest(path);
    console.log("Test identified:", result);
    handleIdentification(result);
  }, [camera, handleIdentification, identified, state]);

  const handleClick = useCallback(() => {
    if (state === "identifying") {
      return identify();
    }

    return reset();
  }, [state, reset, identify]);

  const findTestInFrame = useFindTestFrameProcessor(identify);

  return (
    <Pressable style={styles.container} onPress={handleClick}>
      <CameraFinder
        frameProcessor={findTestInFrame}
        isActive={state === "identifying"}
        camera={camera}
      />
      <Info style={styles.info} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "relative",
    height: "100%",
    width: "100%",
  },
  info: {
    position: "absolute",
    bottom: 80,
    left: 0,
    right: 0,
  },
});
