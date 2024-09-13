import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, ScrollView, Image, TouchableOpacity } from 'react-native';

export default function Profile() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Perfil</Text>
      <View style={styles.imageBlock}>
        <Image
          style={styles.image}
          source={require("../../assets/Perfil.jpg")}
        />
      </View>

      <View style={styles.textBlock}>
        <Text style={styles.text}>Nome</Text>
        <Text style={styles.text}>Email</Text>
        <Text style={styles.text}>Data de Nascimento</Text>
      </View>


    </View>

  );
}

const styles = StyleSheet.create({
  container: {

  },

  title: {
    fontSize: 32,
    fontWeight: "600",
    justifyContent: "center",
    textAlign: "center",
    paddingTop: 18,
  },

  image: {
    width: 230,
    height: 230,
    borderRadius: 100,
    justifyContent: 'center'

  },

  imageBlock: {
    marginTop:18,
    marginBottom:18,
    alignItems: 'center',
    justifyContent: 'center',
  },

  textBlock: {
    justifyContent: 'center',
    alignItems: 'center',
  },

  text: {
    backgroundColor: 'white',
    borderBottomColor:'gray',
    borderBottomWidth:3,
    borderColor:'gray',
    borderWidth:0.8,
    padding:10,
    width:280,
    marginTop:18,
  },
});
