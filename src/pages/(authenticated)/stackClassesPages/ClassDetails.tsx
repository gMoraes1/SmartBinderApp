import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  TouchableOpacity,
  View,
  Text,
  FlatList,
  Dimensions,
} from "react-native";
import styled from "styled-components/native";
import BackBtn from "../../../components/Buttons/BackBtn";
import { collection, doc, onSnapshot, query, where } from "firebase/firestore";
import { db, auth } from "../../../../firebase"; // Importando o Firebase

const Container = styled.View`
  background-color: ${(props) => props.theme.background};
  width: 100%;
  height: 100%;
  align-items: center;
`;

const Title = styled.Text`
  font-size: 32px;
  font-weight: 600;
  text-align: center;
  flex: 1;
  padding-top: 12%;
  color: ${(props) => props.theme.color};
`;

interface StudentData {
  id: string;
  nomeAluno: string;
  nascimentoAluno: string;
  rmAluno: string;
}

const { width } = Dimensions.get("window");

export default function ClassDetails({ navigation }) {
  const [students, setStudents] = useState<StudentData[]>([]); // Lista de alunos

  // Função para pegar os alunos do usuário logado
  useEffect(() => {
    // Verifique se o usuário está logado
    if (!auth.currentUser) {
      console.error("Usuário não logado");
      return;
    }

    console.log("Usuário logado:", auth.currentUser.uid); // Verificar o ID do usuário logado

    // Consulta no Firestore para pegar os alunos do usuário logado
    const unsubscribe = onSnapshot(
      query(
        collection(db, "tblAluno"), // Coleção de alunos
        where("userRef", "==", doc(db, "users", auth.currentUser?.uid)) // Associe os alunos ao usuário logado
      ),
      (querySnapshot) => {
        const studentList: StudentData[] = [];
        if (querySnapshot.empty) {
          console.log("Nenhum aluno encontrado para este usuário");
        }
        querySnapshot.forEach((docSnap) => {
          const data = docSnap.data();
          console.log("Aluno encontrado:", data); // Verificando os dados do aluno
          studentList.push({
            id: docSnap.id,
            nomeAluno: data.nomeAluno,
            nascimentoAluno: data.nascimentoAluno,
            rmAluno: data.rmAluno,
          });
        });

        setStudents(studentList); // Atualiza o estado com a lista de alunos
      },
      (error) => {
        console.error("Erro ao buscar alunos:", error);
      }
    );

    return () => unsubscribe(); // Limpeza da consulta
  }, []); // A consulta é executada apenas uma vez ao montar o componente

  return (
    <Container>
      <View style={styles.header}>
        <BackBtn onPress={() => navigation.goBack()} />
        <Title>Detalhes da Turma</Title>
      </View>

      {/* Exibe a lista de alunos */}
      <FlatList
        data={students}
        keyExtractor={(item) => item.id}
        style={styles.list}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.classItem}>
            <View style={[styles.studentInfo, { width: width * 0.8 }]}>
              <Text style={styles.studentName}>{item.nomeAluno}</Text>
              <Text style={styles.textData}>{item.nascimentoAluno}</Text>
              <Text style={styles.textData}>{item.rmAluno}</Text>
            </View>
          </TouchableOpacity>
        )}
      />

      {/* Botão para adicionar novo aluno */}
      <TouchableOpacity
        onPress={() => navigation.navigate("CreateStudent")} 
        style={styles.BtnAdd}
      >
        <Text style={styles.TxtBtn1}>+</Text>
      </TouchableOpacity>
    </Container>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    height: 120,
    paddingHorizontal: 16,
  },
  list: {
    marginBottom: 20,
    flex: 1,
  },
  classItem: {
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "flex-start", // Alinha o conteúdo à esquerda
    padding: 15,
    marginVertical: 8,
    borderWidth: 2,
    borderColor: "#ccc",
    borderRadius: 8,
    backgroundColor: "#f9f9f9",
    elevation: 5,
  },
  studentInfo: {
    alignItems: "flex-start", // Garante que os textos fiquem à esquerda
    marginBottom: 10, // Espaço entre os dados da turma e o botão
    width: "90%",
  },
  BtnAdd: {
    width: 60,
    height: 60,
    backgroundColor: "#6939E9",
    borderRadius: 30,
    position: "absolute",
    top: "80%",
    right: "6.2%",
    alignItems: "center",
    justifyContent: "center",
    elevation: 5,
  },
  TxtBtn1: {
    fontSize: 40,
    fontWeight: "900",
    color: "white",
    textAlign: "center",
    top: -2,
  },
  textData: {
    color: "black",
    fontSize: 17,
    fontWeight: "400",
  },
  studentName: {
    color: "black",
    fontSize: 30,
    fontWeight: "bold",
  },
});
