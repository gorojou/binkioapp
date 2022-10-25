import { View, Image, StyleSheet } from "react-native";
import React from "react";
import RText from "../RText";
import Navbar from "./Navbar";
export default function Dashboard({ navigation }) {
  return (
    <>
      <View style={styles.header}>
        <Image
          source={require("../../assets/blankpfp.jpg")}
          style={styles.pfpImage}
        />
        <RText style={styles.nombre}>Username</RText>
      </View>
      <Navbar navigation={navigation} />
    </>
  );
}
const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 20,
    marginTop: 20,
    // flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  nombre: {
    fontSize: 20,
  },
  pfpImage: {
    width: 60,
    height: 60,
    borderRadius: 100,
    marginBottom: 15,
  },
});
