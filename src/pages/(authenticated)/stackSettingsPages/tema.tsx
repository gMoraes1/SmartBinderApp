import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { StyleSheet, Text, View, useColorScheme } from 'react-native';
import styled from 'styled-components/native';
import { Checkbox } from 'react-native-paper';
import Globais from '../../../components/GlobalConsts/global'; // Importa o arquivo de variáveis globais
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

const Theme = styled.View`
  flex-direction: column;
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;
  width: 100%;
  background-color: ${(props) => props.theme.inputBackground};
  border-radius: 10px;
  padding: 10px;
  elevation: 2;
`;

const ThemeText = styled.Text`
  font-size: 18px;
  font-weight: 500;
  color: ${(props) => props.theme.color};
`;

export default function ThemeSettings({navigation}) {
  const [isCheck1, setIsCheck1] = useState(true); // Padrão
  const [isCheck2, setIsCheck2] = useState(false); // Claro
  const [isCheck3, setIsCheck3] = useState(false); // Escuro

  // Lógica para garantir que apenas um checkbox esteja selecionado por vez
  const handleCheck1 = () => {
    setIsCheck1(true);
    setIsCheck2(false);
    setIsCheck3(false);
    Globais.setCurrentTheme('device'); // Seleciona o tema baseado no dispositivo
  };

  const handleCheck2 = () => {
    setIsCheck1(false);
    setIsCheck2(true);
    setIsCheck3(false);
    Globais.setCurrentTheme('light'); // Seleciona o tema Claro
  };

  const handleCheck3 = () => {
    setIsCheck1(false);
    setIsCheck2(false);
    setIsCheck3(true);
    Globais.setCurrentTheme('dark'); // Seleciona o tema Escuro
  };

  return (
    <Container>
      <StatusBar style="auto" />
      <View style={styles.header}>
        <BackBtn onPress={() => navigation.goBack()} />
      </View>
      <Title>Configurações de Tema</Title>
      <Theme>
        <View style={styles.AlignView}>
          <Text style={styles.themeText}>Padrão:</Text>
          <Checkbox
            status={isCheck1 ? 'checked' : 'unchecked'}
            onPress={handleCheck1} // Chama a função que define qual checkbox selecionar
          />
        </View>

        <View style={styles.AlignView}>
          <Text style={styles.themeText}>Claro:</Text>
          <Checkbox
            status={isCheck2 ? 'checked' : 'unchecked'}
            onPress={handleCheck2} // Chama a função que define qual checkbox selecionar
          />
        </View>

        <View style={styles.AlignView}>
          <Text style={styles.themeText}>Escuro:</Text>
          <Checkbox
            status={isCheck3 ? 'checked' : 'unchecked'}
            onPress={handleCheck3} // Chama a função que define qual checkbox selecionar
          />
        </View>
      </Theme>
    </Container>
  );
}

const styles = StyleSheet.create({
  themeText: {
    fontSize: 22,
    fontWeight: '500',
    marginRight: 10,
    display: 'flex',
    flexDirection: 'column',
    alignSelf: 'center',
  },

  AlignView: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10, // Espaçamento entre os itens
    width: '100%', // Certificando-se de que o container ocupe 100% da largura
    justifyContent: 'space-between', // Para alinhar texto e checkbox de maneira mais eficiente
  },
  header: {
    top: "5.2%",
    left:'4.3%',
    position:'absolute',
  },
});
