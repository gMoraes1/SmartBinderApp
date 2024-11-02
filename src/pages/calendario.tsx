import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Alert } from 'react-native';
import { Calendar, DateData, LocaleConfig } from 'react-native-calendars';
import { Feather } from "@expo/vector-icons";
import { ptBR } from '../utils/localecalendarConfig';
import styled from 'styled-components/native';
import { FlatList, ScrollView } from 'react-native-gesture-handler';
import { firestore } from '../../firebase';
import { deleteDoc, doc } from 'firebase/firestore';

// Configuração do calendário para Português do Brasil
LocaleConfig.locales["pt-br"] = ptBR;
LocaleConfig.defaultLocale = "pt-br";

const Container = styled.View`
  background-color: ${(props) => props.theme.background};
  width: 100%;
  height: 100%;
`;

export default function Calendars({ navigation }) {
  const [day, setDay] = useState<DateData>();
  const [evento, setEvento] = useState();

  // Formatação de dia e mês
  const diaTratado = day?.day < 10 ? `0${day.day}` : day?.day;
  const mesTratado = day?.month < 10 ? `0${day.month}` : day?.month;
  const ano = day?.year;
  const dataCompleta = day ? `${diaTratado}/${mesTratado}/${ano}` : null;

  async function deleteEvento(id) {
    try {
      await deleteDoc(doc(firestore, 'tblCalendario', id));
      Alert.alert("Evento deletado.")
    } catch (error) {
      console.error("Erro ao deletar.", error)
    }
  }

  return (
    <Container>
      <Calendar
        style={styles.calendar}
        headerStyle={{
          borderBottomWidth: 2,
          paddingBottom: 13,
          marginBottom: 13,
        }}
        theme={{
          textMonthFontWeight: '700',
          textMonthFontSize: 22,
          textDayFontSize: 17,
          textDayFontWeight: '800',
          todayTextColor: '#6636E6',
          todayButtonFontSize: 19,
          selectedDayBackgroundColor: '#6939E9',
          selectedDayTextColor: 'white',
          calendarBackground: 'transparent',
          arrowColor: '#6636E6',
          textDisabledColor: 'rgba(105,57,233,0.3)',
          textDayHeaderFontWeight: '900',
          textDayHeaderFontSize: 13,
        }}
        minDate={new Date().toDateString()}
        hideExtraDays={true}
        onDayPress={setDay}
        renderArrow={(direction) => (
          <Feather size={38} name={`chevron-${direction}`} color={"#6939E9"} />
        )}
        markedDates={day && {
          [day.dateString]: { selected: true }
        }}
      />

      <View style={styles.itensView}>
        <FlatList
          data={evento}
          renderItem={({ item }) => {
            return (

              <ScrollView style={styles.refeicoesstyle}>
                <View style={styles.botaodeletar}>
                  <TouchableOpacity onPress={() => { deleteEvento(item.id) }}>

                    <Text style={styles.deletar}> X </Text>

                  </TouchableOpacity>
                </View>
              </ScrollView>
            );
          }}
        />
      </View>

      <TouchableOpacity
        onPress={() => dataCompleta && navigation.navigate("CreateDateNote", { dataCompleta })}
        style={[styles.BtnAdd, !dataCompleta && styles.disabledBtn]}
        disabled={!dataCompleta}
      >
        <Text style={styles.TxtBtn1}>+</Text>
      </TouchableOpacity>
    </Container>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 32,
    fontWeight: "600",
    textAlign: "center",
    top: 40,
  },
  calendar: {
    borderWidth: 0.5,
    borderBottomWidth: 0.8,
    padding: 13,
    margin: 10,
    top: 45,
    backgroundColor: 'transparent',
  },
  dayText: {
    fontWeight: '600',
    fontSize: 18,
  },
  disabledDayText: {
    fontWeight: '600',
    fontSize: 18,
    color: 'rgba(105,57,233,0.3)',
  },
  day: {
    width: 38,
    height: 38,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 13,
  },
  today: {
    fontWeight: '800',
    fontSize: 17,
    color: '#6636E6',
  },
  selected: {
    color: '#fff',
    backgroundColor: '#6939E9',
  },

  BtnAdd: {
    width: 60,
    height: 60,
    backgroundColor: "#6939E9",
    borderRadius: 30,
    position: "absolute",
    bottom: 30,
    right: 30,
    alignItems: "center",
    justifyContent: "center",
    elevation: 5,
  },

  disabledBtn: {
    backgroundColor: "rgba(105,57,233,0.3)",
  },

  TxtBtn1: {
    fontSize: 40,
    fontWeight: "900",
    color: "white",
    textAlign: "center",
    lineHeight: 60,
  },

  itens: {
    borderRadius: 60,
    zIndex: 1,
    color: 'black',
    marginHorizontal: 10,
    marginVertical: 10,
    padding: 10,
    width: 200,
    height: 100,
    justifyContent: 'center',
    textAlign: 'center',
  },


  titulo2: {
    fontSize: 25,
    justifyContent: 'center',
    textAlign: 'center',
    color: "white",
    fontWeight: '900',
    margin: 18,
    textDecorationStyle: 'double',
    textDecorationLine: 'underline'
  },

  titulo1: {
    justifyContent: 'center',
    textAlign: 'center',
    fontSize: 25,
    color: "white",
    fontWeight: '900',
    margin: 8,

  },

  titulo3: {
    position: 'relative',
    left: 12,
    justifyContent: 'center',
    textAlign: 'left',
    fontSize: 18,
    fontWeight: '400',
  },

  titulo4: {
    position: 'relative',
    left: 3,
    top: -10,
    justifyContent: 'center',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '700',
  },


  refeicoesstyle: {
    backgroundColor: '#fff',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 10,
    marginVertical: 10,
    padding: 10,
  },
  botaodeletar: {
    fontSize: 30,
    zIndex: 1,
    color: 'black',
    textAlignVertical: 'center',
    marginVertical: 20,
    left: 180,
    borderRadius: 30,
  },
  deletar: {
    backgroundColor: '#FF5050',
    fontSize: 18,
    color: "white",
    borderRadius: 3,
    fontWeight: '800',
  },
  cadastrar: {
    fontSize: 32,
    color: "white",
    fontWeight: '600',
  },

  BtnCadastrar: {
    fontSize: 80,
    left: '42%',
    bottom: '25%',
    width: 50,
    height: 50,
    justifyContent: 'center',
    textAlign: 'center',
    alignItems: 'center',
    borderRadius: 16,
    borderColor: 'white',
    borderWidth: 2,
    marginBottom: 10,
    backgroundColor: '#787878',
  },

  itensView: {
    height: '110%',
  },


});
