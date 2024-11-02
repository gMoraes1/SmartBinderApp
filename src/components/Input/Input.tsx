import React from "react";
import styled from "styled-components/native";

const StyleInput = styled.TextInput`
  background-color: ${(props) => props.theme.inputBackground || "#D2DFDA"};
  color: ${(props) => props.theme.color || "#000"};
  width: 255px;
  height: 50px;
  margin: 6px;
  font-size: 18px;
  padding-left: 20px;
  border-radius: 10px;
  elevation: 5;
`;

const Input = ({ text, onChangeText, ...props }) => {
  return (
    <StyleInput
      placeholder={text}
      onChangeText={onChangeText}
      {...props}
    />
  );
};

export default Input;
