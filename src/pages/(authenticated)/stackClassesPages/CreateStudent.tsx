import styled from "styled-components/native";
import BackBtn from "../../../components/Buttons/BackBtn";
import { StyleSheet, View } from "react-native";

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



export default function CreateStudent({ navigation }) {
  return (
    <Container>
      <View style={styles.header}>
        <BackBtn onPress={() => navigation.navigate("ClassDetails")} />
      </View>
      <Title>Cadastrar Aluno</Title>
    </Container>
  )
};

const styles = StyleSheet.create({

  header: {
    right: '41%',
    top: '5%',
  },

});
