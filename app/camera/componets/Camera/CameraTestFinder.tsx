import { useCallback } from "react";
import { StyleSheet, Text } from "react-native";
import { Camera as VisionCamera } from "react-native-vision-camera";
import { useFindTestFrameProcessor } from "@/lib/identifyTest";
import { useCamera } from "@/app/camera/componets/Camera/useCamera";

export default function CameraTestFinder() {
  const camera = useCamera();

  const handleTestIdentified = useCallback(() => {
    alert("test identified. call api here");
    camera.takePhoto().then((photo) => console.log(photo));
  }, [camera]);

  const findTestInFrame = useFindTestFrameProcessor(handleTestIdentified);

  if (!camera.hasPermission) {
    return <Text>No permission</Text>;
  }

  if (camera.device == null) {
    return <Text>No device</Text>;
  }

  return (
    <VisionCamera
      style={StyleSheet.absoluteFill}
      device={camera.device}
      isActive
      photo
      fps={15}
      frameProcessor={findTestInFrame}
      ref={camera.ref}
    />
  );
}
