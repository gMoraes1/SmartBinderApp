import "react-native-gesture-handler";
import { createStackNavigator } from "@react-navigation/stack";

import React from "react";

import Classes from "../pages/(authenticated)/stackClassesPages/Classes";
import RegisterClasses from "../pages/(authenticated)/stackClassesPages/RegisterClasses";
import ExportDoc from "../pages/(authenticated)/stackClassesPages/ExportDoc";
import CreateStudent from "../pages/(authenticated)/stackClassesPages/CreateStudent";
import ListStudents from "../pages/(authenticated)/stackClassesPages/ListStudents";
import ConfigurationClass from "../pages/(authenticated)/stackClassesPages/ConfigurationClass";
import ClassDetails from "../pages/(authenticated)/stackClassesPages/ClassDetails";
import ClassOptions from "../pages/(authenticated)/stackClassesPages/ClassOptions";
import StudentDetails from "../pages/(authenticated)/stackClassesPages/StudentDetails";
import EditSondagem from "../pages/(authenticated)/stackClassesPages/EditSondagem";

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
      <Stack.Screen name="CreateStudent" component={CreateStudent} />
      <Stack.Screen name="ListStudents" component={ListStudents} />
      <Stack.Screen name="ConfigurationClass" component={ConfigurationClass} />
      <Stack.Screen name="ExportDoc" component={ExportDoc} />
      <Stack.Screen name="EditSondagem" component={EditSondagem} />
      <Stack.Screen name="ClassOptions" component={ClassOptions} />
      <Stack.Screen name="StudentDetails" component={StudentDetails} />
    </Stack.Navigator>
  );
}

export default StackRegister;