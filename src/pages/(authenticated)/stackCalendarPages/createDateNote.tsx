import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Alert, FlatList } from 'react-native';
import { Calendar, DateData, LocaleConfig } from 'react-native-calendars';
import { Feather } from "@expo/vector-icons";
import { ptBR } from '../../../utils/localecalendarConfig';
import styled from 'styled-components/native';
import { firestore } from '../../../../firebase';
import { deleteDoc, doc, collection, getDocs, addDoc } from 'firebase/firestore';
import BackBtn from '../../../components/Buttons/BackBtn';
import Input from '../../../components/Input/Input';
import Cadastrar from '../../../components/Buttons/Cadastrar';

// Configuração do calendário para Português do Brasil
LocaleConfig.locales["pt-br"] = ptBR;
LocaleConfig.defaultLocale = "pt-br";

const Container = styled.ScrollView`
  background-color: ${(props) => props.theme.background};
  width: 100%;
  height: 100%;
`;

const Title = styled.Text`
  font-size: 32px;
  font-weight: 600;
  width: 280px;
  text-align: center;
  padding: 6%;
  color: ${(props) => props.theme.color};
`;

export default function Calendars({ navigation }) {
    const [day, setDay] = useState<DateData>();
    const [description, setDescription] = useState("");

    const diaTratado = day?.day < 10 ? `0${day.day}` : day?.day;
    const mesTratado = day?.month < 10 ? `0${day.month}` : day?.month;
    const ano = day?.year;
    const dataCompleta = day ? `${diaTratado}/${mesTratado}/${ano}` : null;

    const isDisabled = !dataCompleta || !description; // Desativa o botão se algum campo estiver vazio

    // Função para salvar o evento no Firestore
    async function addEvento() {
        try {
            const docRef = await addDoc(collection(firestore, 'tblCalendario'), {
                dataCalendario: dataCompleta,
                descricaoCalendario: description
            });
            console.log("Cadastrado com Id:", docRef.id);
            Alert.alert("Cadastro", "Registros cadastrados com sucesso");
            navigation.navigate("Calendars");
        } catch (error) {
            console.error("Erro ao cadastrar:", error);
            Alert.alert("Erro", "Erro ao cadastrar, Por favor, Tente novamente.");
        }
    }

    return (
        <Container contentContainerStyle={{ alignItems: 'center', height: '100%' }}>
            <View style={styles.header}>
                <BackBtn onPress={() => navigation.navigate("Calendars")} />
            </View>

            <Calendar
                style={styles.calendar}
                headerStyle={{
                    borderBottomWidth: 2,
                    paddingBottom: 13,
                    marginBottom: 13,
                }}
                theme={{
                    textMonthFontWeight: '700',
                    textMonthFontSize: 22,
                    textDayFontSize: 17,
                    textDayFontWeight: '800',
                    todayTextColor: '#6636E6',
                    selectedDayBackgroundColor: '#6939E9',
                    selectedDayTextColor: 'white',
                    calendarBackground: 'transparent',
                    arrowColor: '#6636E6',
                    textDisabledColor: 'rgba(105,57,233,0.3)',
                    textDayHeaderFontWeight: '900',
                    textDayHeaderFontSize: 13,
                    monthTextColor: '#6636E6',
                }}
                minDate={new Date().toDateString()}
                hideExtraDays={true}
                onDayPress={setDay}
                renderArrow={(direction) => (
                    <Feather size={38} name={`chevron-${direction}`} color={"#6939E9"} />
                )}
                markedDates={day && {
                    [day.dateString]: { selected: true }
                }}
                // Define uma largura mínima para o cabeçalho do mês para manter o tamanho fixo
                monthFormat={'MMMM yyyy'}
                renderHeader={(date) => (
                    <Text style={styles.monthHeader}>
                        {date.toString('MMMM yyyy').toUpperCase()}
                    </Text>
                )}
            />

            <View style={styles.inputView}>
                <Input editable={false} text="Data do Evento" onChangeText={() => { }} value={dataCompleta} />
                <Input text="Descrição do Evento" onChangeText={setDescription} value={description} />
            </View>
            <View style={styles.cadastrarView}>
                <Cadastrar onPress={addEvento} disabled={isDisabled} />
            </View>
        </Container>
    );
}

const styles = StyleSheet.create({
    calendar: {
        borderWidth: 0.5,
        borderBottomWidth: 0.8,
        backgroundColor: 'transparent',
        top: '16%',
        width: '100%'
    },
    inputView: {
        top: '12%',
        justifyContent: 'center',
        textAlign: 'center',
        alignItems: 'center',
    },
    cadastrarView: {
        justifyContent: 'center',
        textAlign: 'center',
        alignItems: 'center',
        top: '11%',
    },
    alignAll: {
        textAlign: 'center',
        alignItems: 'center',
    },
    header: {
        right: '41%',
        top: '5%',
    },
    monthHeader: {
        fontSize: 22,
        fontWeight: '700',
        textAlign: 'center',
        width: 200, // Define uma largura fixa para o cabeçalho do mês
    },
});
