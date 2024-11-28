import React, { useState } from "react";
import { StyleSheet, View, Alert } from "react-native";


import { db, auth } from "../../../../firebase"; // Importando a instância do Firestore e auth
import { collection, addDoc, doc, writeBatch } from "firebase/firestore"; // Funções do Firestore
import BackBtn from "../../../components/Buttons/BackBtn";
import Input from "../../../components/Input/Input";

import Btn from "../../../components/Buttons/Btn";

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
        { nomeSondagem: "3° Bimestre", periodoInicial: "", periodoFinal: "" },
        { nomeSondagem: "4° Bimestre", periodoInicial: "", periodoFinal: "" },
        { nomeSondagem: "2° Bimestre", periodoInicial: "", periodoFinal: "" },
        { nomeSondagem: "1° Bimestre", periodoInicial: "", periodoFinal: "" },
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

        <RNPickerSelect
          onValueChange={(value) => console.log(value)}
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
              width: 255,
              margin: 8,
              fontSize: 18,
              paddingLeft: 20,
              borderRadius: 10,
              elevation: 5,
            },
            inputAndroid: {
              backgroundColor: theme.inputBackground || "#D2DFDA",
              color: theme.color || "#000",
              height: 50,
              width: 255,
              margin: 8,
              fontSize: 18,
              paddingLeft: 20,
              borderRadius: 10,
              elevation: 5,
            }
          }}

          placeholder={{
            label: 'Escolha um Periodo',
            value: null,
            color: theme.placeholderColor,
          }}
        />

        <RNPickerSelect
          onValueChange={(value) => console.log(value)}
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
              width: 255,
              margin: 8,
              fontSize: 18,
              paddingLeft: 20,
              borderRadius: 10,
              elevation: 5,
            },
            inputAndroid: {
              backgroundColor: theme.inputBackground || "#D2DFDA",
              color: theme.color || "#000",
              height: 50,
              width: 255,
              margin: 8,
              fontSize: 18,
              paddingLeft: 20,
              borderRadius: 10,
              elevation: 5,
            }
          }}

          placeholder={{
            label: 'Escolha uma Série',
            value: null,
            color: theme.placeholderColor,
          }}
        />

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
