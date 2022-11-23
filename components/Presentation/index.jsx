import {
  View,
  Text,
  StyleSheet,
  Image,
  Animated,
  Easing,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import RText from "../RText";
import React, { useState, useEffect, useRef } from "react";
import MainButton from "../buttons";
import AsyncStorage from "@react-native-async-storage/async-storage";
export default function Presentation({ navigation }) {
  const [slide, setSlide] = useState(0);
  const [slideTo, setSlideTo] = useState(0);
  const barIndicatorPosition = useRef(new Animated.Value(slide)).current;
  const section = useRef(new Animated.Value(slide)).current;
  const selectCorrectSlide = () => {
    switch (slide) {
      case 0:
        return <FirstSlide />;
      case 1:
        return <SeocndSlide />;
      case 2:
        return <ThirdSlide />;
      default:
        return <FirstSlide />;
    }
  };
  const continueToAccess = async () => {
    await AsyncStorage.setItem("presentation", "true");
    navigation.navigate("Welcome");
  };
  useEffect(() => {
    Animated.timing(barIndicatorPosition, {
      toValue: slideTo * 15 + 5 * slideTo,
      useNativeDriver: true,
      duration: 400,
      easing: Easing.linear(),
    }).start();
    Animated.timing(section, {
      toValue:
        slide < slideTo
          ? -Dimensions.get("window").width
          : Dimensions.get("window").width,
      useNativeDriver: true,
      duration: 200,
      easing: Easing.linear(),
    }).start();
    setTimeout(() => {
      section.setValue(
        slide < slideTo
          ? Dimensions.get("window").width
          : -Dimensions.get("window").width
      );
      Animated.timing(section, {
        toValue: 0,
        useNativeDriver: true,
        duration: 200,
        easing: Easing.linear(),
      }).start();
      setSlide(slideTo);
    }, 200);
  }, [slideTo]);
  return (
    <>
      <View style={styles.container}>
        <Animated.View
          style={{
            justifyContent: "center",
            alignItems: "center",
            transform: [{ translateX: section }],
          }}
        >
          {selectCorrectSlide()}
        </Animated.View>
      </View>
      <View style={styles.presentationNav}>
        <View style={styles.dots}>
          <TouchableOpacity
            onPress={() => setSlideTo(0)}
            style={styles.dot}
          ></TouchableOpacity>
          <TouchableOpacity
            onPress={() => setSlideTo(1)}
            style={styles.dot}
          ></TouchableOpacity>
          <TouchableOpacity
            onPress={() => setSlideTo(1)}
            style={styles.dot}
          ></TouchableOpacity>
          <TouchableOpacity
            onPress={() => setSlideTo(2)}
            style={styles.dot}
          ></TouchableOpacity>
          <Animated.View
            style={{
              ...styles.dotIndicator,
              transform: [{ translateX: barIndicatorPosition }],
            }}
          ></Animated.View>
        </View>
        <MainButton
          callback={() =>
            slideTo === 2 ? continueToAccess() : setSlideTo(slideTo + 1)
          }
        >
          Siguiente
        </MainButton>
      </View>
    </>
  );
}

const FirstSlide = () => {
  useEffect(() => {}, []);
  return (
    <>
      <Image
        style={styles.mainimage}
        source={require("../../assets/blankpfp.jpg")}
      />
      <RText style={styles.mainText} tipo={"bold"}>
        Acepta pagos con cripto
      </RText>
      <RText style={styles.text} tipo={"thin"}>
        Moderniza tu negocio y acepta pagos a travez de diferentes criptomoneas
        disponibles en el app.
      </RText>
    </>
  );
};
const SeocndSlide = () => {
  useEffect(() => {}, []);
  return (
    <>
      <Image
        style={styles.mainimage}
        source={require("../../assets/blankpfp.jpg")}
      />
      <RText style={styles.mainText} tipo={"bold"}>
        Solicita tu crédito
      </RText>
      <RText style={styles.text} tipo={"thin"}>
        Moderniza tu negocio y acepta pagos a través de diferentes criptomoneas
        disponibles en el app.
      </RText>
    </>
  );
};
const ThirdSlide = () => {
  useEffect(() => {}, []);
  return (
    <>
      <Image
        style={styles.mainimage}
        source={require("../../assets/blankpfp.jpg")}
      />
      <RText style={styles.mainText} tipo={"bold"}>
        Paga con Crypto súper fácil
      </RText>
      <RText style={styles.text} tipo={"thin"}>
        Moderniza tu negocio y acepta pagos a través de diferentes cryptomonedas
        disponibles en el app
      </RText>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
  },
  mainimage: {
    width: 250,
    height: 250,
    borderRadius: 250,
    marginBottom: 30,
  },
  mainText: {
    fontSize: 25,
    textAlign: "center",
  },
  text: {
    fontSize: 15,
    textAlign: "center",
    marginTop: 10,
    maxWidth: "90%",
  },
  presentationNav: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
  },
  dots: {
    flexDirection: "row",
    // padding: 20,
    position: "relative",
  },
  dot: {
    width: 15,
    height: 15,
    borderRadius: 15,
    marginRight: 5,
    backgroundColor: "#e3e3e3",
  },
  dotIndicator: {
    position: "absolute",
    width: 35,
    backgroundColor: "black",
    height: 15,
    borderRadius: 15,
  },
});
