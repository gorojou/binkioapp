import { View, StyleSheet, TouchableOpacity, Image, Alert } from "react-native";
import React, { useState, useEffect } from "react";
import RText from "../../../RText";
import Loader from "../../../Loader";
import MainButton, { SecondaryButton } from "../../../buttons";
import useAuth from "../../../../context/AuthContext";
import BTC from "../../../../assets/svg/btc.svg";
import ETH from "../../../../assets/svg/eth.svg";
import firebase, { storage, firestore } from "../../../../firebase";
import s from "../../../styles";
import Popup from "../../../Popup";
import * as ImagePicker from "expo-image-picker";
import LoaderProgress from "../../../LoaderProgress";
export default function SelectWalletType({ wallets, setGenerateType }) {
  const [loading, setLoading] = useState(false);
  const { currentUser, uploadPfp, updateProfile } = useAuth();
  const [err, setErr] = useState("");
  return (
    <>
      <View style={styles.formularioContainer}>
        <View style={styles.formulario}>
          <RText style={styles.formTitle} tipo={"bold"}>
            Crea una wallet
          </RText>
          {err && <RText style={s.errText}>{err}</RText>}
          <RText style={styles.instrucciones} tipo={"thin"}>
            Selecciona el tipo de wallet que deseas generar
          </RText>
          <View style={styles.selectionView}>
            <TouchableOpacity
              style={
                wallets.btc ? styles.optionSelected : styles.optionNotSelected
              }
              onPress={() => setGenerateType("btc")}
            >
              <BTC
                height={50}
                width={50}
                fill={wallets.btc ? "green" : "black"}
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={
                wallets.eth ? styles.optionSelected : styles.optionNotSelected
              }
              onPress={() => setGenerateType("eth")}
            >
              <ETH
                height={50}
                width={50}
                fill={wallets.eth ? "green" : "black"}
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  formularioContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  formulario: {
    justifyContent: "center",
    alignItems: "center",
    width: "90%",
  },
  formTitle: {
    fontSize: 30,
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
    shadowColor: "green",
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
  instrucciones: {
    marginVertical: 15,
    fontSize: 15,
    textAlign: "center",
  },
  popupElementsContianer: {
    justifyContent: "center",
    alignItems: "center",
  },
});
