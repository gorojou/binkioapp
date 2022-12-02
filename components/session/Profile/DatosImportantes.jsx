import { View, Text, StyleSheet, TextInput } from "react-native";
import React, { useState, useEffect } from "react";
import Navbar from "../Navbar";
import RText from "../../RText";
import useAuth from "../../../context/AuthContext";
import s from "../../styles";
import MainButtom from "../../buttons";
import Loader from "../../Loader";
import { useLocalAuth } from "../../../context/LocalAuthentication";
export default function DatosImportantes({ navigation }) {
  const { requireAuth } = useLocalAuth();
  const { currentUser, updateUser, updateProfile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const [updatable, setUpdatable] = useState(false);
  const standart = {
    nombre: currentUser.nombre,
    dia: currentUser.nacimiento.d,
    mes: currentUser.nacimiento.m,
    year: currentUser.nacimiento.a,
    telefono: currentUser.telefono,
  };
  const [form, setForm] = useState(standart);
  useEffect(() => {
    setUpdatable(JSON.stringify(form) !== JSON.stringify(standart));
  }, [form]);

  const update = async () => {
    setErr("");
    if (!form.nombre || !form.dia || !form.mes || !form.year || !form.telefono)
      return setErr("Por favor no dejes ningun campo vacio");
    setLoading(true);
    try {
      if (!(await requireAuth())) {
        setLoading(false);
        return setErr("La autentificacion ha fallado");
      }
      await updateUser(
        form.telefono,
        form.nombre,
        form.dia,
        form.mes,
        form.year
      );
      await updateProfile();
    } catch (err) {
      setLoading(false);
      console.log(err);
      setErr("Algo salio mal");
    }
  };

  return (
    <>
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <RText style={styles.titulo}>Datos Importantes</RText>
        <RText tipo={"thin"}>No le muestres estos datos a nadie</RText>
        {err && <RText style={s.errText}>{err}</RText>}
        <View style={styles.dataArea}>
          <RText style={styles.dataText}>Correo:</RText>
          <RText style={styles.dataText} tipo={"bold"}>
            {currentUser.user.email}
          </RText>
        </View>
        <View style={{ width: "90%" }}>
          <View style={s.formulario}>
            <View style={s.intputContainer}>
              <TextInput
                style={s.input}
                value={form.nombre}
                onChangeText={(value) => {
                  setForm((prev) => {
                    if (value.length > 8) return { ...prev };
                    return { ...prev, nombre: value };
                  });
                }}
                placeholder="Nombre"
              />
            </View>
            <RText>Fecha de nacimiento</RText>
            <View style={s.nacimientoInput}>
              <TextInput
                style={{ ...s.input, ...s.inputFecha }}
                placeholder="DD"
                keyboardType="numeric"
                value={form.dia}
                onChangeText={(value) =>
                  setForm((prev) => {
                    if (value.length > 2 || value.length < 0)
                      return { ...prev };
                    if (value > 31) return { ...prev, dia: "01" };
                    return { ...prev, dia: value };
                  })
                }
              />
              <TextInput
                style={{ ...s.input, ...s.inputFecha }}
                placeholder="MM"
                keyboardType="numeric"
                value={form.mes}
                onChangeText={(value) =>
                  setForm((prev) => {
                    if (value.length > 2 || value.length < 0)
                      return { ...prev };
                    if (value > 12) return { ...prev, mes: "01" };
                    return { ...prev, mes: value };
                  })
                }
              />
              <TextInput
                style={{ ...s.input, ...s.inputFecha }}
                placeholder="AAAA"
                keyboardType="numeric"
                value={form.year}
                onChangeText={(value) =>
                  setForm((prev) => {
                    if (value.length > 4 || value.length < 0)
                      return { ...prev };
                    return { ...prev, year: value };
                  })
                }
              />
            </View>
            <View style={s.intputContainer}>
              <TextInput
                style={s.input}
                placeholder="Telefono"
                keyboardType="numeric"
                value={form.telefono}
                onChangeText={(value) =>
                  setForm((prev) => {
                    return { ...prev, telefono: value };
                  })
                }
              />
            </View>
          </View>
          <MainButton width={1} blocked={!updatable} callback={() => update()}>
            Actualizar
          </MainButton>
          {loading && <Loader size={100} />}
        </View>
        {/* <View style={styles.dataArea}>
          <RText style={styles.dataText}>Telefono:</RText>
          <RText style={styles.dataText} tipo={"bold"}>
          {currentUser.telefono}
          </RText>
          </View>
          <View style={styles.dataArea}>
          <RText style={styles.dataText}>Correo:</RText>
          <RText style={styles.dataText} tipo={"bold"}>
            {currentUser.user.email}
          </RText>
        </View>
        <View style={styles.dataArea}>
          <RText style={styles.dataText}>Fecha de nacimiento:</RText>
          <RText style={styles.dataText} tipo={"bold"}>
            {currentUser.nacimiento.d}/{currentUser.nacimiento.m}/
            {currentUser.nacimiento.a}
          </RText>
        </View> */}
      </View>
      <Navbar navigation={navigation} />
    </>
  );
}
const styles = StyleSheet.create({
  titulo: {
    fontSize: 30,
    textAlign: "center",
  },
  dataArea: {
    width: "90%",
    marginVertical: 10,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  data: {
    fontSize: 15,
  },
  dataText: {
    fontSize: 15,
  },
});
