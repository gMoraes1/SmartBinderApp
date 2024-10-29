import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  Text,
  View,
  Image,
} from "react-native";
import styled, { useTheme } from "styled-components/native";
import { Ionicons } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native-gesture-handler";

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
  width:90%;
  height:82%;
  position: relative;
  top:2%;
  border-radius: 20px;
  border: solid gray 0.5px;
  align-items: center;
  justify-content: center;
  text-align: center;
`;

const IconPencil = styled.TouchableOpacity`
  position: relative;
  top: 51%;
  left: 38%;
  background-color: ${(props) => props.theme.backgroundIconStyle};
  border-radius: 100px;
  padding: 14px;
`;

export default function Profile({navigation}) {
  const theme = useTheme(); // Get the current theme

  return (
    <Container>
      <ProfileView>
        <Title>Perfil</Title>
        <View style={styles.imageBlock}>
          <Image
            style={styles.image}
            source={require("../../assets/Perfil.jpg")}
          />
          <IconPencil  onPress={() => navigation.navigate("EditProfile")}>
            <Ionicons name="pencil" size={29} color={theme.colorIconStyle} /> 
          </IconPencil>
        </View>

        <View style={styles.textBlock}>
          <TextProfile>Nome</TextProfile>
          <TextProfile>Email</TextProfile>
          <TextProfile>Data de Nascimento</TextProfile>
        </View>
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
