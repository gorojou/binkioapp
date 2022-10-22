import { View, TextInput, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import RText from "../RText";
import MainButton from "../buttons";
import { StyleSheet } from "react-native";
import Person from "../../assets/svg/person.svg";
import Store from "../../assets/svg/store.svg";
import Loader from "../Loader";
export default function Register({ navigation }) {
  const [section, setSection] = useState(false);
  const [loading, setLoading] = useState(false);
  const register = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSection(true);
    }, 3000);
  };
  return (
    <View style={styles.formulario}>
      {section ? (
        <SelectType navigation={navigation} />
      ) : (
        <>
          <RText style={styles.formTitle} tipo={"bold"}>
            Registrate
          </RText>
          <RText style={styles.sessionTitle} tipo={"thin"}>
            !Se parte de la comunidad Binkio!
          </RText>
          <View style={styles.intputContainer}>
            <TextInput style={styles.input} placeholder="Correo" />
          </View>
          <View style={styles.intputContainer}>
            <TextInput style={styles.input} placeholder="Nombre" />
          </View>
          <View style={styles.intputContainer}>
            <TextInput style={styles.input} placeholder="Telefono" />
          </View>
          <View style={styles.intputContainer}>
            <TextInput style={styles.input} placeholder="Contraseña" />
          </View>
          <MainButton width={1} callback={() => register()}>
            Registrate
          </MainButton>
          {loading && <Loader size={100} />}
        </>
      )}
    </View>
  );
}

const SelectType = ({ navigation }) => {
  const [type, setType] = useState("");
  const [loading, setLoading] = useState(false);
  const register = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      navigation.navigate("dash");
    }, 3000);
  };
  return (
    <>
      <RText style={styles.formTitle} tipo={"bold"}>
        Ya casi
      </RText>
      <RText style={styles.sessionTitle} tipo={"thin"}>
        !Selecciona la opcion acorde a ti!
      </RText>
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
          <RText style={{ color: type === "negocio" ? "#f40038" : "black" }}>
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
    </>
  );
};

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
