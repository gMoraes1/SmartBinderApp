import "react-native-gesture-handler";
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from "@react-navigation/stack";
import StackLogin from "./src/routes/stackLogin.routes";
import TabNavigator from "./src/routes/tab.routes";



const Stack = createStackNavigator();

export default function App() {
  const auth = false;
  return (
      <NavigationContainer>
        {auth ? <TabNavigator/> : <StackLogin/>}
      </NavigationContainer>
  );
}
