import {
  MutableRefObject,
  useCallback,
  useEffect,
  useMemo,
  useRef,
} from "react";
import { Camera as VisionCamera } from "react-native-vision-camera/lib/typescript/Camera";
import {
  CameraDevice,
  useCameraDevice,
  useCameraPermission,
} from "react-native-vision-camera";

export interface Camera {
  device: CameraDevice | undefined;
  hasPermission: boolean;
  ref: MutableRefObject<VisionCamera | null>;
  takePhoto: () => Promise<string>;
  requestPermission: () => Promise<boolean>;
}

export function useCamera() {
  const camera = useRef<VisionCamera | null>(null);
  const device = useCameraDevice("back", {
    physicalDevices: [
      "ultra-wide-angle-camera",
      "wide-angle-camera",
      "telephoto-camera",
    ],
  });
  const { hasPermission, requestPermission } = useCameraPermission();

  const takePhoto = useCallback(async () => {
    const result = await camera.current?.takePhoto();

    return result?.path ?? "";
  }, [camera]);

  useEffect(() => {
    requestPermission();
  }, [requestPermission]);

  return useMemo<Camera>(
    () => ({
      hasPermission,
      device,
      ref: camera,
      takePhoto,
      requestPermission,
    }),
    [camera, takePhoto, requestPermission, hasPermission, device],
  );
}
