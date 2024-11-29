import React from "react";
import { TouchableOpacity, StyleSheet, Text } from "react-native";

export default function Btnm({ onPress, texto = "Cadastrar", ...props }) {
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
    width: 100,
    position:'absolute',
    bottom: '60%',             // Move o botão um pouco para cima
    left: '70%',             // Posiciona no canto direito
    zIndex: 10,           // Garante que o botão fique sobre outros elementos
  },
  textButton: {
    color: "white",
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 16,
    
  },
});