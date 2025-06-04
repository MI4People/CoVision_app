# Welcome to CoVision

## Start on actual device (iOS)

```bash
npx expo run:ios --device "device_name"
```

## Required iOS permissions

These lines need to be added to Info.plist

```xml
<key>NSCameraUsageDescription</key>
<string>Allow $(PRODUCT_NAME) to access your camera in order to take pictures of your tests for analysis.</string>
<key>NSMicrophoneUsageDescription</key>
<string>Allow $(PRODUCT_NAME) to access your microphone, to enable voice recognition.</string>
<key>NSSpeechRecognitionUsageDescription</key>
<string>Allow $(PRODUCT_NAME) to access voice recognition to carry out your voice commands.</string>
```

## Required api key 
You need to set the `apiKey` variable to your OpenAI API key.

to do this, create a file in [gptClient](src/services/identifierClient/gptClient)/apiKey.ts

```typescript
export const apiKey = "<your OpenAI API key>";
```