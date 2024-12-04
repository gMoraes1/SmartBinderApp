import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  Alert,
} from "react-native";
import React, { useEffect, useState } from "react";
import styled, { useTheme } from "styled-components/native";
import {
  collection,
  onSnapshot,
  deleteDoc,
  updateDoc,
  query,
  where,
  doc,
  getDocs,
} from "firebase/firestore";
import { db, auth } from "../../../../firebase"; // Ajuste para seu caminho do Firebase
import LtBtn from "../../../components/Buttons/LittleBtn";
import DeleteBtn from "../../../components/Buttons/DeleteBtn";
import RNPickerSelect from 'react-native-picker-select';
import Input from "../../../components/Input/Input";
import { StatusBar } from "expo-status-bar";

interface ClassData {
  id: string;
  nomeTurma: string;
  periodoTurma: string;
  educationLevel: string;
  school: string;
}

const Container = styled.View`
  background-color: ${(props) => props.theme.background};
  width: 100%;
  padding: 16px;
  height: 95%;
`;

const Title = styled.Text`
  font-size: 32px;
  font-weight: 600;
  text-align: center;
  padding-top: 12%;
  color: ${(props) => props.theme.color}; 
`;

export default function Classes({ navigation }) {
  const theme = useTheme();
  const [turma, setTurma] = useState<ClassData[]>([]);
  const [editedTurma, setEditedTurma] = useState<ClassData | null>(null);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      query(
        collection(db, "tblTurma"),
        where("userRef", "==", doc(db, "users", auth.currentUser?.uid))
      ),
      (querySnapshot) => {
        const lista: ClassData[] = [];
        querySnapshot.forEach((docSnap) => {
          const data = docSnap.data();
          lista.push({
            id: docSnap.id,
            nomeTurma: data.nomeTurma,
            periodoTurma: data.periodoTurma,
            educationLevel: data.educationLevel,
            school: data.school,
          });
        });

        setTurma(lista);
      }
    );

    return () => unsubscribe();
  }, []);

  // Função para deletar alunos e sondagens associadas à turma
  // Função para deletar dados associados (alunos, sondagens e observações)
  async function deleteAssociatedData(turmaId: string) {
    try {
      // Deletar alunos associados à turma
      const alunosQuery = query(
        collection(db, "tblAluno"),
        where("turmaRef", "==", doc(db, "tblTurma", turmaId)) // Consultando alunos com a referência da turma
      );
      const alunosSnapshot = await getDocs(alunosQuery);
      if (alunosSnapshot.empty) {
        console.log("Nenhum aluno encontrado para esta turma.");
      } else {
        const alunoDeletePromises = alunosSnapshot.docs.map(async (docSnap) => {
          // Deletar observações (tblObsSondagem) associadas ao aluno
          const observacoesQuery = query(
            collection(db, "tblObsSondagem"),
            where("alunoRef", "==", doc(db, "tblAluno", docSnap.id)) // Consultando observações associadas ao aluno
          );
          const observacoesSnapshot = await getDocs(observacoesQuery);
          if (!observacoesSnapshot.empty) {
            const observacaoDeletePromises = observacoesSnapshot.docs.map((obsSnap) =>
              deleteDoc(doc(db, "tblObsSondagem", obsSnap.id))
            );
            await Promise.all(observacaoDeletePromises);
            console.log("Observações deletadas com sucesso.");
          }

          // Deletar o aluno
          await deleteDoc(doc(db, "tblAluno", docSnap.id));
          console.log("Aluno deletado com sucesso.");
        });
        await Promise.all(alunoDeletePromises);
      }

      // Deletar sondagens associadas à turma
      const sondagensQuery = query(
        collection(db, "tblSondagem"),
        where("turmaRef", "==", doc(db, "tblTurma", turmaId)) // Consultando sondagens com a referência da turma
      );
      const sondagensSnapshot = await getDocs(sondagensQuery);
      if (sondagensSnapshot.empty) {
        console.log("Nenhuma sondagem encontrada para esta turma.");
      } else {
        const sondagemDeletePromises = sondagensSnapshot.docs.map((docSnap) =>
          deleteDoc(doc(db, "tblSondagem", docSnap.id))
        );
        await Promise.all(sondagemDeletePromises);
        console.log("Sondagens deletadas com sucesso.");
      }
    } catch (error) {
      console.error("Erro ao deletar dados relacionados:", error);
      throw new Error("Erro ao deletar dados relacionados.");
    }
  }


  // Função de exclusão da turma com confirmação em duas etapas
  function handleDeleteTurma(turmaId: string) {
    Alert.alert(
      "Confirmar Exclusão",
      "Você tem certeza de que deseja deletar esta turma?",
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Sim",
          onPress: () => {
            Alert.alert(
              "Confirmação Final",
              "Tem certeza absoluta de que deseja deletar esta turma? Isso apagará todos os dados relacionados.",
              [
                {
                  text: "Cancelar",
                  style: "cancel",
                },
                {
                  text: "Deletar",
                  style: "destructive",
                  onPress: async () => {
                    try {
                      // Primeiro, deletar dados relacionados (alunos e sondagens)
                      await deleteAssociatedData(turmaId);

                      // Depois, deletar a turma
                      await deleteDoc(doc(db, "tblTurma", turmaId));
                      Alert.alert("Sucesso", "Turma e dados relacionados deletados com sucesso.");
                    } catch (error) {
                      Alert.alert("Erro", "Não foi possível deletar a turma e os dados relacionados.");
                    }
                  },
                },
              ]
            );
          },
        },
      ]
    );
  }

  const handleEdit = (turmaData: ClassData) => {
    setEditedTurma(turmaData);
  };

  const handleSave = async () => {
    if (editedTurma) {
      try {
        await updateDoc(doc(db, "tblTurma", editedTurma.id), {
          nomeTurma: editedTurma.nomeTurma,
          periodoTurma: editedTurma.periodoTurma,
          educationLevel: editedTurma.educationLevel,
          school: editedTurma.school,
        });
        Alert.alert("Sucesso", "Turma atualizada com sucesso!");
        setEditedTurma(null); // Fecha a caixa de edição
      } catch (error) {
        console.error("Erro ao atualizar a turma:", error);
        Alert.alert("Erro", "Não foi possível atualizar a turma.");
      }
    }
  };

  return (
    <Container>
      <StatusBar style="auto" />

      <Title>Turmas</Title>

      <FlatList
        data={turma}
        keyExtractor={(item) => item.id}
        style={styles.list}
        renderItem={({ item }) => (
          <View style={styles.classItem}>
            <TouchableOpacity
              onPress={() =>
                navigation.navigate("ListStudents", { turmaId: item.id })
              }
              style={styles.classInfo}
            >
              <Text style={styles.textData}>
                Nome da turma: {item.nomeTurma}
              </Text>
              <Text style={styles.textData}>Período: {item.periodoTurma}</Text>
              <Text style={styles.textData}>
                Nível escolar: {item.educationLevel}
              </Text>
              <Text style={styles.textData}>Escola: {item.school}</Text>
            </TouchableOpacity>

            <View style={styles.Buttons}>
              <DeleteBtn onPress={() => handleDeleteTurma(item.id)}>
                Deletar
              </DeleteBtn>
              <LtBtn onPress={() => handleEdit(item)}>Editar</LtBtn>
              <LtBtn
                onPress={() =>
                  navigation.navigate("ExportDoc", { turmaId: item.id })
                }
              >
                Sondagem
              </LtBtn>
            </View>
          </View>
        )}
      />

      {editedTurma && (
        <View style={styles.editContainer}>
          <Text style={styles.editTitle}>Editar Turma</Text>
          <Input
            text="Escola"
            value={editedTurma.nomeTurma}
            onChangeText={(value) =>
              setEditedTurma({ ...editedTurma, nomeTurma: value })
            }
          />
          <RNPickerSelect
            value={editedTurma.periodoTurma} // Passando o valor atual da turma
            onValueChange={(value) => {
              setEditedTurma({ ...editedTurma, periodoTurma: value }); // Atualizando o estado com o valor selecionado
            }}
            items={[
              { label: 'Manhã', value: 'manhã' },
              { label: 'Tarde', value: 'tarde' },
              { label: 'Noite', value: 'noite' },
            ]}
            style={{
              inputIOS: {
                backgroundColor: theme.inputBackground || "#D2DFDA",
                color: theme.color || "#000",
                height: 50,
                width: 240,
                margin: 8,
                fontSize: 18,
                borderRadius: 10,
                elevation: 2,
                alignSelf:'center'
              },
              inputAndroid: {
                backgroundColor: theme.inputBackground || "#D2DFDA",
                color: theme.color || "#000",
                height: 50,
                width: 240,
                margin: 8,
                fontSize: 18,
                borderRadius: 10,
                elevation: 2,
                alignSelf:'center'
              }
            }}
            placeholder={{
              label: 'Escolha um Período',
              value: null,
              color: theme.placeholderColor,
            }}
          />

          <RNPickerSelect
            value={editedTurma.educationLevel} // Passando o valor atual do nível escolar
            onValueChange={(value) => {
              setEditedTurma({ ...editedTurma, educationLevel: value }); // Atualizando o estado com o valor selecionado
            }}
            items={[
              { label: '1° série', value: '1° série' },
              { label: '2° série', value: '2° série' },
              { label: '3° série', value: '3° série' },
              { label: '4° série', value: '4° série' },
              { label: '5° série', value: '5° série' },
            ]}
            style={{
              inputIOS: {
                backgroundColor: theme.inputBackground || "#D2DFDA",
                color: theme.color || "#000",
                height: 50,
                width: 240,
                margin: 8,
                fontSize: 18,
                borderRadius: 10,
                elevation: 2,
                alignSelf:'center'
              },
              inputAndroid: {
                backgroundColor: theme.inputBackground || "#D2DFDA",
                color: theme.color || "#000",
                height: 50,
                width: 240,
                margin: 8,
                fontSize: 18,
                borderRadius: 10,
                elevation: 2,
                alignSelf:'center'
              }
            }}
            placeholder={{
              label: 'Escolha uma Série',
              value: null,
              color: theme.placeholderColor,
            }}
          />

          <Input
            text="Escola"
            value={editedTurma.school}
            onChangeText={(value) =>
              setEditedTurma({ ...editedTurma, school: value })
            }
          />
          <View style={styles.btnGroup}>
            <LtBtn onPress={handleSave}>Salvar</LtBtn>
            <LtBtn onPress={() => setEditedTurma(null)}>Cancelar</LtBtn>
          </View>
        </View>
      )}
      <TouchableOpacity
        onPress={() => navigation.navigate("RegisterClasses")}
        style={styles.BtnAdd}
      >
        <Text style={styles.TxtBtn1}>+</Text>
      </TouchableOpacity>
    </Container>
  );
}

const styles = StyleSheet.create({
  list: {
    marginBottom: 30,
    marginTop: 30,
  },
  classItem: {
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
  classInfo: {
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
    top: "86.6%",
    right: "6.5%",
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
    fontSize: 16,
    fontWeight: "bold",
  },
  Buttons: {
    display: "flex",
    flexDirection: "row",
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
    textAlign:'center',
    justifyContent:'center',
  },
  editTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  input: {
    width: "100%",
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    paddingLeft: 8,
    marginBottom: 10,
  },
  btnGroup: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
    width: "100%",
  },
});