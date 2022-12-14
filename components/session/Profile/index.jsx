import {
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from "react-native";
import React, { useState } from "react";
import RText from "../../RText";
import Navbar from "../Navbar";
import useAuth from "../../../context/AuthContext";
import * as ImagePicker from "expo-image-picker";
import MainButton, { SecondaryButton } from "../../buttons";
import firebase, { storage, firestore } from "../../../firebase";
import Loader from "../../Loader";
import PfpImage from "../PfpImage";
import AccountSettings from "../../../assets/svg/accountSettings.svg";
import Privacy from "../../../assets/svg/privacyShield.svg";
import { useNavigation } from "@react-navigation/native";
import Security from "../../../assets/svg/security.svg";
export default function Profile({ navigation }) {
  const { currentUser, uploadPfp, updateProfile } = useAuth();
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const { logOut } = useAuth();
  async function uploadImageAsync() {
    setLoading(true);
    const blob = await new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.onload = function () {
        resolve(xhr.response);
      };
      xhr.onerror = function (e) {
        console.log(e);
        reject(new TypeError("Network request failed"));
      };
      xhr.responseType = "blob";
      xhr.open("GET", image, true);
      xhr.send(null);
    });
    const uploadTask = await storage
      .ref(`/users/${currentUser.user.uid}/pfp/pfp${currentUser.user.uid}`)
      .put(blob);
    await firestore
      .collection("users")
      .doc(currentUser.user.uid)
      .update({ pfp: await uploadTask.ref.getDownloadURL() });
    setLoading(false);
    await updateProfile();
    blob.close();
  }
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });
    if (!result.cancelled) {
      setImage(result.uri);
    }
  };
  return (
    <>
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={pickImage}>
            {image ? (
              <Image
                source={
                  image
                    ? { uri: image }
                    : currentUser.pfp
                    ? { uri: currentUser.pfp }
                    : require("../../../assets/blankpfp.jpg")
                }
                style={styles.pfpImage}
              />
            ) : (
              <PfpImage size={120} />
            )}
            <View style={styles.addPfpIndicator}>
              <RText style={styles.addPfpIndicatorText} tipo={"bold"}>
                +
              </RText>
            </View>
          </TouchableOpacity>
          <View style={styles.headerText}>
            <RText style={styles.headerTextNombre} tipo={"bold"}>
              {currentUser.nombre}
            </RText>
            <RText tipo={"thin"} style={styles.headerTextEmail}>
              {currentUser.user.email}
            </RText>
          </View>
          {image && (
            <MainButton
              width={0.9}
              style={{ marginTop: 20 }}
              callback={uploadImageAsync}
            >
              Cargar imagen de perfil
            </MainButton>
          )}
        </View>
        <View style={styles.hr}></View>
        <View style={styles.body}>
          {/* <View style={styles.dataArea}>
            <RText style={styles.dataText}>Nombre:</RText>
            <RText style={styles.dataText} tipo={"bold"}>
              {currentUser.nombre}
            </RText>
          </View>
          <View style={styles.dataArea}>
            <RText style={styles.dataText}>Telefono:</RText>
            <RText style={styles.dataText} tipo={"bold"}>
              {currentUser.telefono}
            </RText>
          </View>
          <View style={styles.dataArea}>
            <RText style={styles.dataText}>Correo:</RText>
            <RText style={styles.dataText} tipo={"bold"}>
              {currentUser.user.email}
            </RText>
          </View>
          <View style={styles.dataArea}>
            <RText style={styles.dataText}>Fecha de nacimiento:</RText>
            <RText style={styles.dataText} tipo={"bold"}>
              {currentUser.nacimiento.d}/{currentUser.nacimiento.m}/
              {currentUser.nacimiento.a}
            </RText>
          </View> */}
          <ProfileTab
            title={"Datos Importantes"}
            Svg={Privacy}
            route={"datosImportantes"}
          />
          <ProfileTab title={"Seguridad"} Svg={Security} route={"security"} />
          <ProfileTab title={"Idioma"} Svg={AccountSettings} />
          <ProfileTab title={"Politicas de Privacidad"} Svg={AccountSettings} />
          <ProfileTab title={"Ayuda y soporte"} Svg={AccountSettings} />
          <SecondaryButton
            style={{ marginTop: 20 }}
            callback={logOut}
            width={0.8}
          >
            Cerrar sesi??n
          </SecondaryButton>
        </View>
      </ScrollView>
      <Navbar navigation={navigation} />
      {loading && (
        <View
          style={{
            position: "absolute",
            top: 0,
            bottom: 0,
            right: 0,
            left: 0,
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Loader size={100} />
        </View>
      )}
    </>
  );
}
const ProfileTab = ({ title, Svg, route }) => {
  const navigation = useNavigation();
  return (
    <>
      <TouchableOpacity
        style={styles.profileTab}
        onPress={() => (route ? navigation.navigate(route) : () => {})}
      >
        <Svg fill={"#d9d9d9"} />
        <RText style={styles.profileTabTitle}>{title}</RText>
      </TouchableOpacity>
    </>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    overflow: "scroll",
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 30,
    marginTop: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  headerText: {
    marginTop: 10,
  },
  headerTextNombre: {
    fontSize: 30,
    textAlign: "center",
  },
  headerTextEmail: {
    fontSize: 15,
    textAlign: "center",
  },
  titulo: {
    fontSize: 30,
  },
  pfpImage: {
    width: 120,
    height: 120,
    borderRadius: 100,
    marginBottom: 5,
  },
  body: {
    flex: 1,
    alignItems: "center",
    width: "100%",
    paddingBottom: 50,
  },
  dataArea: {
    width: "90%",
    marginVertical: 10,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  data: {
    fontSize: 20,
  },
  dataText: {
    fontSize: 20,
  },
  activity: {
    position: "relative",
    marginVertical: 10,
    padding: 30,
    borderRadius: 30,
    backgroundColor: "#f3f3f3",
    width: "90%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  activityBg: {
    position: "absolute",
    right: 0,
    height: 100,
    width: 100,
    opacity: 0.05,
  },
  nacimiento: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    width: "100%",
  },
  addPfpIndicator: {
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
    bottom: 7,
    right: 7,
    backgroundColor: "#8E63F1",
    width: 20,
    height: 20,
    borderRadius: 30,
  },
  addPfpIndicatorText: {
    color: "white",
    fontSize: 15,
  },
  profileTab: {
    width: "80%",
    paddingVertical: 5,
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
  },
  profileTabTitle: {
    marginLeft: 5,
  },
  hr: {
    width: "100%",
    height: 1,
    backgroundColor: "#00000077",
    marginBottom: 20,
  },
});
