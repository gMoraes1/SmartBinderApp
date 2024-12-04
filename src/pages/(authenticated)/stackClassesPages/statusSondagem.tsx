import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, FlatList, Modal, Alert } from 'react-native';
import styled from 'styled-components/native';
import { collection, query, where, onSnapshot, doc, updateDoc, getDoc } from 'firebase/firestore';
import { db } from '../../../../firebase';
import Btnm from '../../../components/Buttons/Btnm';
import Btnms from '../../../components/Buttons/BtnmS';
import Input from '../../../components/Input/Input';
import BackBtn from '../../../components/Buttons/BackBtn';
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
  color: ${(props) => props.theme.color};
`;

interface ObsSondagem {
  id: string;
  obs: string;
  qntFaltas: string;
  status: string;
  sondagemRef: any; // Referência para tblSondagem
  nomeSondagem: string; // Nome da sondagem a ser carregado
  periodoInicial: string; // Período inicial
  periodoFinal: string; // Período final
}

export default function StatusSondagem({ route }) {
  const navigation = useNavigation();
  const { turmaId, alunoId } = route.params; // Pegando turmaId e alunoId dos parâmetros da rota

  const [obsSondagens, setObsSondagens] = useState<ObsSondagem[]>([]);
  const [editingItem, setEditingItem] = useState<ObsSondagem | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!alunoId) {
      console.error("ID do aluno não fornecido.");
      return;
    }

    const q = query(
      collection(db, 'tblObsSondagem'),
      where('alunoRef', '==', doc(db, 'tblAluno', alunoId))
    );

    const unsubscribe = onSnapshot(q, async (querySnapshot) => {
      const lista: ObsSondagem[] = [];
      for (const docSnap of querySnapshot.docs) {
        const data = docSnap.data();
        const sondagemRef = data.sondagemRef; // Pega a referência para a sondagem

        // Agora busque os dados da sondagem correspondente
        const sondagemDoc = await getDoc(sondagemRef);
        const nomeSondagem = sondagemDoc.exists() ? (sondagemDoc.data() as { nomeSondagem: string }).nomeSondagem : 'Sem nome';
        const periodoInicial = sondagemDoc.exists() ? (sondagemDoc.data() as { periodoInicial: string }).periodoInicial : 'Sem nome';
        const periodoFinal = sondagemDoc.exists() ? (sondagemDoc.data() as { periodoFinal: string }).periodoFinal : 'Sem nome';

        lista.push({
          id: docSnap.id,
          status: data.status,
          qntFaltas: data.qntFaltas,
          obs: data.obs,

          sondagemRef, // Incluindo a referência
          nomeSondagem, // Armazenando o nome da sondagem
          periodoInicial, // Armazenando o periodo inicial
          periodoFinal, // Armazenando o periodo final
        });
      }

      // Ordena a lista por 'periodoInicial' de forma crescente
      lista.sort((a, b) => {
        const dateA = new Date(a.periodoInicial.split('/').reverse().join('-')); // Converte "DD/MM/YYYY" para "YYYY-MM-DD"
        const dateB = new Date(b.periodoInicial.split('/').reverse().join('-'));
        return dateA.getTime() - dateB.getTime(); // Ordena do menor para o maior
      });

      setObsSondagens(lista);
    });

    return () => unsubscribe();
  }, [alunoId]);

  const handleSave = async () => {
    if (editingItem) {
      setIsSaving(true);
      try {
        await updateDoc(doc(db, 'tblObsSondagem', editingItem.id), {
          status: editingItem.status,
          qntFaltas: editingItem.qntFaltas,
          obs: editingItem.obs,

        });
        Alert.alert('Sucesso', 'Dados atualizados com sucesso!');
        setEditingItem(null); // Fecha o modal
      } catch (error) {
        console.error('Erro ao atualizar os dados:', error);
        Alert.alert('Erro', 'Não foi possível atualizar os dados.');
      } finally {
        setIsSaving(false);
      }
    }
  };

  return (
    <Container>
      <StatusBar style="auto" />

      <View style={styles.header}>
        <BackBtn onPress={() => navigation.goBack()} />
      </View>
      <Title>Status Sondagem</Title>

      <FlatList
        data={obsSondagens}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text style={styles.text}>{item.nomeSondagem}: {item.periodoInicial} __{item.periodoFinal}</Text>
            <Text style={styles.text}>Status: {item.status}</Text>
            <Text style={styles.text}>Faltas: {item.qntFaltas}</Text>
            <Text style={styles.text}>Observação: {item.obs}</Text>

            <Btnm texto="Editar" onPress={() => setEditingItem(item)} />
          </View>
        )}
      />

      <Modal visible={!!editingItem} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Editar Dados</Text>
            <Input
              text="Status do aluno"
              value={editingItem?.status}
              onChangeText={(value) =>
                setEditingItem({ ...editingItem, status: value })
              }
            />
            <Input
              text="Quantidade de Faltas"
              value={editingItem?.qntFaltas}
              onChangeText={(value) =>
                setEditingItem({ ...editingItem, qntFaltas: value })
              }
            />
            <Input
              text="Observação"
              value={editingItem?.obs}
              onChangeText={(value) =>
                setEditingItem({ ...editingItem, obs: value })
              }
            />
            <View style={styles.btnGroup}>
              <Btnms
                texto={isSaving ? 'Salvando...' : 'Salvar'}
                onPress={handleSave}
                disabled={isSaving}
              />
              <Btnms texto="Cancelar" onPress={() => setEditingItem(null)} />
            </View>
          </View>
        </View>
      </Modal>
    </Container>
  );
}

const styles = StyleSheet.create({
  header: {
    marginBottom: 20,
  },
  item: {
    marginVertical: 10,
    padding: 15,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    height: 160, // Aumentando a altura para acomodar os novos campos
  },
  text: {
    fontSize: 16,
    marginBottom: 5,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 8,
    elevation: 5,
  },
  modalTitle: {
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
