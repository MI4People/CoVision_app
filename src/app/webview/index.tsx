import WebView from "react-native-webview";
import Constants from "expo-constants";
import { StyleSheet, Text, View } from "react-native";

export default () => {
  return (
    <View style={styles.container}>
      <Text>Hi I'm native</Text>
      <WebView
        userAgent="congstar/4.3.8"
        source={{
          uri: "https://webshop-fixed-ui-broadband-feat-we-128115-webview.web-tuadev.narf.tech/internet/dsl/api/login/1106160711",
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: Constants.statusBarHeight,
  },
});
