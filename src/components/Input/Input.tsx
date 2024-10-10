import React from "react";
import { TextInput, StyleSheet } from "react-native";

const Input = ({ text }) => {
  return (
    <TextInput
      placeholder={text}
      style={styles.input}
    />
  );
};

export default Input;

const styles = StyleSheet.create({
  input: {
    backgroundColor: "#D2DFDA",
    width: 300,
    height: 55,
    fontSize: 18,
    paddingLeft: 20,
    borderRadius: 10,
  },
});
