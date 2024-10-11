import { StyleSheet, Text, View } from "react-native";
import Cadastrar from "../components/Buttons/Cadastrar";
import Input from "../components/Input/Input";
import Voltar from "../components/Buttons/Voltar";

export default function RegisterClass() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Voltar />
        <Text style={styles.title}>Cadastrar Turma</Text>
      </View>

      <View style={styles.inputContainer}>
        <Input text="Nome da turma" />
        <Input text="Período" />
        <Input text="Nível de escolaridade" />
        <Input text="Escola" />
      </View>

      <Cadastrar />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: 70,
  },
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
  title: {
    flex: 1, 
    fontSize: 32,
    fontWeight: "600",
    textAlign: "center",
    paddingTop: 18,
  },
});
