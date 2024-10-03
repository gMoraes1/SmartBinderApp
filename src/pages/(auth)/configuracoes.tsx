import { useNavigation } from '@react-navigation/native';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native';


export default function Configurations({navigation}) {
  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>

        <Text style={styles.title}>Configurações</Text>

        <View style={styles.topButtonsContainer}>
          <TouchableOpacity style={styles.topButton}
            onPress={() => navigation.navigate('Privacidade')}
          >
            <Text style={styles.topButtonText}>Configurações de privacidade</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.topButton}
            onPress={() => navigation.navigate('Tema')} // Agora está correto
          >
            <Text style={styles.topButtonText}>Tema</Text>
          </TouchableOpacity>

        </View>

        <View style={styles.bottomButtonContainer}>
          <TouchableOpacity style={styles.bottomButton}>
            <Text style={styles.bottomButtonText}>Sair</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
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
    marginTop: 50, // Espaço do topo
    marginBottom: 20, // Espaço abaixo do título
  },
  topButtonsContainer: {
    flex: 1, // Faz com que o container ocupe o espaço restante acima do botão "Sair"
    justifyContent: 'flex-start', // Alinha os botões no topo da área restante
    alignItems: 'center', // Centraliza os botões horizontalmente
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
