import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Alert, FlatList, TextInput } from 'react-native';
import { Calendar, DateData, LocaleConfig } from 'react-native-calendars';
import { Feather } from "@expo/vector-icons";
import { ptBR } from '../../../utils/localecalendarConfig';
import styled, { useTheme } from 'styled-components/native';
import { db, auth } from '../../../../firebase';
import { deleteDoc, doc, collection, getDocs, addDoc } from 'firebase/firestore';
import BackBtn from '../../../components/Buttons/BackBtn';
import Input from '../../../components/Input/Input';
import Cadastrar from '../../../components/Buttons/Btn';

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
    const theme = useTheme();
    const [day, setDay] = useState<DateData>();
    const [description, setDescription] = useState("");

    const diaTratado = day?.day < 10 ? `0${day.day}` : day?.day;
    const mesTratado = day?.month < 10 ? `0${day.month}` : day?.month;
    const ano = day?.year;
    const dataCompleta = day ? `${diaTratado}/${mesTratado}/${ano}` : null;

    const isDisabled = !dataCompleta || !description; // Desativa o botão se algum campo estiver vazio

    // Função para salvar o evento no Firestore
    const handleAddEvento = async () => {
        try {
            //verificando se o usuario esta autenticado
            const user = auth.currentUser;
            if (!user) {
                console.error("usuario não autenticado!");
                Alert.alert("Erro", "Você precisa estar logado para criar um evento.")
                return;
            }
            //Referencia do usuario na coleção'users (referencia  ao documento do usuario)
            const userRef = doc(db, 'users', user.uid); //criação de referencia ao documentodo usuario
            // Obtendo a referência da coleção 'tblCalendario' para adicionar um novo evento
            const calendarCollectionRef = collection(db, 'tblCalendario');
            // Adicionando os dados do Calendario à coleção 'tblCalendario', associando o documento do usuário ao campo 'userRef'
            await addDoc(calendarCollectionRef, {
                dataCalendario: dataCompleta,
                descricaoCalendario: description,
                userRef: userRef,  // A referência ao documento do usuário
            });
            // Navegar de volta para O CALENDARIO de turmas, passando os dados dO EVENTO
            navigation.navigate("Calendars", {
                calendarData: {
                    descricaoCalendario: description,
                    dataCalendario: dataCompleta,
                },
            });
        } catch (error) {
            console.error("Erro ao adicionar um evento: ", error);
            Alert.alert("Erro", "Ocorreu um erro ao adicionar um evento. Tente novamente.");
        }
    };

    return (
        <Container contentContainerStyle={{ alignItems: 'center', height: '100%' }}>
            <StatusBar style="auto" />

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

            <View style={styles.alignView}>
                <View style={styles.inputView}>
                    <TextInput 
                    style={{
                      color:theme.color  
                    }} 
                    onChangeText={() => { }} value={dataCompleta} />
                    <Input text="Descrição do Evento" onChangeText={setDescription} value={description} />
                </View>
                <View style={styles.cadastrarView}>
                    <Cadastrar onPress={handleAddEvento} disabled={isDisabled} />
                </View>
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

    alignView: {
        position: 'absolute',
        bottom:'24%',
    },

    inputView: {
        justifyContent: 'center',
        textAlign: 'center',
        alignItems: 'center',
    },
    textInput: {
        fontSize: 20,
        color: '#000',
    },
    cadastrarView: {
        justifyContent: 'center',
        textAlign: 'center',
        alignItems: 'center',
        top: '11%',
        marginTop: '3%',
    },
    alignAll: {
        textAlign: 'center',
        alignItems: 'center',
    },
    header: {
        left: '4%',
        top: '5%',
        position:'absolute'
    },
    monthHeader: {
        fontSize: 22,
        fontWeight: '700',
        textAlign: 'center',
        width: 200, // Define uma largura fixa para o cabeçalho do mês
    },
});
