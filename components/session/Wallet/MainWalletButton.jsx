import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import RText from "../../RText";
import React, { useState } from "react";
import Wallet from "../../../assets/svg/wallet.svg";
import useAuth from "../../../context/AuthContext";
import Popup from "../Popup";
import { usePopup } from "../../../context/Popup";
import WalletList from "./WalletList";
import { useBlockChainContext } from "../../../context/BlockchainContext";
import CurrentTokenSvg from "../CurrentTokenSvg";
export default function MainWalletButton({ width, customStyles }) {
  const { mainWallet, balance } = useAuth();
  const { token } = useBlockChainContext();
  const { setShow, setComponent } = usePopup();
  return (
    <>
      <View
        style={{
          ...customStyles,
          justifyContent: "center",
          width: "100%",
          alignItems: "center",
        }}
      >
        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            setShow(true);
            setComponent(<WalletList />);
          }}
        >
          <View style={styles.walletSvgContainer}>
            <Wallet fill={"#5d22fa"} height={40} width={40} />
          </View>
          <View style={styles.walletTextContainer}>
            {mainWallet && (
              <>
                <RText style={styles.walletName}>{mainWallet.name}</RText>
                <RText style={styles.balance} tipo={"thin"}>
                  {mainWallet.balance
                    ? parseFloat(mainWallet.balance[token]).toFixed(
                        Math.max(
                          2,
                          (
                            mainWallet.balance[token]
                              .toString()
                              .split(".")[1] || []
                          ).length
                        )
                      )
                    : "Cargando"}{" "}
                  <CurrentTokenSvg height={8} width={8} />
                </RText>
              </>
            )}
          </View>
        </TouchableOpacity>
      </View>
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
  walletTextContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  walletName: {
    fontSize: 20,
  },
  balance: {
    fontSize: 13,
  },
});
