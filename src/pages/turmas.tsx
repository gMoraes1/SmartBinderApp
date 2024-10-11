import { StatusBar } from "expo-status-bar";
import { useNavigation, useRoute } from "@react-navigation/native";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
} from "react-native";
import React, { useEffect, useState } from "react";

interface ClassData {
  name: string;
  period: string;
  educationLevel: string;
  school: string;
}

interface RouteParams {
  classData?: ClassData;
}

export default function Register() {
  const navigation = useNavigation();
  const route = useRoute();
  const [classes, setClasses] = useState<ClassData[]>([]);

  // Se houver dados da turma passada, adicione à lista
  useEffect(() => {
    const params = route.params as RouteParams | undefined;
    if (params?.classData) {
      setClasses((prevClasses) => [...prevClasses, params.classData]);
    }
  }, [route.params]);

  const renderItem = ({ item }: { item: ClassData }) => (
    <View style={styles.classItem}>
      <Text style={styles.className}>{item.name}</Text>
      <Text style={styles.studentCount}>{0} alunos</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Turmas</Text>

      <FlatList
        data={classes}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
        style={styles.list}
      />

      <View style={styles.ViewBtnAdd}>
        <TouchableOpacity
          onPress={() => navigation.navigate("NewClass")}
          style={styles.BtnAdd}
        >
          <Text style={styles.TxtBtn1}>+</Text>
        </TouchableOpacity>
      </View>

      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: "100%",
    padding: 16,
  },

  title: {
    fontSize: 32,
    fontWeight: "600",
    textAlign: "center",
    paddingVertical: 20,
  },

  list: {
    marginBottom: 20,
  },

  classItem: {
    padding: 15,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    backgroundColor: "#f9f9f9",
  },

  className: {
    fontSize: 20,
    fontWeight: "600",
  },

  studentCount: {
    fontSize: 16,
    color: "gray",
  },

  ViewBtnAdd: {},

  BtnAdd: {
    width: 150,
    height: 130,
    alignItems: "center",
  },

  TxtBtn1: {
    fontSize: 40,
    fontWeight: "900",
    textAlign: "center",
    width: 60,
    backgroundColor: "#6939E9",
    borderRadius: 100,
    height: 60,
    position: "absolute",
    bottom: 30,
    left: 280,
    alignItems: "center",
    justifyContent: "center",
    color: 'white'
  },

  TxtBtn2: {
    borderBottomColor: "gray",
    borderBottomWidth: 3,
    borderColor: "#999999",
    borderWidth: 0.8,
    borderBottomRightRadius: 70,
    borderBottomLeftRadius: 70,
    height: "25%",
    textAlign: "center",
    width: "100%",
    fontSize: 18,
    fontWeight: "900",
    backgroundColor: "#6939E9",
  },
});
