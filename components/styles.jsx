import { StyleSheet } from "react-native";

module.exports = StyleSheet.create({
  container: {
    flex: 1,
    overflow: "scroll",
  },
  formulario: {
    justifyContent: "center",
    alignItems: "center",
  },
  button: {
    justifyContent: "center",
    alignItems: "center",
    flex: 0.7,
    backgroundColor: "black",
    padding: 12,
    borderRadius: 15,
  },
  secondaryButton: {
    justifyContent: "center",
    alignItems: "center",
    flex: 0.7,
    backgroundColor: "white",
    borderStyle: "solid",
    borderColor: "black",
    borderWidth: 1,
    padding: 12,
    borderRadius: 15,
  },
  nacimientoInput: {
    flexDirection: "row",
  },
  inputFecha: {
    marginHorizontal: 3,
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
  sessionTitle: {
    textAlign: "center",
  },
  formTitle: {
    fontSize: 30,
  },
  errText: {
    color: "red",
  },
});
