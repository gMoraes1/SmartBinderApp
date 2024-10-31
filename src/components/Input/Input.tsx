import React from "react";
import { TextInput, StyleSheet } from "react-native";
import styled from "styled-components/native";

const StyleInput = styled.TextInput`
  background-color: ${(props) => props.theme.inputBackground}; 
  color: ${(props) => props.theme.color};
  width: 200px;
  height: 55px;
  margin: 6px;
  font-size: 18px;
  padding-left: 20px;
  border-radius: 10px;
  elevation: 5;
  `;

const Input = ({ text, onChangeText }) => {
  return (
    <StyleInput
      placeholder={text}
      onChangeText={onChangeText}
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
    margin: 6,
  },
});
