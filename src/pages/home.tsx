import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, TouchableOpacity, View, FlatList, ScrollView } from 'react-native';
import styled from 'styled-components/native'; // Importar styled-components
import { LinearGradient } from 'expo-linear-gradient'
import { useEffect, useState } from 'react';
import { collection, onSnapshot, orderBy, query, limit } from 'firebase/firestore';
import { firestore } from '../../firebase';

const Container = styled.View`
  background-color: ${props => props.theme.background};
  width: 100%;
  height: 100%;
  text-align:center;
  align-items:center;
`;

const AvisosRecentes = styled.View`
  position: absolute;
  width: 88%;
  border-radius: 30px;
  height: 19%;
  bottom: 30px;
  overflow: hidden; /* Para garantir que o gradiente respeite o border-radius */
`;

const Title = styled.Text`
font-size: 32px;
font-weight: 600;
text-align: center;
padding-top: 12%;
color: ${props => props.theme.color};
`;

export default function Home() {

  const [eventos, setEventos] = useState([]);

  useEffect(() => {
    const eventosRef = collection(firestore, 'tblCalendario');
    const q = query(eventosRef, orderBy('dataCalendario', 'asc'), limit(3));

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

  return (
    <Container>
      <Title>Home</Title>
      <StatusBar style="auto" />
      <AvisosRecentes>
        <LinearGradient
          colors={['#946CFF', '#2E1966']}
          style={{
            flex: 1,
            borderRadius: 30,
          }}
        >
          <Text style={styles.avisosrecentesText}>Avisos Recentes</Text>
          {eventos.length > 0 ? (
            <FlatList
              data={eventos}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <>
                  <View style={styles.itemContainer}>
                    <View style={styles.eventDetails}>
                      <Text style={styles.eventDate}>{item.dataCalendario}</Text>
                      <Text style={styles.eventDescription}>{item.descricaoCalendario}</Text>
                    </View>
                  </View>
                </>
              )}
            />
          ) : (
            <Text style={styles.noEventsText}>Nenhum evento encontrado.</Text>
          )}
        </LinearGradient>
      </AvisosRecentes>
    </Container>
  );
}

const styles = StyleSheet.create({
  itemContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 8,
    margin: 9,
    marginHorizontal:'5%',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: "gray",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 10,
  },

  avisosrecentesText:{
    fontSize: 22,
    fontWeight: '700',
    color: "black",
    margin:3,
    textAlign:'center'
  },
  eventDetails: {
    marginRight: 10,
  },
  eventDate: {
    fontSize: 16,
    fontWeight: '700',
    color: "black",
    margin: -2,
  },
  eventDescription: {
    fontSize: 16,
    margin: 8,
    fontWeight: '400',
    color: "black",
  },

  noEventsText: {
    textAlign: 'center',
    color: 'white',
    marginTop: 20,
    fontSize: 16,
    color: '#666',
  },
});
