import React from "react";
import { View, TouchableOpacity, Text, StyleSheet, SafeAreaView, Alert } from "react-native";
import { uploadPalavras } from "../scripts/upload";

const AdminScreen = () => {

  const handleUpload = async () => {
    try {
      await uploadPalavras();
      Alert.alert("Sucesso", "Lista de palavras enviada para o Firestore!");
    } catch (err) {
      console.error("Erro ao enviar palavras:", err);
      Alert.alert("Erro", "Não foi possível enviar as palavras.");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.innerContainer}>
        <Text style={styles.title}>Administração</Text>
        <Text style={styles.subtitle}>
          Aqui você pode enviar a lista de palavras para o Firestore.
        </Text>

        <TouchableOpacity style={styles.button} onPress={handleUpload}>
          <Text style={styles.buttonText}>Enviar palavras</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const COLORS = {
  primary: "#7B61FF",
  cream: "#FFF8E7",
  text: "#3B3B3B",
  light: "#E5D9FA"
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.cream },
  innerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20
  },
  title: { fontSize: 28, fontWeight: "800", color: COLORS.primary, marginBottom: 8 },
  subtitle: { fontSize: 16, color: COLORS.text, textAlign: "center", marginBottom: 24 },
  button: {
    height: 50,
    width: "70%",
    backgroundColor: COLORS.primary,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 12,
  },
  buttonText: { color: "#fff", fontWeight: "700", fontSize: 16 }
});

export default AdminScreen;
