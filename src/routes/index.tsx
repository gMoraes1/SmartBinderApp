import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import TabRoutes from './tab.routes';
import Home from '../pages/home';
import { Feather, Ionicons } from "@expo/vector-icons";
const Tab = createBottomTabNavigator();




export default function Routes(){
    return(
        <NavigationContainer>
            
            <TabRoutes

            
            />
        </NavigationContainer>
    )
}
