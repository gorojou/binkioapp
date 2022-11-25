import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import Close from "../assets/svg/close.svg";
import React from "react";
export default function Popup({ children, setShow, closingValue, onClose }) {
  return (
    <>
      <TouchableOpacity
        style={styles.popUpContainer}
        onPress={() => {
          if (setShow) setShow(closingValue ? closingValue : false);
          if (onClose) onClose();
        }}
      >
        <View
          style={styles.popup}
          onStartShouldSetResponder={(event) => true}
          onTouchEnd={(e) => {
            e.stopPropagation();
          }}
        >
          <View style={styles.closeSection}>
            <TouchableOpacity
              onPress={() => {
                if (setShow) setShow(closingValue ? closingValue : false);
                if (onClose) onClose();
              }}
            >
              <Close fill={"#F44F46"} width={20} height={20} />
            </TouchableOpacity>
          </View>
          <View style={{ padding: 15 }}>{children}</View>
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
    borderRadius: 20,
    overflow: "hidden",
  },
  closeSection: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "flex-end",
    paddingRight: 10,
    paddingTop: 10,
  },
});
