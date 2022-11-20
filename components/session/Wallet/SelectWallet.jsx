import { View, StyleSheet, TouchableOpacity } from "react-native";
import React, { useState, useEffect } from "react";
import RText from "../../RText";
import Loader from "../../Loader";
import MainButton from "../../buttons";
import useAuth from "../../../context/AuthContext";
import Download from "../../../assets/svg/download.svg";
import Polyline from "../../../assets/svg/polyline.svg";
import s from "../../styles";
export default function SelectWallet({ create }) {
  const { selectType } = useAuth();
  const [type, setType] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  return (
    <>
      <View style={styles.formularioContainer}>
        <View style={styles.formulario}>
          {err && <RText style={s.errText}>{err}</RText>}
          <View style={styles.selectionView}>
            <TouchableOpacity
              style={
                type === "import"
                  ? styles.optionSelected
                  : styles.optionNotSelected
              }
              onPress={() => setType("import")}
            >
              <Download
                height={50}
                width={50}
                fill={type == "import" ? "#f40038" : "black"}
              />
              <RText style={{ color: type === "import" ? "#f40038" : "black" }}>
                Importar
              </RText>
            </TouchableOpacity>
            <TouchableOpacity
              style={
                type === "generate"
                  ? styles.optionSelected
                  : styles.optionNotSelected
              }
              onPress={() => setType("generate")}
            >
              <Polyline
                height={50}
                width={50}
                fill={type == "generate" ? "#f40038" : "black"}
              />
              <RText
                style={{ color: type == "generate" ? "#f40038" : "black" }}
              >
                Generar
              </RText>
            </TouchableOpacity>
          </View>
          <MainButton width={1} callback={() => create(type)}>
            Crear Wallet
          </MainButton>
          {loading && <Loader size={100} />}
        </View>
      </View>
    </>
  );
}
const styles = StyleSheet.create({
  formularioContainer: {
    // flex: 1,
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
