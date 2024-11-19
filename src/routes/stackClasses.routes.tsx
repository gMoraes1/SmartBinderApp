import "react-native-gesture-handler";
import { createStackNavigator } from "@react-navigation/stack";

import React from "react";

import Classes from "../pages/(authenticated)/stackClassesPages/Classes";
import RegisterClasses from "../pages/(authenticated)/stackClassesPages/RegisterClasses";
import ClassDetails from "../pages/(authenticated)/stackClassesPages/ClassDetails";

const Stack = createStackNavigator();

function StackRegister() {
    return (
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }} >
        <Stack.Screen name="Classes" component={Classes} />
        <Stack.Screen name="RegisterClasses" component={RegisterClasses} />
        <Stack.Screen name="ClassDetails" component={ClassDetails} />
        
      </Stack.Navigator>
    );
  }

export default StackRegister;