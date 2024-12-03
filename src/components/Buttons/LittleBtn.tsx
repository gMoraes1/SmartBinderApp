import React, { Children } from "react";
import { TouchableOpacity, StyleSheet, Text } from "react-native";

export default function LtBtn({ onPress, children, ...props }) {
  return (
    <TouchableOpacity onPress={onPress} {...props} style={styles.button}>
      <Text style={styles.textButton}>{children}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    marginTop: 10,
    backgroundColor: "#6939E9",
    padding: 10,
    borderRadius: 10,
    width: 110,
    margin:4,
    alignSelf: "center",
  },
  textButton: {
    color: "white",
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 16,
  },
});
