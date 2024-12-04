import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, FlatList, Alert } from 'react-native';
import styled from 'styled-components/native';
import {
  collection,
  query,
  where,
  onSnapshot,
  updateDoc,
  doc,
} from 'firebase/firestore';
import { db } from '../../../../firebase';
import Input from '../../../components/Input/Input';
import Btnm from '../../../components/Buttons/Btnm';
import Btnms from '../../../components/Buttons/BtnmS';
import BackBtn from "../../../components/Buttons/BackBtn";
import { useNavigation } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';

const Container = styled.View`
  background-color: ${(props) => props.theme.background};
  width: 100%;
  height: 100%;
  padding: 16px;
`;

const Title = styled.Text`
  font-size: 32px;
  font-weight: 600;
  text-align: center;
  padding-top: 12%;
  color: ${(props) => props.theme.color};
  bottom:20%;
`;

interface Sondagem {
  id: string;
  nomeSondagem: string;
  periodoInicial: string;
  periodoFinal: string;
}

export default function EditSondagem({ route }) {
  const navigation = useNavigation();
  const turmaId = route?.params?.turmaId;

  if (!turmaId) {
    console.warn('Parâmetro turmaId não encontrado!');
    return (
      <View>
        <Text>Erro: turmaId não foi fornecido.</Text>
      </View>
    );
  }

  const [sondagens, setSondagens] = useState<Sondagem[]>([]);
  const [editedSondagem, setEditedSondagem] = useState<Sondagem | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchSondagens = () => {
      const q = query(
        collection(db, 'tblSondagem'),
        where('turmaRef', '==', doc(db, 'tblTurma', turmaId))
      );

      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const lista: Sondagem[] = [];
        querySnapshot.forEach((docSnap) => {
          const data = docSnap.data();
          lista.push({
            id: docSnap.id,
            nomeSondagem: data.nomeSondagem,
            periodoInicial: data.periodoInicial,
            periodoFinal: data.periodoFinal,
          });
        });

        // Ordena as sondagens por período inicial (convertido para data)
        lista.sort((a, b) => {
          const dateA = new Date(a.periodoInicial.split('/').reverse().join('-')); // Converte "DD/MM/YYYY" para "YYYY-MM-DD"
          const dateB = new Date(b.periodoInicial.split('/').reverse().join('-'));
          return dateA.getTime() - dateB.getTime(); // Ordena de forma crescente
        });

        setSondagens(lista);
      });

      return unsubscribe;
    };

    return fetchSondagens();
  }, [turmaId]);

  const handleSave = async () => {
    if (editedSondagem) {
      setIsSaving(true); // Indica que a operação está em progresso
      try {
        await updateDoc(doc(db, 'tblSondagem', editedSondagem.id), {
          nomeSondagem: editedSondagem.nomeSondagem,
          periodoInicial: editedSondagem.periodoInicial,
          periodoFinal: editedSondagem.periodoFinal,
        });
        Alert.alert('Sucesso', 'Sondagem atualizada com sucesso!');
        setEditedSondagem(null); // Fecha a caixa de edição
      } catch (error) {
        console.error('Erro ao atualizar a sondagem:', error);
        Alert.alert('Erro', 'Não foi possível atualizar a sondagem.');
      } finally {
        setIsSaving(false); // Restaura o estado de carregamento
      }
    }
  };

  return (
    <Container>
      <StatusBar style="auto" />

      <View style={styles.header}>
        <BackBtn onPress={() => navigation.goBack()} />
        <Title>Editar Sondagens</Title>
      </View>

      <FlatList
        data={sondagens}
        keyExtractor={(item) => item.id}
        style={styles.list}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text style={styles.text}>{item.nomeSondagem}</Text>
            <Text style={styles.text}>Período Inicial: {item.periodoInicial}</Text>
            <Text style={styles.text}>Período Final: {item.periodoFinal}</Text>

            <Btnm texto="Editar" onPress={() => setEditedSondagem(item)} />
          </View>
        )}
      />

      {editedSondagem && (
        <View style={styles.editContainer}>
          <View style={styles.header}>
            <BackBtn onPress={() => navigation.goBack()} />
          </View>
          <Text style={styles.editTitle}>Editar Sondagem</Text>
          <Input
            text="Nome da Sondagem"
            value={editedSondagem.nomeSondagem}
            onChangeText={(value) =>
              setEditedSondagem({ ...editedSondagem, nomeSondagem: value })
            }
          />
          <Input
            text="Período Inicial"
            value={editedSondagem.periodoInicial}
            onChangeText={(value) =>
              setEditedSondagem({ ...editedSondagem, periodoInicial: value })
            }
          />
          <Input
            type={'datetime'}
            options={{ format: 'DD/MM/YYYY' }}
            text="Período Final"
            value={editedSondagem.periodoFinal}
            onChangeText={(value) =>
              setEditedSondagem({ ...editedSondagem, periodoFinal: value })
            }
          />
          <View style={styles.btnGroup}>
            <Btnms
              texto={isSaving ? 'Salvando...' : 'Salvar'}
              onPress={handleSave}
              disabled={isSaving}
            />
            <Btnms texto="Cancelar" onPress={() => setEditedSondagem(null)} />
          </View>
        </View>
      )}
    </Container>
  );
}

const styles = StyleSheet.create({
  item: {
    marginVertical: 10,
    top: '10%',
    padding: 20,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    height: 130,
    width: '95%',
    alignSelf: 'center',
  },
  list: {
    marginBottom: 90,
    marginTop: 40,
    bottom:30

  },
  text: {
    fontSize: 16,
    marginBottom: 5,
  },

  header: {
    right: '0.1%',
    top: '2.7%',
  },

  editContainer: {
    position: 'absolute',
    top: '20%',
    left: '10%',
    right: '10%',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 8,
    elevation: 5,
  },
  editTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  btnGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
});