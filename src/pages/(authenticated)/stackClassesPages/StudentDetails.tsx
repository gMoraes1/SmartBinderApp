import styled, { useTheme } from "styled-components/native";
import { StyleSheet, TextInput, View } from 'react-native'
import { useState } from "react";
import { AutoGrowingTextInput } from 'react-native-autogrow-textinput'
import Btn from "../../../components/Buttons/Btn";
import BackBtn from "../../../components/Buttons/BackBtn";
import { StatusBar } from "expo-status-bar";

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

export default function StudentDetails({ navigation }) {
    const theme = useTheme()
    const [faltas, setFaltas] = useState('');
    const [obs, setObs] = useState('');

    function handleCreateSondagem() {

    };

    return (
        <Container>
            <StatusBar style="auto" />

            <View style={styles.header}>
                <BackBtn onPress={() => navigation.goBack()} />
            </View>
            <Title>Informações do aluno</Title>
            <View style={styles.InputView}>
                <TextInput
                    style={{
                        backgroundColor: theme.inputBackground || "#D2DFDA",
                        color: theme.color || "#000",
                        fontSize: 18,
                        paddingLeft: 20,
                        borderRadius: 10,
                        elevation: 5,
                        margin: 8,
                    }}
                    placeholder="Faltas do Aluno"
                    onChangeText={setFaltas}
                    value={faltas}
                />
                <AutoGrowingTextInput
                    style={[{
                        backgroundColor: theme.inputBackground || "#D2DFDA",
                        color: theme.color || "#000",
                        width: 255,
                        margin: 8,
                        marginBottom: '10%',
                        fontSize: 18,
                        paddingLeft: 20,
                        borderRadius: 10,
                        elevation: 5,
                        textAlign: 'left',
                    }]}
                    placeholder="Observação da Sondagem"
                    onChangeText={setObs}
                    value={obs} />
            </View>
            <Btn onPress={handleCreateSondagem} />
        </Container>
    )
};

const styles = StyleSheet.create({
    Input: {
        backgroundColor: 'red',
        width: 100,
    },

    InputView: {
        top: 30,
        marginBottom: 30,
    },
    header: {
        right: '41%',
        top: '4.7%',
    },
})