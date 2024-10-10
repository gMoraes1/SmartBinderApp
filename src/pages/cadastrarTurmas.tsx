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

      <View>
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
    width: "100%",
    height: "100%",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    height: 120,
    paddingHorizontal: 16, // Espaçamento lateral
  },
  title: {
    flex: 1, // Faz o texto ocupar o espaço restante
    fontSize: 32,
    fontWeight: "600",
    textAlign: "center", // Centraliza o texto
    paddingTop: 18,
  },
});
