import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, Alert, Image } from "react-native";
import styled, { useTheme } from "styled-components/native";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import Input from "../../../components/Input/Input";
import Btn from "../../../components/Buttons/Btn";
import { doc, updateDoc } from "firebase/firestore";
import { db, auth } from "../../../../firebase"; // Importando o Firebase
import { TextInputMask } from "react-native-masked-text";
import { Feather } from "@expo/vector-icons"; // Importando o Feather para o ícone de erro

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
  position: relative;
  bottom: 10px;
`;

const ProfileView = styled.SafeAreaView`
  background-color: ${(props) => props.theme.backgroundProfile};
  width: 90%;
  height: 80%;
  padding: 22px;
  border-radius: 20px;
  border: solid gray 0.5px;
  position: relative;
  top: 10px;
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

export default function EditProfile({ navigation, route }) {
  const theme = useTheme();
  const [username, setUsername] = useState(route.params.nomeProfessor || "");
  const [cpf, setCpf] = useState(route.params.cpf || "");
  const [date, setDate] = useState(route.params.nascimentoProfessor || "");
  const [telefone, setTelefone] = useState(route.params.telefone || "");
  const [isValidCpf, setIsValidCpf] = useState(true); // Estado para validação do CPF

  // Função para validar o CPF
  const validateCpf = (cpf) => {
    const cleanedCpf = cpf.replace(/\D/g, ''); // Remove tudo o que não for número
    if (cleanedCpf.length !== 11) return false;

    let sum = 0;
    let remainder;

    // Validação do primeiro dígito verificador
    for (let i = 0; i < 9; i++) {
      sum += parseInt(cleanedCpf.charAt(i)) * (10 - i);
    }
    remainder = (sum * 10) % 11;
    if (remainder === 10 || remainder === 11) remainder = 0;
    if (remainder !== parseInt(cleanedCpf.charAt(9))) return false;

    sum = 0;
    // Validação do segundo dígito verificador
    for (let i = 0; i < 10; i++) {
      sum += parseInt(cleanedCpf.charAt(i)) * (11 - i);
    }
    remainder = (sum * 10) % 11;
    if (remainder === 10 || remainder === 11) remainder = 0;
    if (remainder !== parseInt(cleanedCpf.charAt(10))) return false;

    return true;
  };

  // Função para lidar com mudanças no CPF
  const handleCpfChange = (text) => {
    setCpf(text);
    const isValid = validateCpf(text); // Valida o CPF enquanto o usuário digita
    setIsValidCpf(isValid); // Atualiza o estado de validade do CPF
  };

  // Função para atualizar os dados no Firestore
  const updateProfile = async () => {
    const user = auth.currentUser;
    if (!user) {
      Alert.alert("Erro", "Usuário não autenticado.");
      return;
    }

    const userRef = doc(db, "tblProfessor", user.uid);

    try {
      // Atualiza os dados no Firestore
      await updateDoc(userRef, {
        nomeProfessor: username,
        cpf: cpf,
        nascimentoProfessor: date,
        telefone: telefone,
      });
      Alert.alert("Sucesso", "Perfil atualizado com sucesso!");
      navigation.navigate("Profile"); // Navega de volta para a página de perfil
    } catch (error) {
      console.error("Erro ao atualizar perfil:", error);
      Alert.alert("Erro", "Erro ao atualizar perfil. Tente novamente.");
    }
  };

  return (
    <Container>
      <Title>Editar Perfil</Title>

      <View style={styles.imageBlock}>
        <Image
          style={styles.image}
          source={require("../../../../assets/Perfil.jpg")}
        />
        <IconPencil onPress={() => console.log("Trocar imagem de perfil")}>
          <Ionicons name="camera" size={26} color={theme.colorIconStyle} />
        </IconPencil>
      </View>

      <View style={styles.alignInput}>
        {/* Campo de Nome */}
        <Input
          text="Nome"
          value={username}
          onChangeText={setUsername}
        />

        {/* Máscara de CPF */}
        <TextInputMask
          type={'cpf'}
          style={[styles.input, !isValidCpf && styles.invalidInput, {
            backgroundColor: theme.inputBackground || "#D2DFDA",  // Mesma cor de fundo de StyleInput
            color: theme.color || "#000",  // Mesma cor de texto
            height: 50,  // Mesma altura
            width: 255,
            margin: 8,  // Mesma margem
            marginBottom:-18,
            fontSize: 18,  // Mesma fonte
            paddingLeft: 20,  // Mesmo padding
            borderRadius: 10,  // Mesma borda arredondada
            elevation: 5,  // Mesma sombra
          }]} // Aplica o estilo de erro se o CPF for inválido
          value={cpf}
          onChangeText={handleCpfChange}
          placeholder="CPF"
          placeholderTextColor={"rgba(255,255,255,0.6)"}
        />
        {/* Ícone de erro para CPF inválido */}
        {!isValidCpf && (
          <Feather style={styles.errorIcon} name="x-circle" color={'#ff0000'} size={26} />
        )}

        {/* Máscara de Data de Nascimento */}
        <TextInputMask
          type={'datetime'}
          options={{ format: 'DD/MM/YYYY' }}
          style={[styles.input, {
            backgroundColor: theme.inputBackground || "#D2DFDA",  // Mesma cor de fundo de StyleInput
            color: theme.color || "#000",  // Mesma cor de texto
            height: 50,  // Mesma altura
            width: 255,
            margin: 8,  // Mesma margem
            fontSize: 18,  // Mesma fonte
            paddingLeft: 20,  // Mesmo padding
            borderRadius: 10,  // Mesma borda arredondada
            elevation: 5,  // Mesma sombra
          }]} // Aplica o estilo de erro se o CPF for inválido
          value={date}
          onChangeText={setDate}
          placeholder="Data de Nascimento"
          placeholderTextColor={"rgba(255,255,255,0.6)"}
        />

        {/* Máscara de Telefone */}
        <TextInputMask
          type={'cel-phone'}
          options={{ maskType: 'BRL', withDDD: true, dddMask: '(99) ' }}
          style={[styles.input, {
            backgroundColor: theme.inputBackground || "#D2DFDA",  // Mesma cor de fundo de StyleInput
            color: theme.color || "#000",  // Mesma cor de texto
            height: 50,  // Mesma altura
            width: 255,
            margin: 8,  // Mesma margem
            fontSize: 18,  // Mesma fonte
            paddingLeft: 20,  // Mesmo padding
            borderRadius: 10,  // Mesma borda arredondada
            elevation: 5,  // Mesma sombra
          }]} // Aplica o estilo de erro se o CPF for inválido
          value={telefone}
          onChangeText={setTelefone}
          placeholder="Número de Celular"
          placeholderTextColor={"rgba(255,255,255,0.6)"}
        />

        <Btn onPress={updateProfile} />
      </View>
    </Container>
  );
}

const styles = StyleSheet.create({
  image: {
    width: 180,
    height: 180,
    borderRadius: 115,
  },

  alignInput: {
    bottom: '3%',
  },

  imageBlock: {
    alignItems: "center",
    justifyContent: "center",
    position: 'relative',
    top: '2%',
  },

  textBlock: {
    justifyContent: "center",
    alignItems: "center",
  },

  input: {
    width: '100%',
    height: 50,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
    paddingLeft: 16,
    marginBottom: 12,
    fontSize: 16,
    position: 'relative',
  },


  invalidInput: {
    borderColor: '#ff0000', // Cor vermelha para borda de campo inválido
    borderWidth: 1,
  },

  errorIcon: {
    position: 'relative',
    left: '58%',
    bottom: '6%',
  },
});
