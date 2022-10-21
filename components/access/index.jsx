import React, { useState } from "react";
import Login from "./Login";
import Register from "./Register";
import { StyleSheet, View, Dimensions } from "react-native";
import RText from "../RText";
function Session({ navigation, route }) {
  return (
    <>
      <View style={styles.sessionContainer}>
        <View style={styles.formContainer}>
          {route.name === "login" ? (
            <Login navigation={navigation} />
          ) : (
            <Register navigation={navigation} />
          )}
        </View>
      </View>
    </>
  );
}
const styles = StyleSheet.create({
  sessionContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  formContainer: {
    width: Dimensions.get("window").width - 30,
  },
  sessionTitle: {
    fontSize: 25,
    textAlign: "center",
    marginBottom: 40,
  },
});
export default Session;
