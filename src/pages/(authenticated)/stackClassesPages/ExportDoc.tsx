import React, { useEffect, useState } from "react";
import * as XLSX from "xlsx";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";
import * as Print from "expo-print";
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
  const [students, setStudents] = useState([]);
  const [turmas, setTurmas] = useState([]);
  const [sondagens, setSondagens] = useState([]);
  const [observations, setObservations] = useState([]);
  const turmaId = route.params?.turmaId;

  // Buscar dados do professor e da turma
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

  // Buscar todas as sondagens
  useEffect(() => {
    const unsubscribeSondagens = onSnapshot(
      query(collection(db, "tblSondagem"), where("turmaRef", "==", doc(db, "tblTurma", turmaId))),
      (querySnapshot) => {
        const sondagensList = querySnapshot.docs.map((docSnap) => {
          const data = docSnap.data();
          return {
            id: docSnap.id,
            ...data,
            periodoInicial: data?.periodoInicial || '',  // Caso a propriedade não exista, atribui uma string vazia
          };
        });

        // Ordenar sondagens por 'periodoInicial'
        const sortedSondagens = sondagensList.sort((a, b) => {
          const dateA = new Date(a.periodoInicial.split("/").reverse().join("-"));
          const dateB = new Date(b.periodoInicial.split("/").reverse().join("-"));
          return dateA.getTime() - dateB.getTime();
        });

        setSondagens(sortedSondagens);
      }
    );

    return () => unsubscribeSondagens();
  }, [turmaId]);

  // Buscar todos os alunos da turma
  useEffect(() => {
    if (!turmaId) return;

    const unsubscribe = onSnapshot(
      query(
        collection(db, "tblAluno"),
        where("turmaRef", "==", doc(db, "tblTurma", turmaId)),
        orderBy("nomeAluno")
      ),
      (querySnapshot) => {
        const studentList = querySnapshot.docs.map((docSnap) => ({
          id: docSnap.id,
          ...docSnap.data(),
        }));
        setStudents(studentList);
      }
    );

    return () => unsubscribe();
  }, [turmaId]);

  // Buscar todas as observações
  useEffect(() => {
    const unsubscribeObservations = onSnapshot(
      collection(db, "tblObsSondagem"),
      (querySnapshot) => {
        const observationsList = querySnapshot.docs.map((docSnap) => ({
          id: docSnap.id,
          ...docSnap.data(),
        }));
        setObservations(observationsList);
      }
    );

    return () => unsubscribeObservations();
  }, []);

  // Gerar arquivo Excel
  const generateExcel = () => {
    const wb = XLSX.utils.book_new();
    const filteredStudents = students.filter(
      (student) => student.turmaRef.id === turmaId
    );

    // Montando o cabeçalho com base nas sondagens ordenadas
    const headers = [
      "Alunos",
      "RM",
      ...sondagens.flatMap((sondagem) => [
        sondagem.nomeSondagem,
        "Faltas",
      ]),
    ];

    const turmaInfo = [
      ["Escola", turmas[0]?.school || "Não disponível"],
      ["Professor", dadosPerfil?.nomeProfessor || "Não disponível"],
      ["Turma", turmas[0]?.nomeTurma || "Não disponível"],
      [],
    ];

    // Montando os dados dos alunos e observações
    const studentsData = filteredStudents.map((student) => {
      const studentRow = [student.nomeAluno, student.rmAluno];

      sondagens.forEach((sondagem) => {
        const relatedObservation = observations.find(
          (obs) =>
            obs.sondagemRef.id === sondagem.id &&
            obs.alunoRef.id === student.id
        );

        studentRow.push(
          relatedObservation?.status || "Não disponível",
          relatedObservation?.qntFaltas?.toString() || "0"
        );
      });

      return studentRow;
    });

    const ws = XLSX.utils.aoa_to_sheet([
      ...turmaInfo,
      headers,
      ...studentsData,
    ]);

    XLSX.utils.book_append_sheet(wb, ws, "Sondagens");

    const base64 = XLSX.write(wb, { type: "base64" });
    const filename = FileSystem.documentDirectory + `${namefile}.xlsx`;

    FileSystem.writeAsStringAsync(filename, base64, {
      encoding: FileSystem.EncodingType.Base64,
    }).then(() => {
      Sharing.shareAsync(filename);
    });
  };

  // Gerar arquivo PDF
  const generatePDF = async () => {
    const filteredStudents = students.filter(
      (student) => student.turmaRef.id === turmaId
    );

    const turmaInfo = `
      <h2>Escola: ${turmas[0]?.school || "Não disponível"}</h2>
      <h3>Professor: ${dadosPerfil?.nomeProfessor || "Não disponível"}</h3>
      <h3>Turma: ${turmas[0]?.nomeTurma || "Não disponível"}</h3>
    `;

    const studentRows = filteredStudents.map((student) => {
      const studentData = `
        <h4>Aluno: ${student.nomeAluno} - RM: ${student.rmAluno}</h4>
        <ul>
          ${sondagens
            .map(
              (sondagem) => `
                <li>${sondagem.nomeSondagem}: ${observations
                  .filter(
                    (obs) =>
                      obs.sondagemRef.id === sondagem.id &&
                      obs.alunoRef.id === student.id
                  )
                  .map(
                    (obs) => `Status: ${obs.status}, Faltas: ${obs.qntFaltas}`
                  )}</li>
              `
            )
            .join("")}
        </ul>
      `;
      return studentData;
    }).join("");

    const htmlContent = `
      <html>
        <body>
          ${turmaInfo}
          ${studentRows}
        </body>
      </html>
    `;

    const { uri } = await Print.printToFileAsync({
      html: htmlContent,
    });

    Sharing.shareAsync(uri);
  };

  return (
    <Container>
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
        <Btn onPress={generatePDF} texto="Exportar PDF" />
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
    width: "100%",
    height: 50,
    justifyContent: "flex-start",
    marginTop: 30,
  },
});
