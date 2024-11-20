import "react-native-gesture-handler";
import { createStackNavigator } from "@react-navigation/stack";
import Inicio from "../pages/(public)/stackLoginPages/inicio";
import InicioRegister from "../pages/(public)/stackLoginPages/inicioRegister";
import Login from "../pages/(public)/stackLoginPages/loginPage";
import Sign from "../pages/(public)/stackLoginPages/SignInPage";
import TabNavigator from "./tab.routes";

const Stack = createStackNavigator();

export default function StackLogin() {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Inicio" component={Inicio} />
            <Stack.Screen name="InicioRegister" component={InicioRegister} />
            <Stack.Screen name="Login" component={Login} />
            <Stack.Screen name="Sign" component={Sign} />
        </Stack.Navigator>
    );
}
