import "react-native-gesture-handler";
import { createStackNavigator } from "@react-navigation/stack";
import { StyleSheet, Text, View, ScrollView, Image } from 'react-native';

import Register from "../pages/turmas"; 
import RegisterClass from "../pages/cadastrarTurmas";

const Stack = createStackNavigator();

function StackRegister() {
    return (
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }} >
        <Stack.Screen name="Register" component={Register} />
        <Stack.Screen name="NovaTurma" component={RegisterClass} />
      </Stack.Navigator>
    );
  }

export default StackRegister;