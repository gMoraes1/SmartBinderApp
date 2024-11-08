import "react-native-gesture-handler";
import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  ImageBackground,
  TextInput,
  TouchableOpacity,
  Alert,
} from "react-native";
import { TextInputMask } from "react-native-masked-text"; // Importando o TextInputMask
import { Feather, Ionicons } from "@expo/vector-icons";
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
  const [isValidCpf, setIsValidCpf] = useState(true); // Estado para validar o CPF



  const formatUsername = (text) => {
    return text
      .toUpperCase() // Garante que todo o texto estará em minúsculas
  };

  const formatEmail = (text) => {
    return text
      .toLowerCase() // Garante que todo o texto estará em minúsculas
  };

  const firestore = getFirestore(); // Obtendo a instância do Firestore

  // Função para validar CPF
  const validateCpf = (cpf) => {
    // Remove tudo o que não for número
    const cleanedCpf = cpf.replace(/\D/g, '');

    // Verifica se o CPF tem 11 dígitos
    if (cleanedCpf.length !== 11) return false;

    // Verificação dos dois últimos dígitos
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
        telefone: telefone, // Você pode preencher o telefone se tiver esse dado
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
          
            onChangeText={(text) => setUsername(formatUsername(text))}

            placeholder="Nome de usuário"
            placeholderTextColor={"rgba(255,255,255,0.6)"}
          />

          {/* Aqui vamos usar o TextInputMask para formatar o CPF */}
          <TextInputMask
            type={'cpf'} // Aplica a máscara de CPF
            style={[styles.input, !isValidCpf && styles.invalidInput]} // Estilo para CPF inválido
            value={cpf}
            onChangeText={handleCpfChange}
            placeholder="CPF do usuário"
            placeholderTextColor={"rgba(255,255,255,0.6)"}
          />

          {/* Mensagem de erro para CPF inválido */}
          {!isValidCpf && <Feather style={styles.icon} name="x-circle" color={'#ff0000'} size={26} />}

          {/* Máscara de Data de Nascimento (corrigida) */}
          <TextInputMask
            type={'datetime'}
            options={{
              format: 'DD/MM/YYYY'
            }}
            style={styles.input}
            value={date}
            onChangeText={setDate}
            placeholder="Data de Nascimento"
            placeholderTextColor={"rgba(255,255,255,0.6)"}
          />

          <TextInputMask
            type={'cel-phone'}
            options={{
              maskType: 'BRL',
              withDDD: true,
              dddMask: '(99) '
            }}

            style={styles.input}
            value={telefone}
            onChangeText={setTelefone}
            placeholder="Número de Celular"
            placeholderTextColor={"rgba(255,255,255,0.6)"}

          />
          <TextInput
            style={styles.input}
            value={email}

            onChangeText={(text) => setEmail(formatEmail(text))}

            placeholder="E-mail"
            placeholderTextColor={"rgba(255,255,255,0.6)"}
          />
          <TextInput
            style={styles.input}
            value={confirmEmail}

            onChangeText={(text) => setConfirmEmail(formatEmail(text))}
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

  icon: {
    position: 'absolute',
    bottom: '78.3%',
    right: 20,
  },

  fundo: {
    width: "100%",
    height: "100%",
  },

  imagem: {
    bottom: '2%',
  },

  input: {
    fontSize: 18,
    margin: 8,
    padding: 9,
    color: "#fff",
    width: 290,
    backgroundColor: "rgba(0,0,0,0.2)",
  },

  invalidInput: {
    borderColor: 'red',
    borderWidth: 2,
  },

  inputView: {
    bottom: '8%',
    textAlign: "center",
    justifyContent: "center",
    alignItems: "center",
  },

  btnInicio: {
    textAlign: "center",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 20,
    width: 170,
    height: 50,
    bottom: '4%',
    backgroundColor: "#FFDE00",
    borderColor: "rgba(0,0,0,0.5)",
    borderBottomWidth: 2.2,
    borderRightWidth: 1,
    borderLeftWidth: 1,
  },

  txtBtn: {
    color: "#000",
    fontWeight: "800",
    textAlign: "center",
    justifyContent: "center",
    alignItems: "center",
    fontSize: 18,
  },

  errorText: {
    color: 'red',
    fontSize: 14,
    marginTop: 5,
  }
});
