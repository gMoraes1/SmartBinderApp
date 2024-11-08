import "react-native-gesture-handler";
import { createStackNavigator } from "@react-navigation/stack";

import EditProfile from "../pages/(authenticated)/stackProfilePages/alterarPerfil";
import Profile from "../pages/(authenticated)/stackProfilePages/perfil";

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