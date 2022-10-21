import { View, StyleSheet } from "react-native";
import React from "react";
import RText from "../RText";
import Home from "../../assets/svg/home.svg";
import Settings from "../../assets/svg/settings.svg";
import Wallet from "../../assets/svg/wallet.svg";
export default function Navbar() {
  return (
    <View style={styles.navbar}>
      <Wallet width={50} height={50} fill={"black"} />
      <Home width={50} height={50} fill={"black"} />
      <Settings width={50} height={50} fill={"black"} />
    </View>
  );
}
const styles = StyleSheet.create({
  navbar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
    backgroundColor: "#f3f3f3",
    padding: 5,
  },
});
