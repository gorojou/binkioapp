import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Welcome from "../components/Welcome";
import Session from "../components/access";
import Dashboard from "../components/session/Dashboard";
const Stack = createNativeStackNavigator();

const MyStack = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerShown: false,
          header: () => null,
          contentStyle: { backgroundColor: "white" },
        }}
      >
        <Stack.Screen name="Home" component={Welcome} />
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
        <Stack.Screen name="dash" component={Dashboard} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
export default MyStack;
