import "react-native-gesture-handler";
import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  ImageBackground,
  TouchableOpacity,
  Alert,
} from "react-native";
import { TextInput } from "react-native-gesture-handler";
import { Ionicons } from "@expo/vector-icons";
import { createUserWithEmailAndPassword } from "firebase/auth"; // Importando a função de Auth
import { auth } from '../../../../firebase'; // Importando a configuração do auth
import { getFirestore, doc, setDoc } from "firebase/firestore"; // Importando funções do Firestore
 
import * as SplashScreen from 'expo-splash-screen';
 
export default function Sign({ navigation }) {
  useEffect(() => {
    async function loadResourcesAndDataAsync() {
      try {
        await SplashScreen.preventAutoHideAsync();
      } catch (e) {
        console.warn(e);
      } finally {
        await SplashScreen.hideAsync();
      }
    }
 
    loadResourcesAndDataAsync();
  }, []);
 
  // Estados do formulário
  const [username, setUsername] = useState("");
  const [cpf, setCpf] = useState("");
  const [date, setDate] = useState("");
  const [telefone, setTelefone] = useState("");
  const [email, setEmail] = useState('');
  const [confirmEmail, setConfirmEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
 
  const firestore = getFirestore(); // Obtendo a instância do Firestore
 
  // Função de cadastro
  const handleSignUp = async () => {
    try {
      if (password === "" || confirmPassword === "" || email === "" || confirmEmail === "") {
        setErrorMessage('Preencha todos os campos');
        Alert.alert('Preencha todos os campos');
        return;
      }
 
      if (password !== confirmPassword) {
        setErrorMessage('As senhas não coincidem');
        Alert.alert('As senhas não coincidem');
        return;
      }
      if (email !== confirmEmail) {
        setErrorMessage('Os emails não coincidem');
        Alert.alert('Os emails não coincidem');
        return;
      }
 
      // Criando usuário no Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
 
      // Criando o perfil do usuário no Firestore
      const userDocRef = doc(firestore, 'tblProfessor', user.uid); // Referência para o documento
      await setDoc(userDocRef, {
        nomeProfessor: username,
        cpf: cpf,
        nascimentoProfessor: date,
        telefone:telefone, // Você pode preencher o telefone se tiver esse dado
      });
 
      Alert.alert('Cadastro realizado com sucesso', 'Usuário criado com sucesso', [
        {
          text: "OK",
          onPress: () => navigation.navigate("Login"), // Navega para a página de Login
        },
      ], { cancelable: false });
 
    } catch (error) {
      if (error.code === 'auth/email-already-in-use') {
        setErrorMessage('Este email já está cadastrado');
        Alert.alert('Este email já está cadastrado');
      } else if (error.code === 'auth/weak-password') {
        setErrorMessage('A senha deve conter pelo menos 6 caracteres');
        Alert.alert('A senha deve conter pelo menos 6 caracteres');
      } else if (error.code === 'auth/invalid-email') {
        setErrorMessage('Por favor, insira um email válido');
        Alert.alert('Por favor, insira um email válido');
      } else if (error.code === 'auth/missing-email') {
        setErrorMessage('Por favor, insira um email.');
        Alert.alert('Por favor, insira um email.');
      } else {
        setErrorMessage(error.message);
      }
      console.error('Erro ao fazer cadastro:', error.message);
    }
  };
 
  return (
<ImageBackground
      style={styles.fundo}
      source={require("../../../../assets/inicio.png")}
>
<View style={styles.container}>
<Image
          source={require("../../../../assets/logoApp.png")}
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
            value={cpf}
            onChangeText={setCpf}
            placeholder="CPF do usuário"
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
            value={telefone}
            onChangeText={setTelefone}
            placeholder="Telefone"
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
            value={confirmEmail}
            onChangeText={setConfirmEmail}
            placeholder="Confirme seu E-mail"
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
<TextInput
            style={styles.input}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
            placeholder="Confirme sua Senha"
            placeholderTextColor={"rgba(255,255,255,0.6)"}
          />
</View>
 
        <TouchableOpacity
          style={styles.btnInicio}
          onPress={handleSignUp}
>
<Text style={styles.txtBtn}>Cadastrar</Text>
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
    top: 20,
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
    bottom: 20,
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