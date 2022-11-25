import { TouchableOpacity, View } from "react-native";
import RText from "./RText";
import s from "./styles";
export default MainButton = ({
  style,
  children,
  width,
  callback,
  fontSize,
  blocked,
}) => {
  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "center",
        position: "relative",
        borderRadius: 15,
        overflow: "hidden",
        ...style,
      }}
    >
      <TouchableOpacity
        style={{ ...s.button, flex: width }}
        onPress={() => callback()}
      >
        <RText style={{ color: "white", fontSize: fontSize ? fontSize : 20 }}>
          {children}
        </RText>
      </TouchableOpacity>
      {blocked && (
        <View
          style={{
            position: "absolute",
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
            backgroundColor: "#f3f3f3a1",
          }}
        ></View>
      )}
    </View>
  );
};
export function SecondaryButton({
  style,
  children,
  width,
  callback,
  fontSize,
}) {
  return (
    <View style={{ flexDirection: "row", justifyContent: "center", ...style }}>
      <TouchableOpacity
        style={{ ...s.secondaryButton, flex: width }}
        onPress={() => callback()}
      >
        <RText style={{ color: "black", fontSize: fontSize ? fontSize : 20 }}>
          {children}
        </RText>
      </TouchableOpacity>
    </View>
  );
}
