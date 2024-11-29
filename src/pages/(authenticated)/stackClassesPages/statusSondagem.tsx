import styled from "styled-components/native";

const Container = styled.View`
  background-color: ${(props) => props.theme.background};
  width: 100%;
  padding: 16px;
  height: 100%;
`;

const Title = styled.Text`
  font-size: 32px;
  font-weight: 600;
  text-align: center;
  padding-top: 12%;
  color: ${(props) => props.theme.color};
`;
export default function StatusSondagem() {
    return (
        <Container>
            <Title>Status da Sondagem</Title>
        </Container>
    )
};