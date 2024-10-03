import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, ScrollView, Image, TouchableOpacity } from 'react-native';

export default function RegisterClass(navigation) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Cadastrar Turma</Text>


    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: "100%"
  },

  BtnAdd: {
    width: 180,
    height: 150,
  },

  TxtBtn1: {
    borderBottomColor: 'gray',
    borderColor: 'gray',
    borderWidth: 0.8,
    fontSize: 60,
    fontWeight: '900',
    position: 'relative',
    textAlign:'center',
    textAlignVertical:'center',
    verticalAlign: 'bottom',
    justifyContent: 'center',
    alignItems: 'center',
    borderTopLeftRadius:45,
    borderTopRightRadius:45,
    height:'75%',
    width: '100%',
    backgroundColor: 'white',
  },

  TxtBtn2: {
    borderBottomColor: 'gray',
    borderBottomWidth: 3,
    borderColor: '#999999',
    borderWidth: 0.8,
    borderBottomRightRadius:70,
    borderBottomLeftRadius:70,
    height:'25%',
    textAlign:'center',
    width: '100%',
    fontSize: 22,
    fontWeight: '900',
    backgroundColor: '#6939E9',
    verticalAlign: 'bottom',
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  ViewBtnAdd: {
    borderRadius:70,
    position:'relative',
    top:10,
    left:50,
  },

  title: {
    fontSize: 32,
    fontWeight: "600",
    justifyContent: "center",
    textAlign: "center",
    paddingTop: 18,
  },
});
