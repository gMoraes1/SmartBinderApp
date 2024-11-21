import React from "react";
import { StyleSheet, View } from "react-native";
import styled from 'styled-components/native';
import BackBtn from "../../../components/Buttons/BackBtn";
import Btn from "../../../components/Buttons/Btn";

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

export default function ClassDetails({navigation}) {
  return (
    <Container>
      <View style={styles.header}>
        <BackBtn onPress={() => navigation.navigate("Classes")} />
        <Title>Detalhes da Turma</Title>
      </View>

      <View style={styles.btnView}>
        <Btn onPress={() => navigation.navigate("CreateStudent")} texto="Cadastrar aluno" />
        <Btn onPress={() => navigation.navigate("ListStudents")} texto="Listar alunos" />
        <Btn onPress={() => navigation.navigate("ConfigurationClass")} texto="Configurações da turma" />
        <Btn onPress={() => navigation.navigate("ExportDoc")} texto="Exportar" />
      </View>
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
  btnView: {
    marginTop: 90,
    display: "flex",
    flexDirection: "column",
    gap: 20,
  },
});
