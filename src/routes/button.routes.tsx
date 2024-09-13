// AppNavigator.js (ou onde você configura suas rotas)

import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import Configurations from '../pages/configuracoes';
import PrivacySettings from '../pages/PrivacySettings';
import ThemeSettings from '../pages/tema';

const Stack = createNativeStackNavigator();

function AppButtonNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Configurations" component={Configurations} />
      <Stack.Screen name="PrivacySettings" component={PrivacySettings} />
      <Stack.Screen name="ThemeSettings" component={ThemeSettings} />
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <AppButtonNavigator />
    </NavigationContainer>
  );
}
