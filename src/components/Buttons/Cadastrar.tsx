import { TouchableOpacity } from "react-native-gesture-handler";
import { StyleSheet, Text } from "react-native";

const Cadastrar = ({ onPress }) => {
  return (
    <TouchableOpacity onPress={onPress} style={styles.button}>
      <Text style={styles.textButton}>Cadastrar</Text>
    </TouchableOpacity>
  );
};

export default Cadastrar;

const styles = StyleSheet.create({
  button: {
    backgroundColor: "#6939E9",
    width: 200,
    height: 38,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 30,
    elevation: 10,
    margin:'10%',
  },
  textButton: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});
