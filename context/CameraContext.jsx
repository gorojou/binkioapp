import { View, Text } from "react-native";
import React, { useState, useEffect, useContext } from "react";
import { Camera } from "expo-camera";
const CameraContext = React.createContext();
export default function useAuth() {
  return useContext(CameraContext);
}
export default function CameraProvider({children}) {
  const [hasPermission, setHasPermission] = useState(null);
  const [type, setType] = useState(Camera.Constants.Type.back);

  const requirePermission = async () => {
    const { status } = await Camera.requestCameraPermissionsAsync();
    setHasPermission(status === "granted");
    return status === "granted";
  };

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  }, []);

  return (
    <CameraContext.Provider >
      {children}
    </CameraContext.Provider>
  );
}