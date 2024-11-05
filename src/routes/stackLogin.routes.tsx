import "react-native-gesture-handler";
import { createStackNavigator } from "@react-navigation/stack";
import React from "react";

import TabNavigator from "./tab.routes";
import Inicio from "../pages/LoginAndSignPages/inicio";
import InicioRegister from "../pages/LoginAndSignPages/inicioRegister";
import Login from "../pages/LoginAndSignPages/loginPage";
import Sign from "../pages/LoginAndSignPages/SignInPage";

const Stack = createStackNavigator();

export default function StackLogin() {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Inicio" component={Inicio} />
            <Stack.Screen name="InicioRegister" component={InicioRegister} />
            <Stack.Screen name="Login" component={Login} />
            <Stack.Screen name="Sign" component={Sign} />
            <Stack.Screen name="Tabs" component={TabNavigator} />
        </Stack.Navigator>
    );
}
