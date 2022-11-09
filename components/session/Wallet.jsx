import { View, StyleSheet, TouchableOpacity, TextInput } from "react-native";
import React, { useState } from "react";
import RText from "../RText";
import MainButton, { SecondaryButton } from "../buttons";
import Navbar from "./Navbar";
import "@ethersproject/shims";
import Loader from "../Loader";
import CopyToClipboard from "../CopyToClipboard";
import useAuth from "../../context/AuthContext";
import s from "../styles";
import * as SecureStore from "expo-secure-store";
import { useBlockChainContext } from "../../context/BlockchainContext";
export default function Wallet({ navigation, route }) {
  const { currentUser, createWallet } = useAuth();
  const { createRandomWallet } = useBlockChainContext();
  const [wallet, setWallet] = useState();
  const [loading, setLoading] = useState(false);
  const [show, setShow] = useState(false);
  const [err, setErr] = useState("");
  const createUserWallet = async () => {
    setLoading(true);
    const wallet = await createRandomWallet();
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
        <View style={{ width: "90%", alignItems: "center" }}>
          {!currentUser.wallet ? (
            <>
              {wallet ? (
                <>
                  <RText style={{ ...styles.formTitle, marginTop: 20 }}>
                    Guarda tu nueva wallet
                  </RText>
                  <RText
                    style={{
                      ...styles.sessionTitle,
                      textAlign: "center",
                      marginBottom: 20,
                    }}
                    tipo={"thin"}
                  >
                    Por favor almacena la informacion de tu wallet en un lugar
                    seguro
                  </RText>
                  {err && <RText style={s.errText}>{err}</RText>}

                  <RText>Mnemonic</RText>
                  <CopyToClipboard value={wallet._mnemonic().phrase} />

                  <RText>Direccion Publica</RText>
                  <CopyToClipboard value={wallet.address} />
                  <MainButton callback={() => saveWallet(wallet)} width={0.8}>
                    Guardar
                  </MainButton>
                </>
              ) : (
                <>
                  <RText style={{ ...styles.formTitle, marginTop: 20 }}>
                    ¡Crea una nueva wallet!
                  </RText>

                  <MainButton callback={() => createUserWallet()}>
                    Generar Wallet
                  </MainButton>
                </>
              )}
            </>
          ) : (
            <>
              <RText style={{ ...styles.formTitle, marginTop: 20 }}>
                Tu Wallet
              </RText>
              <RText style={styles.sessionTitle} tipo={"thin"}>
                Tu wallet es asignada al crear una cuenta
              </RText>
              <CopyToClipboard value={currentUser.wallet.publicKey} />
              <SecondaryButton callback={() => setShow(true)}>
                Ver Datos privados
              </SecondaryButton>
            </>
          )}
          {loading && <Loader size={100} />}
        </View>
        {show && <PopUpMnemonic setShow={setShow} />}
      </View>
      {route.name === "wallet" && <Navbar navigation={navigation} />}
    </>
  );
}
const PopUpMnemonic = ({ setShow }) => {
  const [confirm, setConfirm] = useState(false);
  const [passConfirmed, setPassConfirmed] = useState(false);
  const [pass, setPass] = useState();
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const { currentUser } = useAuth();

  const confirmPass = async () => {
    setLoading(true);
    const storedPass = await SecureStore.getItemAsync("USER_PASS");
    if (storedPass === pass) {
      setLoading(false);
      return setPassConfirmed(true);
    }
    setLoading(false);
    setErr("Las contraseñas no coinciden");
  };
  return (
    <>
      <TouchableOpacity
        style={styles.popUpContainer}
        onPress={() => setShow(false)}
      >
        <View
          style={styles.popup}
          onStartShouldSetResponder={(event) => true}
          onTouchEnd={(e) => {
            e.stopPropagation();
          }}
        >
          {confirm ? (
            <>
              {passConfirmed ? (
                <>
                  <RText style={{ ...styles.formTitle, marginVertical: 20 }}>
                    Los datos de tu wallet
                  </RText>
                  <View></View>
                  <RText style={{ textAlign: "center" }}>Frase mnemonic</RText>
                  <CopyToClipboard value={currentUser.wallet.mnemonic} />
                  <RText style={{ textAlign: "center" }}>Llave Privada</RText>
                  <CopyToClipboard value={currentUser.wallet.privKey} />
                  <MainButton width={0.8} callback={() => setShow(false)}>
                    Volver
                  </MainButton>
                </>
              ) : (
                <>
                  <RText style={{ ...styles.formTitle, marginVertical: 20 }}>
                    Coloca tu contraseña para continuar
                  </RText>
                  {err && (
                    <RText style={{ ...s.errText, textAlign: "center" }}>
                      {err}
                    </RText>
                  )}
                  <View style={s.intputContainer}>
                    <TextInput
                      style={s.input}
                      placeholder="Contraseña"
                      value={pass}
                      secureTextEntry={true}
                      onChangeText={(value) => setPass(value)}
                    />
                  </View>
                  <MainButton width={0.8} callback={() => confirmPass()}>
                    Aceptar
                  </MainButton>
                </>
              )}
            </>
          ) : (
            <>
              <RText style={{ ...styles.formTitle, marginVertical: 20 }}>
                Estas Seguro?
              </RText>
              <RText
                style={{ ...styles.sessionTitle, textAlign: "center" }}
                tipo={"thin"}
              >
                Los datos privados de tu cuenta deberian ser vistos solo por ti
                en una red y lugar seguro
              </RText>
              <SecondaryButton width={0.8} callback={() => setConfirm(true)}>
                Ver Datos
              </SecondaryButton>
              <MainButton width={0.8} callback={() => setShow(false)}>
                Cancelar
              </MainButton>
            </>
          )}
          {loading && <Loader size={100} />}
        </View>
      </TouchableOpacity>
    </>
  );
};
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
  popUpContainer: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#f3f3f3aa",
    justifyContent: "center",
    alignItems: "center",
  },
  popup: {
    width: "90%",
    backgroundColor: "white",
    padding: 15,
    borderRadius: 20,
  },
});
