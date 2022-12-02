import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import React, { useContext, useEffect, useState } from "react";
import TitleLogo from "../components/TitleLogo";
import GoBack from "../assets/svg/goBack.svg";
import { useNavigation } from "@react-navigation/native";
import RText from "../components/RText";
const HeaderContext = React.createContext();
export function useHeader() {
  return useContext(HeaderContext);
}
export default function HeaderProvider({ children }) {
  const navigation = useNavigation();
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  useEffect(() => {
    const app = () => {
      navigation.addListener("state", (navigationState) => {
        if (navigationState.data.state)
          setShowLeftArrow(navigationState.data.state.index > 0);
      });
    };
    return app();
  }, []);

  return (
    <HeaderContext.Provider value={() => {}}>
      <View style={styles.titleContainer}>
        {showLeftArrow && (
          <TouchableOpacity
            style={styles.leftButton}
            onPress={() =>
              navigation.canGoBack() ? navigation.goBack() : () => {}
            }
          >
            <GoBack fill={"#f40038"} width={40} height={40} />
          </TouchableOpacity>
        )}
        <TitleLogo />
      </View>
      {children}
    </HeaderContext.Provider>
  );
}
const styles = StyleSheet.create({
  titleContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    flexDirection: "row",
    position: "relative",
  },
  leftButton: {
    position: "absolute",
    left: 5,
  },
});
