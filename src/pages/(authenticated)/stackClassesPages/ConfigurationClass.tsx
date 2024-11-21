import styled from "styled-components/native";

const Container = styled.View`
  background-color: ${(props) => props.theme.background};
  width: 100%;
  height: 100%;
  align-items: center;
  justify-content:center;
`;

const Title = styled.Text`
  font-size: 32px;
  font-weight: 600;
  text-align: center;
  flex: 1;
  padding-top: 12%;
  color: ${(props) => props.theme.color};
`;

export default function ConfigurationClass() {
    return(
        <Container>
         <Title>Alterar Dados</Title>
        </Container> 
     )
};