import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, ScrollView, Image } from 'react-native';
import styled from 'styled-components/native';
import BackBtn from '../../../components/Buttons/BackBtn';


const Container = styled.View`
  background-color: ${(props) => props.theme.background};
  width: 100%;
  padding: 16px;
  height: 100%;
  align-items: center;
`;

const Title = styled.Text`
  font-size: 32px;
  font-weight: 600;
  text-align: center;
  padding: 12%;
  color: ${(props) => props.theme.color};
`;

const PrivacySettings = ({navigation}) => {
  return (
    <Container>
      <View style={styles.header}>
        <BackBtn onPress={() => navigation.goBack()} />
      </View>
      <StatusBar style="auto" />
      <Title>Configurações de Privacidade</Title>
    </Container>
  );
};

export default PrivacySettings;

const styles = StyleSheet.create({

  header: {
    top: "5.2%",
    left:'4.3%',
    position:'absolute',
  },

  title: {
    fontSize: 32,
    fontWeight: "600",
    justifyContent: "center",
    textAlign: "center",
    paddingTop: "12%",
  },
});
