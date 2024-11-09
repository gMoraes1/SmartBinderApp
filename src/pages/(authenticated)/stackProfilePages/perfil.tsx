import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, Image } from "react-native";
import styled, { useTheme } from "styled-components/native";
import { Ionicons } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native-gesture-handler";
import { useEffect, useState } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { db, auth } from "../../../../firebase"; // Importando o Firebase

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
`;

const TextProfile = styled.Text`
  color: ${(props) => props.theme.color};
  padding: 10px;
  width: 280px;
  margin-top: 2px;
  bottom: 45%;
`;

const ProfileView = styled.View`
  background-color: ${(props) => props.theme.backgroundProfile};
  width: 90%;
  height: 82%;
  position: relative;
  top: 2%;
  border-radius: 20px;
  border: solid gray 0.5px;
  align-items: center;
  justify-content: center;
  text-align: center;
`;

const IconPencil = styled.TouchableOpacity`
  position: relative;
  top: 58%;
  left: 38%;
  background-color: ${(props) => props.theme.backgroundIconStyle};
  border-radius: 100px;
  padding: 14px;
`;

export default function Profile({ navigation }) {
  const theme = useTheme(); // Get the current theme
  const [dadosPerfil, setDadosPerfil] = useState(null); // Initialize with null

  useEffect(() => {
    // Escuta mudanças de autenticação
    const unsubscribeAuth = auth.onAuthStateChanged((user) => {
      if (user) {
        // Usuário autenticado, busca os dados do perfil
        const userRef = doc(db, "tblProfessor", user.uid); // Referência ao documento do professor no Firestore

        const unsubscribe = onSnapshot(userRef, (docSnapshot) => {
          if (docSnapshot.exists()) {
            setDadosPerfil(docSnapshot.data()); // Dados do perfil
          } else {
            setDadosPerfil(null); // Caso o perfil não exista
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
  }, []); // O array de dependências vazio significa que o effect só será executado uma vez (na montagem).

  return (
    <Container>
      <ProfileView>
        <Title>Perfil</Title>
        <View style={styles.imageBlock}>
          <Image
            style={styles.image}
            source={require("../../../../assets/Perfil.jpg")}
          />
          <IconPencil onPress={() => navigation.navigate("EditProfile")}>
            <Ionicons name="pencil" size={29} color={theme.colorIconStyle} />
          </IconPencil>
        </View>

        {dadosPerfil ? (
          <View style={styles.textBlock}>
            <TextProfile>Nome: {dadosPerfil.nome}</TextProfile>
            <TextProfile>Data de Nascimento: {dadosPerfil.dataNascimento}</TextProfile>
            <TextProfile>CPF: {dadosPerfil.cpf}</TextProfile>
            <TextProfile>Número de Celular: {dadosPerfil.numeroCelular}</TextProfile>
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
    borderRadius: 115, // Ensure it's a perfect circle
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
  },
});
