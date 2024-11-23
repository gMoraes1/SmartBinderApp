// App.js
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
import Globais from "./src/components/GlobalConsts/global"; // Importando o arquivo de variáveis globais

const Stack = createStackNavigator();

export default function App() {
  const deviceTheme = useColorScheme(); // Obtém o tema do dispositivo
  const [currentTheme, setCurrentTheme] = useState(Globais.getCurrentTheme()); // Use estado local para controlar o tema atual

  // Define o tema com base no tema global ou no tema do dispositivo
  const theme = themes[currentTheme === 'device' ? deviceTheme : currentTheme] || themes.dark;

  // Atualiza o tema sempre que o tema global mudar
  useEffect(() => {
    const updateTheme = () => {
      setCurrentTheme(Globais.getCurrentTheme()); // Atualiza o estado local com o valor do tema global
    };

    updateTheme(); // Chama para garantir que o tema inicial seja correto

    // Adiciona o listener para atualizações futuras
    const interval = setInterval(updateTheme, 100); // Atualiza periodicamente o estado (aproximadamente a cada 100ms)

    return () => clearInterval(interval); // Limpa o intervalo quando o componente desmontar
  }, []); // Esse efeito só será chamado uma vez, na inicialização

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
        {isAuthenticated ? <TabNavigator /> : <StackLogin />}
      </NavigationContainer>
    </ThemeProvider>
  );
}
