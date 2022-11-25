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
import { usePopup } from "../../context/Popup";
import { useLocalAuth } from "../../context/LocalAuthentication";
import CurrentTokenSvg from "./CurrentTokenSvg";
export default function Enviar({ navigation }) {
  const { balanceTotal } = useAuth();
  const { token } = useBlockChainContext();
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const [amount, setAmount] = useState();
  const [tipo, setTipo] = useState("");
  const { setShow, setComponent } = usePopup();

  const solicitar = async () => {
    if (!amount) return setErr("Numero invalido");
    if (amount > balanceTotal[token]) return setErr("Saldo insuficiente");
    if (!tipo) return setErr("Selecciona un tipo");
    if (tipo === "deuda" && amount > "10.56")
      return setErr("Excede lo necesario");
    try {
      setShow(true);
      setComponent(<Confirmacion amount={amount} tipo={tipo} token={token} />);
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
                {balanceTotal[token] ? balanceTotal[token] : "0.00"}
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

const Confirmacion = ({ amount, tipo, token }) => {
  const { updateProfile } = useAuth();
  const { transfer } = useAuth();
  const { requireAuth } = useLocalAuth();
  const [nota, setNota] = useState();
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  const confrimTransaction = async () => {
    setLoading(true);
    if (!(await requireAuth())) {
      setLoading(false);
      return setErr("La autentificacion ha fallado");
    }
    try {
      const transaction = await transfer(
        amount,
        token,
        tipo === "deuda" ? "Pago Deuda" : "Transferencia a terceros",
        nota ? nota : ""
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
      <View
        style={{
          justifyContent: "center",
          alignContent: "center",
          width: "100%",
          padding: 15,
        }}
      >
        <RText style={styles.formTitle}>Confirma transferencia</RText>
        {err && (
          <RText style={{ ...s.errText, textAlign: "center" }}>{err}</RText>
        )}
        <RText tipo={"thin"} style={{ ...styles.balance, marginTop: 20 }}>
          Cantidad a enviar
        </RText>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            width: "100%",
          }}
        >
          <RText tipo={"bold"} style={{ ...styles.balanceNum, marginRight: 5 }}>
            {amount}
          </RText>
          <CurrentTokenSvg height={20} width={20} />
        </View>
        <View style={styles.confirmInfo}>
          <RText tipo={"thin"}>Tipo de transferencia:</RText>
          <RText tipo={"bold"}>
            {tipo === "deuda" ? "Pago Deuda" : "Transferencia a terceros"}
          </RText>
        </View>
        <KeyboardAvoidingView>
          <View style={styles.intputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Nota"
              value={nota}
              onChangeText={(value) => {
                setNota((prev) => {
                  if (value.length < 140) {
                    return value;
                  }
                  return prev;
                });
              }}
            />
          </View>
          <MainButton width={1} callback={() => confrimTransaction()}>
            Confirmar
          </MainButton>
        </KeyboardAvoidingView>
      </View>
      {loading && <Loader size={100} />}
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
    textAlign: "center",
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
  confirmInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 5,
  },
});
