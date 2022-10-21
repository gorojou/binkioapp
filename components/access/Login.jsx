import { View, StyleSheet, TextInput } from "react-native";
import React from "react";
import RText from "../RText";
export default function Login({ navigation }) {
  return (
    <View style={styles.formulario}>
      <>
        <RText style={styles.formTitle} tipo={"bold"}>
          Ingresa
        </RText>
        <RText style={styles.sessionTitle} tipo={"thin"}>
          !Hola nuevamente!
        </RText>
        <View style={styles.intputContainer}>
          <TextInput style={styles.input} placeholder="Correo" />
        </View>
        <View style={styles.intputContainer}>
          <TextInput style={styles.input} placeholder="Contraseña" />
        </View>
        <MainButton width={1} callback={() => navigation.navigate("dash")}>
          Ingresa
        </MainButton>
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
