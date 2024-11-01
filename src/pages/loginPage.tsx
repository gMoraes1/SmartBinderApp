import "react-native-gesture-handler";
import { StyleSheet, Text, View, Image, ImageBackground, TouchableOpacity, TextInput } from 'react-native';
import { useState } from "react";


export default function Login({ navigation }) {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    return (
        <ImageBackground style={styles.fundo} source={require('../../assets/inicio.png')}>
            <View style={styles.container}>
                <Image source={require('../../assets/logoApp.png')} style={styles.imagem} />

                <View style={styles.inputView}>
                    <TextInput style={styles.input} value={username} onChangeText={setUsername} placeholder="Nome de usuário" placeholderTextColor={'rgba(255,255,255,0.6)'} />
                    <TextInput style={styles.input} value={email} onChangeText={setEmail} placeholder="E-mail" placeholderTextColor={'rgba(255,255,255,0.6)'} />
                    <TextInput style={styles.input} value={password} onChangeText={setPassword} secureTextEntry placeholder="Senha" placeholderTextColor={'rgba(255,255,255,0.6)'} />
                </View>

                <TouchableOpacity style={styles.btnInicio} onPress={() => navigation.navigate('Tabs')}>
                    <Text style={styles.txtBtn}>
                        Login
                    </Text>
                </TouchableOpacity>

            </View>
        </ImageBackground>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
        height: '100%',
        textAlign: 'center',
        justifyContent: 'center',
        alignItems: 'center',
        top:-50,
    },

    title: {
        fontSize: 20,
        width: 300,
        color: "#fff",
        fontWeight: "600",
        justifyContent: "center",
        textAlign: "center",
        paddingTop: 46,
    },
    fundo: {
        width: '100%',
        height: '100%',
    },

    btnInicio: {
        textAlign: 'center',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 20,
        width: 170,
        height: 50,
        top: 80,
        backgroundColor: '#FFDE00',
        borderColor: 'rgba(0,0,0,0.5)',
        borderBottomWidth: 2.2,
        borderRightWidth: 1,
        borderLeftWidth: 1,
    },

    txtBtn: {
        color: '#000',
        fontWeight: '800',
        fontSize: 18,
    },

    input: {
        fontSize: 18,
        margin: 10,
        padding: 10,
        color: '#fff',
        width: 290,
        backgroundColor: 'rgba(0,0,0,0.2)'
    },

    inputView: {
        top: 50,
        textAlign: 'center',
        justifyContent: 'center',
        alignItems: 'center',
    },
    imagem: {

    },
});
