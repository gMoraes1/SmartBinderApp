import "react-native-gesture-handler";
import { createStackNavigator } from "@react-navigation/stack";
import { StyleSheet, Text, View, ScrollView, Image } from 'react-native';
import Configurations from "../pages/configuracoes";
import ThemeSettings from "../pages/tema";
import PrivacySettings from "../pages/PrivacySettings";
import Register from "../pages/Classes";
import RegisterClass from "../pages/RegisterClasses";



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