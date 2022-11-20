import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import React, { useState, useContext } from "react";
const PopupContext = React.createContext();
export function usePopup() {
  return useContext(PopupContext);
}

export default function PopupProvider({ children }) {
  const [show, setShow] = useState();
  const [component, setComponent] = useState(false);
  const [closingValue, setClosingValue] = useState();
  const value = { setComponent, setShow, setClosingValue };
  return (
    <PopupContext.Provider value={value}>
      {children}
      {show && (
        <Popup setShow={setShow} closingValue={closingValue}>
          {component}
        </Popup>
      )}
    </PopupContext.Provider>
  );
}

const Popup = ({ children, setShow, closingValue }) => {
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
};
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
    zIndex: 99999999999,
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