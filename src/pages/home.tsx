import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import styled from 'styled-components/native'; // Importar styled-components

const Container = styled.View`
  background-color: ${props => props.theme.background};
  width: 100%;
  height: 100%;
`;

const Title = styled.Text`
font-size: 32px;
font-weight: 600;
text-align: center;
padding-top: 12%;
color: ${props => props.theme.color};
`;

export default function Home() {
  return (
    <Container>
      <Title>Home</Title>
      <StatusBar style="auto" />
    </Container>
  );
}

const styles = StyleSheet.create({

});
