import "react-native-gesture-handler";
import { createStackNavigator } from "@react-navigation/stack";
import Profile from "../pages/(authenticated)/stackProfilePages/perfil";
import EditProfile from "../pages/(authenticated)/stackProfilePages/alterarPerfil";

const Stack = createStackNavigator();

export default function StackProfile() {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Profile" component={Profile} />
            <Stack.Screen name="EditProfile" component={EditProfile} />
        </Stack.Navigator>
    );
}
