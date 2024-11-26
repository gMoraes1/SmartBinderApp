import React, { useState } from "react";
import { StyleSheet, View, Alert } from "react-native";
import styled from 'styled-components/native';
import { TextInputIconProps } from 'react-native-paper'

import { db, auth } from "../../../../firebase"; // Importando a instância do Firestore e auth
import { collection, addDoc, doc } from 'firebase/firestore'; // Funções do Firestore
import BackBtn from "../../../components/Buttons/BackBtn";
import Input from "../../../components/Input/Input";

import Btn from "../../../components/Buttons/Btn";
import TextInputIcon from "react-native-paper/lib/typescript/components/TextInput/Adornment/TextInputIcon";

// Definindo o estilo para os componentes
const Container = styled.View`
  background-color: ${(props) => props.theme.background};
  width: 100%;
  height: 100%;
  align-items: center;
  display: flex;
  gap: 30px;
`;

const Title = styled.Text`
  font-size: 32px;
  font-weight: 600;
  text-align: center;
  flex: 1;
  padding-top: 12%;
  color: ${(props) => props.theme.color};
`;

export default function RegisterClasses({ navigation }) {
  const [className, setClassName] = useState("");
  const [period, setPeriod] = useState("");
  const [educationLevel, setEducationLevel] = useState("");
  const [school, setSchool] = useState("");

  // Função para adicionar a turma ao Firestore
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
      const classCollectionRef = collection(db, 'tblTurma');
      // Adicionando os dados da turma à coleção 'tblTurma', associando o documento do usuário ao campo 'userRef'
      await addDoc(classCollectionRef, {
        nomeTurma: className,
        periodoTurma: period,
        educationLevel: educationLevel,
        school: school,
        userRef: userRef,  // A referência ao documento do usuário
      });
      // Navegar de volta para a lista de turmas, passando os dados da turma
      navigation.navigate("Classes", {
        classData: {
          name: className,
          period,
          educationLevel,
          school,
        },
      });
    } catch (error) {
      console.error("Erro ao adicionar turma: ", error);
      Alert.alert("Erro", "Ocorreu um erro ao adicionar a turma. Tente novamente.");
    }
  };

  return (
    <Container>
      <View style={styles.header}>
        <BackBtn onPress={() => navigation.goBack()} />
        <Title>Cadastrar Turma</Title>
      </View>

      <View style={styles.inputContainer}>
        <Input text="Nome da turma" onChangeText={setClassName} />
        <Input text="Período" onChangeText={setPeriod} />
        <Input text="Nível de escolaridade" onChangeText={setEducationLevel} />
        <Input text="Escola" onChangeText={setSchool} />
      </View>

      <Btn onPress={handleAddClass} texto="Cadastrar" />
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
  inputContainer: {
    display: "flex",
    flexDirection: "column",
    gap: 10,
  },
});

