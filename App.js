import "@ethersproject/shims";
import "./shim";
import { Buffer } from "buffer";
global.Buffer = Buffer;
import { StyleSheet, Text, View, SafeAreaView, StatusBar } from "react-native";
import Initial from "./navigation/Initial";
import TitleLogo from "./components/TitleLogo";
import { AuthProvider } from "./context/AuthContext";
import HeaderProvider from "./context/HeaderContext";
export default function App() {
  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: "white",
        overflow: "scroll",
        ...styles.container,
      }}
    >
      <AuthProvider>
        {/* <View style={styles.titleContainer}>
          <TitleLogo />
        </View> */}
        <Initial />
      </AuthProvider>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    marginTop: Platform.OS === "android" ? StatusBar.currentHeight : 18,
  },
  button: {
    backgroundColor: "#7DE24E",
    zIndex: 0,
    height: 40,
    alignItems: "center",
    borderRadius: 30,
    padding: 30,
    marginLeft: 35,
    marginRight: 35,
    marginTop: 20,
    marginBottom: 25,
  },
});
