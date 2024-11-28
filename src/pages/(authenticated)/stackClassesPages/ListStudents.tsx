import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  Text,
} from "react-native";
import styled from "styled-components/native";
import {
  collection,
  onSnapshot,
  query,
  where,
  orderBy,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { db } from "../../../../firebase";
import DeleteBtn from "../../../components/Buttons/DeleteBtn";
import LtBtn from "../../../components/Buttons/LittleBtn";
import BackBtn from "../../../components/Buttons/BackBtn";


interface StudentData {
  id: string;
  nomeAluno: string;
  nascimentoAluno: string;
  rmAluno: string;
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
  padding-bottom: 8%;
  color: ${(props) => props.theme.color};
`;

export default function ListStudents({ navigation, route }) {
  const [students, setStudents] = useState<StudentData[]>([]);
  const { turmaId } = route.params; // Obtendo o parâmetro turmaId

  async function deleteAluno(id: string) {
    try {
      await deleteDoc(doc(db, "tblAluno", id));
      Alert.alert("Aluno deletado.");
    } catch (error) {
      console.error("Erro ao deletar aluno.", error);
      Alert.alert("Erro ao deletar aluno.");
    }
  }

  useEffect(() => {
    const unsubscribe = onSnapshot(
      query(
        collection(db, "tblAluno"),
        where("turmaRef", "==", doc(db, "tblTurma", turmaId)),
        orderBy("nomeAluno") // Ordenando pela propriedade nomeAluno
      ),
      (querySnapshot) => {
        const studentList: StudentData[] = [];
        querySnapshot.forEach((docSnap) => {
          const data = docSnap.data();
          studentList.push({
            id: docSnap.id,
            nomeAluno: data.nomeAluno,
            nascimentoAluno: data.nascimentoAluno,
            rmAluno: data.rmAluno,
          });
        });

        setStudents(studentList);
      }
    );

    return () => unsubscribe();
  }, [turmaId]); ''

  return (
    <Container>
      <View style={styles.header}>
        <BackBtn onPress={() => navigation.goBack()} />
      <Title>Alunos da turma</Title>
      </View>

      <FlatList
        data={students}
        keyExtractor={(item) => item.id}
        style={styles.list}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.studentItem}
            onPress={() => {
              navigation.navigate("StudentDetails");
            }}
          >
            <View style={styles.studentInfo}>
              <Text style={styles.textData}>Nome: {item.nomeAluno}</Text>
              <Text style={styles.textData}>
                Nascimento: {item.nascimentoAluno}
              </Text>
              <Text style={styles.textData}>RM: {item.rmAluno}</Text>
            </View>
            <View style={styles.buttonsContainer}>
              <DeleteBtn onPress={() => deleteAluno(item.id)}>
                Deletar
              </DeleteBtn>
              <LtBtn onPress={() => navigation.navigate("StudentDetails")}>
                Editar
              </LtBtn>
            </View>
          </TouchableOpacity>
        )}
      />

      {/* Botão para registrar alunos */}
      <TouchableOpacity
        onPress={() =>
          navigation.navigate("CreateStudent", { turmaId: turmaId })
        }
        style={styles.BtnAdd}
      >

        <Text style={styles.TxtBtn1}>+</Text>
      </TouchableOpacity>
    </Container>
  );
}

const styles = StyleSheet.create({
  header: {
    right: '0%',
    top: '2.8%',
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
  textData: {
    color: "black",
    fontSize: 16,
    fontWeight: "bold",
  },
  BtnAdd: {
    width: 60,
    height: 60,
    backgroundColor: "#6939E9",
    borderRadius: 30,
    position: "absolute",
    top: "82%",
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
  deleteButton: {
    backgroundColor: "#FF5050",
    borderRadius: 5,
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
  deleteText: {
    color: "white",
    fontSize: 16,
    fontWeight: "800",
  },
  buttonsContainer: {
    display: "flex",
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
    justifyContent: "center"
  }
});
