import {
  PaintStyle,
  PointMode,
  Skia,
  type SkPoint,
  vec,
} from "@shopify/react-native-skia";
import {
  ColorConversionCodes,
  ContourApproximationModes,
  MorphShapes,
  MorphTypes,
  ObjectType,
  OpenCV,
  PointVector,
  RetrievalModes,
} from "react-native-fast-opencv";
import { useResizePlugin } from "vision-camera-resize-plugin";
import {
  DrawableFrame,
  useSkiaFrameProcessor,
} from "react-native-vision-camera";
import { useState } from "react";
import { useRunOnJS } from "react-native-worklets-core";
import { useCallOnceStable } from "@/lib/useCallOnceStable";

const paint = Skia.Paint();
const border = Skia.Paint();

paint.setStyle(PaintStyle.Fill);
paint.setColor(Skia.Color(0x66_e7_a6_49));
border.setStyle(PaintStyle.Fill);
border.setColor(Skia.Color(0xff_e7_a6_49));
border.setStrokeWidth(4);

const minDetectionTime = 1500;

export function useFindTestFrameProcessor(handleTestIdentified: () => void) {
  const { frameProcessor, identifiedTest } = useIdentifyTest();

  useCallOnceStable(identifiedTest, handleTestIdentified, minDetectionTime);

  return frameProcessor;
}

function useIdentifyTest() {
  const shrinkImage = useShrinkImage();
  const [identifiedTest, setIdentifiedTest] = useState(false);
  const handleTestIdentified = useRunOnJS(setIdentifiedTest, [
    setIdentifiedTest,
  ]);

  const frameProcessor = useSkiaFrameProcessor(
    (frame) => {
      "worklet";

      const ratio = 500 / frame.width;
      const height = frame.height * ratio;
      const width = frame.width * ratio;

      const resized = shrinkImage(frame, height, width);

      const shape = findRectangularBrightShape(resized, height, width);

      frame.render();

      if (shape) {
        drawPolygon(frame, shape, ratio);
      }

      handleTestIdentified(!!shape);

      OpenCV.clearBuffers();
    },
    [handleTestIdentified],
  );

  return {
    frameProcessor,
    identifiedTest,
  };
}

function useShrinkImage() {
  const { resize } = useResizePlugin();

  return (frame: DrawableFrame, height: number, width: number) => {
    "worklet";

    return resize(frame, {
      dataType: "uint8",
      pixelFormat: "bgr",
      scale: {
        height,
        width,
      },
    });
  };
}

function findRectangularBrightShape(
  image: Uint8Array<ArrayBufferLike>,
  height: number,
  width: number,
) {
  "worklet";

  const source = OpenCV.bufferToMat("uint8", height, width, 3, image);

  // greyscale conversion
  OpenCV.invoke(
    "cvtColor",
    source,
    source,
    ColorConversionCodes.COLOR_BGR2GRAY,
  );

  // Morphological Operations (noise reduction)
  const kernel = OpenCV.createObject(ObjectType.Size, 4, 4);
  const blurKernel = OpenCV.createObject(ObjectType.Size, 7, 7);
  const structuringElement = OpenCV.invoke(
    "getStructuringElement",
    MorphShapes.MORPH_ELLIPSE,
    kernel,
  );

  OpenCV.invoke(
    "morphologyEx",
    source,
    source,
    MorphTypes.MORPH_OPEN,
    structuringElement,
  );
  OpenCV.invoke(
    "morphologyEx",
    source,
    source,
    MorphTypes.MORPH_CLOSE,
    structuringElement,
  );

  // blurring
  OpenCV.invoke("GaussianBlur", source, source, blurKernel, 0);

  // edge detection
  OpenCV.invoke("Canny", source, source, 75, 100);

  const contours = OpenCV.createObject(ObjectType.MatVector);

  OpenCV.invoke(
    "findContours",
    source,
    contours,
    RetrievalModes.RETR_LIST,
    ContourApproximationModes.CHAIN_APPROX_SIMPLE,
  );

  const contoursMats = OpenCV.toJSValue(contours);

  let greatestPolygon: PointVector | undefined;
  let greatestArea = 0;

  for (let index = 0; index < contoursMats.array.length; index++) {
    const contour = OpenCV.copyObjectFromVector(contours, index);
    const { value: area } = OpenCV.invoke("contourArea", contour, false);
    const minRectData = OpenCV.toJSValue(OpenCV.invoke("minAreaRect", contour));

    const minRectRatio = minRectData.width / minRectData.height;

    if (
      area > 2000 &&
      area > greatestArea &&
      minRectRatio > 2.5 &&
      minRectRatio < 4
    ) {
      const peri = OpenCV.invoke("arcLength", contour, true);
      const approx = OpenCV.createObject(ObjectType.PointVector);

      OpenCV.invoke("approxPolyDP", contour, approx, 0.01 * peri.value, true);

      greatestPolygon = approx;
      greatestArea = area;
    }
  }
  return greatestPolygon;
}

function drawPolygon(
  frame: DrawableFrame,
  polygon: PointVector,
  ratio: number,
) {
  "worklet";

  const points = OpenCV.toJSValue(polygon).array;

  const path = Skia.Path.Make();
  const pointsToShow: SkPoint[] = [];

  const lastPointX = (points[points.length - 1]?.x || 0) / ratio;
  const lastPointY = (points[points.length - 1]?.y || 0) / ratio;

  path.moveTo(lastPointX, lastPointY);
  pointsToShow.push(vec(lastPointX, lastPointY));

  for (let index = 0; index < points.length; index++) {
    const pointX = (points[index]?.x || 0) / ratio;
    const pointY = (points[index]?.y || 0) / ratio;

    path.lineTo(pointX, pointY);
    pointsToShow.push(vec(pointX, pointY));
  }

  path.close();

  frame.drawPath(path, paint);
  frame.drawPoints(PointMode.Polygon, pointsToShow, border);
}
