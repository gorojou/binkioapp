import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, Image } from "react-native";
import RText from "./RText";
function TitleLogo() {
  return (
    <>
      <View style={styles.container}>
        <Image style={styles.image} source={require("../assets/main.png")} />
      </View>
    </>
  );
}
const styles = StyleSheet.create({
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },
  title: {
    fontSize: 25,
    fontWeight: "bold",
    color: "#5B1EF6",
  },
  image: {
    width: 250,
    height: 70,
    borderRadius: 100,
    marginRight: 10,
  },
});
export default TitleLogo;
