import { View, StyleSheet, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import RText from "../RText";
import Home from "../../assets/svg/home.svg";
import Settings from "../../assets/svg/settings.svg";
import Wallet from "../../assets/svg/wallet.svg";
export default function Navbar({ navigation }) {
  const [configBox, setConfigBox] = useState(false);
  return (
    <View style={styles.navbar}>
      <Wallet width={40} height={40} fill={"white"} />
      <Home width={40} height={40} fill={"white"} />

      <TouchableOpacity onPress={() => setConfigBox(!configBox)}>
        <Settings width={40} height={40} fill={"white"} />
      </TouchableOpacity>
      {configBox && <ConfigMenu navigation={navigation} />}
    </View>
  );
}
const ConfigMenu = ({ navigation }) => {
  return (
    <>
      <View style={styles.configBox}>
        <TouchableOpacity onPress={() => navigation.navigate("Home")}>
          <RText>Cerrar Sesión</RText>
        </TouchableOpacity>
      </View>
    </>
  );
};
const styles = StyleSheet.create({
  navbar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
    backgroundColor: "#36287d",
  },
  configBox: {
    position: "absolute",
    top: -60,
    right: 20,
    backgroundColor: "#f3f3f3",
    padding: 15,
    borderRadius: 40,
    shadowOffset: {
      width: 0,
      height: 12,
    },
    shadowOpacity: 0.58,
    shadowRadius: 16.0,
    shadowColor: "#000",
  },
});
