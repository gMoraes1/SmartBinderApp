import React from "react";
import styled, { useTheme } from "styled-components/native";

const StyleInput = styled.TextInput`
  background-color: ${(props) => props.theme.inputBackground || "#D2DFDA"};
  color: ${(props) => props.theme.color || "#000"};
  width: 255px;
  height: 50px;
  margin: 8px;
  font-size: 18px;
  padding-left: 20px;
  border-radius: 2px;
  elevation: 8;
  z-index:20;
`;

const Input = ({ text, onChangeText, ...props }) => {
  const theme = useTheme()

  return (
    <StyleInput
      placeholder={text}
      onChangeText={onChangeText}
      placeholderTextColor={theme.placeholderColor}
      {...props}
    />
  );
};

export default Input;
