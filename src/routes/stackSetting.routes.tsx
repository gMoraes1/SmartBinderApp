import "react-native-gesture-handler";
import { createStackNavigator } from "@react-navigation/stack";
import { StyleSheet, Text, View, ScrollView, Image } from 'react-native';
import Configurations from "../pages/(authenticated)/stackSettingsPages/configuracoes";
import ThemeSettings from "../pages/(authenticated)/stackSettingsPages/tema";
import PrivacySettings from "../pages/(authenticated)/stackSettingsPages/PrivacySettings";

const Stack = createStackNavigator();

function StackSettings() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="settings" component={Configurations} />
      <Stack.Screen name="Tema" component={ThemeSettings} />
      <Stack.Screen name="Privacidade" component={PrivacySettings} />
    </Stack.Navigator>
  );
}

export default StackSettings;
