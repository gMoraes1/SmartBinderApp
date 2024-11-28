import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import styled from 'styled-components/native';
import { StyleSheet, Text, View } from 'react-native';
import Input from '../../../components/Input/Input';
import Btn from '../../../components/Buttons/Btn';
import BackBtn from "../../../components/Buttons/BackBtn";



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
  const turmaId = route?.params?.turmaId;

  if (!turmaId) {
    return (
      <View>
        <Text>Erro: turmaId não foi fornecido!</Text>
      </View>
    );
  }

  const generateExcel = () => {
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet([[], [], [], []]);
    XLSX.utils.book_append_sheet(wb, ws, 'teste', true);
    const base64 = XLSX.write(wb, { type: 'base64' });
    const filename = FileSystem.documentDirectory + `${namefile}.xlsx`;
    FileSystem.writeAsStringAsync(filename, base64, {
      encoding: FileSystem.EncodingType.Base64,
    }).then(() => {
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
        <Btn onPress={generateExcel} texto="Importar Excel" />
      </View>

      <View style={styles.BtnView}>
        <Btn onPress={generateExcel} texto="Importar PDF" />
      </View>

      <View style={styles.BtnView}>
        <Btn
          onPress={() =>
            navigation.navigate('EditSondagem', { turmaId })
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
});
