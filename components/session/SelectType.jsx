import { View, StyleSheet, TouchableOpacity } from "react-native";
import React, { useState, useEffect } from "react";
import RText from "../RText";
import Loader from "../Loader";
import MainButton from "../buttons";
import useAuth from "../../context/AuthContext";
import Person from "../../assets/svg/person.svg";
import Store from "../../assets/svg/store.svg";
import s from "../styles";
export default function SelectType() {
  const { selectType } = useAuth();
  const [type, setType] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const register = async () => {
    setLoading(true);
    try {
      await selectType(type);
      setLoading(false);
    } catch (err) {
      setErr(err.message);
      setLoading(false);
    }
  };
  return (
    <>
      <View style={styles.formularioContainer}>
        <View style={styles.formulario}>
          <RText style={styles.formTitle} tipo={"bold"}>
            Ya casi
          </RText>
          <RText style={styles.sessionTitle} tipo={"thin"}>
            !Selecciona la opcion acorde a ti!
          </RText>
          {err && <RText style={s.errText}>{err}</RText>}
          <View style={styles.selectionView}>
            <TouchableOpacity
              style={
                type === "negocio"
                  ? styles.optionSelected
                  : styles.optionNotSelected
              }
              onPress={() => setType("negocio")}
            >
              <Store
                height={50}
                width={50}
                fill={type == "negocio" ? "#f40038" : "black"}
              />
              <RText
                style={{ color: type === "negocio" ? "#f40038" : "black" }}
              >
                Negocio
              </RText>
            </TouchableOpacity>
            <TouchableOpacity
              style={
                type === "cliente"
                  ? styles.optionSelected
                  : styles.optionNotSelected
              }
              onPress={() => setType("cliente")}
            >
              <Person
                height={50}
                width={50}
                fill={type == "cliente" ? "#f40038" : "black"}
              />
              <RText style={{ color: type == "cliente" ? "#f40038" : "black" }}>
                Cliente
              </RText>
            </TouchableOpacity>
          </View>
          <MainButton width={1} callback={() => register()}>
            Registrarme
          </MainButton>
          {loading && <Loader size={100} />}
        </View>
      </View>
    </>
  );
}
const styles = StyleSheet.create({
  formularioContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  formulario: {
    justifyContent: "center",
    alignItems: "center",
    width: "90%",
  },
  formTitle: {
    fontSize: 30,
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
