import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, Alert, Image } from "react-native";
import styled, { useTheme } from "styled-components/native";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import Input from "../../../components/Input/Input";
import Btn from "../../../components/Buttons/Btn";
import { doc, onSnapshot, updateDoc } from "firebase/firestore";
import { db, auth } from "../../../../firebase";
import { Feather } from "@expo/vector-icons";
import BackBtn from "../../../components/Buttons/BackBtn";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";
import { Asset } from "expo-asset";

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
  bottom: 24%;
  left: 24%;
  background-color: ${(props) => props.theme.backgroundIconStyle};
  border-radius: 100px;
  padding: 12px;
`;

const defaultProfileImage = require("../../../../assets/Perfil.jpg");

export default function EditProfile({ navigation, route }) {
  const theme = useTheme();
  const [username, setUsername] = useState(route.params.nomeProfessor || "");
  const [cpf, setCpf] = useState(route.params.cpf || "");
  const [date, setDate] = useState(route.params.nascimentoProfessor || "");
  const [telefone, setTelefone] = useState(route.params.telefone || "");
  const [isValidCpf, setIsValidCpf] = useState(true);
  const [image, setImage] = useState<string | null>(null);
  const [dadosPerfil, setDadosPerfil] = useState(null);

  useEffect(() => {
    const unsubscribeAuth = auth.onAuthStateChanged((user) => {
      if (user) {
        const userRef = doc(db, "tblProfessor", user.uid);
        const unsubscribe = onSnapshot(userRef, (docSnapshot) => {
          if (docSnapshot.exists()) {
            const userData = docSnapshot.data();
            const profileImage = userData.imagemPerfil || defaultProfileImage;
            setImage(profileImage);
            setDadosPerfil(userData);
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
    try {
      const updatedData = {
        nomeProfessor: username,
        cpf: cpf,
        nascimentoProfessor: date,
        telefone: telefone,
        imagemPerfil: image || defaultProfileImage,
      };
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
            source={image ? { uri: image } : defaultProfileImage}
          />
          <IconPencil onPress={pickImage}>
            <Ionicons name="camera" size={26} color={theme.colorIconStyle} />
          </IconPencil>
        </View>
        <View style={styles.alignInput}>
          <Input
            text="Nome Completo"
            value={username}
            onChangeText={(text) => setUsername(formatUsername(text))}
            placeholder="Nome Completo"
          />
          <Input
            text="CPF"
            value={cpf}
            onChangeText={handleCpfChange}
            placeholder="000.000.000-00"
          />
          {!isValidCpf && (
            <Feather
              style={styles.errorIcon}
              name="x-circle"
              color="#ff0000"
              size={26}
            />
          )}
          <Input
            text="Data de Nascimento"
            value={date}
            onChangeText={handleDateChange}
            placeholder="DD/MM/AAAA"
          />
          <Input
            text="Número de Telefone"
            value={telefone}
            onChangeText={handlePhoneChange}
            placeholder="(00)00000-0000"
          />
          <Btn onPress={updateProfile} disabled={!isValidCpf} />
        </View>
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
  AlignAll: {
    position: "absolute",
  },
  alignInput: {
    bottom: "6%",
    justifyContent: "center",
    alignItems: "center",
  },
  imageBlock: {
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    bottom: "2%",
  },
  header: {
    position: "absolute",
    top: "5%",
    left: "4%",
  },
  errorIcon: {
    position: "absolute",
    right: "10%",
    top: "28.3%",
  },
});
