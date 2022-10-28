import { View, Text, Image } from "react-native";
import React, { useState } from "react";
import useAuth from "../../context/AuthContext";

export default function PfpImage({ styles, size }) {
  const { currentUser } = useAuth();
  const [imageLoaded, setImageLoaded] = useState(false);
  return (
    <>
      <View style={{ position: "relative" }}>
        <Image
          onLoad={() => setImageLoaded(true)}
          source={
            currentUser.pfp
              ? { uri: currentUser.pfp }
              : require("../../assets/blankpfp.jpg")
          }
          style={{
            width: size ? size : 30,
            height: size ? size : 30,
            borderRadius: size ? size * 2 : 60,
            ...styles,
          }}
        />
        {!imageLoaded && (
          <Image
            source={require("../../assets/blankpfp.jpg")}
            style={{
              position: "absolute",
              width: size ? size : 30,
              height: size ? size : 30,
              borderRadius: size ? size * 2 : 60,
              ...styles,
            }}
          />
        )}
      </View>
    </>
  );
}
