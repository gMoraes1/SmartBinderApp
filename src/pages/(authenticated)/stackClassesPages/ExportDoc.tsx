import React, { useEffect, useState } from "react";
import * as XLSX from "xlsx";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";
import styled from "styled-components/native";
import { StyleSheet, Text, View } from "react-native";
import Input from "../../../components/Input/Input";
import Btn from "../../../components/Buttons/Btn";
import BackBtn from "../../../components/Buttons/BackBtn";
import { auth, db } from "../../../../firebase";
import {
  collection,
  doc,
  getDoc,
  onSnapshot,
  query,
  where,
  orderBy,
} from "firebase/firestore";
import { StatusBar } from "expo-status-bar";

interface StudentData {
  id: string;
  nomeAluno: string;
  nascimentoAluno: string;
  rmAluno: string;
  turmaId: string;
}

interface ClassData {
  id: string;
  nomeTurma: string;
  periodoTurma: string;
  educationLevel: string;
  school: string;
}

interface SondagemData {
  id: string;
  nomeSondagem: string;
  periodoInicial: string;
  periodoFinal: string;
  turmaRef: any;
}

interface ObservationData {
  id: string;
  alunoRef: any;
  sondagemRef: any;
  obs: string;
  status: string;
  qntFaltas: number;
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
  const [namefile, setFilename] = useState("");
  const [dadosPerfil, setDadosPerfil] = useState(null);
  const [students, setStudents] = useState<StudentData[]>([]);
  const [turmas, setTurmas] = useState<ClassData[]>([]);
  const [sondagens, setSondagens] = useState<SondagemData[]>([]);
  const [observations, setObservations] = useState<ObservationData[]>([]);
  const turmaId = route.params?.turmaId;

  // Puxar dados do professor e turma
  useEffect(() => {
    if (turmaId) {
      const turmaRef = doc(db, "tblTurma", turmaId);

      getDoc(turmaRef).then((docSnap) => {
        if (docSnap.exists()) {
          const turmaData = docSnap.data();
          setTurmas([{
            id: docSnap.id,
            nomeTurma: turmaData.nomeTurma,
            school: turmaData.school,
            periodoTurma: turmaData.periodoTurma,
            educationLevel: turmaData.educationLevel,
          }]);
        }
      });

      const perfilRef = doc(db, "tblProfessor", auth.currentUser?.uid);
      getDoc(perfilRef).then((docSnap) => {
        if (docSnap.exists()) {
          setDadosPerfil(docSnap.data());
        }
      });
    }
  }, [turmaId]);

  // Puxar todas as sondagens (1° Bimestre, 2° Bimestre, etc.)
  useEffect(() => {
    const unsubscribeSondagens = onSnapshot(
      collection(db, "tblSondagem"),
      (querySnapshot) => {
        const sondagensList: SondagemData[] = [];
        querySnapshot.forEach((docSnap) => {
          const data = docSnap.data();
          if (["1° Bimestre", "2° Bimestre", "3° Bimestre", "4° Bimestre"].includes(data.nomeSondagem)) {
            sondagensList.push({
              id: docSnap.id,
              nomeSondagem: data.nomeSondagem,
              periodoInicial: data.periodoInicial,
              periodoFinal: data.periodoFinal,
              turmaRef: data.turmaRef,
            });
          }
        });
        setSondagens(sondagensList);
      }
    );
    return () => unsubscribeSondagens();
  }, []);

  // Puxar todos os alunos dessa turma
  useEffect(() => {
    if (!turmaId) return;

    const unsubscribe = onSnapshot(
      query(
        collection(db, "tblAluno"),
        where("turmaRef", "==", doc(db, "tblTurma", turmaId)),
        orderBy("nomeAluno")
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
            turmaId: data.turmaRef.id,
          });
        });
        setStudents(studentList);
      }
    );

    return () => unsubscribe();
  }, [turmaId]);

  // Puxar todas as observações
  useEffect(() => {
    const unsubscribeObservations = onSnapshot(
      collection(db, "tblObsSondagem"),
      (querySnapshot) => {
        const observationsList: ObservationData[] = [];
        querySnapshot.forEach((docSnap) => {
          const data = docSnap.data();
          observationsList.push({
            id: docSnap.id,
            alunoRef: data.alunoRef,
            sondagemRef: data.sondagemRef,
            obs: data.obs,
            status: data.status, // Garantindo que o status está sendo puxado
            qntFaltas: data.qntFaltas,
          });
        });
        setObservations(observationsList);
      }
    );

    return () => unsubscribeObservations();
  }, []);

  // Função para gerar o arquivo Excel
  const generateExcel = () => {
    const wb = XLSX.utils.book_new();

    const filteredStudents = students.filter((student) => student.turmaId === turmaId);

    const header = [
      "Nome do Aluno",
      "RM",
      "1° Bimestre - Status",
      "1° Bimestre - Faltas",
      "2° Bimestre - Status",
      "2° Bimestre - Faltas",
      "3° Bimestre - Status",
      "3° Bimestre - Faltas",
      "4° Bimestre - Status",
      "4° Bimestre - Faltas",
    ];

    // Usando os dados corretos de turma, escola e professor
    const turmaInfo = [
      [`Nome da escola: ${turmas[0]?.school || "Não disponível"}`],
      [`Professor: ${dadosPerfil?.nomeProfessor || "Não disponível"}`],
      [`Turma: ${turmas[0]?.nomeTurma || "Não disponível"}`],
    ];

    const studentsData = filteredStudents.map((student) => {
      let bimestersData = [[], [], [], []];

      sondagens.forEach((sondagem, index) => {
        const observation = observations.find(
          (obs) => obs.sondagemRef.id === sondagem.id && obs.alunoRef.id === student.id
        );
        if (observation) {
          bimestersData[index] = [observation.status || "", observation.qntFaltas || 0];
        }
      });

      const studentRow = [
        student.nomeAluno,
        student.rmAluno,
        ...bimestersData.flat(),
      ];

      return studentRow;
    });

    const ws = XLSX.utils.aoa_to_sheet([
      ...turmaInfo,
      [],
      header,
      ...studentsData,
    ]);

    XLSX.utils.book_append_sheet(wb, ws, "Alunos");

    const base64 = XLSX.write(wb, { type: "base64" });

    const filename = FileSystem.documentDirectory + `${namefile}.xlsx`;

    FileSystem.writeAsStringAsync(filename, base64, {
      encoding: FileSystem.EncodingType.Base64,
    }).then(() => {
      Sharing.shareAsync(filename);
    });
  };

  return (
    <Container>
      <StatusBar style="auto" />

      <View style={styles.header}>
        <BackBtn onPress={() => navigation.goBack()} />
      </View>
      <Title>Sondagens</Title>

      <View style={styles.BtnView}>
        <Input text="Nome do Arquivo" onChangeText={setFilename} value={namefile} />
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
            navigation.navigate("EditSondagem", {
              turmaId: route.params.turmaId,
            })
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
    width: "90%",
    alignItems: "center",
  },

  header: {
    right: "41%",
    top: "4.7%",
  },

  studentList: {
    marginTop: 20,
    width: "90%",
  },
});
