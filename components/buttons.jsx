import { TouchableOpacity, View } from "react-native";
import RText from "./RText";
import s from "./styles";
export default MainButton = ({ children, width, callback }) => {
  return (
    <View style={{ flexDirection: "row", justifyContent: "center" }}>
      <TouchableOpacity
        style={{ ...s.button, flex: width }}
        onPress={() => callback()}
      >
        <RText style={{ color: "white", fontSize: 20 }}>{children}</RText>
      </TouchableOpacity>
    </View>
  );
};
export function SecondaryButton({ children, width, callback }) {
  return (
    <View style={{ flexDirection: "row", justifyContent: "center" }}>
      <TouchableOpacity
        style={{ ...s.secondaryButton, flex: width }}
        onPress={() => callback()}
      >
        <RText style={{ color: "black", fontSize: 20 }}>{children}</RText>
      </TouchableOpacity>
    </View>
  );
}
