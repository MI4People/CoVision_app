import { Camera } from "@/src/components/CameraFinder/useCamera";
import { StyleSheet, Text } from "react-native";
import {
  Camera as VisionCamera,
  DrawableFrameProcessor,
} from "react-native-vision-camera";
import { FC } from "react";

interface CameraFinderProps {
  frameProcessor: DrawableFrameProcessor;
  isActive: boolean;
  camera: Camera;
}

export const CameraFinder: FC<CameraFinderProps> = ({
  frameProcessor,
  isActive,
  camera,
}) => {
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
      isActive={isActive}
      photo={true}
      fps={5}
      frameProcessor={frameProcessor}
      ref={camera.ref}
    />
  );
};
