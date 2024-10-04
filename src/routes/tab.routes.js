import "react-native-gesture-handler";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs";
import { Feather, Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, View, ScrollView, Image } from 'react-native';



import StackRegister from "./stackRegister.routes";
import StackSettings from "./stackSetting.routes";
import Home from "../pages/home";
import Calendar from "../pages/calendario";
import Profile from "../pages/perfil";

const Tab = createMaterialBottomTabNavigator();
const Stack = createStackNavigator();


export default function TabNavigator() {
    return (
      <Tab.Navigator screenOptions={{
        headerShown: false,
        tabBarLabel: false,
        tabBarStyle: {
          position: 'absolute',
          height: 64,
          borderTopWidth: 1,
        },
      }} >
  
  
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
          component={Calendar}
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
          component={Profile}
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
    );
  }
  
