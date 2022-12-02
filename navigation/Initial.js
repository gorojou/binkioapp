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
import SolicitudCredito from "../components/session/SolicitudCredito";
import Enviar from "../components/session/Enviar";
import Garantia from "../components/session/Garantia";
import Recibir from "../components/session/Recibir";
import BlockchainContext from "../context/BlockchainContext";
import KYC from "../components/session/KYC";
import CreateWallet from "../components/session/Wallet/CreateWallet";
import PopupProvider from "../context/Popup";
import Presentation from "../components/Presentation";
import AsyncStorage from "@react-native-async-storage/async-storage";
import PinForm from "../components/session/PinForm";
import LocalAuthenticationProvider from "../context/LocalAuthentication";
import TermsAndConditions from "../components/session/TermsAndConditions";
import Historic from "../components/session/Historic";
import HeaderProvider from "../context/HeaderContext";
import DatosImportantes from "../components/session/Profile/DatosImportantes";
import SolicitarCobro from "../components/session/SolicitarCobro";
import WalletCreation from "../components/session/Wallet/CreateWallet/WalletCreation";
import OnRegisterWalletCreation from "../components/session/Wallet/CreateWallet/OnRegisterWalletCreation";

const Stack = createNativeStackNavigator();

const MyStack = () => {
  const { currentUser, walletsETH, walletsBTC } = useAuth();
  const [presentation, setPresentation] = useState();
  useEffect(() => {
    const app = async () => {
      setPresentation(await AsyncStorage.getItem("presentation"));
    };
    app();
  }, []);
  return (
    <NavigationContainer>
      <HeaderProvider>
        <LocalAuthenticationProvider>
          <BlockchainContext>
            <PopupProvider>
              <Stack.Navigator
                initialRouteName={currentUser ? "dash" : "Home"}
                screenOptions={{
                  headerShown: false,
                  header: () => null,
                  animation: "fade",
                  contentStyle: { backgroundColor: "white" },
                }}
              >
                {currentUser ? (
                  <>
                    {currentUser.type ? (
                      <>
                        {currentUser.terminosYCondiciones ? (
                          <>
                            {currentUser.verified ? (
                              <>
                                {currentUser.pin ? (
                                  <>
                                    {walletsETH ? (
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
                                        <Stack.Screen
                                          name="historic"
                                          component={Historic}
                                        />
                                        <Stack.Screen
                                          name="datosImportantes"
                                          component={DatosImportantes}
                                        />
                                        <Stack.Screen
                                          name="security"
                                          component={PinForm}
                                        />
                                        <Stack.Screen
                                          name="solicitarCobro"
                                          component={SolicitarCobro}
                                        />
                                      </>
                                    ) : (
                                      <>
                                        <Stack.Screen
                                          name="createWallet"
                                          component={OnRegisterWalletCreation}
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
                          <>
                            <Stack.Screen
                              name="termsAndConditions"
                              component={TermsAndConditions}
                            />
                          </>
                        )}
                      </>
                    ) : (
                      <Stack.Screen name="selectType" component={SelectType} />
                    )}
                  </>
                ) : (
                  <>
                    {/* {presentation === null && ( */}
                    <Stack.Screen name="Home" component={Presentation} />
                    {/* )} */}
                    <Stack.Screen name={"Welcome"} component={Welcome} />
                    {/* <Stack.Screen
                      name={presentation === null ? "Welcome" : "Home"}
                      component={Welcome}
                    /> */}
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
            </PopupProvider>
          </BlockchainContext>
        </LocalAuthenticationProvider>
      </HeaderProvider>
    </NavigationContainer>
  );
};
export default MyStack;
