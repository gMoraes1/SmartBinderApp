import "react-native-gesture-handler";
import { createStackNavigator } from "@react-navigation/stack";
import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs";
import { StyleSheet, Text, View, ScrollView, Image } from 'react-native';

import Inicio from "./src/pages/inicio";

const Tab = createMaterialBottomTabNavigator();
const Stack = createStackNavigator();

export default function Index(){
  return(
    <View>
    <Inicio />
  </View>
  )
};