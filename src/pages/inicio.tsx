import "react-native-gesture-handler";
import { createStackNavigator } from "@react-navigation/stack";
import { StyleSheet, Text, View, ScrollView, Image } from 'react-native';

export default function Inicio() {
    return (
        <View style={styles.container}>
            <View style={styles.circulosView}>
                <View style={styles.circulo3}></View>

                <View style={styles.circulo2}></View>

                <View style={styles.circulo1}></View>
            </View>
        </View>
    )
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
        height: '100%',
    },

    title: {
        fontSize: 32,
        fontWeight: "600",
        justifyContent: "center",
        textAlign: "center",
        paddingTop: 18,
    },

    circulo1: {
        backgroundColor: '#2E1966',
    },

    circulo2: {
        backgroundColor: '#946CFF',
    },

    circulo3: {
        backgroundColor: '#6939E9',
    },

    circulosView: {
        display: 'flex',
        flexDirection: 'column',
    },
});
