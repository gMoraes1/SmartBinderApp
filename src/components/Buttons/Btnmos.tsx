import React from "react"; 
import { TouchableOpacity, StyleSheet, Text } from "react-native";

export default function Btnmos({ onPress, texto = "Cadastrar", ...props }) {
  return (
    <TouchableOpacity onPress={onPress} {...props} style={styles.button}>
      <Text style={styles.textButton}>{texto}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    marginTop: 10,
    backgroundColor: "#6939E9",
    padding: 10,
    borderRadius: 10,
    width: 150,   // Tamanho do botão ajustado
    alignSelf: 'center', // Centraliza o botão na tela
    zIndex: 10,     // Garantir que fique sobre outros elementos
  },
  textButton: {
    color: "white",
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 16,
  },
});
