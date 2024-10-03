import "react-native-gesture-handler";
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from "@react-navigation/stack";
import StackLogin from "./src/routes/stackLogin.routes";
import { ClerkProvider } from "@clerk/clerk-expo";
import { tokenCache } from './src/storage/tokenCache';

// Verificar o ambiente e usar a chave correspondente
const PUBLIC_CLERK_PUBLISHABLE_KEY = process.env.NODE_ENV === 'production'
  ? process.env.EXPO_PUBLIC_CLERK_PRODUCTION_KEY
  : process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY;

const Stack = createStackNavigator();

export default function App() {
  return (
    <ClerkProvider publishableKey={PUBLIC_CLERK_PUBLISHABLE_KEY} tokenCache={tokenCache}>
      <NavigationContainer>
        <StackLogin />
      </NavigationContainer>
    </ClerkProvider>
  );
}
