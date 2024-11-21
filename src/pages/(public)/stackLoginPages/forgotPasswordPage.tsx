import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Alert,
  ImageBackground,
} from "react-native";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../../../../firebase"; // Certifique-se de ajustar o caminho do seu arquivo firebase

export default function ForgotPassPage({ navigation }: { navigation: any }) {
  const [email, setEmail] = useState("");

  const handlePasswordReset = async () => {
    if (!email) {
      Alert.alert("Erro", "Por favor, insira um email válido.");
      return;
    }

    try {
      await sendPasswordResetEmail(auth, email);
      Alert.alert(
        "Email Enviado",
        "Verifique sua caixa de entrada para redefinir sua senha.",
        [
          {
            text: "OK",
            onPress: () => navigation.navigate("Login"),
          },
        ],
        { cancelable: false }
      );
    } catch (error: any) {
      console.error("Erro ao enviar o email de redefinição:", error.code);

      let errorMessage;
      switch (error.code) {
        case "auth/user-not-found":
          errorMessage = "Usuário não encontrado. Verifique o email.";
          break;
        case "auth/invalid-email":
          errorMessage = "Email inválido. Verifique o formato.";
          break;
        default:
          errorMessage = "Ocorreu um erro. Tente novamente.";
      }

      Alert.alert("Erro", errorMessage);
    }
  };

  return (
    <ImageBackground
      style={styles.fundo}
      source={require("../../../../assets/inicio.png")}
    >
      <View style={styles.container}>
        <Text style={styles.title}>Recuperar Senha</Text>
        <TextInput
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          placeholder="Insira seu email"
          placeholderTextColor="rgba(255,255,255,0.6)"
        />
        <TouchableOpacity style={styles.btnEnviar} onPress={handlePasswordReset}>
          <Text style={styles.txtBtn}>Enviar</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate("Login")}>
          <Text style={styles.voltar}>Voltar ao Login</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  fundo: {
    width: "100%",
    height: "100%",
  },
  container: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 22,
    fontWeight: "800",
    color: "#fff",
    marginBottom: 20,
  },
  input: {
    fontSize: 18,
    margin: 10,
    padding: 10,
    color: "#fff",
    width: 290,
    backgroundColor: "rgba(0,0,0,0.2)",
  },
  btnEnviar: {
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 20,
    width: 170,
    height: 50,
    backgroundColor: "#FFDE00",
    borderColor: "rgba(0,0,0,0.5)",
    borderBottomWidth: 2.2,
    borderRightWidth: 1,
    borderLeftWidth: 1,
    marginTop: 20,
  },
  txtBtn: {
    color: "#000",
    fontWeight: "800",
    fontSize: 18,
  },
  voltar: {
    color: "skyblue",
    fontSize: 16,
    marginTop: 20,
  },
});
