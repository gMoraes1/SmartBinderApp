import { StyleSheet, Text, View } from 'react-native';
import Cadastrar from '../components/Buttons/Cadastrar';

export default function RegisterClass() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Cadastrar Turma</Text>
      <Cadastrar />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: "100%"
  },
  title: {
    fontSize: 32,
    fontWeight: "600",
    justifyContent: "center",
    textAlign: "center",
    paddingTop: 18,
  },
});
