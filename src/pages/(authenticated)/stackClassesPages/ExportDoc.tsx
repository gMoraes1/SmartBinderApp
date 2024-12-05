import React, { useEffect, useState } from "react";
import * as XLSX from "xlsx";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";
import styled from "styled-components/native";
import { StyleSheet, View } from "react-native";
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
  rmAluno: string;
  turmaId: string;
}

interface ClassData {
  id: string;
  nomeTurma: string;
  school: string;
}

interface SondagemData {
  id: string;
  nomeSondagem: string;
}

interface ObservationData {
  id: string;
  alunoRef: any;
  sondagemRef: any;
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

  useEffect(() => {
    if (turmaId) {
      // Fetch the Turma data
      const turmaRef = doc(db, "tblTurma", turmaId);
      getDoc(turmaRef).then((docSnap) => {
        if (docSnap.exists()) {
          const turmaData = docSnap.data();
          setTurmas([
            {
              id: docSnap.id,
              nomeTurma: turmaData.nomeTurma,
              school: turmaData.school,
            },
          ]);
        }
      });

      // Fetch the professor data
      const perfilRef = doc(db, "tblProfessor", auth.currentUser?.uid);
      getDoc(perfilRef).then((docSnap) => {
        if (docSnap.exists()) {
          setDadosPerfil(docSnap.data());
        }
      });
    }
  }, [turmaId]);

  useEffect(() => {
    // Fetch all Sondagens
    const unsubscribeSondagens = onSnapshot(collection(db, "tblSondagem"), (querySnapshot) => {
      const sondagensList: SondagemData[] = [];
      querySnapshot.forEach((docSnap) => {
        const data = docSnap.data();
        // Only add sondagens that belong to the current turma
        if (data.turmaRef.id === turmaId) {
          sondagensList.push({
            id: docSnap.id,
            nomeSondagem: data.nomeSondagem,
          });
        }
      });
      setSondagens(sondagensList);
    });

    return () => unsubscribeSondagens();
  }, [turmaId]);

  useEffect(() => {
    // Fetch all students in the current turma
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
            rmAluno: data.rmAluno,
            turmaId: data.turmaRef.id,
          });
        });
        setStudents(studentList);
      }
    );
    return () => unsubscribe();
  }, [turmaId]);

  useEffect(() => {
    // Fetch all observations related to the students
    const unsubscribeObservations = onSnapshot(collection(db, "tblObsSondagem"), (querySnapshot) => {
      const observationsList: ObservationData[] = [];
      querySnapshot.forEach((docSnap) => {
        const data = docSnap.data();
        observationsList.push({
          id: docSnap.id,
          alunoRef: data.alunoRef,
          sondagemRef: data.sondagemRef,
          status: data.status || "", // Ensure there are no null values for status
          qntFaltas: data.qntFaltas || 0, // Ensure there are no null values for faltas
        });
      });
      setObservations(observationsList);
    });

    return () => unsubscribeObservations();
  }, []);

  const generateExcel = () => {
    const wb = XLSX.utils.book_new();

    const filteredStudents = students.filter((student) => student.turmaId === turmaId);

    // Header
    const header = [
      "Nome do Aluno",
      "RM",
      ...sondagens.map((sondagem) => `${sondagem.nomeSondagem} - Status`),
      ...sondagens.map((sondagem) => `${sondagem.nomeSondagem} - Faltas`),
    ];

    // Turma information
    const turmaInfo = [
      [`Nome da escola: ${turmas[0]?.school || ""}`],
      [`Professor: ${dadosPerfil?.nomeProfessor || ""}`],
      [`Turma: ${turmas[0]?.nomeTurma || ""}`],
    ];

    // Sorting Sondagens by order
    const orderedSondagens = sondagens.sort((a, b) => {
      const bimestreOrder = {
        "1° Bimestre": 1,
        "2° Bimestre": 2,
        "3° Bimestre": 3,
        "4° Bimestre": 4,
      };
      return bimestreOrder[a.nomeSondagem] - bimestreOrder[b.nomeSondagem];
    });

    // Preparing the students' data
    const studentsData = filteredStudents.map((student) => {
      const bimestersData = orderedSondagens.map(() => ["", ""]);

      // Filling the data for each bimestre
      orderedSondagens.forEach((sondagem, index) => {
        const observation = observations.find(
          (obs) => obs.sondagemRef.id === sondagem.id && obs.alunoRef.id === student.id
        );

        if (observation) {
          bimestersData[index] = [
            observation.status || "",
            String(observation.qntFaltas || ""),
          ];
        }
      });

      const studentRow = [
        student.nomeAluno,
        student.rmAluno,
        ...bimestersData.flat(),
      ];

      return studentRow;
    });

    // Creating the worksheet with the turma and students' data
    const ws = XLSX.utils.aoa_to_sheet([
      ...turmaInfo,
      [],
      header,
      ...studentsData,
    ]);

    // Adjusting the columns width
    const colWidths = header.map(() => ({ wch: 20 }));
    ws["!cols"] = colWidths;

    // Appending the worksheet to the workbook
    XLSX.utils.book_append_sheet(wb, ws, "Alunos");

    // Generating the Excel file and sharing it
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
        {/* Adicionando o botão de exportar PDF */}
        <Btn
          onPress={() => console.log("Exportando PDF...")}
          texto="Exportar PDF"
        />
      </View>
      <View style={styles.BtnView}>
        {/* Adicionando o botão de editar sondagem */}
        <Btn
          onPress={() => navigation.navigate("EditSondagem", { turmaId })}
          texto="Editar Sondagem"
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
});
