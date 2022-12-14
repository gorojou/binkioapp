import {
  View,
  StyleSheet,
  TextInput,
  KeyboardAvoidingView,
  Dimensions,
  Alert,
} from "react-native";
import React, { useState } from "react";
import RText from "../RText";
import Loader from "../Loader";
import s from "../styles";
import useAuth from "../../context/AuthContext";
import Navbar from "./Navbar";
import SelectToken from "./SelectToken";
import { useBlockChainContext } from "../../context/BlockchainContext";
export default function Garantia({ navigation }) {
  const { token } = useBlockChainContext();
  const { currentUser, transfer, balanceTotal, updateProfile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const [amount, setAmount] = useState();
  const solicitar = async () => {
    if (!amount) return setErr("Numero invalido");
    if (amount > balanceTotal[token]) return setErr("Solicitud muy alta");
    try {
      setLoading(true);
      const transaction = await transfer(amount, token, "Garantia", "Garantia");
      Alert.alert("Transaccion realizada");
      await updateProfile();
    } catch (err) {
      setErr(err.message);
      setLoading(false);
    }
  };
  return (
    <>
      <View style={styles.sessionContainer}>
        <View style={styles.formContainer}>
          <View style={styles.formulario}>
            <RText style={styles.formTitle} tipo={"bold"}>
              Ofrecer Garantia
            </RText>
            <RText style={styles.sessionTitle} tipo={"thin"}>
              !Coloca el monto que desees ofrecer!
            </RText>
            {err && <RText style={s.errText}>{err}</RText>}
            <RText style={styles.titulo} tipo={"thin"}>
              Red
            </RText>
            <SelectToken />
            <View style={styles.balanceContainer}>
              <RText style={styles.balance} tipo={"thin"}>
                Tu balance actual
              </RText>
              <RText style={styles.balanceNum}>
                {balanceTotal[token] !== null ? balanceTotal[token] : "0.00"}
              </RText>
            </View>
            <KeyboardAvoidingView>
              <View style={styles.intputContainer}>
                <TextInput
                  style={styles.input}
                  keyboardType="numeric"
                  placeholder="Monto"
                  value={amount}
                  onChangeText={(value) =>
                    setAmount((prev) => {
                      return value;
                    })
                  }
                />
              </View>
              <MainButton
                style={{ marginTop: 20 }}
                width={1}
                callback={() => solicitar()}
              >
                Ofrecer
              </MainButton>
            </KeyboardAvoidingView>
          </View>
        </View>
      </View>
      {loading && <Loader size={100} />}
      <Navbar navigation={navigation} />
    </>
  );
}
const styles = StyleSheet.create({
  sessionContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  titulo: {
    marginVertical: 10,
    fontSize: 25,
  },
  formContainer: {
    width: Dimensions.get("window").width - 30,
  },
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
  balanceContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    justifyContent: "space-between",
    padding: 5,
    marginTop: 20,
  },
  balance: {
    fontSize: 20,
    textAlign: "center",
  },
  balanceNum: {
    fontSize: 25,
    textAlign: "center",
  },
  input: {
    backgroundColor: "#f3f3f3",
    flex: 1,
    padding: 10,
    borderRadius: 20,
    textAlign: "center",
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
