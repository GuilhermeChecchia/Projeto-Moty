import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ImageBackground
} from 'react-native';

import { auth, db } from '../firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';

const COLORS = {
  primary: '#7B61FF',
  light: '#E5D9FA',
  cream: '#FFF8E7',
  white: '#FFFFFF',
  text: '#3B3B3B'
};

const RegisterScreen = ({ navigation }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignUp = async () => {
    if (!name || !email || !password || !confirmPassword) {
      Alert.alert("Erro", "Preencha todos os campos.");
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert("Erro", "As senhas não coincidem.");
      return;
    }
    if (password.length < 6) {
      Alert.alert("Erro", "A senha deve ter pelo menos 6 caracteres.");
      return;
    }

    setLoading(true);
    try {
      // 🔹 Cria o usuário na autenticação
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // 🔹 Cria o documento na coleção "usuarios" com o mesmo ID do auth
      await setDoc(doc(db, "usuarios", user.uid), {
        id: user.uid,
        nome: name,
        email: email,
        criadoEm: serverTimestamp(), // 🔹 timestamp oficial do Firestore
      });

      Alert.alert("Sucesso", "Cadastro realizado! Bem-vindo(a).");
      navigation.replace('Home'); // 🔹 navega pra tela principal
    } catch (error) {
      let errorMessage = "Erro ao cadastrar. Tente novamente.";
      switch (error.code) {
        case 'auth/email-already-in-use':
          errorMessage = "Este e-mail já está em uso.";
          break;
        case 'auth/invalid-email':
          errorMessage = "Formato de e-mail inválido.";
          break;
        case 'auth/weak-password':
          errorMessage = "A senha é muito fraca.";
          break;
        default:
          console.error("Erro de Cadastro:", error);
      }
      Alert.alert("Erro de Cadastro", errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ImageBackground
      source={{
        uri: 'https://images.pexels.com/photos/220455/pexels-photo-220455.jpeg?cs=srgb&dl=pexels-pixabay-220455.jpg&fm=jpg'
      }}
      style={styles.background}
      resizeMode="cover"
    >
      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView
          style={styles.container}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          <View style={styles.logoWrapper}>
            <Text style={styles.logoText}>moty.</Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.title}>Crie sua conta</Text>
            <Text style={styles.subtitle}>Preencha os campos abaixo:</Text>

            <TextInput
              style={styles.input}
              placeholder="Nome completo"
              placeholderTextColor="#A99BEA"
              value={name}
              onChangeText={setName}
              autoCapitalize="words"
            />

            <TextInput
              style={styles.input}
              placeholder="E-mail escolar"
              placeholderTextColor="#A99BEA"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />

            <TextInput
              style={styles.input}
              placeholder="Senha"
              placeholderTextColor="#A99BEA"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />

            <TextInput
              style={styles.input}
              placeholder="Confirmar senha"
              placeholderTextColor="#A99BEA"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
            />

            <TouchableOpacity
              style={[styles.button, loading && styles.buttonDisabled]}
              onPress={handleSignUp}
              activeOpacity={0.85}
              disabled={loading}
            >
              <Text style={styles.buttonText}>
                {loading ? 'Cadastrando...' : 'Cadastrar'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <Text style={styles.loginText}>
                Já tem conta? <Text style={styles.loginLink}>Fazer Login</Text>
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}></Text>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: { flex: 1 },
  safeArea: { flex: 1 },
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  logoWrapper: {
    alignItems: 'center',
    marginTop: 8,
    height: 100,
    justifyContent: 'center'
  },
  logoText: {
    fontSize: 50,
    fontWeight: '800',
    color: COLORS.primary
  },
  card: {
    backgroundColor: COLORS.white,
    borderRadius: 18,
    padding: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 6,
    width: '90%',
    maxWidth: 380,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: COLORS.text,
    marginBottom: 4
  },
  subtitle: { color: '#6A5AAE', marginBottom: 12 },
  input: {
    width: '100%',
    height: 52,
    backgroundColor: COLORS.light,
    borderRadius: 12,
    paddingHorizontal: 14,
    marginBottom: 12,
    fontSize: 16,
    color: COLORS.text
  },
  button: {
    height: 52,
    borderRadius: 12,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 6,
    marginBottom: 6
  },
  buttonDisabled: { opacity: 0.6 },
  buttonText: {
    color: COLORS.white,
    fontSize: 17,
    fontWeight: '700'
  },
  loginText: {
    marginTop: 10,
    textAlign: 'center',
    color: '#6E5FCF'
  },
  loginLink: {
    fontWeight: '700',
    color: COLORS.primary
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 6
  },
  footerText: { color: '#8a77ff' },
});

export default RegisterScreen;
