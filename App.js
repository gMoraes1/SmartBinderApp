import "react-native-gesture-handler";
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from "@react-navigation/stack";
import StackLogin from "./src/routes/stackLogin.routes";
import TabNavigator from "./src/routes/tab.routes";
import { ThemeProvider } from "styled-components/native"; // Certifique-se de usar 'native'
import { useColorScheme } from "react-native";
import themes from "./src/theme";

const Stack = createStackNavigator();

export default function App() {
  const auth = false; // Simulação de autenticação
  const deviceTheme = useColorScheme(); // Obtém o tema do dispositivo
  const theme = themes[deviceTheme] || themes.dark; // Define o tema

  return (
    <ThemeProvider theme={theme}>
      <NavigationContainer>
        {auth ? <TabNavigator /> : <StackLogin />}
      </NavigationContainer>
    </ThemeProvider>
  );
}
