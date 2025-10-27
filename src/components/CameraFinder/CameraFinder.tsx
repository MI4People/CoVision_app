import { Camera } from "@/src/components/CameraFinder/useCamera";
import { Image, StyleSheet, Text } from "react-native";
import {
  Camera as VisionCamera,
  DrawableFrameProcessor,
  FormatFilter,
  useCameraFormat,
} from "react-native-vision-camera";
import { FC } from "react";

interface CameraFinderProps {
  frameProcessor?: DrawableFrameProcessor;
  isActive: boolean;
  camera: Camera;
  snappedPhoto?: string;
}

const formatFilter: FormatFilter[] = [
  { fps: 10 },
  {
    photoResolution: {
      width: 1920,
      height: 1080,
    },
  },
];

export const CameraFinder: FC<CameraFinderProps> = ({
  frameProcessor,
  isActive,
  camera,
  snappedPhoto,
}) => {
  const format = useCameraFormat(camera.device, formatFilter);

  if (!camera.hasPermission) {
    return <Text>No permission</Text>;
  }

  if (camera.device == null) {
    return <Text>No device</Text>;
  }

  if (snappedPhoto) {
    return <Image src={snappedPhoto} style={StyleSheet.absoluteFill} />;
  }

  return (
    <VisionCamera
      style={StyleSheet.absoluteFill}
      device={camera.device}
      isActive={isActive}
      photo={true}
      exposure={-1}
      format={format}
      fps={10}
      frameProcessor={frameProcessor}
      ref={camera.ref}
    />
  );
};
