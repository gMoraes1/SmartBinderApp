import "react-native-gesture-handler";
import { createStackNavigator } from "@react-navigation/stack";
import { ActivityIndicator, StyleSheet, Text, View, ScrollView, Image, ImageBackground, ViewBase, TouchableOpacityProps, TouchableOpacity, } from 'react-native';
import { useNavigation } from "@react-navigation/native";
import * as WebBrowser from 'expo-web-browser';
import { ButtonGoogle } from "../../components/buttonGoogle";
import { ButtonFacebook } from "../../components/buttonFacebook";
import { useEffect, useState } from "react";
import { useOAuth } from "@clerk/clerk-expo";
import { useSignIn } from "@clerk/clerk-expo";
import { ClerkProvider } from "@clerk/clerk-expo";
import * as Linking from 'expo-linking';


interface touchableOpacityProps extends TouchableOpacityProps {
    isLoad?: boolean
    title: string
}

WebBrowser.maybeCompleteAuthSession()


export default function InicioRegister() {
    const signIn = useSignIn()
    const [isLoading, setIsLoading] = useState(false)
    const googleOAuth = useOAuth({ strategy: 'oauth_google' })
    const facebookOAuth = useOAuth({ strategy: 'oauth_facebook' })
    async function onGoogleSignIn() {
        try {
            setIsLoading(true)


            const redirectUrl = Linking.createURL('/');
            const oAuthFlow = await googleOAuth.startOAuthFlow({ redirectUrl });  

            if(oAuthFlow.authSessionResult?.type === 'success'){
                if (oAuthFlow.setActive) {
                    await oAuthFlow.setActive({session: oAuthFlow.createdSessionId})
                }
            }

        } catch (error) {
            console.log(error)
            setIsLoading(false)
        }
    }

    async function onFacebookSignIn() {
        try {
            setIsLoading(true)

            const redirectUrl = Liking.createURL("/")
            const oAuthFlow = await facebookOAuth.startOAuthFlow({redirectUrl})
            if(oAuthFlow.authSessionResult?.type === 'success'){
                if (oAuthFlow.setActive) {
                    await oAuthFlow.setActive({session: oAuthFlow.createdSessionId})
                }
            }
        } catch (error) {
            console.log(error)
            setIsLoading(false)
        }
    }


    useEffect(() => {
        WebBrowser.warmUpAsync()

        return () => {
            WebBrowser.coolDownAsync
        }


    }, [])


    return (
        <ImageBackground style={styles.fundo} source={require('../../../assets/inicio.png')}>
            <View style={styles.container}>

                <View style={styles.viewAlign}>
                    <Image source={require('../../../assets/logoApp.png')} style={styles.imagem} />

                    <Text style={styles.title}>
                        Organize de forma inteligente.
                    </Text>

                    <ButtonGoogle icon="logo-google" title="Entrar com Google" isLoad={isLoading} onPress={onGoogleSignIn} />
                    <ButtonFacebook icon="logo-facebook" title="Entrar com Facebook" isLoad={isLoading} onPress={onFacebookSignIn} />
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

});
