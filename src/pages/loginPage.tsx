import "react-native-gesture-handler";
import { StyleSheet, Text, View, Image, ImageBackground, TouchableOpacity, TextInput } from 'react-native';
import { useState, useEffect } from "react";
import { auth } from "../../firebase"; // Certifique-se de importar auth corretamente
import { signInWithEmailAndPassword } from "firebase/auth"; // Importar a função

export default function Login({ navigation }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [initializing, setInitializing] = useState(true);
    const [user, setUser] = useState();

    function dados(user) {
        setUser(user);
        if (initializing) setInitializing(false);
    }

    function logar() {
        // Verifica se o email está no formato correto
        if (!email) {
            alert('Por favor, insira um email.');
            return;
        }
        if (!password) {
            alert('Por favor, insira uma senha.');
            return;
        }

        signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                const user = userCredential.user; // Obter o usuário logado
                if (user) {
                    navigation.navigate('Tabs', { email });
                }
            })
            .catch((error) => {
                console.log('Código de erro:', error.code); // Log do código de erro
                console.log('Mensagem de erro:', error.message); // Log da mensagem de erro

                let errorMessage;
                switch (error.code) {
                    case 'auth/wrong-password':
                        errorMessage = 'Senha inválida. Tente novamente.';
                        break;
                    case 'auth/user-not-found':
                        errorMessage = 'Email inválido. Usuário não encontrado.';
                        break;
                    case 'auth/invalid-email':
                        errorMessage = 'Email inválido. Verifique o formato.';
                        break;
                    default:
                        errorMessage = 'Ocorreu um erro Email ou senha invalidos. Tente novamente.';
                }
                
                alert(errorMessage); // Exibir a mensagem de erro específica
            });
    }

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(user => {
            dados(user);
        });
        return () => unsubscribe();
    }, []);

    return (
        <ImageBackground style={styles.fundo} source={require('../../assets/inicio.png')}>
            <View style={styles.container}>
                <Image source={require('../../assets/logoApp.png')} style={styles.imagem} />

                <View style={styles.inputView}>
                    <TextInput 
                        style={styles.input} 
                        value={email} 
                        onChangeText={text => setEmail(text)} 
                        placeholder="E-mail" 
                        placeholderTextColor={'rgba(255,255,255,0.6)'} 
                    />
                    <TextInput 
                        style={styles.input} 
                        value={password} 
                        onChangeText={text => setPassword(text)} 
                        secureTextEntry 
                        placeholder="Senha" 
                        placeholderTextColor={'rgba(255,255,255,0.6)'} 
                    />
                </View>

                <TouchableOpacity style={styles.btnInicio} onPress={logar}>
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
        justifyContent: 'center',
        alignItems: 'center',
        top: -50,
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
        backgroundColor: 'rgba(0,0,0,0.2)',
    },
    inputView: {
        top: 50,
        justifyContent: 'center',
        alignItems: 'center',
    },
    imagem: {
        // Adicione estilos para a imagem, se necessário
    },
});
