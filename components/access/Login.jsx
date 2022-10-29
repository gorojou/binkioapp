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
export default function Login({ navigation }) {
  const { logIn } = useAuth();
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const login = async () => {
    setErr("");
    if (!form.email || !form.pass)
      return setErr("Por favor no dejes ningun campo vacio");
    if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/.test(form.email))
      return setErr("Email invalido");
    setLoading(true);
    try {
      await logIn(form.email, form.pass);
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
      <RText style={styles.formTitle} tipo={"bold"}>
        Ingresa
      </RText>
      <RText style={styles.sessionTitle} tipo={"thin"}>
        !Hola nuevamente!
      </RText>
      {err && <RText style={s.errText}>{err}</RText>}
      <KeyboardAvoidingView>
        <View style={styles.intputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Correo"
            value={form.email}
            onChangeText={(value) =>
              setForm((prev) => {
                return { ...prev, email: value };
              })
            }
          />
        </View>
        <View style={styles.intputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Contraseña"
            value={form.pass}
            secureTextEntry={true}
            onChangeText={(value) =>
              setForm((prev) => {
                return { ...prev, pass: value };
              })
            }
          />
        </View>
        <MainButton width={1} callback={() => login()}>
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
