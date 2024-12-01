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
  getDocs
} from "firebase/firestore";
import { db } from "../../../../firebase";
import DeleteBtn from "../../../components/Buttons/DeleteBtn";
import LtBtn from "../../../components/Buttons/LittleBtn";
import BackBtn from "../../../components/Buttons/BackBtn";
import Input from "../../../components/Input/Input"; // Ensure Input component is available for form fields

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
  const [editedStudent, setEditedStudent] = useState<StudentData | null>(null);
  const { turmaId } = route.params; 
  const { alunoId } = route.params;

  // Função para excluir as observações associadas ao aluno
  const deleteObservacoes = async (alunoId: string) => {
    const collectionRef = collection(db, "tblObsSondagem");
    const q = query(
      collectionRef,
      where("alunoRef", "==", doc(db, "tblAluno", alunoId))
    );

    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((docSnap) => {
      deleteDoc(doc(db, "tblObsSondagem", docSnap.id)); // Excluir cada observação
    });
  };

  // Função para excluir o aluno
  const deleteAluno = async (id: string) => {
    Alert.alert(
      "Confirmar Exclusão",
      "Você tem certeza que deseja excluir este aluno?",
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Sim",
          onPress: () => {
            Alert.alert(
              "Confirmar Exclusão Final",
              "Esta ação é irreversível. Você tem certeza que deseja excluir?",
              [
                {
                  text: "Cancelar",
                  style: "cancel",
                },
                {
                  text: "Sim",
                  onPress: async () => {
                    try {
                      // Excluir observações do aluno
                      await deleteObservacoes(id);
                      // Excluir aluno
                      await deleteDoc(doc(db, "tblAluno", id));
                      Alert.alert("Aluno deletado com sucesso.");
                    } catch (error) {
                      console.error("Erro ao deletar aluno.", error);
                      Alert.alert("Erro ao deletar aluno.");
                    }
                  },
                },
              ]
            );
          },
        },
      ]
    );
  };

  useEffect(() => {
    const unsubscribe = onSnapshot(
      query(
        collection(db, "tblAluno"),
        where("turmaRef", "==", doc(db, "tblTurma", turmaId)),
        orderBy("nomeAluno") // Ordering by student name
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
  }, [turmaId]);

  const handleEditStudent = (studentData: StudentData) => {
    setEditedStudent(studentData);
  };

  const handleSaveStudent = async () => {
    if (editedStudent) {
      try {
        await updateDoc(doc(db, "tblAluno", editedStudent.id), {
          nomeAluno: editedStudent.nomeAluno,
          nascimentoAluno: editedStudent.nascimentoAluno,
          rmAluno: editedStudent.rmAluno,
        });
        Alert.alert("Sucesso", "Aluno atualizado com sucesso!");
        setEditedStudent(null); // Close edit form
      } catch (error) {
        console.error("Erro ao atualizar aluno:", error);
        Alert.alert("Erro", "Não foi possível atualizar o aluno.");
      }
    }
  };

  return (
    <Container>
      <View style={styles.header}>
        <BackBtn onPress={() => navigation.goBack()} />
      </View>
        <Title>Alunos da turma</Title>

        <FlatList
          data={students}
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
                <DeleteBtn onPress={() => deleteAluno(item.id)}>
                  Deletar
                </DeleteBtn>
                <LtBtn onPress={() => handleEditStudent(item)}>
                  Editar
                </LtBtn>
                <LtBtn onPress={() => navigation.navigate("StatusSondagem", { alunoId: item.id, turmaId })}>
                  Progresso
                </LtBtn>
              </View>
            </View>
          )}
        />

      {/* Add/Edit student form */}
      {editedStudent && (
        <View style={styles.editContainer}>
          <Text style={styles.editTitle}>Editar Aluno</Text>
          <Input
            text="Nome"
            value={editedStudent.nomeAluno}
            onChangeText={(value) =>
              setEditedStudent({ ...editedStudent, nomeAluno: value })
            }
          />
          <Input
            text="Nascimento"
            value={editedStudent.nascimentoAluno}
            onChangeText={(value) =>
              setEditedStudent({ ...editedStudent, nascimentoAluno: value })
            }
          />
          <Input
            text="RM"
            value={editedStudent.rmAluno}
            onChangeText={(value) =>
              setEditedStudent({ ...editedStudent, rmAluno: value })
            }
          />
          <View style={styles.btnGroup}>
            <LtBtn onPress={handleSaveStudent}>Salvar</LtBtn>
            <LtBtn onPress={() => setEditedStudent(null)}>Cancelar</LtBtn>
          </View>
        </View>
      )}

      {/* Button to register new students */}
      <TouchableOpacity
        onPress={() =>
          navigation.navigate("CreateStudent", { turmaId: turmaId,  })
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
    top: '2.8%',
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
    display: "flex",
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  editContainer: {
    position: "absolute",
    top: "30%",
    left: "10%",
    right: "10%",
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 8,
    elevation: 5,
    alignItems: "center",
  },
  editTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  btnGroup: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
    width: "100%",
  },
});
