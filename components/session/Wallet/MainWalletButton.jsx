import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import RText from "../../RText";
import React, { useState } from "react";
import Wallet from "../../../assets/svg/wallet.svg";
import useAuth from "../../../context/AuthContext";
import Popup from "../Popup";
import WalletList from "./WalletList";
export default function MainWalletButton({ width }) {
  const { mainWallet } = useAuth();
  const [walletList, setWalletList] = useState(false);
  return (
    <>
      <View
        style={{
          justifyContent: "center",
          width: "100%",
          alignItems: "center",
        }}
      >
        <TouchableOpacity
          style={styles.button}
          onPress={() => setWalletList(true)}
        >
          <View style={styles.walletSvgContainer}>
            <Wallet fill={"#5d22fa"} height={40} width={40} />
          </View>
          {mainWallet && (
            <RText style={styles.walletName}>{mainWallet.name}</RText>
          )}
        </TouchableOpacity>
      </View>
      {walletList && (
        <Popup setShow={setWalletList}>
          <WalletList />
        </Popup>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  button: {
    position: "relative",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    width: "90%",
    overflow: "hidden",
    backgroundColor: "white",
    borderStyle: "solid",
    borderColor: "black",
    borderWidth: 1,
    padding: 10,
    borderRadius: 40,
  },
  walletSvgContainer: {
    position: "absolute",
    left: 10,
  },
  walletName: {
    fontSize: 20,
  },
});
