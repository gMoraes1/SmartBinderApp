import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import Configurations from "../pages/configuracoes";
import ThemeSettings from "../pages/tema";
import PrivacyConfiguration from "../pages/PrivacySettings";

const Stack = createNativeStackNavigator();

export default function Rotas() {
    return (
        <Stack.Navigator screenOptions={{headerShown: false}}>
            <Stack.Screen name="configurações" component={Configurations} />
            <Stack.Screen name="Tema" component={ThemeSettings} />
            <Stack.Screen name="Privacidade" component={PrivacyConfiguration} />
        </Stack.Navigator>
    );
}
