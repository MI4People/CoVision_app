import { View, StyleSheet, Text } from "react-native";
import { Link } from "expo-router";

export default function Index() {
  return (
    <View style={styles.container}>
      <Link href="/root" style={styles.link}>
        <Text>Camera</Text>
      </Link>
      <Link href="/voice" style={styles.link}>
        <Text>Voice</Text>
      </Link>
      <Link href="/webview" style={styles.link}>
        <Text>Webview</Text>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  link: {
    padding: 10,
    marginVertical: 5,
  },
});
