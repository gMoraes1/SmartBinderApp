import { TouchableOpacity } from "react-native-gesture-handler"
import { StyleSheet, Text } from 'react-native';

const Cadastrar = () => {
  return (
    <TouchableOpacity style={styles.button}>
      <Text style={styles.textButton}>Cadastrar</Text>
    </TouchableOpacity>
  )
}

export default Cadastrar

const styles = StyleSheet.create({
  button: {
    backgroundColor: "#6939E9",
    width: 200,
    height: 38,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 30,
  },
  textButton: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});