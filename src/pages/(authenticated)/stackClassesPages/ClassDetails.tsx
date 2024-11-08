import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from "react-native";
import { useNavigation, NavigationProp } from "@react-navigation/native";
import { RootStackParamList } from "../../../navigation/types";
import BackBtn from "../../../components/Buttons/BackBtn"; 
import React from "react";

function ClassDetails() {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  return (
    <View style={styles.container}>
      <BackBtn onPress={() => navigation.navigate("Classes")} />
      
    </View>
  );
}

export default ClassDetails;
const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: "100%",
    padding: 16,
  },
});
