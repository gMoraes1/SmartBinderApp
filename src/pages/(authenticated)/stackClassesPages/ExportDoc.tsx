import React, { useEffect, useState } from 'react';
import * as XLSX from 'xlsx';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import styled from 'styled-components/native';
import { StyleSheet, Text, View } from 'react-native';
import Input from '../../../components/Input/Input';
import Btn from '../../../components/Buttons/Btn';
import BackBtn from "../../../components/Buttons/BackBtn";
import { auth, db } from '../../../../firebase';
import { collection, doc, onSnapshot, orderBy, query, where } from 'firebase/firestore';

// Definição da interface para os dados dos alunos
interface StudentData {
  id: string;
  nomeAluno: string;
  nascimentoAluno: string;
  rmAluno: string;
}

const Container = styled.View`
  background-color: ${(props) => props.theme.background};
  width: 100%;
  height: 100%;
  align-items: center;
`;

const Title = styled.Text`
  font-size: 32px;
  font-weight: 600;
  text-align: center;
  padding-top: 12%;
  color: ${(props) => props.theme.color};
`;

export default function ExportDoc({ navigation, route }) {
  const [namefile, setFilename] = useState('');
  const [dadosPerfil, setDadosPerfil] = useState(null);
  const [students, setStudents] = useState<StudentData[]>([]);
  const { turmaId } = route.params; // Obtendo o parâmetro turmaId

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
    const unsubscribe = onSnapshot(
      query(
        collection(db, "tblAluno"),
        where("turmaRef", "==", doc(db, "tblTurma", turmaId)),
        orderBy("nomeAluno") // Ordenando pela propriedade nomeAluno
      ),
      (querySnapshot) => {
        const studentList: StudentData[] = [];
        querySnapshot.forEach((docSnap) => {
          const data = docSnap.data();
          studentList.push({
            id: docSnap.id,
            nomeAluno: data.nomeAluno,
            nascimentoAluno: data.nascimentoAluno,
            rmAluno: data.rmAluno,
          });
        });

        setStudents(studentList);
      }
    );

    return () => unsubscribe();
  }, [turmaId]);

  if (!turmaId) {
    return (
      <View>
        <Text>Erro: turmaId não foi fornecido!</Text>
      </View>
    );
  }

  const generateExcel = () => {
    const wb = XLSX.utils.book_new();
  
    // Cabeçalho da planilha
    const header = ['Nome do Aluno', 'RM','1° Sondagem','2° Sondagem','3° Sondagem','4° Sondagem',];
    
    // Adiciona uma linha para o nome do professor
    const professorRow = ['', '', dadosPerfil?.nomeProfessor || ''];
  
    // Adiciona uma linha em branco
    const emptyRow = ['', '', ''];
  
    // Mapeia os alunos para os dados da planilha
    const data = students.map(student => [
      student.nomeAluno, 
      student.rmAluno
    ]);
  
    // Cria a planilha com o nome do professor, linhas vazias e os dados dos alunos
    const ws = XLSX.utils.aoa_to_sheet([
      professorRow,   // Linha com o nome do professor
      emptyRow,       // Linha em branco
      header,         // Cabeçalho
      ...data         // Dados dos alunos
    ]);
  
    // Adiciona a planilha ao arquivo
    XLSX.utils.book_append_sheet(wb, ws, 'Alunos');
  
    // Converte o arquivo para base64
    const base64 = XLSX.write(wb, { type: 'base64' });
  
    // Cria o caminho do arquivo
    const filename = FileSystem.documentDirectory + `${namefile}.xlsx`;
  
    // Salva o arquivo no sistema de arquivos
    FileSystem.writeAsStringAsync(filename, base64, {
      encoding: FileSystem.EncodingType.Base64,
    }).then(() => {
      // Compartilha o arquivo gerado
      Sharing.shareAsync(filename);
    });
  };
  
  

  return (
    <Container>
      <View style={styles.header}>
        <BackBtn onPress={() => navigation.goBack()} />
      </View>
      <Title>Sondagens</Title>

      <View style={styles.BtnView}>
        <Input
          text="Nome do Arquivo"
          onChangeText={setFilename}
          value={namefile}
        />
      </View>

      <View style={styles.BtnView}>
        <Btn onPress={generateExcel} texto="Exportar Excel" />
      </View>

      <View style={styles.BtnView}>
        <Btn onPress={generateExcel} texto="Exportar PDF" />
      </View>

      <View style={styles.BtnView}>
        <Btn
          onPress={() =>
            navigation.navigate('EditSondagem', { turmaId })
          }
          texto="Editar Sondagens"
        />
      </View>
    </Container>
  );
}

const styles = StyleSheet.create({
  BtnView: {
    marginTop: 20,
    width: '90%',
    alignItems: 'center',
  },

  header: {
    right: '41%',
    top: '4.7%',
  },
});
