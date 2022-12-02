import { View, Text, StyleSheet, TextInput, Alert } from "react-native";
import RText from "../../../RText";
import React, { useState, useEffect } from "react";
import useAuth from "../../../../context/AuthContext";
import { useBlockChainContext } from "../../../../context/BlockchainContext";
import SelectWallet from "./SelectWalletMethod";
import { SecondaryButton } from "../../../buttons";
import TestMnemonic from "./TestMnemonic";
import CopyToClipboard from "../../../CopyToClipboard";
import s from "../../../styles";
import Eye from "../../../../assets/svg/eyeHidden.svg";
import Loader from "../../../Loader";
import ImportWallet from "./ImportWallet";
import { useLocalAuth } from "../../../../context/LocalAuthentication";
export default function WalletCreation({
  confirmWallet,
  walletType,
  setGenerateType,
  setWallets,
}) {
  const { createRandomWalletEth, createRandomWalletBtc } =
    useBlockChainContext();
  const [wallet, setWallet] = useState();
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const [type, setType] = useState();
  const createUserWallet = async () => {
    const wallet =
      walletType === "btc"
        ? await createRandomWalletBtc()
        : await createRandomWalletEth();
    setWallet({ ...wallet, tipo: walletType });
  };
  const create = async (typeOfW) => {
    if (typeOfW === "generate") await createUserWallet();
    setType(typeOfW);
  };
  return (
    <>
      <View style={[styles.formulario, !confirmWallet && { marginBottom: 40 }]}>
        <View
          style={{
            alignItems: "center",
            width: !confirmWallet ? "90%" : "100%",
          }}
        >
          {type === "import" ? (
            <>
              <ImportWallet
                confirmWallet={confirmWallet}
                setWallets={setWallets}
                setGenerateType={setGenerateType}
                walletType={walletType}
              />
            </>
          ) : (
            <>
              {wallet ? (
                <>
                  <CheckNewWallet
                    mnemonic={wallet.mnemonic}
                    wallet={wallet}
                    walletType={walletType}
                    confirmWallet={confirmWallet}
                    setGenerateType={setGenerateType}
                    setWallets={setWallets}
                  />
                </>
              ) : (
                <>
                  <RText style={{ ...styles.formTitle, marginTop: 20 }}>
                    Crear wallet {walletType === "btc" ? "Bitcoin" : "Ethereum"}
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
const CheckNewWallet = ({
  mnemonic,
  wallet,
  confirmWallet,
  setWallets,
  walletType,
  setGenerateType,
}) => {
  const [resolver, setResolver] = useState({ resolver: null });
  const [hide, setHide] = useState(true);
  const [displayTest, setdisplayTest] = useState(false);
  const [nombre, setNombre] = useState();
  const [err, setErr] = useState();
  const [loading, setLoading] = useState(false);
  const { requireAuth } = useLocalAuth();
  const { updateProfile, uploadWallet } = useAuth();

  const createPromise = () => {
    let resolver;
    return [
      new Promise((resolve, reject) => {
        resolver = resolve;
      }),
      resolver,
    ];
  };

  const acceptWallet = async () => {
    setErr("");
    if (!nombre) return setErr("Colocale Nombre a tu wallet");
    if (confirmWallet) {
      if (!(await displayTestHandler())) return;
      await saveWallet();
    }
    setLoading(true);
    try {
      await uploadWallet(wallet, nombre, walletType);
      await updateProfile();
    } catch (err) {
      console.log(err);
      setErr("Algo salio mal intenta nuevamente");
      setLoading(false);
    }
  };

  const displayTestHandler = async () => {
    const [promise, resolve] = await createPromise();
    setdisplayTest(true);
    setResolver({ resolve });
    return promise;
  };

  const passed = async (status) => {
    setdisplayTest(false);
    resolver.resolve(status);
  };

  const saveWallet = async () => {
    try {
      setLoading(true);
      if (!confirmWallet && !(await requireAuth())) {
        setLoading(false);
        return setErr("La autentificacion ha fallado");
      }
      setWallets((prev) => {
        return { ...prev, [walletType]: { ...wallet, nombre } };
      });
      setGenerateType(null);
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
          <TestMnemonic passed={passed} mnemonic={mnemonic} />
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
            callback={() => acceptWallet()}
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
