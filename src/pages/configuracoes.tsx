import { useNavigation } from '@react-navigation/native';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native';
import styled from 'styled-components/native';

const Container = styled.View`
  background-color: ${(props) => props.theme.background};
  width: 100%;
  height: 100%;
`;

const Title = styled.Text`
  font-size: 32px;
  width:100%;
  font-weight: 600;
  text-align: center;
  padding: 12%;
  color: ${(props) => props.theme.color};
`;

const Button = styled.TouchableOpacity`
elevation: 2;
background-color: ${(props) => props.theme.inputBackground};
color: ${(props) => props.theme.color};
border-radius: 5px;
padding: 15px;
margin-vertical: 10px; 
width: 88%; 
align-items: center;
`;

export default function Configurations({navigation}) {
  return (
    <Container>
      <ScrollView contentContainerStyle={styles.scrollContainer}>

        <Title style={styles.title}>Configurações</Title>

        <View style={styles.topButtonsContainer}>
          <Button
            onPress={() => navigation.navigate('Privacidade')}
          >
            <Text style={styles.topButtonText}>Configurações de privacidade</Text>
          </Button>

          <Button
            onPress={() => navigation.navigate('Tema')} // Agora está correto
          >
            <Text style={styles.topButtonText}>Tema</Text>
          </Button>

        </View>

        <View style={styles.bottomButtonContainer}>
          <TouchableOpacity style={styles.bottomButton}>
            <Text style={styles.bottomButtonText}>Sair</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </Container>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },
  scrollContainer: {
    flexGrow: 1,
  },
  title: {
    fontSize: 32,
    fontWeight: '600',
    textAlign: 'center',
    top:'8 %',
  },
  topButtonsContainer: {
    flex: 1, // Faz com que o container ocupe o espaço restante acima do botão "Sair"
    justifyContent: 'flex-start', // Alinha os botões no topo da área restante
    alignItems: 'center', // Centraliza os botões horizontalmente
    top:'26%'
  },
  topButton: {
    borderBottomColor: 'gray',
    borderBottomWidth: 3,
    borderColor: 'gray',
    borderWidth: 0.8,
    backgroundColor: '#FFFFFF', // Cor de fundo dos botões
    borderRadius: 5,
    paddingVertical: 15, // Aumenta o padding vertical
    paddingHorizontal: 25, // Aumenta o padding horizontal
    marginVertical: 10, // Espaço vertical entre os botões
    width: '88%', // Largura dos botões
    alignItems: 'center',
  },
  topButtonText: {
    color: '#000000', // Cor do texto dos botões
    fontSize: 18, // Tamanho da fonte dos botões
    fontWeight: '500',
  },
  bottomButtonContainer: {
    justifyContent: 'flex-end', // Faz o botão ficar na parte inferior do container
    alignItems: 'center', // Centraliza o botão horizontalmente
    display: 'flex',
    bottom: 90,
    alignContent: 'center',
    paddingTop: 100, // Ajusta a posição vertical do botão "Sair" (ajuste conforme necessário)
  },
  bottomButton: {
    backgroundColor: '#8A2BE2', // Cor de fundo do botão (roxo)
    borderRadius: 5,
    paddingHorizontal: 20, // Reduz o padding horizontal
    alignItems: 'center',
    width: 90, // Largura menor do botão
    verticalAlign: 'middle',
    height: 40, // Altura do botão
  },
  bottomButtonText: {
    color: '#FFFFFF', // Cor do texto do botão
    fontSize: 16, // Tamanho da fonte do botão
    padding: 6,
    fontWeight: '500',
  },
});
