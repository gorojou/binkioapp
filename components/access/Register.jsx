import { View, TextInput, TouchableOpacity } from "react-native";
import React, { useState, useEffect } from "react";
import RText from "../RText";
import MainButton from "../buttons";
import { StyleSheet } from "react-native";
import Loader from "../Loader";
import s from "../styles";
import useAuth from "../../context/AuthContext";
export default function Register({ navigation }) {
  const { signUp } = useAuth();
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const [form, setForm] = useState({
    email: "",
    nombre: "",
    dia: "",
    mes: "",
    year: "",
    telefono: "",
    pass: "",
  });
  const register = async () => {
    setErr("");
    if (
      !form.email ||
      !form.nombre ||
      !form.dia ||
      !form.mes ||
      !form.year ||
      !form.telefono ||
      !form.pass
    )
      return setErr("Por favor no dejes ningun campo vacio");
    if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/.test(form.email))
      return setErr("Email invalido");
    if (form.pass.length < 6)
      return setErr("La contraseña debe tener un minimo de 6 caracteres");

    setLoading(true);
    try {
      await signUp(
        form.email,
        form.pass,
        form.telefono,
        form.nombre,
        form.dia,
        form.mes,
        form.year
      );
      setLoading(false);
    } catch (err) {
      setLoading(false);
      setErr(err.message);
    }
  };
  return (
    <View style={styles.formulario}>
      <>
        <RText style={styles.formTitle} tipo={"bold"}>
          Registrate
        </RText>
        <RText style={styles.sessionTitle} tipo={"thin"}>
          !Se parte de la comunidad Binkio!
        </RText>
        {err && <RText style={s.errText}>{err}</RText>}
        <View style={styles.intputContainer}>
          <TextInput
            style={styles.input}
            value={form.nombre}
            onChangeText={(value) =>
              setForm((prev) => {
                return { ...prev, nombre: value };
              })
            }
            placeholder="Nombre"
          />
        </View>
        <RText>Fecha de nacimiento</RText>
        <View style={styles.nacimientoInput}>
          <TextInput
            style={{ ...styles.input, ...styles.inputFecha }}
            placeholder="DD"
            keyboardType="numeric"
            value={form.dia}
            onChangeText={(value) =>
              setForm((prev) => {
                if (value.length > 2 || value.length < 0) return { ...prev };
                if (value > 31) return "00";
                return { ...prev, dia: value };
              })
            }
          />
          <TextInput
            style={{ ...styles.input, ...styles.inputFecha }}
            placeholder="MM"
            keyboardType="numeric"
            value={form.mes}
            onChangeText={(value) =>
              setForm((prev) => {
                if (value.length > 2 || value.length < 0) return { ...prev };
                if (value > 12) return "00";
                return { ...prev, mes: value };
              })
            }
          />
          <TextInput
            style={{ ...styles.input, ...styles.inputFecha }}
            placeholder="AA"
            keyboardType="numeric"
            value={form.year}
            onChangeText={(value) =>
              setForm((prev) => {
                if (value.length > 4 || value.length < 0) return { ...prev };
                return { ...prev, year: value };
              })
            }
          />
        </View>
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
            placeholder="Telefono"
            value={form.telefono}
            onChangeText={(value) =>
              setForm((prev) => {
                return { ...prev, telefono: value };
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
        <MainButton width={1} callback={() => register()}>
          Registrate
        </MainButton>
        {loading && <Loader size={100} />}
      </>
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
  },
  nacimientoInput: {
    flexDirection: "row",
  },
  inputFecha: {
    marginHorizontal: 3,
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
