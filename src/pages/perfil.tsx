import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, ScrollView, Image } from 'react-native';

export default function Profile() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Perfil</Text>
    </View>
  );
}

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
