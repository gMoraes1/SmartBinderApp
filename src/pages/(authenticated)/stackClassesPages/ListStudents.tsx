import React, { useEffect, useState } from "react";
import { View, StyleSheet, FlatList, TouchableOpacity, Text, Alert } from "react-native";
import styled from "styled-components/native";
import {
  collection,
  onSnapshot,
  deleteDoc,
  query,
  where,
  doc,
} from "firebase/firestore";
import { db, auth } from "../../../../firebase"; // Ajuste para seu caminho do Firebase

// Interface para o tipo dos dados
interface StudentData {
  id: string;
  name: string;
  age: number;
  grade: string;
}

const Container = styled.View`
  background-color: ${(props) => props.theme.background};
  width: 100%;
  padding: 16px;
  height: 100%;
`;

const Title = styled.Text`
  font-size: 32px;
  font-weight: 600;
  text-align: center;
  padding-top: 12%;
  color: ${(props) => props.theme.color};
`;

export default function ListStudents({ navigation }) {
  const [students, setStudents] = useState<StudentData[]>([]);

  // Função para deletar aluno
  async function deleteStudent(id: string) {
    try {
      await deleteDoc(doc(db, "tblAlunos", id)); // Substitua "tblStudents" pelo nome correto da coleção
      Alert.alert("Aluno deletado.");
    } catch (error) {
      console.error("Erro ao deletar aluno:", error);
    }
  }

  // Carregando dados em tempo real
  useEffect(() => {
    const unsubscribe = onSnapshot(
      query(
        collection(db, "tblAlunos"),
        where("userRef", "==", doc(db, "users", auth.currentUser?.uid)) // Ajuste conforme a estrutura
      ),
      (querySnapshot) => {
        const studentList: StudentData[] = [];
        querySnapshot.forEach((docSnap) => {
          const data = docSnap.data();
          studentList.push({
            id: docSnap.id,
            name: data.name,
            age: data.age,
            grade: data.grade,
          });
        });

        setStudents(studentList);
      }
    );

    return () => unsubscribe();
  }, []);

  return (
    <Container>
      <Title style={styles.title}>Alunos</Title>

      <FlatList
        data={students}
        keyExtractor={(item) => item.id}
        style={styles.list}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.studentItem}
            onPress={() => navigation.navigate("StudentDetails", { studentId: item.id })}
          >
            <View style={styles.studentInfo}>
              <Text style={styles.textData}>Nome: {item.name}</Text>
              <Text style={styles.textData}>Idade: {item.age}</Text>
              <Text style={styles.textData}>Série: {item.grade}</Text>
            </View>
            
          </TouchableOpacity>
        )}
      />
    </Container>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 32,
    fontWeight: "600",
    textAlign: "center",
    paddingVertical: 20,
  },

  list: {
    marginBottom: 20,
  },

  studentItem: {
    flexDirection: "column",
    justifyContent: "space-between",
    padding: 15,
    marginVertical: 8,
    borderWidth: 2,
    borderColor: "#ccc",
    borderRadius: 8,
    backgroundColor: "#f9f9f9",
    elevation: 5,
  },

  studentInfo: {
    alignItems: "flex-start",
    marginBottom: 10,
  },

  BtnDelete: {
    marginTop: 10,
    backgroundColor: "#ff4d4d",
    padding: 10,
    borderRadius: 10,
    width: 100,
    alignSelf: "center",
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
    elevation: 5,
  },

  TxtBtn1: {
    fontSize: 40,
    fontWeight: "900",
    color: "white",
    textAlign: "center",
    lineHeight: 60,
  },

  textData: {
    color: "black",
    fontSize: 15,
    fontWeight: "bold",
  },
});
