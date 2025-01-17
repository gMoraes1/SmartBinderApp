import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  Text,
} from "react-native";
import styled, { useTheme } from "styled-components/native";
import {
  collection,
  onSnapshot,
  query,
  where,
  orderBy,
  deleteDoc,
  doc,
  getDocs,
  updateDoc,
} from "firebase/firestore";
import { db } from "../../../../firebase";
import DeleteBtn from "../../../components/Buttons/DeleteBtn";
import LtBtn from "../../../components/Buttons/LittleBtn";
import BackBtn from "../../../components/Buttons/BackBtn";
import Input from "../../../components/Input/Input";
import { StatusBar } from "expo-status-bar";

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
  justify-content:center;
  
`;

const Title = styled.Text`
  font-size: 32px;
  font-weight: 600;
  text-align: center;
  color: ${(props) => props.theme.color};
  top:30;
`;

export default function ListStudents({ navigation, route }) {
  const theme = useTheme()
  const [students, setStudents] = useState<StudentData[]>([]);
  const [editedStudent, setEditedStudent] = useState<StudentData | null>(null);
  const [searchText, setSearchText] = useState("");
  const { turmaId } = route.params;

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

  //Delete para aluno e condsecutivamente apagar as tblObsSondagem
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
            // Segunda confirmação
            Alert.alert(
              "Atenção!",
              "Esta ação é irreversível. Deseja realmente excluir este aluno?",
              [
                {
                  text: "Não",
                  style: "cancel",
                },
                {
                  text: "Sim, excluir",
                  onPress: async () => {
                    try {
                      await deleteObservacoes(id); // Excluir observações associadas
                      await deleteDoc(doc(db, "tblAluno", id)); // Excluir aluno
                      Alert.alert("Sucesso", "Aluno deletado com sucesso.");
                    } catch (error) {
                      console.error("Erro ao deletar aluno.", error);
                      Alert.alert("Erro", "Não foi possível deletar o aluno.");
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
        setEditedStudent(null);
      } catch (error) {
        console.error("Erro ao atualizar aluno:", error);
        Alert.alert("Erro", "Não foi possível atualizar o aluno.");
      }
    }
  };

  const fetchStudents = () => {
    const studentQuery = query(
      collection(db, "tblAluno"),
      where("turmaRef", "==", doc(db, "tblTurma", turmaId)),
      orderBy("nomeAluno")
    );

    onSnapshot(studentQuery, (querySnapshot) => {
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
    });
  };

  useEffect(() => {
    fetchStudents();
  }, [turmaId]);

  // Função para buscar alunos pelo nome ou pela inicial
  const handleSearch = () => {
    if (searchText.trim() === "") {
      fetchStudents(); // Se a busca estiver vazia, puxa todos os alunos
      return;
    }

    const searchQuery = query(
      collection(db, "tblAluno"),
      where("turmaRef", "==", doc(db, "tblTurma", turmaId)),
      where("nomeAluno", ">=", searchText),
      where("nomeAluno", "<=", searchText + "\uf8ff"),
      orderBy("nomeAluno")
    );

    onSnapshot(searchQuery, (querySnapshot) => {
      const filteredList: StudentData[] = [];
      querySnapshot.forEach((docSnap) => {
        const data = docSnap.data();
        filteredList.push({
          id: docSnap.id,
          nomeAluno: data.nomeAluno,
          nascimentoAluno: data.nascimentoAluno,
          rmAluno: data.rmAluno,
        });
      });
      setStudents(filteredList);
    });
  };

  const formatUsername = (text) => {
    const names = text.split(" ");  // Divide o texto em partes (nomes)
    const formattedNames = names.map((name, index) => {
      if (index === 0) {
        // Capitaliza a primeira letra do primeiro nome
        return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
      } else {
        // Mantém os outros nomes como o usuário digitar
        return name;
      }
    });

    return formattedNames.join(" ");  // Junta os nomes novamente
  };

  const handleSearchChange = (text) => {
    const formattedText = formatUsername(text); // Chamando a função formatUsername
    setSearchText(formattedText);
  };

  const handleDateChange1 = (text: string) => {
    let cleaned = text.replace(/\D/g, ""); // Remove caracteres não numéricos
    if (cleaned.length > 8) cleaned = cleaned.slice(0, 8); // Limita a string a no máximo 8 caracteres
    const formatted = cleaned.replace(/(\d{2})(\d{2})(\d{4})/, "$1/$2/$3"); // Formata como DD/MM/YYYY
    setEditedStudent((prev) =>
      prev ? { ...prev, nascimentoAluno: formatted } : null
    );
  };
  

  return (
    <Container>
      <StatusBar style="auto" />

      <View style={styles.header}>
        <BackBtn onPress={() => navigation.goBack()} />
      </View>
      <Title>Alunos da turma</Title>

      {/* Input e botão de busca */}
      <View style={styles.searchContainer}>
        <Input
          text="Buscar Aluno"
          value={searchText}
          onChangeText={handleSearchChange}
          placeholder="Digite o nome ou inicial"
        />
        <LtBtn onPress={handleSearch}>Buscar</LtBtn>
      </View>

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
              <DeleteBtn onPress={() => deleteAluno(item.id)}>Deletar</DeleteBtn>
              <LtBtn onPress={() => handleEditStudent(item)}>Editar</LtBtn>
              <LtBtn
                onPress={() =>
                  navigation.navigate("StatusSondagem", {
                    alunoId: item.id,
                    turmaId,
                  })
                }
              >
                Progresso
              </LtBtn>
            </View>
          </View>
        )}
      />

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
            text="Data de Nascimento"
            value={editedStudent?.nascimentoAluno || ""} // Certifique-se de que a data de nascimento está sendo passada
            onChangeText={handleDateChange1}
            placeholder="Digite a data de nascimento"
            placeholderTextColor={theme.placeholderColor}
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
    top: "3%",

  },
  list: {
    marginBottom: 90,
    marginTop: 40,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",

    marginBottom: '5%',
    top: 45
  },
  studentItem: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: 'center',
    textAlign: "left",
    padding: 15,
    marginVertical: 8,
    borderWidth: 2,
    borderColor: "#ccc",
    borderRadius: 8,
    backgroundColor: "#f9f9f9",
    elevation: 5,
  },
  studentInfo: {
    marginBottom: 10,
    position: 'relative',
    right: '15%',
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
  editContainer: {
    position: "absolute",
    top: "30%",
    left: "10%",
    width: "80%",
    padding: 16,
    backgroundColor: "white",
    borderRadius: 10,
    elevation: 5,
    zIndex: 10,

  },
  editTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  btnGroup: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  buttonsContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-evenly",
  }
});