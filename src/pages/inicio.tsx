import "react-native-gesture-handler";
import { StyleSheet, Text, View, Image, ImageBackground, TouchableOpacity } from 'react-native';

export default function Inicio({ navigation }) {
    return (
        <ImageBackground style={styles.fundo} source={require('../../assets/inicio.png')}>
            <View style={styles.container}>
                <View style={styles.viewAlign}>
                    <Image source={require('../../assets/imagemInicio.png')} style={styles.imagem} />
                    <Text style={styles.title}>
                        Seja bem vindo(a) ao melhor 
                        aplicativo para professores.
                    </Text>
                    <TouchableOpacity 
                        style={styles.btnInicio} 
                        onPress={() => navigation.navigate('InicioRegister')}
                    >
                        <Text style={styles.txtBtn}>
                            Começar
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </ImageBackground>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
        height: '100%',
    },
    viewAlign: {
        top: '30%',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
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
    imagem: {},
    btnInicio: {
        textAlign: 'center',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 20,
        width: 170,
        height: 50,
        top: 58,
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
});
