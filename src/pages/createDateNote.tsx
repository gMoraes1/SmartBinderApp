import React, { useState } from "react";
import { Alert, StyleSheet, View } from 'react-native';
import styled from "styled-components/native";
import Input from "../components/Input/Input";
import BackBtn from "../components/Buttons/BackBtn";
import Cadastrar from "../components/Buttons/Cadastrar";
import { firestore } from "../../firebase"; // Certifique-se de importar corretamente o firestore
import { collection, addDoc } from "firebase/firestore";

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
  padding: 6%;
  margin:20px;
  color: ${(props) => props.theme.color};
`;

export default function CreateDateNote({ route, navigation }) {
    const { dataCompleta } = route.params; // Obtenha o valor de dataCompleta dos parâmetros
    const [description, setDescription] = useState("");

    // Função para salvar o evento no Firestore
    async function addEvento() {
        try {
            const docRef = await addDoc(collection(firestore, 'tblCalendario'), {
                dataCalendario: dataCompleta,
                descricaoCalendario: description
            });
            console.log("Cadastrado com Id:", docRef.id);
            Alert.alert("Cadastro", "Registros cadastrados com sucesso")
            navigation.navigate("Calendars");

        } catch (error) {
            console.error("Erro ao cadastrar:", error);
            Alert.alert("Erro", "Erro ao cadastrar, Por favor, Tente novamente.");
        }
    }

    return (
        <Container>
            <View style={styles.header}>
                <BackBtn onPress={() => navigation.navigate("Calendars")} />
            </View>
            <Title>Salvar Evento</Title>
            <Input text="Data do Evento" onChangeText={() => { }} value={dataCompleta} />
            <Input text="Descrição do Evento" onChangeText={setDescription} value={description} />
            <Cadastrar onPress={addEvento} />
        </Container>
    );
}

const styles = StyleSheet.create({
    header: {
        right: '41%',
        top: '5%',
    },
});
