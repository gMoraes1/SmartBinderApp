import * as XLSX from 'xlsx'
import * as FileSystem from 'expo-file-system'
import * as Sharing from 'expo-sharing'
import styled from 'styled-components/native';
import { StyleSheet, TouchableOpacity } from 'react-native';

const Container = styled.View`
  background-color: ${(props) => props.theme.background};
  width: 100%;
  height: 100%;
  align-items: center;
  justify-content:center;
`;

const Title = styled.Text`
  font-size: 32px;
  font-weight: 600;
  text-align: center;
  flex: 1;
  padding-top: 12%;
  color: ${(props) => props.theme.color};
`;



export default function CreateDoc() {

    const generateExcel = () => {
        const wb = XLSX.utils.book_new();
        const ws = XLSX.utils.aoa_to_sheet([
            [],
            [],
            [],
            []
        ]);
        XLSX.utils.book_append_sheet(wb,ws, "teste", true);
        const base64 = XLSX.write(wb, {type: 'base64'});
        const filename = FileSystem.documentDirectory + "teste.xlsx";
        FileSystem.writeAsStringAsync(filename, base64, {
            encoding: FileSystem.EncodingType.Base64
        }).then(() => {
            Sharing.shareAsync(filename);
        })


    };



    return (
        <Container>
            <Title>Sondagens</Title>

            <TouchableOpacity style={styles.BtnSondagem} onPress={generateExcel}>Gerar Excel</TouchableOpacity>

        </Container>
    )
}

const styles = StyleSheet.create({
    BtnSondagem: {
        width: 100,
        backgroundColor:'red',
        height: 40,
    },
})