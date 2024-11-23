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
import { auth, db } from "../../../../firebase"; // Importando o Firebase

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

interface ClassData {
  id: string;
  nomeAluno: string;
  nascimentoAluno: string;
  rmAluno: string;
}

const { width } = Dimensions.get('window');  

export default function ClassDetails({ navigation, route }) {
  const [student, setStudent] = useState<ClassData[]>([]); // Alterado para o tipo ClassData

  const { classId } = route.params; // Supondo que o ID da turma seja passado via navegação

  useEffect(() => {
    // Alterando a consulta para pegar alunos pela turma, filtrando pelo ID da turma
    const unsubscribe = onSnapshot(
      query(
        collection(db, "tblAluno"),
        where("classRef", "==", doc(db, "tblTurma", classId))  // Filtrando pela referência da turma
      ),
      (querySnapshot) => {
        const lista: ClassData[] = [];
        querySnapshot.forEach((docSnap) => {
          const data = docSnap.data();
          lista.push({
            id: docSnap.id,
            nomeAluno: data.nomeAluno,
            nascimentoAluno: data.nascimentoAluno,
            rmAluno: data.rmAluno,
          });
        });
        setStudent(lista); // Atualizando o estado com os alunos encontrados
      }
    );
    return () => unsubscribe(); // Cleanup para a consulta
  }, [classId]); // Dependendo do classId, a consulta será reexecutada

  return (
    <Container>
      <View style={styles.header}>
        <BackBtn onPress={() => navigation.navigate("Classes")} />
        <Title>Detalhes da Turma</Title>
      </View>

      <FlatList
        data={student}
        keyExtractor={(item) => item.id}
        style={styles.list}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.classItem}
            onPress={() => navigation.navigate("ClassDetails")}
          >
            <View style={[styles.studentInfo, { width: width * 0.8 }]}>
              <Text style={styles.studentName}>{item.nomeAluno}</Text>
              <Text style={styles.textData}>{item.nascimentoAluno}</Text>
              <Text style={styles.textData}>{item.rmAluno}</Text>
            </View>
          </TouchableOpacity>
        )}
      />

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
  btnView: {
    marginTop: 90,
    display: "flex",
    flexDirection: "column",
    gap: 20,
  },
  list: {
    marginBottom: 20,
    flex: 1
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
    width: '90%'
  },
  BtnDelete: {
    marginTop: 10,
    backgroundColor: "#ff4d4d",
    padding: 10,
    borderRadius: 10,
    width: 100,
    alignSelf: "center", // Centraliza o botão no item
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
  }
});
