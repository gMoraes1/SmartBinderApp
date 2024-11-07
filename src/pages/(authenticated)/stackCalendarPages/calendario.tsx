import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Alert, FlatList } from 'react-native';
import { Calendar, DateData, LocaleConfig } from 'react-native-calendars';
import { Feather } from "@expo/vector-icons";
import { ptBR } from '../../../utils/localecalendarConfig';
import styled from 'styled-components/native';
import { firestore } from '../../../../firebase';
import { deleteDoc, doc, collection, onSnapshot, query, orderBy } from 'firebase/firestore';


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
  const [eventos, setEventos] = useState([]);

  const diaTratado = day?.day < 10 ? `0${day.day}` : day?.day;
  const mesTratado = day?.month < 10 ? `0${day.month}` : day?.month;
  const ano = day?.year;
  const dataCompleta = day ? `${diaTratado}/${mesTratado}/${ano}` : null;

  useEffect(() => {
    // Adiciona o `orderBy` na consulta para ordenar por `dataCalendario` 
    // em ordem ascendente(datas mais recentes primeiro e a mais distantes embaixo)
    const eventosRef = collection(firestore, 'tblCalendario');
    const q = query(eventosRef, orderBy('dataCalendario', 'asc'));

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const eventosList = [];
      querySnapshot.forEach(doc => {
        eventosList.push({
          id: doc.id,
          ...doc.data(),
        });
      });
      setEventos(eventosList);
    });

    return () => unsubscribe();
  }, []);

  async function deleteEvento(id) {
    try {
      await deleteDoc(doc(firestore, 'tblCalendario', id));
    } catch (error) {
      console.error("Erro ao deletar:", error);
    }
  }

  return (
    <Container>
      <View style={styles.itensView}>
        {eventos.length > 0 ? (
          <FlatList
            data={eventos}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View style={styles.itemContainer}>
                <View style={styles.eventDetails}>
                  <Text style={styles.eventDate}>{item.dataCalendario}</Text>
                  <Text style={styles.eventDescription}>{item.descricaoCalendario}</Text>
                </View>
                <TouchableOpacity onPress={() => deleteEvento(item.id)} style={styles.deleteButton}>
                  <Text style={styles.deleteText}>X</Text>
                </TouchableOpacity>
              </View>
            )}
          />
        ) : (
          <Text style={styles.noEventsText}>Nenhum evento encontrado.</Text>
        )}
      </View>

      <TouchableOpacity
        onPress={() => navigation.navigate("CreateDateNote")}
        style={[styles.BtnAdd]}
      >
        <Text style={styles.TxtBtn1}>+</Text>
      </TouchableOpacity>
    </Container>
  );
}

const styles = StyleSheet.create({
  calendar: {
    borderWidth: 0.5,
    borderBottomWidth: 0.8,
    padding: 13,
    margin: 10,
    top: 45,
    backgroundColor: 'transparent',
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
  TxtBtn1: {
    fontSize: 40,
    fontWeight: "900",
    color: "white",
    textAlign: "center",
    lineHeight: 60,
  },
  itensView: {
    flex: 1,
    margin: '3%',
    top: '6%',
    paddingHorizontal: 10,
  },
  itemContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginVertical: 8,
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  eventDetails: {
    marginRight: 10,
  },
  eventDate: {
    fontSize: 16,
    fontWeight: '700',
    color: "black",
    margin: -8,
  },
  eventDescription: {
    fontSize: 16,
    margin: 16,
    fontWeight: '400',
    color: "black",
  },
  deleteButton: {
    backgroundColor: '#FF5050',
    borderRadius: 5,
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
  deleteText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '800',
  },
  noEventsText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: '#666',
  },
});
