import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, Image, Switch } from 'react-native';

export default function ThemeSettings(){
  const toggleSwitch = () => setIsEnabled(previousState => !previousState);
  const [isEnabled, setIsEnabled] = useState(false);
  return (
    <View>
      <Text style={styles.title}>Configurações de Tema {isEnabled}</Text>
      <Switch
        trackColor={{false: '#767577', true: '#363636'}}
        thumbColor={isEnabled ? '#7343F3' : '#f4f3f4'}
        ios_backgroundColor="#3e3e3e"
        onValueChange={toggleSwitch}
        value={isEnabled}
      />
    </View>

  );
};


const styles = StyleSheet.create({
  container: {

  },

  title:{
    fontSize:32,
    fontWeight:"600",
    justifyContent:"center",
    textAlign:"center",
    paddingTop:"12%",
  },
});
