import { View, StyleSheet, TouchableOpacity, Alert } from "react-native";
import React, { useState } from "react";
import RText from "../RText";
import MainButton from "../buttons";
import Navbar from "./Navbar";
import useAuth from "../../context/AuthContext";
import "@ethersproject/shims";
import { ethers } from "ethers";
import s from "../styles";
import Loader from "../Loader";
import Copy from "../../assets/svg/copy.svg";
import * as Clipboard from "expo-clipboard";
export default function Wallet({ navigation }) {
  const { currentUser, createWallet } = useAuth();
  const [wallet, setWallet] = useState();
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const createUserWallet = () => {
    setLoading(true);
    const wallet = ethers.Wallet.createRandom();
    setWallet(wallet);
    setLoading(false);
  };
  const saveWallet = async (wallet) => {
    try {
      setLoading(true);
      await createWallet(wallet);
    } catch (err) {}
    setLoading(false);
    setErr(err.message);
  };
  return (
    <>
      <View style={styles.formulario}>
        <View style={{ width: "90%" }}>
          {!currentUser.wallet ? (
            <>
              {wallet ? (
                <>
                  <RText style={styles.formTitle}>Guarda tu Wallet</RText>
                  {err && <RText style={s.errText}>{err}</RText>}
                  <View style={styles.walletContainer}>
                    <RText style={styles.wallet}>{wallet.address}</RText>
                    <TouchableOpacity
                      onPress={() => {
                        Alert.alert("Copiado");
                        Clipboard.setStringAsync(wallet.address);
                      }}
                    >
                      <Copy height={30} width={30} fill={"black"} />
                    </TouchableOpacity>
                  </View>
                  <MainButton callback={() => saveWallet(wallet)}>
                    Guardar
                  </MainButton>
                </>
              ) : (
                <>
                  <RText style={styles.formTitle}>
                    No tienes ninguna wallet
                  </RText>
                  <MainButton callback={() => createUserWallet()}>
                    Generar Wallet
                  </MainButton>
                </>
              )}
            </>
          ) : (
            <>
              <RText style={styles.formTitle}>Tu wallet asiganada</RText>
              <View style={styles.walletContainer}>
                <RText style={styles.wallet}>
                  {currentUser.wallet.publicKey}
                </RText>
                <TouchableOpacity
                  onPress={() => {
                    Alert.alert("Copiado");
                    Clipboard.setStringAsync(currentUser.wallet.publicKey);
                  }}
                >
                  <Copy height={30} width={30} fill={"black"} />
                </TouchableOpacity>
              </View>
            </>
          )}
          {loading && <Loader size={100} />}
        </View>
      </View>
      <Navbar navigation={navigation} />
    </>
  );
}
const styles = StyleSheet.create({
  formulario: {
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
  },
  formTitle: {
    fontSize: 30,
    textAlign: "center",
  },
  walletContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 10,
    width: "100%",
  },
  wallet: {
    backgroundColor: "#f3f3f3",
    flex: 1,
    padding: 10,
    borderRadius: 20,
    marginTop: 20,
    textAlign: "center",
    marginRight: 5,
  },
  selectionView: {
    flexDirection: "row",
    marginTop: 20,
  },
  optionSelected: {
    flex: 0.5,
    padding: 20,
    borderRadius: 20,
    shadowOffset: {
      width: 0,
      height: 12,
    },
    shadowOpacity: 0.58,
    shadowRadius: 16.0,

    elevation: 24,
    marginHorizontal: 10,
    shadowColor: "#f40038",
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
  },
  optionNotSelected: {
    flex: 0.5,
    padding: 20,
    borderRadius: 20,
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.36,
    shadowRadius: 6.68,
    marginHorizontal: 10,
    elevation: 11,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
  },
});
