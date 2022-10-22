import { View, Text, StyleSheet, Animated, Easing } from "react-native";
import React, { useState, useEffect, useRef } from "react";

export default function Loader({ size }) {
  const styles = StyleSheet.create({
    lsdGrid: {
      height: size,
      width: size,
    },
    lsd: {
      position: "absolute",
      width: size / 5,
      height: size / 5,
      borderRadius: 50,
      backgroundColor: "#f40038",
    },
    lsd1: {
      top: size / 10,
      left: size / 10,
    },
    lsd2: {
      top: size / 10,
      left: size / 2.5,
    },
    lsd3: {
      top: size / 10,
      left: size / 1.42,
    },
    lsd4: {
      top: size / 2.5,
      left: size / 10,
    },
    lsd5: {
      top: size / 2.5,
      left: size / 2.5,
    },
    lsd6: {
      top: size / 2.5,
      left: size / 1.42,
    },
    lsd7: {
      top: size / 1.42,
      left: size / 10,
    },
    lsd8: {
      top: size / 1.42,
      left: size / 2.5,
    },
    lsd9: {
      top: size / 1.42,
      left: size / 1.42,
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
      <View style={styles.lsdGrid}>
        <Ball style={{ ...styles.lsd, ...styles.lsd1 }} time={0} />
        <Ball style={{ ...styles.lsd, ...styles.lsd2 }} time={200} />
        <Ball style={{ ...styles.lsd, ...styles.lsd3 }} time={400} />
        <Ball style={{ ...styles.lsd, ...styles.lsd4 }} time={200} />
        <Ball style={{ ...styles.lsd, ...styles.lsd5 }} time={400} />
        <Ball style={{ ...styles.lsd, ...styles.lsd6 }} time={600} />
        <Ball style={{ ...styles.lsd, ...styles.lsd7 }} time={400} />
        <Ball style={{ ...styles.lsd, ...styles.lsd8 }} time={600} />
        <Ball style={{ ...styles.lsd, ...styles.lsd9 }} time={800} />
      </View>
    </View>
  );
}
const Ball = ({ style, time }) => {
  const opacity = useRef(new Animated.Value(1)).current;
  useEffect(() => {
    setTimeout(() => {
      const start = Animated.timing(opacity, {
        toValue: 1,
        useNativeDriver: true,
        duration: 800,
        easing: Easing.linear(),
      });
      const finish = Animated.timing(opacity, {
        toValue: 0.2,
        useNativeDriver: true,
        duration: 800,
        easing: Easing.linear(),
      });
      Animated.loop(Animated.sequence([finish, start])).start();
    }, time);
  }, []);

  return <Animated.View style={{ ...style, opacity: opacity }}></Animated.View>;
};
