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
import BackBtn from "../../../components/Buttons/BackBtn";
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system'; // Para converter a imagem em base64

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
  bottom: 50px;
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
  const [image, setImage] = useState<string | null>(null);

  const formatUsername = (text) => {
    return text.toUpperCase(); // Garante que o nome seja em maiúsculas
  };

  // Função para escolher a imagem e convertê-la para base64
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      const imageUri = result.assets[0].uri;
      setImage(imageUri); // Armazena a URI da imagem selecionada

      try {
        // Converte a imagem para base64
        const base64Image = await FileSystem.readAsStringAsync(imageUri, {
          encoding: FileSystem.EncodingType.Base64,
        });
        setImage(base64Image); // Atualiza a imagem com o conteúdo base64
      } catch (error) {
        console.error("Erro ao converter imagem para base64: ", error);
        Alert.alert("Erro", "Ocorreu um erro ao converter a imagem.");
      }
    }
  };

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

  const handleCpfChange = (text) => {
    setCpf(text);
    const isValid = validateCpf(text);
    setIsValidCpf(isValid);
  };

  // Função para atualizar o perfil
  const updateProfile = async () => {
    const user = auth.currentUser;
    if (!user) {
      Alert.alert("Erro", "Usuário não autenticado.");
      return;
    }

    const userRef = doc(db, "tblProfessor", user.uid);

    try {
      // Se a imagem foi escolhida, vamos atualizar a URL da imagem no Firestore
      const imageUrl = image || null;

      // Atualiza os dados no Firestore
      await updateDoc(userRef, {
        nomeProfessor: username,
        cpf: cpf,
        nascimentoProfessor: date,
        telefone: telefone,
        imagemPerfil: imageUrl, // Salva a imagem base64 no Firestore
      });

      Alert.alert("Sucesso", "Perfil atualizado com sucesso!");
      navigation.navigate("Profile");
    } catch (error) {
      console.error("Erro ao atualizar perfil:", error);
      Alert.alert("Erro", "Erro ao atualizar perfil. Tente novamente.");
    }
  };

  return (
    <Container>
      <View style={styles.header}>
        <BackBtn onPress={() => navigation.navigate("Profile")} />
      </View>
      <Title>Editar Perfil</Title>
      <View style={styles.imageBlock}>
        {image ? (
          <Image style={styles.image} source={{ uri: `data:image/jpeg;base64,${image}` }} />
        ) : (
          <Image style={styles.image} source={require("../../../../assets/Perfil.jpg")} />
        )}
        <IconPencil onPress={pickImage}>
          <Ionicons name="camera" size={26} color={theme.colorIconStyle} />
        </IconPencil>
      </View>

      <View style={styles.alignInput}>
        <Input
          text="Nome"
          value={username}
          onChangeText={(text) => setUsername(formatUsername(text))}
        />
        <TextInputMask
          type={'cpf'}
          style={[!isValidCpf && styles.invalidInput, {
            backgroundColor: theme.inputBackground || "#D2DFDA",
            color: theme.color || "#000",
            height: 50,
            width: 255,
            margin: 8,
            fontSize: 18,
            paddingLeft: 20,
            borderRadius: 10,
            elevation: 5,
          }]}
          value={cpf}
          onChangeText={handleCpfChange}
          placeholder="CPF"
          placeholderTextColor={"rgba(255,255,255,0.6)"}
        />
        {!isValidCpf && (
          <Feather style={styles.errorIcon} name="x-circle" color={'#ff0000'} size={26} />
        )}
        <TextInputMask
          type={'datetime'}
          options={{ format: 'DD/MM/YYYY' }}
          style={[{
            backgroundColor: theme.inputBackground || "#D2DFDA",
            color: theme.color || "#000",
            height: 50,
            width: 255,
            margin: 8,
            fontSize: 18,
            paddingLeft: 20,
            borderRadius: 10,
            elevation: 5,
          }]}
          value={date}
          onChangeText={setDate}
          placeholder="Data de Nascimento"
          placeholderTextColor={"rgba(255,255,255,0.6)"}
        />
        <TextInputMask
          type={'cel-phone'}
          options={{ maskType: 'BRL', withDDD: true, dddMask: '(99) ' }}
          style={[{
            backgroundColor: theme.inputBackground || "#D2DFDA",
            color: theme.color || "#000",
            height: 50,
            width: 255,
            margin: 8,
            marginBottom: '10%',
            fontSize: 18,
            paddingLeft: 20,
            borderRadius: 10,
            elevation: 5,
          }]}
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
    bottom: '6%',
    justifyContent: "center",
    alignItems: "center",
  },
  imageBlock: {
    alignItems: "center",
    justifyContent: "center",
    position: 'relative',
    bottom: '2%',
  },
  header: {
    right: '41%',
    top: '4.7%',
  },
  invalidInput: {
    borderColor: '#ff0000',
    borderWidth: 1,
  },
  errorIcon: {
    position: 'absolute',
    left: '58%',
    top: '25.3%',
  },
  inputStyle: {
    backgroundColor: "#D2DFDA",
    color: "#000",
    height: 50,
    width: 255,
    margin: 8,
    marginBottom: '10%',
    fontSize: 18,
    paddingLeft: 20,
    borderRadius: 10,
    elevation: 5,
  },
});
