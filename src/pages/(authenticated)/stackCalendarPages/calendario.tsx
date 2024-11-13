import { useEffect, useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, FlatList } from 'react-native';
import { db, auth } from '../../../../firebase';
import { deleteDoc, doc, collection, onSnapshot, query, where, orderBy } from 'firebase/firestore';
import styled from 'styled-components/native';

// Defina o tipo correto para os eventos
type Event = {
  id: string;
  descricaoCalendario: string;
  dataCalendario: string;
};

const Container = styled.View`
  background-color: ${(props) => props.theme.background};
  width: 100%;
  height: 100%;
`;

export default function Calendars({ navigation }) {
  const [eventos, setEventos] = useState<Event[]>([]);

  async function deleteEvento(id: string) {
    try {
      await deleteDoc(doc(db, 'tblCalendario', id));
    } catch (error) {
      console.error("Erro ao deletar:", error);
    }
  }

  useEffect(() => {
    const unsubscribe = onSnapshot(
      query(
        collection(db, 'tblCalendario'),
        where('userRef', '==', doc(db, 'users', auth.currentUser?.uid)), // Filtra pelos eventos do usuário autenticado
        orderBy('dataCalendario', 'desc') // Ordena os eventos pelas datas de forma decrescente (mais recentes primeiro)
      ),
      (querySnapshot) => {
        const lista: Event[] = [];
        querySnapshot.forEach((docSnap) => {
          const data = docSnap.data();
          lista.push({
            id: docSnap.id,
            descricaoCalendario: data.descricaoCalendario,
            dataCalendario: data.dataCalendario,
          });
        });
        setEventos(lista); // Atualiza os eventos no estado
      },
      (error) => {
        console.error("Erro ao buscar dados:", error);
      }
    );

    return () => unsubscribe(); // Limpa a inscrição quando o componente for desmontado
  }, []); // O useEffect só é executado uma vez quando o componente é montado

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
