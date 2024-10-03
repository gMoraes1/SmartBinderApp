import "react-native-gesture-handler";
import { createStackNavigator } from "@react-navigation/stack";
import { StyleSheet, Text, View, ScrollView, Image } from 'react-native';

import Configurations from "../pages/(auth)/configuracoes";
import Register from "../pages/(auth)/turmas"; 
import ThemeSettings from "../pages/(auth)/tema";
import PrivacySettings from "../pages/(auth)/PrivacySettings";
import RegisterClass from "../pages/(auth)/cadastrarTurmas";

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
        <Stack.Screen name="Register" component={Register} />
        <Stack.Screen name="NovaTurma" component={RegisterClass} />
      </Stack.Navigator>
    );
  }

export default StackSettings;