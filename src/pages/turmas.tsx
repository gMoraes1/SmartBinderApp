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

  useEffect(() => {
    const params = route.params as RouteParams | undefined;
    if (params?.classData) {
      setClasses((prevClasses) => [...prevClasses, params.classData]);
    }
  }, [route.params]);

  const handleDelete = (index: number) => {
    setClasses((prevClasses) => prevClasses.filter((_, i) => i !== index));
  };

  const renderItem = ({ item, index }: { item: ClassData; index: number }) => (
    <View style={styles.classItem}>
      <View>
        <Text style={styles.className}>{item.name}</Text>
        <Text style={styles.studentCount}>{0} alunos</Text>
      </View>

      <TouchableOpacity
        onPress={() => handleDelete(index)}
        style={styles.BtnDelete}
      >
        <Text style={styles.TxtDelete}>Deletar</Text>
      </TouchableOpacity>
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

      <TouchableOpacity
        onPress={() => navigation.navigate("NewClass")}
        style={styles.BtnAdd}
      >
        <Text style={styles.TxtBtn1}>+</Text>
      </TouchableOpacity>

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
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 15,
    marginVertical: 8,
    borderWidth: 2,
    borderColor: "#ccc",
    borderRadius: 8,
    backgroundColor: "#f9f9f9",
    elevation: 5,
  },

  className: {
    fontSize: 20,
    fontWeight: "600",
  },

  studentCount: {
    fontSize: 16,
    color: "#6939E9",
  },

  BtnDelete: {
    marginTop: 10,
    backgroundColor: "#ff4d4d",
    padding: 10,
    borderRadius: 5,
  },

  TxtDelete: {
    color: "white",
    textAlign: "center",
    fontWeight: "bold",
  },

  BtnAdd: {
    width: 60,
    height: 60,
    backgroundColor: "#6939E9",
    borderRadius: 30,
    position: "absolute",
    bottom: 30,
    right: 30,
    alignItems: "center",
    justifyContent: "center",
    elevation: 5, // Sombra para Android
  },

  TxtBtn1: {
    fontSize: 40,
    fontWeight: "900",
    color: "white",
    textAlign: "center",
    lineHeight: 60, // Centraliza verticalmente
  },
});
