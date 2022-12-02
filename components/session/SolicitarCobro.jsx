import { View, Text, TextInput, KeyboardAvoidingView } from "react-native";
import React, { useState } from "react";
import s from "../styles";
import RText from "../RText";
import SelectToken from "./SelectToken";
import Navbar from "./Navbar";
import useAuth from "../../context/AuthContext";
import { Alert } from "react-native";
import Loader from "../Loader";
export default function SolicitarCobro({ navigation }) {
  const [form, setForm] = useState({
    amount: "",
    email: "",
  });
  const { updateProfile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState();
  const requestPayment = async () => {
    setErr("");
    if (!form.email || !form.amount)
      return setErr("Por favor no dejes ningun campo vacio");
    if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/.test(form.email))
      return setErr("Email invalido");
    setLoading(true);
    setTimeout(async () => {
      Alert.alert("Cobro enviado");
      await updateProfile();
    }, 3000);
  };
  return (
    <>
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <View style={{ ...s.formulario, width: "90%" }}>
          <RText style={s.formTitle}>Crear nuevo cobro</RText>
          <RText tipo={"thin"} style={s.sessionTitle}>
            Ingresa la cantida de dinero, que criptomoneda y correo del usuario.
          </RText>
          {err && <RText style={s.errText}>{err}</RText>}
          <KeyboardAvoidingView>
            <RText>Cantidad a pagar</RText>
            <View style={s.intputContainer}>
              <TextInput
                style={s.input}
                placeholder="Cantidad a pagar"
                value={form.amount}
                keyboardType="numeric"
                onChangeText={(value) =>
                  setForm((prev) => {
                    return { ...prev, amount: value };
                  })
                }
              />
            </View>
            <View style={{ marginVertical: 20 }}>
              <RText style={s.sessionTitle}>Selecciona cryptomoneda</RText>
              <SelectToken />
            </View>
            <RText>Correo electrónico del usuario</RText>
            <View style={s.intputContainer}>
              <TextInput
                style={s.input}
                placeholder="Correo"
                value={form.email}
                onChangeText={(value) =>
                  setForm((prev) => {
                    return { ...prev, email: value };
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
              <MainButton fontSize={15} callback={() => requestPayment()}>
                Crear Recibo
              </MainButton>
            </View>
          </KeyboardAvoidingView>
          {loading && <Loader size={100} />}
        </View>
      </View>
      <Navbar navigation={navigation} />
    </>
  );
}
