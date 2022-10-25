import { StyleSheet } from "react-native";

module.exports = StyleSheet.create({
  button: {
    justifyContent: "center",
    alignItems: "center",
    flex: 0.7,
    backgroundColor: "black",
    padding: 15,
    borderRadius: 40,
    marginTop: 30,
    width: "80%",
  },
  secondaryButton: {
    justifyContent: "center",
    alignItems: "center",
    flex: 0.7,
    backgroundColor: "white",
    borderStyle: "solid",
    borderColor: "black",
    borderWidth: 1,
    padding: 15,
    borderRadius: 40,
    marginTop: 20,
  },
  errText: {
    color: "red",
  },
});
