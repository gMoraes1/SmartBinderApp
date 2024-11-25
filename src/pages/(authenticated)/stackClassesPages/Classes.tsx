import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  Alert,
} from "react-native";
import React, { useEffect, useState } from "react";
import styled from "styled-components/native";
import {
  collection,
  onSnapshot,
  deleteDoc,
  query,
  where,
  doc,
} from "firebase/firestore";
import { db, auth } from "../../../../firebase"; // Ajuste para seu caminho do Firebase
import LtBtn from "../../../components/Buttons/LittleBtn";
import DeleteBtn from "../../../components/Buttons/DeleteBtn";

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
  padding: 16px;
  height: 100%;
`;

const Title = styled.Text`
  font-size: 32px;
  font-weight: 600;
  text-align: center;
  padding-top: 12%;
  color: ${(props) => props.theme.color};
`;

export default function Classes({ navigation }) {
  const [turma, setTurma] = useState<ClassData[]>([]);

  async function deleteTurma(id: string) {
    try {
      await deleteDoc(doc(db, "tblTurma", id));
      Alert.alert("Turma deletada.");
    } catch (error) {
      console.error("Erro ao deletar turma.", error);
    }
  }

  useEffect(() => {
    const unsubscribe = onSnapshot(
      query(
        collection(db, "tblTurma"),
        where("userRef", "==", doc(db, "users", auth.currentUser?.uid))
      ),
      (querySnapshot) => {
        const lista: ClassData[] = [];
        querySnapshot.forEach((docSnap) => {
          const data = docSnap.data();
          lista.push({
            id: docSnap.id,
            nomeTurma: data.nomeTurma,
            periodoTurma: data.periodoTurma,
            educationLevel: data.educationLevel,
            school: data.school,
          });
        });

        setTurma(lista);
      }
    );

    return () => unsubscribe();
  }, []);

  return (
    <Container>
      <Title style={styles.title}>Turmas</Title>

      <FlatList
        data={turma}
        keyExtractor={(item) => item.id}
        style={styles.list}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.classItem}
            onPress={() =>
              navigation.navigate("ListStudents", { turmaId: item.id })
            }
          >
            <View style={styles.classInfo}>
              <Text style={styles.textData}>
                Nome da turma: {item.nomeTurma}
              </Text>
              <Text style={styles.textData}>Período: {item.periodoTurma}</Text>
              <Text style={styles.textData}>
                Nível escolar: {item.educationLevel}
              </Text>
              <Text style={styles.textData}>Escola: {item.school}</Text>
            </View>

            <View style={styles.Buttons}>
              <DeleteBtn onPress={() => deleteTurma(item.id)}>
                Deletar
              </DeleteBtn>
              <LtBtn onPress={() => navigation.navigate("ClassDetails")}>
                Editar
              </LtBtn>
              <LtBtn onPress={() => navigation.navigate("ExportDoc")}>
                Sondagem
              </LtBtn>
            </View>
          </TouchableOpacity>
        )}
      />

      <TouchableOpacity
        onPress={() => navigation.navigate("RegisterClasses")}
        style={styles.BtnAdd}
      >
        <Text style={styles.TxtBtn1}>+</Text>
      </TouchableOpacity>

      <StatusBar style="auto" />
    </Container>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 32,
    fontWeight: "600",
    textAlign: "center",
    paddingVertical: 20,
  },
  list: {
    marginBottom: 20,
  },
  classItem: {
    flexDirection: "column",
    justifyContent: "space-between",
    padding: 15,
    marginVertical: 8,
    borderWidth: 2,
    borderColor: "#ccc",
    borderRadius: 8,
    backgroundColor: "#f9f9f9",
    elevation: 5,
  },
  classInfo: {
    alignItems: "flex-start",
    marginBottom: 10,
  },
  BtnDelete: {
    marginTop: 10,
    backgroundColor: "#ff4d4d",
    padding: 10,
    borderRadius: 10,
    width: 100,
    alignSelf: "center",
  },
  TxtDelete: {
    color: "white",
    textAlign: "center",
    fontWeight: "bold",
  },
  BtnAdd: {
    width: 60,
    height: 60,
    backgroundColor: "#6939E9",
    borderRadius: 30,
    position: "absolute",
    top: "82%",
    right: "6.2%",
    alignItems: "center",
    justifyContent: "center",
    elevation: 5,
  },
  TxtBtn1: {
    fontSize: 40,
    fontWeight: "900",
    color: "white",
    textAlign: "center",
    top: -2,
  },
  textData: {
    color: "black",
    fontSize: 16,
    fontWeight: "bold",
  },
  BtnEdit: {
    marginTop: 10,
    backgroundColor: "#6939E9",
    padding: 10,
    borderRadius: 10,
    width: 100,
    alignSelf: "center",
  },
  TxtEdit: {
    color: "white",
    textAlign: "center",
    fontWeight: "bold",
  },
  Buttons: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-evenly",
  },
});
