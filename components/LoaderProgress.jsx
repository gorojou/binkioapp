import { View, Text, StyleSheet, Animated, Easing } from "react-native";
import React, { useState, useEffect, useRef } from "react";
import RText from "./RText";

export default function LoaderProgress({ progress }) {
  const styles = StyleSheet.create({
    progress: {
      fontSize: 35,
    },
    loaderContainer: {
      position: "absolute",
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
      backgroundColor: "#ffffffaa",
      justifyContent: "center",
      alignItems: "center",
    },
  });
  return (
    <View style={styles.loaderContainer}>
      <RText style={styles.progress}>{progress}%</RText>
    </View>
  );
}
