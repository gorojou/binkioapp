import {
  View,
  StyleSheet,
  TextInput,
  KeyboardAvoidingView,
} from "react-native";
import React, { useState } from "react";
import RText from "../RText";
import Loader from "../Loader";
import s from "../styles";
import useAuth from "../../context/AuthContext";
import { useLocalAuth } from "../../context/LocalAuthentication";
export default function PinForm({ navigation, route }) {
  const { savePin, currentUser } = useAuth();
  const { requireAuth } = useLocalAuth();
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const createPin = async () => {
    setErr("");
    if (!form.pass) return setErr("Por favor no dejes ningun campo vacio");
    if (form.pass === currentUser.pin) return setErr("Pin ya en uso");
    setLoading(true);
    try {
      if (route.name === "security") {
        if (!(await requireAuth())) {
          setLoading(false);
          return setErr("La autentificacion ha fallado");
        }
      }
      await savePin(form.pass);
    } catch (err) {
      setErr(err.message);
      setLoading(false);
    }
  };
  const [form, setForm] = useState({
    email: "",
    pass: "",
  });
  return (
    <View style={styles.formulario}>
      <View style={{ width: "90%", alignItems: "center" }}>
        {route.name === "security" ? (
          <>
            <RText style={styles.formTitle} tipo={"bold"}>
              Cambia tu pin
            </RText>
            <RText style={styles.sessionTitle} tipo={"thin"}>
              No le muestres tu pin de seguridad a nadie
            </RText>
          </>
        ) : (
          <>
            <RText style={styles.formTitle} tipo={"bold"}>
              Crea un pin
            </RText>
            <RText style={styles.sessionTitle} tipo={"thin"}>
              Crea un pin de 4 números que te ayudará proteger tus transacciones
              y el ingreso a la app
            </RText>
          </>
        )}
        {err && <RText style={s.errText}>{err}</RText>}
        <KeyboardAvoidingView>
          <View style={styles.intputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Pin"
              value={form.pass}
              secureTextEntry={true}
              keyboardType="numeric"
              onChangeText={(value) =>
                setForm((prev) => {
                  if (value.length > 4) return { ...prev, pass: form.pass };
                  return { ...prev, pass: value };
                })
              }
            />
          </View>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <View></View>
            <MainButton callback={() => createPin()} fontSize={15}>
              Confirmar
            </MainButton>
          </View>
          {loading && <Loader size={100} />}
        </KeyboardAvoidingView>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  formulario: {
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
  },
  sessionTitle: {
    textAlign: "center",
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
    textAlign: "center",
    marginVertical: 20,
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
