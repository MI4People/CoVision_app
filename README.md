# Welcome to CoVision!

## Start on actual device (iOS)
```bash
npx expo run:ios --device "device_name"
```

## Required iOS permissions: 

These lines need to be added to Info.plist
```xml
<key>NSCameraUsageDescription</key>
<string>Allow $(PRODUCT_NAME) to access your camera</string>
<key>NSMicrophoneUsageDescription</key>
<string>Allow $(PRODUCT_NAME) to access your microphone</string>
<key>NSSpeechRecognitionUsageDescription</key>
<string>Wir benötigen Zugriff auf die Spracherkennung, um Sprachbefehle zu verarbeiten.</string>
```