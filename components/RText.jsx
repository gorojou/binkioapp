import React, { useState, useEffect } from "react";
import { Text } from "react-native";
import {
  useFonts,
  Roboto_500Medium,
  Roboto_900Black,
  Roboto_100Thin,
} from "@expo-google-fonts/roboto";
function RText({ children, style, tipo }) {
  useEffect(() => {
    switch (tipo) {
      case "":
        setType("Roboto_500Medium");
        break;
      case "thin":
        setType("Roboto_100Thin");
        break;
      case "bold":
        setType("Roboto_900Black");
        break;
      default:
        setType("Roboto_500Medium");
        break;
    }
  }, []);
  const [type, setType] = useState("Roboto_500Medium");
  let [fontsLoaded] = useFonts({
    Roboto_500Medium,
    Roboto_900Black,
    Roboto_100Thin,
  });
  if (!fontsLoaded) {
    return null;
  }
  return (
    <>
      <Text
        style={{
          ...style,
          fontFamily: type,
        }}
      >
        {children}
      </Text>
    </>
  );
}
export default RText;
