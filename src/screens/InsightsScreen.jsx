// InsightsScreen.jsx
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity
} from 'react-native';
import { db } from '../firebase';
import { collection, getDocs } from 'firebase/firestore';

const COLORS = {
  primary: '#7B61FF',
  cream: '#FFF8E7',
  white: '#FFFFFF',
  text: '#3B3B3B'
};

const InsightsScreen = ({ navigation }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const snapshot = await getDocs(collection(db, "usuarios"));
        const allUsers = snapshot.docs.map(doc => {
          const data = doc.data();
          return {
            id: data.id,
            nome: data.nome || "Usuário sem nome"
          };
        });
        setUsers(allUsers);
      } catch (error) {
        console.error("Erro ao carregar usuários:", error);
      } finally {
        setLoading(false);
      }
    };

    loadUsers();
  }, []);

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <ActivityIndicator size="large" color={COLORS.primary} style={{ marginTop: 30 }} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.header}>Usuários</Text>

        {users.length === 0 ? (
          <Text style={styles.noData}>Nenhum usuário encontrado.</Text>
        ) : (
          users.map(user => (
            <TouchableOpacity
              key={user.id}
              style={styles.userCard}
              onPress={() => navigation.navigate('UserDetail', { user })} // <-- objeto completo
            >
              <Text style={styles.userName}>{user.nome}</Text>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: COLORS.cream },
  container: { padding: 20, paddingBottom: 60 },
  header: { fontSize: 24, fontWeight: '800', color: COLORS.primary, marginBottom: 16 },
  noData: { textAlign: 'center', color: COLORS.text, marginTop: 20 },

  userCard: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  userName: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.text,
  },
});

export default InsightsScreen;
