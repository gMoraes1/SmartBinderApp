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
  getDocs,
} from "firebase/firestore";
import { db } from "../../../../firebase";
import DeleteBtn from "../../../components/Buttons/DeleteBtn";
import LtBtn from "../../../components/Buttons/LittleBtn";
import BackBtn from "../../../components/Buttons/BackBtn";
import Input from "../../../components/Input/Input";

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
  padding-top: 12%;
  color: ${(props) => props.theme.color};
`;

export default function ListStudents({ navigation, route }) {
  const [students, setStudents] = useState<StudentData[]>([]);
  const [searchQuery, setSearchQuery] = useState(""); // Estado para o termo de busca
  const [filteredStudents, setFilteredStudents] = useState<StudentData[]>([]);
  const { turmaId } = route.params;

  useEffect(() => {
    const unsubscribe = onSnapshot(
      query(
        collection(db, "tblAluno"),
        where("turmaRef", "==", doc(db, "tblTurma", turmaId)),
        orderBy("nomeAluno")
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
        setFilteredStudents(studentList); // Inicializa os alunos filtrados com todos os dados
      }
    );

    return () => unsubscribe();
  }, [turmaId]);

  const handleSearch = () => {
    // Filtrar alunos que começam com o termo digitado
    const results = students.filter((student) =>
      student.nomeAluno.toLowerCase().startsWith(searchQuery.toLowerCase())
    );
    setFilteredStudents(results);
  };

  const clearSearch = () => {
    setSearchQuery("");
    setFilteredStudents(students);
  };

  return (
    <Container>
      <View style={styles.header}>
        <BackBtn onPress={() => navigation.goBack()} />
        <View style={styles.searchContainer}>
          <Input
            placeholder="Buscar aluno..."
            value={searchQuery}
            onChangeText={(text) => setSearchQuery(text)}
          />
          <TouchableOpacity onPress={handleSearch} style={styles.searchButton}>
            <Text style={styles.searchButtonText}>Buscar</Text>
          </TouchableOpacity>
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={clearSearch} style={styles.clearButton}>
              <Text style={styles.clearButtonText}>X</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      <Title>Alunos da turma</Title>

      <FlatList
        data={filteredStudents} // Renderizar a lista filtrada
        keyExtractor={(item) => item.id}
        style={styles.list}
        renderItem={({ item }) => (
          <View style={styles.studentItem}>
            <View style={styles.studentInfo}>
              <Text style={styles.textData}>Nome: {item.nomeAluno}</Text>
              <Text style={styles.textData}>
                Nascimento: {item.nascimentoAluno}
              </Text>
              <Text style={styles.textData}>RM: {item.rmAluno}</Text>
            </View>
            <View style={styles.buttonsContainer}>
              <DeleteBtn onPress={() => deleteAluno(item.id)}>Deletar</DeleteBtn>
              <LtBtn onPress={() => handleEditStudent(item)}>Editar</LtBtn>
              <LtBtn
                onPress={() =>
                  navigation.navigate("StatusSondagem", { alunoId: item.id, turmaId })
                }
              >
                Progresso
              </LtBtn>
            </View>
          </View>
        )}
      />

      <TouchableOpacity
        onPress={() => navigation.navigate("CreateStudent", { turmaId })}
        style={styles.BtnAdd}
      >
        <Text style={styles.TxtBtn1}>+</Text>
      </TouchableOpacity>
    </Container>
  );
}

const styles = StyleSheet.create({
  header: {
    top: "2.8%",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginVertical: 10,
  },
  searchButton: {
    backgroundColor: "#6939E9",
    padding: 10,
    borderRadius: 5,
    marginLeft: 10,
  },
  searchButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  clearButton: {
    marginLeft: 10,
  },
  clearButtonText: {
    color: "#ff0000",
    fontWeight: "bold",
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
  buttonsContainer: {
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
    justifyContent: "center",
  },
});
