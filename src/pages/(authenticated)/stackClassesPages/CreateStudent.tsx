import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import { db } from "../../../../firebase";
import { addDoc, collection, doc, getDocs, query, where } from "firebase/firestore";
import BackBtn from "../../../components/Buttons/BackBtn";
import styled, { useTheme } from "styled-components/native";
import Btn from "../../../components/Buttons/Btn";
import Input from "../../../components/Input/Input";
import { StatusBar } from "expo-status-bar";

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
  const theme = useTheme();
  const { turmaId } = route.params; // Obtendo a turmaId passada da tela anterior

  // Definir os estados para os campos de entrada
  const [nomeAluno, setNomeAluno] = useState("");
  const [nascimentoAluno, setNascimentoAluno] = useState("");
  const [rmAluno, setRmAluno] = useState("");

  const formatUsername = (text) => {
    const names = text.split(" ");
    const formattedNames = names.map((name, index) => {
      if (index === 0) {
        return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
      } else {
        return name;
      }
    });

    return formattedNames.join(" ");
  };

  const handleNomeAlunoChange = (text) => {
    const formattedText = formatUsername(text); // Chamando a função formatUsername
    setNomeAluno(formattedText);
  };

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

  const handleDateChange = (text) => {
    let cleaned = text.replace(/\D/g, ""); // Remove tudo que não for número

    // Limita a quantidade de caracteres a 8 (DD/MM/AAAA)
    if (cleaned.length > 8) cleaned = cleaned.slice(0, 8);

    // Formata a data conforme a máscara DD/MM/AAAA
    if (cleaned.length >= 6) {
      cleaned = cleaned.replace(/(\d{2})(\d{2})(\d{4})/, "$1/$2/$3");
    } else if (cleaned.length >= 4) {
      cleaned = cleaned.replace(/(\d{2})(\d{2})/, "$1/$2");
    }

    // Atualiza o estado com a data formatada
    setNascimentoAluno(cleaned);
  };

  return (
    <Container>
      <StatusBar style="auto" />

      <View style={styles.header}>
        <BackBtn onPress={() => navigation.goBack()} />
      </View>

      <Title>Cadastrar Aluno</Title>

      <View style={styles.containerButtons}>
        <View style={styles.containerInput}>
          <Input
            text="Nome do Aluno"
            value={nomeAluno}
            onChangeText={handleNomeAlunoChange}
          />

          <Input
            text={nascimentoAluno}
            onChangeText={handleDateChange}
            placeholder="Data de Nascimento"
            placeholderTextColor={theme.placeholderColor}
            keyboardType="numeric"
            maxLength={10} // Limita o comprimento do campo a 10 caracteres
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
