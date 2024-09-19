import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, ScrollView, Image } from 'react-native';

const ThemeSettings = () => {
  return (
    <View>
       <Text style={styles.title}>Configurações de Privacidade</Text>
    </View>
  );
};

export default ThemeSettings;

const styles = StyleSheet.create({
  container: {

  },

  title:{
    fontSize:32,
    fontWeight:"600",
    justifyContent:"center",
    textAlign:"center",
    paddingTop:18,
  },
});
