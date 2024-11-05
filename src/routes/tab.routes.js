import "react-native-gesture-handler";
import { createStackNavigator } from "@react-navigation/stack";
import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import styled from 'styled-components/native';  

import StackProfile from "./stackProfile";
import StackRegister from "./stackClasses.routes";
import StackSettings from "./stackSetting.routes";
import Home from "../pages/StackHomePages/home";
import StackCalendar from "./stackCalendar.routes";


const Tab = createMaterialBottomTabNavigator();
const Stack = createStackNavigator();


const Container = styled.View`
  background-color: ${props => props.theme.background};
  width: 100%;
  height: 100%;
`;

export default function TabNavigator() {
    return (
      <Container>
      <Tab.Navigator screenOptions={{
        headerShown: false,
        tabBarLabel: false,
        tabBarStyle: {
          position: 'absolute',
          height: 90,
          borderTopWidth: 1,
        },
      }}>
  
  
        <Tab.Screen
          name="home"
          component={Home}
          options={{
            tabBarShowLabel: false,
            tabBarIcon: ({ color, size, focused }) => {
              if (focused) {
                return <Ionicons name="home" size={29} color={"#2E1966"} />
              }
              return <Ionicons name="home-outline" size={29} color={"#6939E9"} />
            }
          }}
        />
  
        <Tab.Screen
          name="calendar"
          component={StackCalendar}
          options={{
            tabBarIcon: ({ color, size, focused }) => {
              if (focused) {
                return <Ionicons name="calendar" size={29} color={"#2E1966"} />
              }
              return <Ionicons name="calendar-outline" size={29} color={"#6939E9"} />
            }
          }}
        />
  
        <Tab.Screen
          name="profile"
          component={StackProfile}
          options={{
            tabBarIcon: ({ color, size, focused }) => {
              if (focused) {
                return <Ionicons name="person" size={29} color={"#2E1966"} />
              }
              return <Ionicons name="person-outline" size={29} color={"#6939E9"} />
            }
          }}
        />
  
        <Tab.Screen
          name="Turmas"
          component={StackRegister}
          options={{
  
            tabBarIcon: ({ color, size, focused }) => {
              if (focused) {
                return <Ionicons name="book" size={29} color={"#2E1966"} />
              }
              return <Ionicons name="book-outline" size={29} color={"#6939E9"} />
            }
          }}
        />
  
        <Tab.Screen
          name="configurações"
          component={StackSettings}
          options={{
            tabBarIcon: ({ color, size, focused }) => {
              if (focused) {
                return <Ionicons name="settings" size={29} color={"#2E1966"}></Ionicons>
              }
              return <Ionicons name="settings-outline" size={29} color={"#6939E9"} />
            }
          }}
        />
      </Tab.Navigator>
      </Container>
    );
  }
  
