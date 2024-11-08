import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Switch, useColorScheme } from 'react-native';
import { isEnabled } from 'react-native/Libraries/Performance/Systrace';
import styled from 'styled-components/native';

const Container = styled.View`
  background-color: ${(props) => props.theme.background};
  width: 100%;
  padding: 16px;
  height: 100%;
`;

const Title = styled.Text`
  font-size: 32px;
  width:100%;
  font-weight: 600;
  text-align: center;
  padding: 12%;
  color: ${(props) => props.theme.color};
`;

const Theme = styled.View`
flexDirection: row;
alignItems: center;
justifyContent: space-between;
width: 100%;
paddingHorizontal: 20px;
backgroundColor: ${(props) => props.theme.inputBackground};
borderRadius: 10px;
padding: 10px;
elevation: 2;
`;

const ThemeText = styled.Text`   
fontSize: 18px;
fontWeight: 500;
marginRight: 10px;
color: ${(props) => props.theme.color}
`;

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
    <Container>
      <Title>Configurações de Tema</Title>
      <Theme>
        <ThemeText>Modo: {themeText}</ThemeText>
        <Switch
          trackColor={{ false: '#767577', true: '#363636' }}
          thumbColor={isEnabled ? '#7343F3' : '#f4f3f4'}
          ios_backgroundColor="#3e3e3e"
          onValueChange={toggleSwitch}
          value={isEnabled}
        />
      </Theme>
    </Container>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: '5%',
    backgroundColor: '#f5f5f5', // Light background color
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
    elevation: 2, // For Android shadow
  },
  themeText: {
    fontSize: 18,
    fontWeight: '500',
    marginRight: 10,
  },
});

