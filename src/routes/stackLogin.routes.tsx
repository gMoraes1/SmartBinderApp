import "react-native-gesture-handler";
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from "@react-navigation/stack";
import Inicio from "../pages/(public)"; // Ajuste o caminho conforme necessário
import InicioRegister from "../pages/(public)/inicioRegister";
import TabNavigator from "./tab.routes";

const Stack = createStackNavigator();

export default function StackLogin() {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Inicio" component={Inicio} />
            <Stack.Screen name="InicioRegister" component={InicioRegister} />
            <Stack.Screen name="TabNavigator" component={TabNavigator} />
        </Stack.Navigator>
    );
}
