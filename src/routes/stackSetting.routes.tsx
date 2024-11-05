import "react-native-gesture-handler";
import { createStackNavigator } from "@react-navigation/stack";
import { StyleSheet, Text, View, ScrollView, Image } from 'react-native';
import React from 'react'; // Importação explícita do React
import Configurations from "../pages/StackSettingsPages/configuracoes";
import ThemeSettings from "../pages/StackSettingsPages/tema";
import PrivacySettings from "../pages/StackSettingsPages/PrivacySettings";
import RegisterClasses from "../pages/StackClassesPages/RegisterClasses";

const Stack = createStackNavigator();

function StackSettings() {
    return (
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }} >
        <Stack.Screen name="settings" component={Configurations} />
        <Stack.Screen name="Tema" component={ThemeSettings} />
        <Stack.Screen name="Privacidade" component={PrivacySettings} />
        <Stack.Screen name="Register" component={RegisterClasses} />
        <Stack.Screen name="NovaTurma" component={RegisterClasses} />
      </Stack.Navigator>
    );
  }

export default StackSettings;