import "react-native-gesture-handler";
import { createStackNavigator } from "@react-navigation/stack";
import Calendars from "../pages/StackCalendarPages/calendario";
import CreateDateNote from "../pages/StackCalendarPages/createDateNote";
import React from "react";

const Stack = createStackNavigator();

function StackCalendar() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="Calendars" component={Calendars} />
      <Stack.Screen name="CreateDateNote" component={CreateDateNote} />
    </Stack.Navigator>
  );
}

export default StackCalendar;
