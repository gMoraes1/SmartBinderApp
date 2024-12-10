import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, Alert, Image } from "react-native";
import styled, { useTheme } from "styled-components/native";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import Input from "../../../components/Input/Input";
import Btn from "../../../components/Buttons/Btn";
import { doc, onSnapshot, updateDoc } from "firebase/firestore";
import { db, auth } from "../../../../firebase";
import BackBtn from "../../../components/Buttons/BackBtn";
import * as ImagePicker from "expo-image-picker";
import { Feather } from "@expo/vector-icons"; // Importando o Feather para o ícone de erro

const Container = styled.View`
  background-color: ${(props) => props.theme.background};
  width: 100%;
  height: 100%;
  align-items: center;
  justify-content: center;
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

const IconPencil = styled.TouchableOpacity`
  position: relative;
  bottom: 24%;
  left: 24%;
  background-color: ${(props) => props.theme.backgroundIconStyle};
  border-radius: 100px;
  padding: 12px;
`;

export default function EditProfile({ navigation, route }) {
  const theme = useTheme();
  const [username, setUsername] = useState("");  
  const [cpf, setCpf] = useState("");  
  const [date, setDate] = useState("");  
  const [telefone, setTelefone] = useState("");  
  const [image, setImage] = useState<string | null>(null);
  const [isValidCpf, setIsValidCpf] = useState(true);

  const [dadosPerfil, setDadosPerfil] = useState(null);

  // Carregar dados do Firebase e inicializar os estados
  useEffect(() => {
    const unsubscribeAuth = auth.onAuthStateChanged((user) => {
      if (user) {
        const userRef = doc(db, "tblProfessor", user.uid);
        const unsubscribe = onSnapshot(userRef, (docSnapshot) => {
          if (docSnapshot.exists()) {
            const userData = docSnapshot.data();
            setDadosPerfil(userData); // Armazena os dados completos
            // Inicializa o estado com os dados do Firebase apenas uma vez
            if (!username && !cpf && !date && !telefone) {
              setUsername(userData.nomeProfessor || "");
              setCpf(userData.cpf || "");
              setDate(userData.nascimentoProfessor || "");
              setTelefone(userData.telefone || "");
              setImage(userData.imagemPerfil || "../../../../assets/Perfil.jpg");
            }
          } else {
            setDadosPerfil(null);
          }
        });
        return () => unsubscribe();
      } else {
        setDadosPerfil(null);
      }
    });
    return () => unsubscribeAuth();
  }, []);

  const formatUsername = (text) => {
    const names = text.split(" ");
    return names
      .map((name, index) =>
        index === 0
          ? name.charAt(0).toUpperCase() + name.slice(1).toLowerCase()
          : name
      )
      .join(" ");
  };

  // Função para validar o CPF
  const validateCpf = (cpf) => {
    const cleaned = cpf.replace(/\D/g, "");
    let sum = 0,
      remainder;

    for (let i = 0; i < 9; i++) sum += parseInt(cleaned.charAt(i)) * (10 - i);
    remainder = (sum * 10) % 11;
    if (remainder === 10 || remainder === 11) remainder = 0;
    if (remainder !== parseInt(cleaned.charAt(9))) return false;

    sum = 0;
    for (let i = 0; i < 10; i++) sum += parseInt(cleaned.charAt(i)) * (11 - i);
    remainder = (sum * 10) % 11;
    if (remainder === 10 || remainder === 11) remainder = 0;
    if (remainder !== parseInt(cleaned.charAt(10))) return false;

    return true;
  };

  const handleCpfChange = (text) => {
    let cleaned = text.replace(/\D/g, "");
    if (cleaned.length > 11) cleaned = cleaned.slice(0, 11);
    setCpf(cleaned.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4"));

    if (cleaned.length === 11) {
      setIsValidCpf(validateCpf(cleaned));
    } else {
      setIsValidCpf(false);
    }
  };

  const handleDateChange = (text) => {
    let cleaned = text.replace(/\D/g, "");
    if (cleaned.length > 8) cleaned = cleaned.slice(0, 8);
    setDate(cleaned.replace(/(\d{2})(\d{2})(\d{4})/, "$1/$2/$3"));
  };

  const handlePhoneChange = (text) => {
    let cleaned = text.replace(/\D/g, "");
    if (cleaned.length > 11) cleaned = cleaned.slice(0, 11);
    setTelefone(
      cleaned.replace(/(\d{2})(\d{5})(\d{4})/, "($1)$2-$3")
    );
  };

  const pickImage = async () => {
    Alert.alert("Escolher imagem", "Escolha uma opção", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Galeria",
        onPress: async () => {
          let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 0.6,
          });
          if (!result.canceled) setImage(result.assets[0].uri);
        },
      },
      {
        text: "Câmera",
        onPress: async () => {
          let result = await ImagePicker.launchCameraAsync({
            allowsEditing: true,
            aspect: [4, 3],
            quality: 0.6,
          });
          if (!result.canceled) setImage(result.assets[0].uri);
        },
      },
    ]);
  };

  const updateProfile = async () => {
    const user = auth.currentUser;
    if (!user) {
      Alert.alert("Erro", "Usuário não autenticado.");
      return;
    }

    const userRef = doc(db, "tblProfessor", user.uid);

    // Preenche os dados atualizados
    const updatedData = {
      nomeProfessor: username.trim(),
      cpf: cpf.trim(),
      nascimentoProfessor: date.trim(),
      telefone: telefone.trim(),
      imagemPerfil: image || dadosPerfil?.imagemPerfil || "../../../../assets/Perfil.jpg",
    };

    // Verificar se os campos obrigatórios estão preenchidos
    if (!updatedData.nomeProfessor || !updatedData.cpf || !updatedData.nascimentoProfessor || !updatedData.telefone) {
      Alert.alert("Erro", "Preencha todos os campos!");
      return;
    }

    try {
      await updateDoc(userRef, updatedData);
      Alert.alert("Sucesso", "Perfil atualizado com sucesso!");
      navigation.navigate("Profile");
    } catch (error) {
      console.error("Erro ao atualizar perfil: ", error);
      Alert.alert("Erro", "Ocorreu um erro ao atualizar seu perfil.");
    }
  };

  return (
    <Container>
      <StatusBar style="auto" />
      <View style={styles.header}>
        <BackBtn onPress={() => navigation.navigate("Profile")} />
      </View>
      <View style={styles.AlignAll}>
        <Title>Editar Perfil</Title>
        <View style={styles.imageBlock}>
          <Image
            style={styles.image}
            source={image ? { uri: image } : require("../../../../assets/Perfil.jpg")}
          />
          <IconPencil onPress={pickImage}>
            <Ionicons name="camera" size={26} color={theme.colorIconStyle} />
          </IconPencil>
        </View>
        <View style={styles.alignInput}>
          <Input
            text="Nome Completo"
            value={username} // Utilizando o valor diretamente do estado
            onChangeText={(text) => setUsername(formatUsername(text))}
            placeholder="Nome Completo"
          />
          <View style={styles.inputWrapper}>
            <Input
              text="CPF"
              value={cpf} // Utilizando o valor diretamente do estado
              onChangeText={handleCpfChange}
              placeholder="000.000.000-00"
            />
            {!isValidCpf && (
              <Feather style={styles.errorIcon} name="x-circle" color={'#ff0000'} size={26} />
            )}
          </View>
          <Input
            text="Data de Nascimento"
            value={date} // Utilizando o valor diretamente do estado
            onChangeText={handleDateChange}
            placeholder="DD/MM/YYYY"
          />
          <Input
            text="Telefone"
            value={telefone} // Utilizando o valor diretamente do estado
            onChangeText={handlePhoneChange}
            placeholder="(00) 00000-0000"
          />
        </View>
        <Btn text="Atualizar" onPress={updateProfile} />
      </View>
    </Container>
  );
}

const styles = StyleSheet.create({
  header: {
    position: "absolute",
    top: 40,
    left: 10,
    zIndex: 1,
  },
  imageBlock: {
    alignItems: "center",
  },
  image: {
    width: 180,
    height: 180,
    borderRadius: 100,
  },
  AlignAll: {
    alignItems: "center",
    bottom:'4%'
  },
  alignInput: {
    bottom:'4%'
  },
  inputWrapper: {
    position:'relative'
  },
  errorIcon: {
    position:'absolute',
    top:'34%',
    right:'9%',
    zIndex:30,

  },
});
