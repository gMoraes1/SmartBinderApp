import { StatusBar } from 'expo-status-bar';
import { useNavigation } from '@react-navigation/native';
import { StyleSheet, Text, View, ScrollView, Image, TouchableOpacity } from 'react-native';

export default function Register({navigation}) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Turmas</Text>

      <View style={styles.ViewBtnAdd}>
        <TouchableOpacity  onPress={() => navigation.navigate('NovaTurma')} style={styles.BtnAdd}>
            <Text style={styles.TxtBtn1}>+</Text>

            <Text style={styles.TxtBtn2}>Nova Turma</Text>
        </TouchableOpacity>
      </View>


    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: "100%"
  },

  BtnAdd: {
    width: 150,
    height: 130,
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
    fontSize: 18,
    fontWeight: '900',
    backgroundColor: '#6939E9',
    verticalAlign: 'bottom',
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  ViewBtnAdd: {
    borderRadius:70,
    position:'relative',
    top:20,
    left:40,
  },

  title: {
    fontSize: 32,
    fontWeight: "600",
    justifyContent: "center",
    textAlign: "center",
    paddingTop: 18,
  },
});
