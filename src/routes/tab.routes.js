import "react-native-gesture-handler";
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from "@expo/vector-icons";
import styled from "styled-components/native";
import Home from "../pages/(authenticated)/stackHomePages/home";
import StackCalendar from "./stackCalendar.routes";
import StackProfile from "./stackProfile";
import StackRegister from "./stackRegister.routes";
import StackSettings from "./stackSetting.routes";

const Tab = createBottomTabNavigator();

const Container = styled.View`
  background-color: ${props => props.theme.background};
  width: 100%;
  height: 100%;
`;

export default function TabNavigator() {
  return (
    <Container>
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarShowLabel: false,
          tabBarIconStyle:{
           margin:'13%',
          },
          tabBarStyle: {
            position: 'absolute',
            height: '8.5%', // Altura da barra
            borderTopWidth: 1,
            justifyContent: 'center', // Centraliza o conteúdo verticalmente
            alignItems: 'center',     // Centraliza o conteúdo horizontalmente
          },
        }}
      >
        <Tab.Screen
          name="home"
          component={Home}
          options={{
            tabBarIcon: ({ color, size, focused }) => {
              if (focused) {
                return <Ionicons name="home" size={30} color={"#2E1966"} />;
              }
              return <Ionicons name="home-outline" size={30} color={"#6939E9"} />;
            },
          }}
        />

        <Tab.Screen
          name="calendar"
          component={StackCalendar}
          options={{
            tabBarIcon: ({ color, size, focused }) => {
              if (focused) {
                return <Ionicons name="calendar" size={30} color={"#2E1966"} />;
              }
              return <Ionicons name="calendar-outline" size={30} color={"#6939E9"} />;
            },
          }}
        />

        <Tab.Screen
          name="profile"
          component={StackProfile}
          options={{
            tabBarIcon: ({ color, size, focused }) => {
              if (focused) {
                return <Ionicons name="person" size={30} color={"#2E1966"} />;
              }
              return <Ionicons name="person-outline" size={30} color={"#6939E9"} />;
            },
          }}
        />

        <Tab.Screen
          name="Turmas"
          component={StackRegister}
          options={{
            tabBarIcon: ({ color, size, focused }) => {
              if (focused) {
                return <Ionicons name="book" size={30} color={"#2E1966"} />;
              }
              return <Ionicons name="book-outline" size={30} color={"#6939E9"} />;
            },
          }}
        />

        <Tab.Screen
          name="configurações"
          component={StackSettings}
          options={{
            tabBarIcon: ({ color, size, focused }) => {
              if (focused) {
                return <Ionicons name="settings" size={30} color={"#2E1966"} />;
              }
              return <Ionicons name="settings-outline" size={30} color={"#6939E9"} />;
            },
          }}
        />
      </Tab.Navigator>
    </Container>
  );
}
