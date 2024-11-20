import "react-native-gesture-handler";
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from "@react-navigation/stack";
import StackLogin from "./src/routes/stackLogin.routes"; // Tela de Login
import TabNavigator from "./src/routes/tab.routes"; // Navegação das telas principais (após login)
import { ThemeProvider } from "styled-components/native";
import { useColorScheme } from "react-native";
import themes from "./src/theme";
import { useState, useEffect } from "react";
import { auth } from "./firebase"; // Importando o auth do Firebase
import CreateDoc from "./src/pages/(authenticated)/stackClassesPages/CreateDoc";

const Stack = createStackNavigator();

export default function App() {
  const deviceTheme = useColorScheme(); // Obtém o tema do dispositivo
  const theme = themes[deviceTheme] || themes.dark; // Define o tema
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Estado de autenticação

  // Verificar o estado de autenticação do usuário
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      setIsAuthenticated(!!user); // Atualiza o estado de autenticação conforme o usuário
    });

    // Limpeza do listener ao desmontar o componente
    return () => unsubscribe();
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <NavigationContainer>
        {/* {isAuthenticated ? <TabNavigator /> : <StackLogin />} */}
        <CreateDoc/>
      </NavigationContainer>
    </ThemeProvider>
  );
}
