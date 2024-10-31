import "react-native-gesture-handler";
import { createStackNavigator } from "@react-navigation/stack";
import Inicio from "../pages/inicio";
import InicioRegister from "../pages/inicioRegister";
import Login from "../pages/loginPage";
import Sign from "../pages/SignInPage";
import TabNavigator from "./tab.routes";

const Stack = createStackNavigator();

export default function StackLogin() {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Inicio" component={Inicio} />
            <Stack.Screen name="InicioRegister" component={InicioRegister} />
            <Stack.Screen name="Login" component={Login} />
            <Stack.Screen name="Sign" component={Sign} />
            <Stack.Screen name="Tabs" component={TabNavigator} />
        </Stack.Navigator>
    );
}
