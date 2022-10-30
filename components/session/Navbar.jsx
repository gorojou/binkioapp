import { View, StyleSheet, TouchableOpacity, Image } from "react-native";
import React, { useState } from "react";
import RText from "../RText";
import Home from "../../assets/svg/home.svg";
import Settings from "../../assets/svg/settings.svg";
import Wallet from "../../assets/svg/wallet.svg";
import useAuth from "../../context/AuthContext";
import PfpImage from "./PfpImage";
export default function Navbar({ navigation }) {
  const [configBox, setConfigBox] = useState(false);
  const { currentUser } = useAuth();
  return (
    <View style={styles.navbar}>
      <TouchableOpacity onPress={() => navigation.navigate("dash")}>
        <Home width={40} height={40} fill={"black"} />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate("wallet")}>
        <Wallet width={40} height={40} fill={"black"} />
      </TouchableOpacity>
      <Settings width={40} height={40} fill={"black"} />
      <TouchableOpacity onPress={() => navigation.navigate("profile")}>
        <PfpImage size={30} />
      </TouchableOpacity>
      {configBox && <ConfigMenu navigation={navigation} />}
    </View>
  );
}
const ConfigMenu = () => {
  const { logOut } = useAuth();
  return (
    <>
      <View style={styles.configBox}>
        <TouchableOpacity
          onPress={async () => {
            await logOut();
          }}
        >
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
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "black",
    justifyContent: "space-evenly",
    alignItems: "center",
    borderTopRightRadius: 10,
    borderTopLeftRadius: 10,
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
