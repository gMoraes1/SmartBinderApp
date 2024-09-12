import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Feather, Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, View, ScrollView, Image } from 'react-native';

import Home from '../pages/home';
import Register from '../pages/cadastro';
import Calendar from '../pages/calendario';
import Configuration from '../pages/configuracoes';
import Profile from '../pages/perfil';

const Tab = createBottomTabNavigator();

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
            }
        }} >
            <Tab.Screen
                name="configuration"
                component={Configuration}
                options={{
                    tabBarIcon: ({ color, size, focused }) => {
                        if(focused) {
                            return <Ionicons name="settings" size={29} color={"#2E1966"}></Ionicons>
                        }
                        return <Ionicons name="settings-outline" size={29} color={"#6939E9"} />
                }
                }}
            />

            <Tab.Screen
                name="calendar"
                component={Calendar}
                options={{
                    tabBarIcon: ({ color, size, focused }) => {
                        if(focused) {
                            return <Ionicons name="calendar" size={29} color={"#2E1966"} />
                        }
                        return <Ionicons name="calendar-outline" size={29} color={"#6939E9"} />
                }
                }}
            />

            <Tab.Screen
                name="home"
                component={Home}
                options={{
                    tabBarIcon: ({ color, size, focused }) => {
                        if(focused) {
                            return <Ionicons name="home" size={29} color={"#2E1966"} />
                        }
                        return <Ionicons name="home-outline" size={29} color={"#6939E9"} />
                }
                }}
            />

            <Tab.Screen
                name="register"
                component={Register}
                options={{
                    tabBarIcon: ({ color, size, focused }) => {
                        if(focused) {
                            return <Ionicons name="person-add" size={29} color={"#2E1966"} />
                        }
                        return <Ionicons name="person-add-outline" size={29} color={"#6939E9"} />
                }
                }}
            />

            <Tab.Screen
                name="profile"
                component={Profile}
                options={{
                    tabBarIcon: ({ color, size, focused }) => {
                        if(focused) {
                            return <Ionicons name="person" size={29} color={"#2E1966"} />
                        }
                        return <Ionicons name="person-outline" size={29} color={"#6939E9"} />
                }
                }}
            />
        </Tab.Navigator>
    )
}


