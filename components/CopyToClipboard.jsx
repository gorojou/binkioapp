import {
  View,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from "react-native";
import RText from "./RText";
import Copy from "../assets/svg/copy.svg";
import * as Clipboard from "expo-clipboard";
export default function CopyToClipboard({ value }) {
  return (
    <View style={styles.walletContainer}>
      <RText style={styles.wallet}>{value}</RText>
      <TouchableOpacity
        onPress={() => {
          Alert.alert("Copiado");
          Clipboard.setStringAsync(value);
        }}
      >
        <Copy height={30} width={30} fill={"black"} />
      </TouchableOpacity>
    </View>
  );
}
const styles = StyleSheet.create({
  walletContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 10,
    width: "100%",
  },
  wallet: {
    backgroundColor: "#f3f3f3",
    flex: 1,
    padding: 10,
    borderRadius: 20,
    // marginTop: 20,
    textAlign: "center",
    marginRight: 5,
  },
});
