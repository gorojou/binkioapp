import {
  View,
  StyleSheet,
  TextInput,
  KeyboardAvoidingView,
} from "react-native";
import React, { useState, useEffect } from "react";
import RText from "../../../RText";
import Loader from "../../../Loader";
import s from "../../../styles";
import useAuth from "../../../../context/AuthContext";
import { ethers } from "ethers";
import * as Bip39 from "bip39";
import { useBlockChainContext } from "../../../../context/BlockchainContext";
import CopyToClipboard from "../../../CopyToClipboard";
import { useLocalAuth } from "../../../../context/LocalAuthentication";
export default function ImportWallet({
  confirmWallet,
  setWallets,
  setGenerateType,
  walletType,
}) {
  const { getBTCWalletFromMnemonic } = useBlockChainContext();
  const { uploadWallet, updateProfile } = useAuth();
  const { requireAuth } = useLocalAuth();
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const [nombre, setNombre] = useState("");
  const [priv, setPriv] = useState("");
  const [wallet, setWallet] = useState();
  const createNewWallet = async () => {
    if (!nombre) return setErr("Llena todos los campos");
    setLoading(true);
    try {
      if (!confirmWallet && !(await requireAuth())) {
        setLoading(false);
        return setErr("La autentificacion ha fallado");
      }
      if (confirmWallet) {
        setWallets((prev) => {
          return {
            ...prev,
            [walletType]: { ...wallet, nombre: nombre },
          };
        });
        return setGenerateType(null);
      }
      await uploadWallet(wallet, nombre, walletType);
      await updateProfile();
    } catch (err) {
      setErr(err?.message);
      setLoading(false);
    }
  };
  useEffect(() => {
    (async () => {
      if (!priv) return;
      setErr("");
      setLoading(true);
      try {
        if (walletType === "btc") {
          if (!Bip39.validateMnemonic(priv))
            throw { message: "Mnemonic invalido" };
          const newWallet = await getBTCWalletFromMnemonic(priv);
          setLoading(false);
          return setWallet({
            mnemonic: priv,
            imported: true,
            tipo: walletType,
            ...newWallet,
          });
        }
        setWallet({
          address: ethers.utils.computeAddress(priv),
          privateKey: priv,
          tipo: walletType,
          imported: true,
        });
      } catch (err) {
        setErr(
          err.message === "Mnemonic invalido" ||
            "Ingresa una llave privada valida"
        );
        console.log(err);
      }
      setLoading(false);
    })();
  }, [priv]);
  return (
    <View style={styles.formulario}>
      <RText style={styles.formTitle} tipo={"bold"}>
        Importa tu Wallet
      </RText>
      {err && <RText style={s.errText}>{err}</RText>}
      <KeyboardAvoidingView>
        <View style={styles.intputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Nombre de tu nueva wallet"
            value={nombre}
            onChangeText={(value) =>
              setNombre((prev) => {
                return value;
              })
            }
          />
        </View>
        <View style={styles.intputContainer}>
          <TextInput
            style={styles.input}
            placeholder={
              walletType === "btc" ? "Frase mnemonic" : "Llave Privada"
            }
            value={priv}
            onChangeText={(value) =>
              setPriv((prev) => {
                return value;
              })
            }
          />
        </View>
        {wallet && (
          <>
            <RText style={{ textAlign: "center" }}>Tu direccion publica</RText>
            <CopyToClipboard value={wallet.address} />
          </>
        )}
        <MainButton
          style={{ marginTop: 20 }}
          width={1}
          callback={() => createNewWallet()}
        >
          Ingresa
        </MainButton>
        {loading && <Loader size={100} />}
      </KeyboardAvoidingView>
    </View>
  );
}
const styles = StyleSheet.create({
  formulario: {
    justifyContent: "center",
    alignItems: "center",
  },
  formTitle: {
    fontSize: 30,
  },
  intputContainer: {
    flexDirection: "row",
    marginVertical: 10,
    width: "100%",
  },
  input: {
    backgroundColor: "#f3f3f3",
    flex: 1,
    padding: 10,
    borderRadius: 20,
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
