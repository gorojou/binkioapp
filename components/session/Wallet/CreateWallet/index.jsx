import { View, Text, StyleSheet, TextInput } from "react-native";
import React, { useState, useEffect } from "react";
import SelectWalletType from "./SelectWalletType";
import Popup from "../../../Popup";
import WalletCreation from "./WalletCreation";
import MainButton from "../../../buttons";
import useAuth from "../../../../context/AuthContext";
import Loader from "../../../Loader";
import s from "../../../styles";
export default function CreateWallet() {
  const { uploadWallet, updateProfile } = useAuth();
  const [wallets, setWallets] = useState({ btc: null, eth: null });
  const [generateType, setGenerateType] = useState();
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  return (
    <>
      {generateType ? (
        <>
          <WalletCreation
            walletType={generateType}
            setGenerateType={setGenerateType}
            setWallets={setWallets}
          />
        </>
      ) : (
        <>
          <View style={[styles.formulario, { marginBottom: 40 }]}>
            <View
              style={{
                alignItems: "center",
                width: "100%",
              }}
            >
              <SelectWalletType
                wallets={wallets}
                setGenerateType={setGenerateType}
              />
              {err && (
                <RText style={{ ...s.errText, textAlign: "center" }}>
                  {err}
                </RText>
              )}
            </View>
          </View>
        </>
      )}
      {loading && <Loader size={100} />}
    </>
  );
}
const styles = StyleSheet.create({
  formulario: {
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
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
  popUpContainer: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#ffffffaa",
    justifyContent: "center",
    alignItems: "center",
  },
  popup: {
    width: "90%",
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.36,
    shadowRadius: 6.68,
    marginHorizontal: 2.5,
    elevation: 11,
    backgroundColor: "white",
    padding: 15,
    borderRadius: 20,
  },
  walletPreview: {
    position: "relative",
    marginTop: 20,
    padding: 5,
  },
  hideMnemonic: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#f3f3f3",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  intputContainer: {
    flexDirection: "row",
    marginTop: 10,
    width: "100%",
  },
  input: {
    backgroundColor: "#f3f3f3",
    flex: 1,
    padding: 10,
    borderRadius: 20,
    textAlign: "center",
  },
});
