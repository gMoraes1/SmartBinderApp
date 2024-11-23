import React, { useState, useEffect } from "react";
import { StyleSheet, View, Alert } from "react-native";
import styled from "styled-components/native";

import { auth, db } from "../../../../firebase"; // Importando a instância do Firestore e auth
import { collection, addDoc, doc, query, where, getDocs } from "firebase/firestore"; // Funções do Firestore

import BackBtn from "../../../components/Buttons/BackBtn";
import Input from "../../../components/Input/Input";
import Btn from "../../../components/Buttons/Btn";

const Container = styled.View`
  background-color: ${(props) => props.theme.background};
  width: 100%;
  height: 100%;
  align-items: center;
  justify-content: center;
`;

const Title = styled.Text`
  font-size: 32px;
  font-weight: 600;
  text-align: center;
  flex: 1;
  padding-top: 12%;
  color: ${(props) => props.theme.color};
`;

export default function CreateStudent({ navigation }) {
  const [studentName, setStudentName] = useState("");
  const [birthStudent, setBirthStudent] = useState("");
  const [rmAluno, setRmAluno] = useState("");
  const [classId, setClassId] = useState("");  // Aqui você armazena o ID da turma

  // Função para pegar o ID da turma
  const getClassId = async () => {
    try {
      // Exemplo de consulta à coleção 'tblTurma', aqui você pode filtrar a turma conforme necessário
      const q = query(collection(db, "tblTurma"));
      const querySnapshot = await getDocs(q);

      // Pegando o ID da primeira turma (ou a que você desejar)
      if (!querySnapshot.empty) {
        const doc = querySnapshot.docs[0]; // Aqui você pode aplicar algum filtro se necessário
        setClassId(doc.id);  // Armazena o ID da turma
      } else {
        console.error("Nenhuma turma encontrada!");
        Alert.alert("Erro", "Nenhuma turma encontrada no banco de dados.");
      }
    } catch (error) {
      console.error("Erro ao buscar turma:", error);
      Alert.alert("Erro", "Ocorreu um erro ao buscar a turma.");
    }
  };

  // Chama a função getClassId quando o componente for montado
  useEffect(() => {
    getClassId();
  }, []);

  const handleAddClass = async () => {
    try {
      const user = auth.currentUser;
      if (!user) {
        console.error("Usuário não autenticado!");
        Alert.alert("Erro", "Você precisa estar logado para criar um aluno.");
        return;
      }

      if (!classId) {
        console.error("ID da turma não encontrado!");
        Alert.alert("Erro", "Não foi possível associar o aluno à turma.");
        return;
      }

      // Referência à turma que o aluno será associado (usando o ID encontrado)
      const classRef = doc(db, "tblTurma", classId);  // Referência ao documento da turma pela ID

      // Referência ao aluno que será adicionado
      const studentCollectionRef = collection(db, "tblAluno");

      // Adicionando os dados do aluno à coleção 'tblAluno', associando à turma pela referência
      await addDoc(studentCollectionRef, {
        nomeAluno: studentName,
        nascimentoAluno: birthStudent,
        rmAluno: rmAluno,
        classRef: classRef, // Associando a turma pela referência
      });

      // Navegar de volta para os detalhes da turma (caso você queira mostrar detalhes após o cadastro)
      navigation.navigate("ClassDetails", {
        classData: {
          name: studentName,
          birthStudent,
          rmAluno,
        },
      });
    } catch (error) {
      console.error("Erro ao adicionar aluno: ", error);
      Alert.alert(
        "Erro",
        "Ocorreu um erro ao adicionar o aluno. Tente novamente."
      );
    }
  };

  return (
    <Container>
      <View style={styles.header}>
        <BackBtn onPress={() => navigation.navigate("ClassDetails")} />
      </View>
      <Title>Cadastrar Aluno</Title>
      <View style={styles.inputContainer}>
        <View>
          <Input text="Nome do aluno" onChangeText={setStudentName} />
          <Input text="Nascimento aluno" onChangeText={setBirthStudent} />
          <Input text="RM Aluno" onChangeText={setRmAluno} />
        </View>
        <Btn onPress={handleAddClass} texto="Cadastrar" />
      </View>
    </Container>
  );
}

const styles = StyleSheet.create({
  header: {
    right: "41%",
    top: "5%",
  },
  inputContainer: {
    display: "flex",
    flexDirection: "column",
    gap: 10,
    marginBottom: 300,
  },
});
