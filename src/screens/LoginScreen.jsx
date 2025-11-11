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

import { auth } from '../firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';

const COLORS = {
  primary: '#7B61FF',
  light: '#E5D9FA',
  cream: '#FFF8E7',
  white: '#FFFFFF',
  text: '#3B3B3B'
};

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Erro", "Por favor preencha todos os campos.");
      return;
    }
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigation.replace('Home');
    } catch (error) {
      let errorMessage = "E-mail ou senha inválidos.";
      switch (error.code) {
        case 'auth/invalid-email':
        case 'auth/user-not-found':
        case 'auth/wrong-password':
          errorMessage = "E-mail ou senha inválidos.";
          break;
        case 'auth/too-many-requests':
          errorMessage = "Muitas tentativas. Tente mais tarde.";
          break;
        default:
          console.error(error);
      }
      Alert.alert("Erro de login", errorMessage);
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
            <Text style={styles.title}>Bem-vindo(a)!</Text>
            <Text style={styles.subtitle}>Faça login para continuar.</Text>

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

            <TouchableOpacity
              style={[styles.button, loading && styles.buttonDisabled]}
              onPress={handleLogin}
              activeOpacity={0.85}
              disabled={loading}
            >
              <Text style={styles.buttonText}>{loading ? 'Entrando...' : 'Entrar'}</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigation.navigate('Register')}>
              <Text style={styles.registerText}>
                Não tem conta? <Text style={styles.registerLink}>Cadastre-se</Text>
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>Made By Phoenix Inovações.</Text>
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
    alignItems: 'center', // 🔹 centraliza horizontalmente
  },
  logoWrapper: {
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 6,
    height: 100,
    justifyContent: 'center'
  },
  logoText: { fontSize: 50, fontWeight: '800', color: COLORS.primary },
  card: {
    backgroundColor: COLORS.white,
    borderRadius: 18,
    padding: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 6,
    width: '90%',     // 🔹 menor que 100%
    maxWidth: 380,    // 🔹 não ultrapassa 380px
  },
  title: { fontSize: 22, fontWeight: '800', color: COLORS.text, marginBottom: 4 },
  subtitle: { color: '#6A5AAE', marginBottom: 14 },
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
  buttonText: { color: COLORS.white, fontSize: 17, fontWeight: '700' },
  registerText: { marginTop: 10, textAlign: 'center', color: '#6E5FCF' },
  registerLink: { fontWeight: '700', color: COLORS.primary },
  footer: { alignItems: 'center', paddingVertical: 6 },
  footerText: { color: '#8a77ff' },
});

export default LoginScreen;
