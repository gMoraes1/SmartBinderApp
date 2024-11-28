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
    alignSelf: "flex-end",
    bottom:'80%',
    margin:'3%',
    zIndex: 10,           // Garante que o botão fique sobre outros elementos
    elevation:5,
  },
  textButton: {
    color: "white",
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 16,
    
  },
});