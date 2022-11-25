import {
  View,
  StyleSheet,
  TextInput,
  KeyboardAvoidingView,
} from "react-native";
import React, { useState, useEffect } from "react";
import RText from "../../RText";
import Loader from "../../Loader";
import s from "../../styles";
import useAuth from "../../../context/AuthContext";
import { ethers } from "ethers";
import CopyToClipboard from "../../CopyToClipboard";
import { useLocalAuth } from "../../../context/LocalAuthentication";
export default function ImportWallet({ navigation }) {
  const { createWallet, updateProfile } = useAuth();
  const { requireAuth } = useLocalAuth();
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const [nombre, setNombre] = useState("");
  const [priv, setPriv] = useState("");
  const [wallet, setWallet] = useState();
  const createNewWallet = async () => {
    setLoading(true);
    try {
      if (!(await requireAuth())) {
        setLoading(false);
        return setErr("La autentificacion ha fallado");
      }
      await createWallet(wallet, nombre);
      await updateProfile();
    } catch (err) {
      setErr(err?.message);
      setLoading(false);
    }
  };
  useEffect(() => {
    if (!priv) return;
    if (!nombre) return setErr("Llena todos los campos");
    setErr("");
    setLoading(true);
    try {
      setWallet({
        name: nombre,
        address: ethers.utils.computeAddress(priv),
        privKey: priv,
        imported: true,
      });
    } catch (err) {
      setErr("Ingresa una llave privada valida");
      console.log(err);
    }
    setLoading(false);
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
            placeholder="Llave Privada"
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
