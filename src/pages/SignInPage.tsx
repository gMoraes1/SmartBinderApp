import "react-native-gesture-handler";
import {
  StyleSheet,
  Text,
  View,
  Image,
  ImageBackground,
  TouchableOpacity,
} from "react-native";
import { TextInput } from "react-native-gesture-handler";
import { useState } from "react";
import { Feather, Ionicons } from "@expo/vector-icons";

export default function Sign({ navigation }) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [date, setDate] = useState("");
  return (
    <ImageBackground
      style={styles.fundo}
      source={require("../../assets/inicio.png")}
    >
      <View style={styles.container}>
        <Image
          source={require("../../assets/logoApp.png")}
          style={styles.imagem}
        />

        <View style={styles.inputView}>
          <TextInput
            style={styles.input}
            value={username}
            onChangeText={setUsername}
            placeholder="Nome de usuário"
            placeholderTextColor={"rgba(255,255,255,0.6)"}
          />
          <TextInput
            style={styles.input}
            value={date}
            onChangeText={setDate}
            placeholder="Data de Nascimento"
            placeholderTextColor={"rgba(255,255,255,0.6)"}
          />
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            placeholder="E-mail"
            placeholderTextColor={"rgba(255,255,255,0.6)"}
          />
          <TextInput
            style={styles.input}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            placeholder="Senha"
            placeholderTextColor={"rgba(255,255,255,0.6)"}
          />
        </View>

        <TouchableOpacity
          style={styles.btnInicio}
          onPress={() => navigation.navigate("Tabs")}
        >
          <Text style={styles.txtBtn}>Login</Text>
        </TouchableOpacity>

        <View style={styles.logoAlignView}>
          <TouchableOpacity>
            <Ionicons
              name="logo-google"
              size={40}
              backgroundColor={"#fff"}
              marginRight={30}
              padding={3}
              color={"#000"}
            />
          </TouchableOpacity>
          <TouchableOpacity>
            <Ionicons
              name="logo-facebook"
              size={40}
              color={"#fff"}
              marginLeft={30}
              padding={3}
              backgroundColor={"#3b5998"}
            />
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: "100%",
    textAlign: "center",
    justifyContent: "center",
    alignItems: "center",
  },

  logoAlignView: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    top: 50,
  },

  viewAlign: {
    top: "30%",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 20,
    width: 300,
    color: "#fff",
    fontWeight: "600",
    justifyContent: "center",
    textAlign: "center",
    paddingTop: 46,
  },
  fundo: {
    width: "100%",
    height: "100%",
  },

  imagem: {},

  btnInicio: {
    textAlign: "center",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 20,
    width: 170,
    height: 50,
    top: 10,
    backgroundColor: "#FFDE00",
    borderColor: "rgba(0,0,0,0.5)",
    borderBottomWidth: 2.2,
    borderRightWidth: 1,
    borderLeftWidth: 1,
  },

  input: {
    fontSize: 18,
    margin: 10,
    padding: 10,
    color: "#fff",
    width: 290,
    backgroundColor: "rgba(0,0,0,0.2)",
  },

  inputView: {
    bottom:20,
    textAlign: "center",
    justifyContent: "center",
    alignItems: "center",
  },

  txtBtn: {
    color: "#000",
    fontWeight: "800",
    textAlign: "center",
    justifyContent: "center",
    alignItems: "center",
    fontSize: 18,
  },
});
