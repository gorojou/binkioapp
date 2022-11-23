import {
  View,
  StyleSheet,
  TextInput,
  KeyboardAvoidingView,
  Dimensions,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import React, { useState } from "react";
import RText from "../RText";
import Loader from "../Loader";
import s from "../styles";
import useAuth from "../../context/AuthContext";
import Navbar from "./Navbar";
import CrediCard from "../../assets/svg/credit_card.svg";
import Swap from "../../assets/svg/swap.svg";
import SelectToken from "./SelectToken";
import { useBlockChainContext } from "../../context/BlockchainContext";
export default function Enviar({ navigation }) {
  const { currentUser, balanceTotal, transfer, updateProfile } = useAuth();
  const { token } = useBlockChainContext();
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const [amount, setAmount] = useState();
  const [tipo, setTipo] = useState("");
  const solicitar = async () => {
    if (!amount) return setErr("Numero invalido");
    if (!tipo) return setErr("Selecciona un tipo");
    if (tipo === "deuda" && amount > "10.56")
      return setErr("Excede lo necesario");
    try {
      setLoading(true);
      const transaction = await transfer(
        amount,
        token,
        "Transferencia",
        "Prueba sistema historial"
      );
      Alert.alert("Transaccion realizada");
      await updateProfile();
    } catch (err) {
      setErr(err.message);
      setLoading(false);
    }
  };
  return (
    <>
      <ScrollView
        style={styles.sessionContainer}
        contentContainerStyle={{
          ...styles.sessionContainer,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <View style={styles.formContainer}>
          <View style={styles.formulario}>
            <RText style={styles.formTitle} tipo={"bold"}>
              Enviar Activos
            </RText>
            {err && <RText style={s.errText}>{err}</RText>}
            <RText style={styles.titulo} tipo={"thin"}>
              Red
            </RText>
            <SelectToken />
            <RText style={styles.titulo} tipo={"thin"}>
              Tipo
            </RText>
            <View style={styles.selectActivo}>
              <TouchableOpacity
                onPress={() => setTipo("deuda")}
                style={tipo === "deuda" ? styles.activoSelected : styles.activo}
              >
                <CrediCard
                  height={50}
                  width={50}
                  fill={tipo === "deuda" ? "#5d22fa" : "#000"}
                />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setTipo("terceros")}
                style={
                  tipo === "terceros" ? styles.activoSelected : styles.activo
                }
              >
                <Swap
                  height={50}
                  width={50}
                  fill={tipo === "terceros" ? "#5d22fa" : "#000"}
                />
              </TouchableOpacity>
            </View>

            {tipo ? tipo === "deuda" ? <Prestamo /> : <Terceros /> : <></>}
            <View style={styles.balanceContainer}>
              <RText style={styles.balance} tipo={"thin"}>
                Tu balance actual
              </RText>
              <RText style={styles.balanceNum}>
                {balanceTotal[token] ? balanceTotal[token] : "-.--"}
              </RText>
            </View>
            <KeyboardAvoidingView>
              <View style={styles.intputContainer}>
                <TextInput
                  keyboardType="numeric"
                  style={styles.input}
                  placeholder="Monto"
                  value={amount}
                  onChangeText={(value) => setAmount(value)}
                />
              </View>
              <MainButton
                style={{ marginTop: 20 }}
                width={1}
                callback={() => solicitar()}
              >
                Enviar
              </MainButton>
            </KeyboardAvoidingView>
          </View>
        </View>
      </ScrollView>
      {loading && <Loader size={100} />}
      <Navbar navigation={navigation} />
    </>
  );
}
const Prestamo = () => {
  return (
    <>
      <View style={styles.deudaContainer}>
        <RText style={styles.deuda} tipo={"thin"}>
          Debes un total de
        </RText>
        <RText style={styles.deudaNum}>10.56$</RText>
      </View>
    </>
  );
};
const Terceros = () => {
  return (
    <>
      <RText style={{ ...styles.titulo, marginTop: 20 }} tipo={"thin"}>
        Introduce el correo de la persona a transferir
      </RText>
      <View style={styles.intputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Correo"
          //   value={form.pass}
          //   onChangeText={(value) =>
          //     setForm((prev) => {
          //       return { ...prev, pass: value };
          //     })
          //   }
        />
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  sessionContainer: {
    overflow: "scroll",
    paddingBottom: 60,
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
  titulo: {
    marginVertical: 10,
    fontSize: 25,
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
  deudaContainer: {
    marginTop: 20,
    alignItems: "center",
  },
  deuda: {
    fontSize: 20,
  },
  deudaNum: {
    fontSize: 25,
  },
  selectionView: {
    marginTop: 20,
    flexDirection: "row",
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
      height: 12,
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
      height: 5,
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
