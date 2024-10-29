import "react-native-gesture-handler";
import { createStackNavigator } from "@react-navigation/stack";

import Classes from "../pages/Classes";
import RegisterClasses from "../pages/RegisterClasses";
import ClassDetails from "../pages/ClassDetails";

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