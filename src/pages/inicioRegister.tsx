import "react-native-gesture-handler";
import { createStackNavigator } from "@react-navigation/stack";
import { StyleSheet, Text, View, ScrollView, Image, ImageBackground, ViewBase, TouchableOpacity, } from 'react-native';


export default function InicioRegister({ navigation }) {
    return (
        <ImageBackground style={styles.fundo} source={require('../../assets/inicio.png')}>
            <View style={styles.container}>

                <View style={styles.viewAlign}>
                    <Image source={require('../../assets/logoApp.png')} style={styles.imagem} />

                    <Text style={styles.title}>
                        Organize de forma inteligente.
                    </Text>


                    <TouchableOpacity style={styles.btnInicio} onPress={() => navigation.navigate('Login')}>
                        <Text style={styles.txtBtn}>
                            Login
                        </Text>
                    </TouchableOpacity>

                    <View style={styles.signView}>
                        <Text style={styles.txtSign}>Ainda não tem uma conta?</Text>
                        <TouchableOpacity style={styles.btnSign} onPress={() => navigation.navigate('Sign')}>
                            <Text style={styles.txtBtnSign}> Cadastrar-se</Text>
                        </TouchableOpacity>
                    </View>

                </View>

            </View>
        </ImageBackground>
    )
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

    imagem: {
    },

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

    txtSign:{
        color: '#fff',
        fontWeight: '800',
        fontSize: 18,

    },

    btnSign:{

    },

    txtBtnSign:{
        color: 'skyblue',
        fontWeight: '800',
        fontSize: 18,
    },

    signView:{
        borderTopColor:'black',
        borderTopWidth:0.6,
        width:'100%',
        justifyContent:'center',
        textAlign:'center',
        padding:20,
        top:'34%',
        display:'flex',
        flexDirection:'row',
    },


});
