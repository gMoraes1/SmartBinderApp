import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  Text,
  View,
  Image,
  SafeAreaView,
} from "react-native";
import styled, { useTheme } from "styled-components/native";
import { Ionicons } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native-gesture-handler";
import BackBtn from "../../../components/Buttons/BackBtn";
import Input from "../../../components/Input/Input";
import { useState } from "react";

const Container = styled.View`
  background-color: ${(props) => props.theme.background};
  width: 100%;
  height: 100%;
  justify-content: center;
  align-items: center;

`;

const Title = styled.Text`
  font-size: 32px;
  font-weight: 600;
  text-align: center;
  padding-top: 12%;
  color: ${(props) => props.theme.color};
  position:relative;
  bottom:20px;
`;

const TextProfile = styled.Text`
  color: ${(props) => props.theme.color};
  padding: 10px;
  width: 280px;
  margin-top: 2px;
  bottom: 45%;
`;

const ProfileView = styled.SafeAreaView`
  background-color: ${(props) => props.theme.backgroundProfile};
  width:90%;
  height:90vh;
  position: relative;
  border-radius: 20px;
  border: solid gray 0.5px;
  align-items: center;
  justify-content: center;
  text-align: center;
`;

const IconPencil = styled.TouchableOpacity`
  position: relative;
  bottom: 26%;
  left: 20%;
  background-color: ${(props) => props.theme.backgroundIconStyle};
  border-radius: 100px;
  padding: 12px;
`;

export default function EditProfile({ navigation }) {
  const theme = useTheme(); // Get the current theme
  const [username, setUsername] = useState("");
  const [cpf, setCpf] = useState("");
  const [date, setDate] = useState("");
  const [telefone, setTelefone] = useState("");
  const [email, setEmail] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isValidCpf, setIsValidCpf] = useState(true); // Estado para validar o CPF
  return (
    <Container>
      <View style={styles.header}>
        <BackBtn onPress={() => navigation.navigate("Profile")} />
      </View>
      <ProfileView>
        <Title>Perfil</Title>
        <View style={styles.imageBlock}>
          <Image
            style={styles.image}
            source={require("../../../../assets/Perfil.jpg")}
          />
          <IconPencil onPress={() => navigation.navigate("EditProfile")}>
            <Ionicons name="camera" size={26} color={theme.colorIconStyle} />
          </IconPencil>
        </View>

        <View style={styles.textBlock}>
          <View style={styles.alignInput}>
            <Input text="Nome" onChangeText={setUsername}/>
            <Input text="Data de Nascimento" onChangeText={setDate}/>
            <Input text="CPF" onChangeText={setCpf}/>
            <Input text="Número de celular" onChangeText={setTelefone}/>
          </View>
        </View>
      </ProfileView>
    </Container>
  );
}

const styles = StyleSheet.create({
  image: {
    width: 160,
    height: 160,
    borderRadius: 115, // Ensure it's a perfect circle
    justifyContent: "center",
  },

  alignInput: {
    bottom: '16%',
  },

  header: {
    right: '41%',
    bottom: '0.5%',
  },

  imageBlock: {
    alignItems: "center",
    justifyContent: "center",
    position:'relative',
    bottom:10,
  },

  textBlock: {
    justifyContent: "center",
    alignItems: "center",
  },
});
