import "react-native-gesture-handler";
import { createStackNavigator } from "@react-navigation/stack";

import Calendars from "../pages/(authenticated)/stackCalendarPages/calendario";
import CreateDateNote from "../pages/(authenticated)/stackCalendarPages/createDateNote";

const Stack = createStackNavigator();

function StackCalendar() {
    return (
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }} >
        <Stack.Screen name="Calendars" component={Calendars} />
        <Stack.Screen name="CreateDateNote" component={CreateDateNote} />
      </Stack.Navigator>
    );
  }

export default StackCalendar;