import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, ScrollView, Image } from 'react-native';

export default function Register() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Cadastro</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width:"100%",
    height: "100%"
  },

  title:{
    fontSize:32,
    fontWeight:"600",
    justifyContent:"center",
    textAlign:"center",
    paddingTop:18,
  },
});
