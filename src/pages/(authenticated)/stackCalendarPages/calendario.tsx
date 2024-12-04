import { useEffect, useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, FlatList } from 'react-native';
import { db, auth } from '../../../../firebase';
import { deleteDoc, doc, collection, query, where, orderBy, onSnapshot, getDocs } from 'firebase/firestore'; // Correção aqui
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

  // Função para excluir um evento
  async function deleteEvento(id: string) {
    try {
      await deleteDoc(doc(db, 'tblCalendario', id));
      // Remove o evento excluído do estado imediatamente para evitar duplicação
      setEventos((prevEventos) => prevEventos.filter((evento) => evento.id !== id));
    } catch (error) {
      console.error("Erro ao deletar:", error);
    }
  }

  // Função para verificar se a data do evento já passou
  function checkEventDate(eventDate: string): boolean {
    const currentDate = new Date();
    const eventDateObj = new Date(eventDate); // Certifique-se de que a data do evento está sendo convertida corretamente
    return eventDateObj < currentDate;
  }

  // Função para buscar e deletar eventos expirados
  async function checkAndDeleteExpiredEvents() {
    try {
      const q = query(
        collection(db, 'tblCalendario'),
        where('userRef', '==', doc(db, 'users', auth.currentUser?.uid)),
        orderBy('dataCalendario', 'desc')
      );
      
      const querySnapshot = await getDocs(q); // Buscar todos os eventos

      querySnapshot.forEach((docSnap) => {
        const data = docSnap.data();
        const eventDate = data.dataCalendario;

        // Verifica se o evento tem uma data anterior à data atual
        if (checkEventDate(eventDate)) {
          // Exclui o evento se a data for anterior
          deleteEvento(docSnap.id);
        }
      });
    } catch (error) {
      console.error("Erro ao buscar ou deletar eventos expirados:", error);
    }
  }

  useEffect(() => {
    // Verifica e deleta eventos expirados ao carregar o componente
    checkAndDeleteExpiredEvents();

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
  }, []); // O useEffect agora verifica a exclusão e a atualização uma vez quando o componente é montado

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
    top:'78.7%',
    right: '6%',
    alignItems: "center",
    justifyContent: "center",
    elevation: 5,
  },

  TxtBtn1: {
    fontSize: 40,
    fontWeight: "900",
    color: "white",
    textAlign: "center",
    top:-2
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
      width: 1,
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
