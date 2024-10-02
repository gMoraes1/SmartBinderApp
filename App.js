import "react-native-gesture-handler";
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from "@react-navigation/stack";
import Inicio from "./src/pages/inicio"; // Ajuste o caminho conforme necessário
import InicioRegister from "./src/pages/inicioRegister";
import StackLogin from "./src/routes/stackLogin.routes";

const Stack = createStackNavigator();



export default function App() {
    return (
        <NavigationContainer>
            <StackLogin />
        </NavigationContainer>
    );
}
