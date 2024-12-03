import React, { useState } from "react";
import {
  View,
  StyleSheet,
} from "react-native";
import { db } from "../../../../firebase";
import {
  addDoc,
  collection,
  doc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import BackBtn from "../../../components/Buttons/BackBtn";
import styled from "styled-components/native";
import Btn from "../../../components/Buttons/Btn";
import Input from "../../../components/Input/Input";

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

export default function CreateStudent({ navigation, route }) {
  const { turmaId } = route.params; // Obtendo a turmaId passada da tela anterior

  // Definir os estados para os campos de entrada
  const [nomeAluno, setNomeAluno] = useState("");
  const [nascimentoAluno, setNascimentoAluno] = useState("");
  const [rmAluno, setRmAluno] = useState("");

  // Função para criar observações (tblObsSondagem) automaticamente
  const createObservationsForStudent = async (alunoId) => {
    try {
      // Obtendo as sondagens associadas à turma
      const sondagensRef = collection(db, "tblSondagem");
      const sondagensQuerySnapshot = await getDocs(
        query(
          sondagensRef,
          where("turmaRef", "==", doc(db, "tblTurma", turmaId))
        )
      );

      // Criar uma coleção tblObsSondagem para cada sondagem
      await Promise.all(
        sondagensQuerySnapshot.docs.map((sondagemDoc) =>
          addDoc(collection(db, "tblObsSondagem"), {
            obs: "",
            qntFaltas: "",
            status: "",
            alunoRef: doc(db, "tblAluno", alunoId), // Referência ao aluno
            sondagemRef: doc(db, "tblSondagem", sondagemDoc.id), // Referência à sondagem
          })
        )
      );

      console.log("Observações criadas com sucesso!");
    } catch (error) {
      console.error("Erro ao criar observações:", error);
    }
  };

  // Função para registrar o aluno no Firestore
  const handleRegister = async () => {
    try {
      if (nomeAluno && nascimentoAluno && rmAluno) {
        // Adicionar aluno na coleção 'tblAlunos'
        const alunoRef = await addDoc(collection(db, "tblAluno"), {
          nomeAluno,
          nascimentoAluno,
          rmAluno,
          turmaRef: doc(db, "tblTurma", turmaId), // Referência da turma
        });

        // Chamar a função para criar observações
        await createObservationsForStudent(alunoRef.id);

        // Navegar de volta para a lista de alunos
        navigation.goBack();
      } else {
        alert("Por favor, preencha todos os campos.");
      }
    } catch (error) {
      console.error("Erro ao cadastrar aluno: ", error);
      alert("Erro ao cadastrar aluno, tente novamente.");
    }
  };

  return (
    <Container>
      <View style={styles.header}>
        <BackBtn onPress={() => navigation.goBack()} />
      </View>

      <Title>Cadastrar Aluno</Title>
      
      <View style={styles.containerButtons}>
        <View style={styles.containerInput}>
          <Input
            text="Nome do Aluno"
            value={nomeAluno}
            onChangeText={setNomeAluno}
          />

          <Input
            text="Data de Nascimento"
            value={nascimentoAluno}
            onChangeText={setNascimentoAluno}
            keyboardType="numeric"
          />

          <Input
            text="RM do Aluno"
            value={rmAluno}
            onChangeText={setRmAluno}
            keyboardType="numeric"
          />
        </View>

        <Btn onPress={handleRegister} texto="Cadastrar"></Btn>
      </View>
    </Container>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#f0f0f0",
  },
  title: {
    fontSize: 24,
    fontWeight: "600",
    marginBottom: 20,
  },
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
    gap: 10
  }
});
