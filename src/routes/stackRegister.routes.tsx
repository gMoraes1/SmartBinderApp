import "react-native-gesture-handler";
import { createStackNavigator } from "@react-navigation/stack";

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
        <Stack.Screen name="NewClass" component={RegisterClass} />
      </Stack.Navigator>
    );
  }

export default StackRegister;