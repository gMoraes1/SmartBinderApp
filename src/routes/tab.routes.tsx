import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Feather, Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, View, ScrollView, Image } from 'react-native';

import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import PrivacyConfiguration from '../pages/PrivacySettings';
import Home from '../pages/home';
import Register from '../pages/turmas';
import Calendar from '../pages/calendario';
import Configuration from '../pages/configuracoes';
import Profile from '../pages/perfil';
import ThemeSettings from '../pages/tema';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function AppNavigator() {
    return (
      <Stack.Navigator>
        <Stack.Screen name="Configurations" component={Configuration} />
        <Stack.Screen name="PrivacySettings" component={PrivacyConfiguration} />
        <Stack.Screen name="ThemeSettings" component={ThemeSettings} />
      </Stack.Navigator>
    );
  }

export default function TabRoutes() {
    return (


        <Tab.Navigator screenOptions={{
            headerShown: false,
            tabBarShowLabel: false,
            tabBarStyle: {
                position: 'absolute',
                backgroundColor: '#D1D8EE',
                height: 64,
                borderTopWidth: 0,
            },
        }} >


            <Tab.Screen
                name="home"
                component={Home}
                options={{
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
                name="register"
                component={Register}
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
                name="configuration"
                component={Configuration}
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
    )
}

