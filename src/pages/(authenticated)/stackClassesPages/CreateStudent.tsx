import React, { useState } from "react";
import { View, TextInput, TouchableOpacity, Text, StyleSheet } from "react-native";
import { db } from "../../../../firebase";
import { addDoc, collection, doc } from "firebase/firestore";

export default function CreateStudent({ navigation, route }) {
  const { turmaId } = route.params; // Obtendo a turmaId passada da tela anterior

  // Definir os estados para os campos de entrada
  const [nomeAluno, setNomeAluno] = useState("");
  const [nascimentoAluno, setNascimentoAluno] = useState("");
  const [rmAluno, setRmAluno] = useState("");

  // Função para registrar o aluno no Firestore
  const handleRegister = async () => {
    try {
      if (nomeAluno && nascimentoAluno && rmAluno) {
        // Adicionar aluno na coleção 'tblAlunos'
        await addDoc(collection(db, "tblAluno"), {
          nomeAluno,
          nascimentoAluno,
          rmAluno,
          turmaRef: doc(db, "tblTurma", turmaId), // Referência da turma
        });

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
    <View style={styles.container}>
      <Text style={styles.title}>Cadastrar Aluno</Text>

      <TextInput
        style={styles.input}
        placeholder="Nome do Aluno"
        value={nomeAluno}
        onChangeText={setNomeAluno}
      />
      <TextInput
        style={styles.input}
        placeholder="Data de Nascimento (DD/MM/AAAA)"
        value={nascimentoAluno}
        onChangeText={setNascimentoAluno}
      />
      <TextInput
        style={styles.input}
        placeholder="RM do Aluno"
        value={rmAluno}
        onChangeText={setRmAluno}
        keyboardType="numeric"
      />

      <TouchableOpacity style={styles.btnRegister} onPress={handleRegister}>
        <Text style={styles.txtBtnRegister}>Cadastrar</Text>
      </TouchableOpacity>
    </View>
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
  input: {
    width: "100%",
    padding: 10,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 4,
    backgroundColor: "#fff",
  },
  btnRegister: {
    marginTop: 20,
    backgroundColor: "#6939E9",
    padding: 12,
    borderRadius: 4,
    width: "100%",
    alignItems: "center",
  },
  txtBtnRegister: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});
