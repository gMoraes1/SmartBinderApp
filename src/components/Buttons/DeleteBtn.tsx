import React from "react";
import { TouchableOpacity, StyleSheet, Text } from "react-native";

export default function DeleteBtn({ onPress, children, ...props }) {
  return (
    <TouchableOpacity onPress={onPress} {...props} style={styles.button}>
      <Text style={styles.textButton}>{children}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    marginTop: 10,
    backgroundColor: "#ff4d4d",
    padding: 10,
    borderRadius: 10,
    width: 100,
    margin:4,
    alignSelf: "center",
  },
  textButton: {
    color: "white",
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 16
  },
});
