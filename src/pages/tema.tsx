import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Switch, useColorScheme } from 'react-native';

export default function ThemeSettings() {
  const [isEnabled, setIsEnabled] = useState(false);
  const [themeText, setThemeText] = useState('');
  const deviceTheme = useColorScheme(); // Get the device theme

  // Set the initial state based on device theme
  useEffect(() => {
    if (deviceTheme === "dark") {
      setIsEnabled(true);
      setThemeText('Escuro');
    } else {
      setIsEnabled(false);
      setThemeText('Claro');
    }
  }, [deviceTheme]); // Depend on deviceTheme

  const toggleSwitch = () => {
    setIsEnabled(previousState => !previousState);
    setThemeText(previousState => previousState === 'Claro' ? 'Escuro' : 'Claro');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Configurações de Tema</Text>
      <View style={styles.switchContainer}>
        <Text style={styles.themeText}>Modo: {themeText}</Text>
        <Switch
          trackColor={{ false: '#767577', true: '#363636' }}
          thumbColor={isEnabled ? '#7343F3' : '#f4f3f4'}
          ios_backgroundColor="#3e3e3e"
          onValueChange={toggleSwitch}
          value={isEnabled}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: '5%',
    backgroundColor: '#f5f5f5', // Light background color
  },
  title: {
    fontSize: 32,
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 30,
    top:'10%',
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 20,
    backgroundColor: '#fff', // White background for the switch area
    borderRadius: 10,
    padding: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2, // For Android shadow
  },
  themeText: {
    fontSize: 18,
    fontWeight: '500',
    marginRight: 10,
  },
});
