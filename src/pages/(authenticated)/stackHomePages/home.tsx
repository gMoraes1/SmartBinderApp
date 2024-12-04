import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, FlatList } from 'react-native';
import styled from 'styled-components/native'; // Importar styled-components
import { LinearGradient } from 'expo-linear-gradient';
import { collection, onSnapshot, orderBy, query, limit, where, doc } from 'firebase/firestore';
import { db, auth } from '../../../../firebase'; // Importar o auth para filtrar pelos eventos do usuário autenticado

const Container = styled.View`
  background-color: ${props => props.theme.background};
  width: 100%;
  height: 100%;
  text-align:center;
  align-items:center;
`;

const AvisosRecentes = styled.View`
  width: 90%;
  height:52%;
  position:relative;
  top:8%;
  border-radius: 30px;
  overflow: hidden; /* Para garantir que o gradiente respeite o border-radius */
  justify-content: center;
  text-align:center;
  align-itens:center;
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
  const [dadosPerfil, setDadosPerfil] = useState(null); // Initialize with null

  useEffect(() => {
    const unsubscribeAuth = auth.onAuthStateChanged((user) => {
      if (user) {
        // Busca os dados do perfil do Firestore usando o uid do usuário autenticado
        const userRef = doc(db, "tblProfessor", user.uid);
        const unsubscribe = onSnapshot(userRef, (docSnapshot) => {
          if (docSnapshot.exists()) {
            setDadosPerfil(docSnapshot.data()); // Carrega os dados do usuário no estado
          } else {
            setDadosPerfil(null); // Caso o perfil não exista no Firestore
          }
        });

        // Cleanup do listener de perfil
        return () => unsubscribe();
      } else {
        setDadosPerfil(null); // Caso o usuário não esteja logado
      }
    });

    // Cleanup do listener de autenticação
    return () => unsubscribeAuth();
  }, []); // Esse useEffect só executa uma vez após o componente ser montado

  useEffect(() => {
    const eventosRef = collection(db, 'tblCalendario');
    const q = query(
      eventosRef,
      where('userRef', '==', doc(db, 'users', auth.currentUser?.uid)), // Filtra os eventos do usuário autenticado
      orderBy('dataCalendario', 'asc'),
      limit(3)
    );

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const eventosList = [];
      querySnapshot.forEach((doc) => {
        eventosList.push({
          id: doc.id,
          ...doc.data(),
        });
      });
      setEventos(eventosList);
    });

    return () => unsubscribe();
  }, []);

  // Função para pegar apenas o primeiro nome
  const getFirstName = (fullName) => {
    if (!fullName) return ''; // Caso o nome esteja vazio
    return fullName.split(' ')[0]; // Pega a primeira palavra antes do primeiro espaço
  };

  return (
    <Container>
      <StatusBar style="auto" />
      <Title>Home</Title>
      <Title>
        <Text>Olá {dadosPerfil ? getFirstName(dadosPerfil.nomeProfessor) : 'Usuário'}</Text>
      </Title>
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
                <View style={styles.itemContainer}>
                  <View style={styles.eventDetails}>
                    <Text style={styles.eventDate}>{item.dataCalendario}</Text>
                    <Text style={styles.eventDescription}>{item.descricaoCalendario}</Text>
                  </View>
                </View>
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
    margin: 12,
    marginHorizontal: 13,
    padding: 10,
    shadowColor: 'gray',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 10,
  },

  avisosrecentesText: {
    fontSize: 22,
    fontWeight: '700',
    margin: 1,
    padding: 10,
    textAlign: 'center',
  },

  eventDetails: {
    marginRight: 10,
  },

  eventDate: {
    fontSize: 16,
    fontWeight: '700',
    margin: -2,
  },

  eventDescription: {
    fontSize: 16,
    margin: 8,
    fontWeight: '400',
  },

  noEventsText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: '#111',
  },
});
