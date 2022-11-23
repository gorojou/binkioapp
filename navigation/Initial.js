import React, { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Welcome from "../components/Welcome";
import Session from "../components/access";
import Dashboard from "../components/session/Dashboard";
import useAuth from "../context/AuthContext";
import SelectType from "../components/session/SelectType";
import Wallet from "../components/session/Wallet";
import Profile from "../components/session/Profile";
import FTXProvider from "../context/FTXContext";
import SolicitudCredito from "../components/session/SolicitudCredito";
import Enviar from "../components/session/Enviar";
import Garantia from "../components/session/Garantia";
import Recibir from "../components/session/Recibir";
import BlockchainContext from "../context/BlockchainContext";
import KYC from "../components/session/KYC";
import OnRegister from "../components/session/Wallet/OnRegister";
import PopupProvider from "../context/Popup";
import Presentation from "../components/Presentation";
import AsyncStorage from "@react-native-async-storage/async-storage";
import PinForm from "../components/session/PinForm";
const Stack = createNativeStackNavigator();

const MyStack = () => {
  const { currentUser, wallets } = useAuth();
  const [presentation, setPresentation] = useState();
  useEffect(() => {
    const app = async () => {
      setPresentation(await AsyncStorage.getItem("presentation"));
    };
    app();
  }, []);
  return (
    <FTXProvider>
      <BlockchainContext>
        <PopupProvider>
          <NavigationContainer>
            <Stack.Navigator
              initialRouteName={currentUser ? "dash" : "Home"}
              screenOptions={{
                headerShown: false,
                header: () => null,
                contentStyle: { backgroundColor: "white" },
              }}
            >
              {currentUser ? (
                <>
                  {currentUser.type ? (
                    <>
                      {currentUser.verified ? (
                        <>
                          {currentUser.pin ? (
                            <>
                              {wallets ? (
                                <>
                                  <Stack.Screen
                                    name="dash"
                                    component={Dashboard}
                                  />
                                  <Stack.Screen
                                    name="profile"
                                    component={Profile}
                                  />
                                  <Stack.Screen
                                    name="wallet"
                                    component={Wallet}
                                  />
                                  <Stack.Screen
                                    name="solicitud"
                                    component={SolicitudCredito}
                                  />
                                  <Stack.Screen
                                    name="enviar"
                                    component={Enviar}
                                  />
                                  <Stack.Screen
                                    name="garantia"
                                    component={Garantia}
                                  />
                                  <Stack.Screen
                                    name="recibir"
                                    component={Recibir}
                                  />
                                </>
                              ) : (
                                <>
                                  <Stack.Screen
                                    name="createWallet"
                                    component={OnRegister}
                                    options={{ showNav: true }}
                                  />
                                </>
                              )}
                            </>
                          ) : (
                            <>
                              <Stack.Screen
                                name="pinform"
                                component={PinForm}
                              />
                            </>
                          )}
                        </>
                      ) : (
                        <>
                          <Stack.Screen name="kyc" component={KYC} />
                        </>
                      )}
                    </>
                  ) : (
                    <Stack.Screen name="selectType" component={SelectType} />
                  )}
                </>
              ) : (
                <>
                  {presentation === null && (
                    <Stack.Screen name="Home" component={Presentation} />
                  )}
                  {/* <Stack.Screen name={"Welcome"} component={Welcome} /> */}
                  <Stack.Screen
                    name={presentation === null ? "Welcome" : "Home"}
                    component={Welcome}
                  />
                  <Stack.Screen
                    name="register"
                    component={Session}
                    options={{ form: true }}
                  />
                  <Stack.Screen
                    name="login"
                    component={Session}
                    options={{ form: false }}
                  />
                </>
              )}
            </Stack.Navigator>
          </NavigationContainer>
        </PopupProvider>
      </BlockchainContext>
    </FTXProvider>
  );
};
export default MyStack;
