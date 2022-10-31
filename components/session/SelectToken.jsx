import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import React from "react";
import Bitcoin from "../../assets/svg/bitcoin.svg";
import Ethereum from "../../assets/svg/ethereum.svg";
import WBTC from "../../assets/svg/wBTC.svg";
import USDT from "../../assets/svg/USDT.svg";

export default function SelectToken({ token, setToken }) {
  return (
    <View style={styles.selectActivo}>
      <TouchableOpacity
        onPress={() => setToken("btc")}
        style={token === "btc" ? styles.activoSelected : styles.activo}
      >
        <Bitcoin height={50} width={50} />
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => setToken("eth")}
        style={token === "eth" ? styles.activoSelected : styles.activo}
      >
        <Ethereum height={50} width={50} />
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => setToken("wbtc")}
        style={token === "wbtc" ? styles.activoSelected : styles.activo}
      >
        <WBTC height={50} width={50} />
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => setToken("usdt")}
        style={token === "usdt" ? styles.activoSelected : styles.activo}
      >
        <USDT height={50} width={50} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  selectionView: {
    flexDirection: "row",
    marginTop: 20,
  },
  selectActivo: {
    flexDirection: "row",
    width: "100%",
    padding: 3,
  },
  activoSelected: {
    flex: 1,
    padding: 10,
    borderRadius: 20,
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.58,
    shadowRadius: 16.0,

    elevation: 24,
    marginHorizontal: 2.5,
    shadowColor: "#5d22fa",
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
  },
  activo: {
    flex: 1,
    padding: 10,
    borderRadius: 20,
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.36,
    shadowRadius: 6.68,
    marginHorizontal: 2.5,
    elevation: 11,
    backgroundColor: "#f3f3f3",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
  },
});
