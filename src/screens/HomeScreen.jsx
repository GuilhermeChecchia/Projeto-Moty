import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  TextInput,
  SafeAreaView,
  Platform,
  ScrollView,
  ActivityIndicator
} from 'react-native';

import { auth, db } from '../firebase';
import { signOut } from 'firebase/auth';
import {
  addDoc,
  collection,
  serverTimestamp,
  query,
  where,
  orderBy,
  limit,
  getDocs,
  doc,
  updateDoc
} from 'firebase/firestore';

const COLORS = {
  primary: '#7B61FF',
  light: '#E5D9FA',
  cream: '#FFF8E7',
  white: '#FFFFFF',
  text: '#3B3B3B'
};

const HomeScreen = ({ navigation }) => {
  const [diaryText, setDiaryText] = useState('');
  const [cooldown, setCooldown] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  const [showBorracha, setShowBorracha] = useState(false);
  const [userPosts, setUserPosts] = useState([]);
  const [loadingPosts, setLoadingPosts] = useState(false);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      navigation.replace('Login');
    } catch (error) {
      console.error("Erro ao sair:", error);
      Alert.alert("Erro", "Não foi possível sair. Tente novamente.");
    }
  };

  // 🔄 Buscar últimas entradas do diário do usuário
  const fetchUserPosts = async () => {
    try {
      setLoadingPosts(true);
      const user = auth.currentUser;
      if (!user) return;

      const q = query(
        collection(db, 'posts'),
        where('userId', '==', user.uid),
        orderBy('createdAt', 'desc'), // 🔁 agora usa o campo local
        limit(5)
      );

      const querySnapshot = await getDocs(q);
      const posts = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      setUserPosts(posts);
    } catch (error) {
      console.error("Erro ao carregar posts:", error);
      Alert.alert("Erro", "Não foi possível carregar seus textos.");
    } finally {
      setLoadingPosts(false);
    }
  };

  // ✅ Salvar ou atualizar entrada
  const handleSaveDiary = async () => {
    if (cooldown) {
      Alert.alert("Aguarde", "Por favor, espere alguns segundos antes de enviar novamente.");
      return;
    }

    if (diaryText.trim() === '') {
      Alert.alert("Atenção", "O campo do diário está vazio!");
      return;
    }

    try {
      const user = auth.currentUser;
      if (!user) {
        Alert.alert("Erro", "Usuário não autenticado.");
        return;
      }

      if (isEditing && editId) {
        // 🩹 Atualizar texto existente
        const postRef = doc(db, 'posts', editId);
        await updateDoc(postRef, {
          texto: diaryText.trim(),
          timestamp: serverTimestamp(),
          updatedAt: new Date().getTime()
        });
        Alert.alert("✏️ Diário Atualizado", "Seu texto foi editado com sucesso.");
      } else {
        // ✨ Criar novo texto
        await addDoc(collection(db, 'posts'), {
          userId: user.uid,
          texto: diaryText.trim(),
          timestamp: serverTimestamp(),
          createdAt: new Date().getTime() // 🔥 campo local garante exibição imediata
        });
        Alert.alert("✅ Diário Registrado", "Sua entrada foi salva com sucesso.");
      }

      setDiaryText('');
      setEditId(null);
      setIsEditing(false);
      fetchUserPosts();

      // cooldown
      setCooldown(true);
      setTimeout(() => setCooldown(false), 5000);

    } catch (error) {
      console.error("Erro ao salvar diário:", error);
      Alert.alert("Erro", "Não foi possível salvar seu diário. Tente novamente.");
    }
  };

  const handleEdit = (post) => {
    setDiaryText(post.texto);
    setIsEditing(true);
    setEditId(post.id);
    setShowBorracha(false);
  };

  useEffect(() => {
    if (showBorracha) fetchUserPosts();
  }, [showBorracha]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.logoText}>moty.</Text>
          <TouchableOpacity onPress={handleSignOut} style={styles.signOutButton}>
            <Text style={styles.signOutText}>Sair</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.titleBlock}>
          <Text style={styles.title}>Meu Diário</Text>
          <Text style={styles.subtitle}>
            Conte como foi seu dia. Seja sincero(a), isso ajuda no crescimento.
          </Text>
        </View>

        <View style={styles.card}>
          <TextInput
            style={styles.emotionInput}
            placeholder="O que aconteceu hoje?"
            placeholderTextColor="#9C8FE6"
            multiline
            value={diaryText}
            onChangeText={setDiaryText}
            textAlignVertical="top"
          />
          <TouchableOpacity
            style={[
              styles.saveButton,
              cooldown && { backgroundColor: '#A89BE9' }
            ]}
            onPress={handleSaveDiary}
            activeOpacity={cooldown ? 1 : 0.85}
            disabled={cooldown}
          >
            <Text style={styles.saveButtonText}>
              {isEditing
                ? 'Salvar Alterações'
                : cooldown
                ? 'Aguarde...'
                : 'Registrar Meu Diário'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* 🩹 Botão Borracha */}
        <TouchableOpacity
          style={styles.eraserButton}
          onPress={() => setShowBorracha(!showBorracha)}
        >
          <Text style={styles.eraserButtonText}>
            {showBorracha ? 'Fechar Borracha' : '🩹 Borracha (Editar meu diário)'}
          </Text>
        </TouchableOpacity>

        {/* 🧾 Lista de textos */}
        {showBorracha && (
          <View style={styles.borrachaArea}>
            {loadingPosts ? (
              <ActivityIndicator color={COLORS.primary} size="large" />
            ) : userPosts.length === 0 ? (
              <Text style={{ color: COLORS.text }}>Você ainda não escreveu nada.</Text>
            ) : (
              userPosts.map(post => (
                <View key={post.id} style={styles.postItem}>
                  <Text style={styles.postText}>{post.texto}</Text>
                  <TouchableOpacity
                    style={styles.editButton}
                    onPress={() => handleEdit(post)}
                  >
                    <Text style={styles.editButtonText}>Editar</Text>
                  </TouchableOpacity>
                </View>
              ))
            )}
          </View>
        )}

        <View style={styles.insightCard}>
          <Text style={styles.insightNote}>
            Área reservada. Gráficos e métricas aparecerão aqui.
          </Text>
          <TouchableOpacity
            style={styles.insightButton}
            onPress={() => navigation.navigate('Insights')}
          >
            <Text style={styles.insightButtonText}>Ver insights</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: COLORS.cream },
  header: {
    backgroundColor: COLORS.primary,
    paddingTop: Platform.OS === 'android' ? 28 : 8,
    paddingBottom: 10,
    paddingHorizontal: 16,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  logoText: { color: '#fff', fontSize: 20, fontWeight: '800' },
  signOutButton: { padding: 6 },
  signOutText: { color: '#fff' },

  container: {
    padding: 20,
    paddingBottom: 40,
  },
  titleBlock: { marginTop: 12, marginBottom: 12 },
  title: { fontSize: 24, fontWeight: '800', color: COLORS.primary },
  subtitle: { color: '#6A5AAE', marginTop: 6 },

  card: {
    backgroundColor: COLORS.white,
    borderRadius: 18,
    padding: 16,
    marginBottom: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 6,
  },
  emotionInput: {
    width: '100%',
    minHeight: 160,
    maxHeight: 300,
    backgroundColor: COLORS.light,
    borderRadius: 12,
    padding: 14,
    fontSize: 16,
    color: COLORS.text,
    marginBottom: 12,
  },
  saveButton: {
    height: 50,
    borderRadius: 12,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  saveButtonText: { color: COLORS.white, fontSize: 16, fontWeight: '700' },

  eraserButton: {
    marginBottom: 16,
    backgroundColor: '#DCD3FB',
    borderRadius: 12,
    padding: 10,
    alignItems: 'center',
  },
  eraserButtonText: {
    color: COLORS.primary,
    fontWeight: '700',
  },
  borrachaArea: {
    backgroundColor: '#FBF8FF',
    borderRadius: 12,
    padding: 12,
    marginBottom: 20,
  },
  postItem: {
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E0F7',
    paddingBottom: 8,
  },
  postText: {
    color: COLORS.text,
    marginBottom: 6,
  },
  editButton: {
    alignSelf: 'flex-end',
    backgroundColor: COLORS.light,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  editButtonText: {
    color: COLORS.primary,
    fontWeight: '600',
  },

  insightCard: {
    backgroundColor: '#FBF8FF',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
    alignItems: 'center',
    marginBottom: 20
  },
  insightNote: {
    color: '#7B66D9',
    marginTop: 8,
    marginBottom: 12,
    textAlign: 'center'
  },
  insightButton: {
    height: 44,
    borderRadius: 12,
    backgroundColor: COLORS.light,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 12,
  },
  insightButtonText: { color: COLORS.primary, fontWeight: '700' },
});

export default HomeScreen;
