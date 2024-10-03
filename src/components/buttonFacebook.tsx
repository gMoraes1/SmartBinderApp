import { TouchableOpacity, ActivityIndicator, Text, View, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export function ButtonFacebook({ title, isLoad = false, icon, ...rest }) {
    return (
        <TouchableOpacity style={styles.btnInicio} disabled={isLoad} activeOpacity={0.8} {...rest}>
            {isLoad ? (
                <ActivityIndicator color={'#000'} />
            ) : (
                <View style={styles.session}>
                    <Ionicons style={styles.icon} name={icon} />
                    <Text style={styles.txtBtn}>{title}</Text>
                </View>
            )}
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    icon: {
        fontSize: 22,
    },
    session: {
        display: 'flex',
        flexDirection: 'row',
    },
    btnInicio: {
        textAlign: 'center',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 20,
        width: 230,
        height: 50,
        top: 60,
        backgroundColor: '#2050b3',
        borderColor: 'rgba(0,0,0,0.5)',
        borderBottomWidth: 2.2,
        borderRightWidth: 1,
        borderLeftWidth: 1,
    },
    txtBtn: {
        color: '#fff',
        fontWeight: '800',
        fontSize: 18,
    },
});
