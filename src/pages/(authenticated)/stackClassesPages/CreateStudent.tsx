import React, { useState, useEffect } from "react";
import { StyleSheet, View, Alert } from "react-native";
import styled from "styled-components/native";
import { auth, db } from "../../../../firebase"; // Instância do Firebase
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

  // Função para pegar a turma automaticamente
  const handleAddClass = async () => {
    try {
      // Verificando se o usuário está autenticado
      const user = auth.currentUser;
      if (!user) {
        console.error("Usuário não autenticado!");
        Alert.alert("Erro", "Você precisa estar logado para criar uma turma.");
        return;
      }
      // Referência do usuário na coleção 'users' (a referência ao documento do usuário)
      const userRef = doc(db, 'users', user.uid);  // Criação da referência ao documento do usuário
      // Obtendo a referência da coleção 'tblTurma' para adicionar uma nova turma
      const classCollectionRef = collection(db, 'tblAluno');
      // Adicionando os dados da turma à coleção 'tblTurma', associando o documento do usuário ao campo 'userRef'
      await addDoc(classCollectionRef, {
        nomeAluno: studentName,
        nascimentoAluno: birthStudent,
        rmAluno: rmAluno,
        userRef: userRef,  // A referência ao documento do usuário
      });
      // Navegar de volta para a lista de turmas, passando os dados da turma
      navigation.navigate("ClassDetails", {
        classData: {
          name: studentName,
          birthStudent,
          rmAluno,
        },
      });
    } catch (error) {
      console.error("Erro ao adicionar aluno: ", error);
      Alert.alert("Erro", "Ocorreu um erro ao adicionar a aluno. Tente novamente.");
    }
  };

  return (
    <Container>
      <View style={styles.header}>
        <BackBtn onPress={() => navigation.goBack()} />
      </View>
      <Title>Cadastrar Aluno</Title>
      <View style={styles.inputContainer}>
        <Input text="Nome do aluno" value={studentName} onChangeText={setStudentName} />
        <Input text="Nascimento aluno" value={birthStudent} onChangeText={setBirthStudent} />
        <Input text="RM Aluno" value={rmAluno} onChangeText={setRmAluno} />

        {/* A turma será associada automaticamente ao aluno */}
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
