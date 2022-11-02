import { View, StyleSheet, TouchableOpacity, Alert } from "react-native";
import React, { useState } from "react";
import RText from "../RText";
import MainButton from "../buttons";
import Navbar from "./Navbar";
import Bitcoin from "../../assets/svg/bitcoin.svg";
import Ethereum from "../../assets/svg/ethereum.svg";
import useAuth from "../../context/AuthContext";
import "@ethersproject/shims";
import { ethers } from "ethers";
import s from "../styles";
import Loader from "../Loader";
import Copy from "../../assets/svg/copy.svg";
import * as Clipboard from "expo-clipboard";
import axios from "axios";
export default function Wallet({ navigation }) {
  const { currentUser, createWallet } = useAuth();
  const [wallet, setWallet] = useState();
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const [token, setToken] = useState("btc");
  const createUserWallet = async () => {
    setLoading(true);
    if (token === "eth") {
      const wallet = await ethers.Wallet.createRandom();
      setWallet(wallet);
      setLoading(false);
    } else {
      setTimeout(() => {
        setLoading(false);
        setErr("Algo salio mal, intente mas tarde");
      }, 3000);
      // const response = await axios.get();
    }
  };
  const saveWallet = async (wallet) => {
    try {
      setLoading(true);
      await createWallet(wallet, token === "btc" ? token : "eth");
    } catch (err) {}
    setLoading(false);
    setErr(err.message);
  };
  return (
    <>
      <View style={styles.formulario}>
        <View style={{ width: "90%" }}>
          <RText style={styles.formTitle}>Selecciona tu tipo de wallet</RText>
          <View style={styles.selectActivo}>
            <TouchableOpacity
              style={token === "btc" ? styles.activoSelected : styles.activo}
              onPress={() => setToken("btc")}
            >
              <Bitcoin height={50} width={50} />
            </TouchableOpacity>
            <TouchableOpacity
              style={token === "eth" ? styles.activoSelected : styles.activo}
              onPress={() => setToken("eth")}
            >
              <Ethereum height={50} width={50} />
            </TouchableOpacity>
          </View>
          {!currentUser[token].publicKey ? (
            <>
              {wallet ? (
                <>
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
                  <RText
                    style={{ ...styles.formTitle, marginTop: 20 }}
                    tipo={"thin"}
                  >
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
              <View style={styles.walletContainer}>
                <RText style={styles.wallet}>
                  {currentUser[token].publicKey}
                </RText>
                <TouchableOpacity
                  onPress={() => {
                    Alert.alert("Copiado");
                    Clipboard.setStringAsync(currentUser[token].publicKey);
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
