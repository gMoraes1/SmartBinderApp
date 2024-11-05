import "react-native-gesture-handler";
import { createStackNavigator } from "@react-navigation/stack";
import React from "react";

import Profile from "../pages/StackProfilePages/perfil";
import EditProfile from "../pages/StackProfilePages/alterarPerfil";

const Stack = createStackNavigator();

function StackProfile() {
    return (
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }} >
        <Stack.Screen name="Profile" component={Profile} />
        <Stack.Screen name="EditProfile" component={EditProfile} />
      </Stack.Navigator>
    );
  }

export default StackProfile;