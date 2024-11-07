import React, { useState } from "react";
import { StyleSheet, Text, View } from "react-native";



import styled from 'styled-components/native';

import { db } from "../../../../firebase"; // Importe a instância do Firestore
import { collection, addDoc } from 'firebase/firestore'; // Importe funções do Firestore
import BackBtn from "../../../components/Buttons/BackBtn";
import Input from "../../../components/Input/Input";
import Cadastrar from "../../../components/Buttons/Cadastrar";

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

export default function RegisterClasses({ navigation }) {
  const [className, setClassName] = useState("");
  const [period, setPeriod] = useState("");
  const [educationLevel, setEducationLevel] = useState("");
  const [school, setSchool] = useState("");

  const handleAddClass = async () => {
    try {
      // Adiciona os dados da turma no Firestore
      await addDoc(collection(db, 'tblTurma'), {
        nomeTurma: className,
        periodoTurma: period,
        educationLevel: educationLevel,
        school: school,
      });

      // Navegar de volta e passar os dados da turma
      navigation.navigate("Classes", {
        classData: {
          name: className,
          period,
          educationLevel,
          school,
        },
      });
    } catch (error) {
      console.error("Erro ao adicionar documento: ", error);
    }
  };

  return (
    <Container>
      <View style={styles.header}>
        <BackBtn onPress={() => navigation.navigate("Classes")} />
        <Title>Cadastrar Turma</Title>
      </View>

      <View style={styles.inputContainer}>
        <Input text="Nome da turma" onChangeText={setClassName} />
        <Input text="Período" onChangeText={setPeriod} />
        <Input text="Nível de escolaridade" onChangeText={setEducationLevel} />
        <Input text="Escola" onChangeText={setSchool} />
      </View>

      <Cadastrar onPress={handleAddClass} />
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
