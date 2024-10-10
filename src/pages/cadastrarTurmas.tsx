import { StyleSheet, Text, View } from "react-native";
import Cadastrar from "../components/Buttons/Cadastrar";
import Input from "../components/Input/Input";
import Voltar from "../components/Buttons/Voltar";

export default function RegisterClass() {
  const placeholderText = "Nome da turma";

  return (
    <View style={styles.container}>
      <View>
        <Voltar />
        <Text style={styles.title}>Cadastrar Turma</Text>
      </View>
      <Input text={placeholderText} />
      <Cadastrar />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: "100%",
  },
  title: {
    fontSize: 32,
    fontWeight: "600",
    justifyContent: "center",
    textAlign: "center",
    paddingTop: 18,
  },
});
