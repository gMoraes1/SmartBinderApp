import * as XLSX from 'xlsx';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import styled from 'styled-components/native';
import { StyleSheet, TouchableOpacity, Text, View } from 'react-native';
import Input from '../../../components/Input/Input';
import { useState } from 'react';
import Btn from '../../../components/Buttons/Btn';

const Container = styled.View`
  background-color: ${props => props.theme.background};
  width: 100%;
  height: 100%;
  text-align:center;
  align-items:center;
`;

const Title = styled.Text`
  font-size: 32px;
  font-weight: 600;
  text-align: center;
  padding-top: 12%;
  color: ${props => props.theme.color};
`;

export default function ExportDoc() {
    const [namefile, setFilename] = useState('');
    const generateExcel = () => {
        const wb = XLSX.utils.book_new();
        const ws = XLSX.utils.aoa_to_sheet([
            [],
            [],
            [],
            []
        ]);
        XLSX.utils.book_append_sheet(wb, ws, "teste", true);
        const base64 = XLSX.write(wb, { type: 'base64' });
        const filename = FileSystem.documentDirectory + `${namefile}.xlsx`;
        FileSystem.writeAsStringAsync(filename, base64, {
            encoding: FileSystem.EncodingType.Base64
        }).then(() => {
            Sharing.shareAsync(filename);
        });
    };

    return (
        <Container>
            <Title>Sondagens</Title>
            <View style={styles.BtnView}>
                <Input text="Nome do Arquivo" onChangeText={setFilename} value={namefile} />
            </View>

            <View style={styles.BtnView}>
                <Btn onPress={generateExcel} texto='Importar Excel'></Btn>
            </View>

            <View style={styles.BtnView}>
                <Btn onPress={generateExcel} texto='Importar PDF'></Btn>
            </View>
            

        </Container>
    );
}

const styles = StyleSheet.create({
    BtnSondagem: {
        width: 200,
        backgroundColor: 'red',
        height: 40,
        borderRadius: 5,  // Opcional, para bordas arredondadas
        justifyContent: 'center',
        textAlign: 'center',
        alignItems: "center",
        margin: 16,
    },
    BtnText: {
        color: 'white',  // Cor do texto
        fontSize: 16,    // Tamanho da fonte
        fontWeight: 'bold',  // Peso da fonte
        justifyContent: 'center',
        textAlign: 'center',
        alignItems: "center",
    },
    BtnView: {
        top:'12%',
        margin: 8,
        justifyContent: 'center',
        textAlign: 'center',
        alignItems: "center",
    },
});
