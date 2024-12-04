import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, Image } from "react-native";
import styled, { useTheme } from "styled-components/native";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { db, auth } from "../../../../firebase"; // Importando o Firebase

const Container = styled.View`
  background-color: ${(props) => props.theme.background};
  width: 100%;
  height: 100%;
  align-items: center;
  justify-content:center;
  text-align:center;
`;

const Title = styled.Text`
  font-size: 32px;
  font-weight: 600;
  text-align: center;
  padding: 3%;
  padding-top:6%;
  color: ${(props) => props.theme.color};
`;

const TextProfile = styled.Text`
  color: ${(props) => props.theme.color};
  padding: 10px;
  width: 280px;
  margin-top: 2px;
  bottom: 45%;
`;

const ProfileView = styled.View`
  margin-bottom:12%;
  background-color: ${(props) => props.theme.backgroundProfile};
  width: 90%;
  height: 76%;
  border-radius: 20px;
  border: solid gray 0.5px;
`;

const IconPencil = styled.TouchableOpacity`
  position: relative;
  top: 74%;
  left: 38%;
  background-color: ${(props) => props.theme.backgroundIconStyle};
  border-radius: 100px;
  padding: 14px;
`;

export default function Profile({ navigation }) {
  const theme = useTheme(); // Get the current theme
  const [dadosPerfil, setDadosPerfil] = useState(null); // Initialize with null

  useEffect(() => {
    const unsubscribeAuth = auth.onAuthStateChanged((user) => {
      if (user) {
        // Busca os dados do perfil do Firestore usando o uid do usuário autenticado
        const userRef = doc(db, "tblProfessor", user.uid);
        const unsubscribe = onSnapshot(userRef, (docSnapshot) => {
          if (docSnapshot.exists()) {
            setDadosPerfil(docSnapshot.data()); // Carrega os dados do usuário no estado
          } else {
            setDadosPerfil(null); // Caso o perfil não exista no Firestore
          }
        });

        // Cleanup do listener de perfil
        return () => unsubscribe();
      } else {
        setDadosPerfil(null); // Caso o usuário não esteja logado
      }
    });

    // Cleanup do listener de autenticação
    return () => unsubscribeAuth();
  }, []); // Esse useEffect só executa uma vez após o componente ser montado

  const handleEditProfile = () => {
    if (dadosPerfil) {
      navigation.navigate("EditProfile", {
        nomeProfessor: dadosPerfil.nomeProfessor || "",
        cpf: dadosPerfil.cpf || "",
        nascimentoProfessor: dadosPerfil.nascimentoProfessor || "",
        telefone: dadosPerfil.telefone || "",
        imagemPerfil: dadosPerfil.imagemPerfil || "",
      });
    }
  };

  return (
    <Container>
      <StatusBar style="auto" />
      <ProfileView>
        <Title>Perfil</Title>
        <View style={styles.imageBlock}>
          {dadosPerfil && dadosPerfil.imagemPerfil ? (
            <Image
              style={styles.image}
              source={{ uri: `data:image/jpeg;base64,${dadosPerfil.imagemPerfil}` }} // A imagem em base64
            />
          ) : (
            <Image
              style={styles.image}
              source={require("../../../../assets/Perfil.jpg")} // Imagem padrão caso não tenha imagem no Firestore
            />
          )}

          <IconPencil onPress={handleEditProfile}>
            <Ionicons name="pencil" size={29} color={theme.colorIconStyle} />
          </IconPencil>
        </View>

        {dadosPerfil ? (
          <View style={styles.textBlock}>
            <TextProfile>Nome: {dadosPerfil.nomeProfessor}</TextProfile>
            <TextProfile>Data de Nascimento: {dadosPerfil.nascimentoProfessor}</TextProfile>
            <TextProfile>CPF: {dadosPerfil.cpf}</TextProfile>
            <TextProfile>Número de Celular: {dadosPerfil.telefone}</TextProfile>
          </View>
        ) : (
          <Text style={{ color: theme.color }}>Carregando...</Text>
        )}
      </ProfileView>
    </Container>
  );
}

const styles = StyleSheet.create({
  image: {
    width: 230,
    height: 230,
    borderRadius: 115, // Para garantir que seja um círculo perfeito
    justifyContent: "center",
  },

  imageBlock: {
    marginTop: 18,
    marginBottom: 18,
    alignItems: "center",
    justifyContent: "center",
  },

  textBlock: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: '7.5%',
  },
});
