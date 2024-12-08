import React, { useState } from "react";
import { StyleSheet, View, Alert } from "react-native";
import styled, { useTheme } from "styled-components/native";

import { db, auth } from "../../../../firebase"; // Importando a instância do Firestore e auth
import { collection, addDoc, doc, writeBatch } from "firebase/firestore"; // Funções do Firestore
import BackBtn from "../../../components/Buttons/BackBtn";
import Input from "../../../components/Input/Input";

import Btn from "../../../components/Buttons/Btn";
import { StatusBar } from "expo-status-bar";

// Definindo o estilo para os componentes
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

export default function RegisterClasses({ navigation }) {
  const theme = useTheme();
  const [className, setClassName] = useState("");
  const [period, setPeriod] = useState("");
  const [educationLevel, setEducationLevel] = useState("");
  const [school, setSchool] = useState("");

  // Função para adicionar a turma e as sondagens ao Firestore
  const handleAddClass = async () => {
    try {
      const user = auth.currentUser;
      if (!user) {
        console.error("Usuário não autenticado!");
        Alert.alert("Erro", "Você precisa estar logado para criar uma turma.");
        return;
      }

      // Referência do usuário na coleção 'users'
      const userRef = doc(db, "users", user.uid);

      // Criando batch para operações em lote
      const batch = writeBatch(db);

      // Referência da nova turma
      const classCollectionRef = collection(db, "tblTurma");
      const turmaDocRef = doc(classCollectionRef);

      // Adicionando a turma ao batch
      batch.set(turmaDocRef, {
        nomeTurma: className,
        periodoTurma: period,
        educationLevel,
        school,
        userRef,
      });

      // Criando as sondagens relacionadas à turma
      const sondagens = [
        { label: "1° série Ensino Fundamental", value: "1° série Ensino Fundamental" },
        { label: "2° série Ensino Fundamental", value: "2° série Ensino Fundamental" },
        { label: "3° série Ensino Fundamental", value: "3° série Ensino Fundamental" },
        { label: "4° série Ensino Fundamental", value: "4° série Ensino Fundamental" },
        { label: "5° série Ensino Fundamental", value: "5° série Ensino Fundamental" },
      ];

      const sondagemCollectionRef = collection(db, "tblSondagem");
      sondagens.forEach((sondagem) => {
        const sondagemDocRef = doc(sondagemCollectionRef);
        batch.set(sondagemDocRef, {
          ...sondagem,
          turmaRef: turmaDocRef, // Referência da turma
        });
      });

      // Commit das operações em lote
      await batch.commit();

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
      Alert.alert(
        "Erro",
        "Ocorreu um erro ao adicionar a turma. Tente novamente."
      );
    }
  };

  return (
    <Container>
      <StatusBar style="auto" />

      <View style={styles.header}>
        <BackBtn onPress={() => navigation.goBack()} />
      </View>

      <Title>Cadastrar Turma</Title>

      <View style={styles.containerButtons}>
        <View style={styles.containerInput}>
          <Input text="Nome da turma" onChangeText={setClassName} />

          <Input
            onChangeText={setPeriod}
            text={"Escolha um Periodo"}
          />

          <Input
            onChangeText={setEducationLevel}
            text={"Escolha uma Série"}
          />

          <Input text="Escola" onChangeText={setSchool} />
        </View>

        <Btn onPress={handleAddClass} texto="Cadastrar" />
      </View>
    </Container>
  );
}

const styles = StyleSheet.create({
  header: {
    top: "2.7%",
  },
  containerButtons: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 50,
    gap: 40,
  },
  containerInput: {
    display: "flex",
    flexDirection: "column",
    gap: 10,
  },
});