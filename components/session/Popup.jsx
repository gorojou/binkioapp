import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import React from "react";
export default function Popup({ children, setShow, closingValue }) {
  return (
    <>
      <TouchableOpacity
        style={styles.popUpContainer}
        onPress={() => setShow && setShow(closingValue ? closingValue : false)}
      >
        <View
          style={styles.popup}
          onStartShouldSetResponder={(event) => true}
          onTouchEnd={(e) => {
            e.stopPropagation();
          }}
        >
          {children}
        </View>
      </TouchableOpacity>
    </>
  );
}
const styles = StyleSheet.create({
  popUpContainer: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#ffffffaa",
    justifyContent: "center",
    alignItems: "center",
  },
  absolute: {
    position: "absolute",
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
  popup: {
    width: "90%",
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.36,
    shadowRadius: 6.68,
    marginHorizontal: 2.5,
    elevation: 11,
    backgroundColor: "white",
    padding: 15,
    borderRadius: 20,
  },
});
