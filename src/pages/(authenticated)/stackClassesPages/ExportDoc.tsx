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
  turmaId: string; // Adiciona turmaId para associar o aluno à turma
}

interface ClassData {
  id: string;
  nomeTurma: string;
  periodoTurma: string;
  educationLevel: string;
  school: string;
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
  const [turmas, setTurmas] = useState<ClassData[]>([]);
  const turmaId = route.params?.turmaId; // Obtendo turmaId diretamente de route.params

  // Carrega a turma selecionada
  useEffect(() => {
    if (!turmaId) {
      console.error("turmaId não encontrado");
      return;
    }

    const unsubscribe = onSnapshot(
      doc(db, "tblTurma", turmaId), // Acesso direto ao documento da turma pela referência
      (docSnapshot) => {
        if (docSnapshot.exists()) {
          const data = docSnapshot.data();
          setTurmas([ // Alteração para setar turmas como um array
            {
              id: docSnapshot.id,
              nomeTurma: data.nomeTurma,
              periodoTurma: data.periodoTurma,
              educationLevel: data.educationLevel,
              school: data.school,
            },
          ]);
        } else {
          console.error("Turma não encontrada.");
        }
      }
    );

    return () => unsubscribe();
  }, [turmaId]);

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

  // Carrega os alunos da turma selecionada
  useEffect(() => {
    if (!turmaId) return;

    const unsubscribe = onSnapshot(
      query(
        collection(db, "tblAluno"),
        where("turmaRef", "==", doc(db, "tblTurma", turmaId)), // Verifique se o filtro é feito pela turmaRef
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
            turmaId: data.turmaRef.id, // Atribuindo a turmaId para cada aluno
          });
        });

        setStudents(studentList); // Atualiza a lista de alunos
      }
    );

    return () => unsubscribe();
  }, [turmaId]);



  // Gera o arquivo Excel com os dados dos alunos
  const generateExcel = () => {
    if (students.length === 0) {
      console.error('Nenhum aluno encontrado para esta turma');
      return;
    }

    const wb = XLSX.utils.book_new(); // Criação de uma nova planilha Excel

    // Filtrando alunos pela turma
    const filteredStudents = students.filter(student => student.turmaId === turmaId);

    // Verificando se há alunos para a turma
    if (filteredStudents.length === 0) {
      console.error('Nenhum aluno encontrado para esta turma');
      return;
    }

    // Cabeçalho da planilha
    const header = ['Nome do Aluno', 'RM', '1° Bimestre', '2° Bimestre', '3° Bimestre', '4° Bimestre'];

    // Criar a linha para o nome da turma e nome do professor
    const turmaInfo = [
      [`Professor: ${dadosPerfil?.nomeProfessor}`], // Nome do professor
      [`Turma: ${turmas[0]?.school}`], // Nome da turma
      [`Turma: ${turmas[0]?.nomeTurma}`], // Nome da turma
    ];

    // Dados dos alunos
    const studentsData = filteredStudents.map(student => [
      student.nomeAluno,
      student.rmAluno,
      '', '', '', '' // Campos para as notas (que podem ser preenchidos depois)
    ]);

    // Adicionando as informações da turma e do professor ao Excel
    const ws = XLSX.utils.aoa_to_sheet([
      ...turmaInfo,  // Linhas com nome da turma e nome do professor
      [], // Linha vazia para separação
      header, // Cabeçalho
      ...studentsData // Dados dos alunos
    ]);

    // Adiciona a planilha ao arquivo Excel
    XLSX.utils.book_append_sheet(wb, ws, 'Alunos');

    // Converte o arquivo para base64
    const base64 = XLSX.write(wb, { type: 'base64' });

    // Caminho do arquivo
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
            navigation.navigate('EditSondagem', { turmaId: route.params.turmaId })
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

  studentList: {
    marginTop: 20,
    width: '90%',
  },
});
