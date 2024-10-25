import React, { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import Cadastrar from "../components/Buttons/Cadastrar";
import Input from "../components/Input/Input";
import BackBtn from "../components/Buttons/BackBtn";

export default function RegisterClasses({ navigation }) {
  const [className, setClassName] = useState("");
  const [period, setPeriod] = useState("");
  const [educationLevel, setEducationLevel] = useState("");
  const [school, setSchool] = useState("");

  const handleAddClass = () => {
    // Navegar de volta e passar os dados da turma
    navigation.navigate("Classes", {
      classData: {
        name: className,
        period,
        educationLevel,
        school,
      },
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <BackBtn onPress={() => navigation.navigate("Classes")} />
        <Text style={styles.title}>Cadastrar Turma</Text>
      </View>

      <View style={styles.inputContainer}>
        <Input text="Nome da turma" onChangeText={setClassName} />
        <Input text="Período" onChangeText={setPeriod} />
        <Input text="Nível de escolaridade" onChangeText={setEducationLevel} />
        <Input text="Escola" onChangeText={setSchool} />
      </View>

      <Cadastrar onPress={handleAddClass} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: 70,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    height: 120,
    paddingHorizontal: 16,
  },
  inputContainer: {
    display: "flex",
    flexDirection: "column",
    gap: 10,
  },
  title: {
    flex: 1,
    fontSize: 32,
    fontWeight: "600",
    textAlign: "center",
    paddingTop: 18,
  },
});
