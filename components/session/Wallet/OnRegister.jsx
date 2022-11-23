import { View, Text, StyleSheet, TextInput } from "react-native";
import RText from "../../RText";
import React, { useState, useEffect } from "react";
import useAuth from "../../../context/AuthContext";
import { useBlockChainContext } from "../../../context/BlockchainContext";
import SelectWallet from "./SelectWallet";
import { SecondaryButton } from "../../buttons";
import TestMnemonic from "./TestMnemonic";
import CopyToClipboard from "../../CopyToClipboard";
import s from "../../styles";
import Eye from "../../../assets/svg/eyeHidden.svg";
import Loader from "../../Loader";
import ImportWallet from "./ImportWallet";
export default function OnRegister({ confirmWallet }) {
  const { createRandomWallet } = useBlockChainContext();
  const [wallet, setWallet] = useState();
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const [type, setType] = useState();
  console.log(confirmWallet);
  const createUserWallet = async () => {
    const wallet = await createRandomWallet();
    setWallet(wallet);
  };
  const create = async (typeOfW) => {
    if (typeOfW === "generate") await createUserWallet();
    setType(typeOfW);
  };
  return (
    <>
      <View style={[styles.formulario, !confirmWallet && { flex: 1 }]}>
        <View
          style={{
            alignItems: "center",
            width: !confirmWallet ? "90%" : "100%",
          }}
        >
          {type === "import" ? (
            <>
              <ImportWallet />
            </>
          ) : (
            <>
              {wallet ? (
                <>
                  <CheckNewWallet
                    mnemonic={wallet._mnemonic().phrase}
                    wallet={wallet}
                    confirmWallet={confirmWallet}
                  />
                </>
              ) : (
                <>
                  <RText style={{ ...styles.formTitle, marginTop: 20 }}>
                    ¡Crea una nueva wallet!
                  </RText>
                  <RText style={styles.sessionTitle} tipo={"thin"}>
                    Guarda todos los datos de tu wallet en un lugar seguro
                  </RText>
                  <SelectWallet create={create} />
                </>
              )}
            </>
          )}
          {loading && <Loader size={100} />}
        </View>
      </View>
    </>
  );
}
const CheckNewWallet = ({ mnemonic, wallet, confirmWallet }) => {
  const [hide, setHide] = useState(true);
  const [displayTest, setdisplayTest] = useState(false);
  const [nombre, setNombre] = useState();
  const [err, setErr] = useState();
  const [loading, setLoading] = useState(false);
  const { createWallet } = useAuth();
  const continueToTest = async () => {
    setErr("");
    console.log(wallet);
    if (!nombre) return setErr("Colocale Nombre a tu wallet");
    if (confirmWallet) return await saveWallet();
    setdisplayTest(true);
  };
  const saveWallet = async () => {
    try {
      setLoading(true);
      await createWallet(wallet, nombre);
    } catch (err) {
      console.log(err);
      setLoading(false);
      setErr(err.message);
    }
  };
  return (
    <>
      {displayTest ? (
        <>
          <TestMnemonic
            setdisplayTest={setdisplayTest}
            mnemonic={mnemonic}
            nombre={nombre}
            wallet={wallet}
          />
        </>
      ) : (
        <>
          <RText style={{ ...styles.formTitle, marginTop: 20 }}>
            Guarda tu nueva wallet
          </RText>
          <RText
            style={{
              ...styles.sessionTitle,
              textAlign: "center",
            }}
            tipo={"thin"}
          >
            Por favor almacena la informacion de tu wallet en un lugar seguro
          </RText>
          {err && (
            <RText style={{ ...s.errText, textAlign: "center" }}>{err}</RText>
          )}
          <SecondaryButton
            style={{ marginTop: 20 }}
            width={1}
            callback={() => setHide(!hide)}
          >
            {hide ? "Ver Frase Secreta" : "Esconder Frase Secreta"}
          </SecondaryButton>
          <RText
            style={{
              ...styles.sessionTitle,
              textAlign: "center",
              marginTop: 20,
            }}
            tipo={"thin"}
          >
            Dale un nombre a tu nueva wallet
          </RText>
          <View style={styles.intputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Nombre de Wallet"
              value={nombre}
              onChangeText={(value) => {
                if (value.length < 20) setNombre(value);
              }}
            />
          </View>
          <View style={styles.walletPreview}>
            <RText>Mnemonic</RText>
            <CopyToClipboard value={mnemonic} />
            {hide && (
              <View style={styles.hideMnemonic}>
                <Eye fill={"black"} />
              </View>
            )}
          </View>
          <MainButton
            style={{ marginTop: 20 }}
            callback={() => continueToTest()}
            width={1}
          >
            Siguiente
          </MainButton>
          {loading && <Loader size={100} />}
        </>
      )}
    </>
  );
};
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
