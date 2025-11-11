// src/screens/UserDetailScreen.jsx
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import { db } from '../firebase';
import { collection, getDocs, doc, getDoc } from 'firebase/firestore';
import { BarChart } from 'react-native-chart-kit';

const screenWidth = Dimensions.get('window').width;

const COLORS = {
  primary: '#7B61FF',
  cream: '#FFF8E7',
  light: '#E5D9FA',
  white: '#FFFFFF',
  text: '#3B3B3B',
};

const UserDetailScreen = ({ route }) => {
  const { user } = route.params;
  const [loading, setLoading] = useState(true);
  const [chartData, setChartData] = useState({
    labels: ['Alegria', 'Tristeza', 'Raiva', 'Ansiedade', 'Tédio', 'Medo'],
    datasets: [{ data: [0, 0, 0, 0, 0, 0] }],
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        console.log("🔹 Carregando posts do usuário:", user.id);

        // 1️⃣ Carregar todos os posts
        const postsSnapshot = await getDocs(collection(db, 'posts'));
        const allPosts = postsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        const userPosts = allPosts.filter(p => p.userId === user.id);

        // 2️⃣ Carregar palavras do documento
        const palavrasDoc = await getDoc(doc(db, 'recursos', 'palavras'));
        const palavrasArray = palavrasDoc.data()?.lista || [];

        // 3️⃣ Contagem inicial
        const emocaoMap = {
          alegria: 0,
          tristeza: 0,
          raiva: 0,
          ansiedade: 0,
          tédio: 0,
          medo: 0,
        };

        // 4️⃣ Processar os posts
        userPosts.forEach(post => {
          const wordsInPost = post.texto
            .toLowerCase()
            .split(/\s+/)
            .map(w => w.replace(/[.,!?]/g, ''));

          wordsInPost.forEach(word => {
            const match = palavrasArray.find(p => p.palavra.toLowerCase() === word);
            if (match && emocaoMap.hasOwnProperty(match.associado)) {
              emocaoMap[match.associado] += 1;
            }
          });
        });

        // 5️⃣ Atualizar gráfico
        const emotionCounts = Object.values(emocaoMap);
        setChartData({
          labels: Object.keys(emocaoMap).map(
            e => e.charAt(0).toUpperCase() + e.slice(1)
          ),
          datasets: [{ data: emotionCounts }],
        });

      } catch (error) {
        console.error("Erro ao carregar dados:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [user.id]);

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
        <Text style={styles.header}>Detalhes de {user.nome}</Text>

        <View style={styles.chartContainer}>
          <Text style={styles.chartTitle}>Distribuição de Emoções</Text>
          <BarChart
            data={chartData}
            width={screenWidth - 40}
            height={250}
            fromZero
            chartConfig={{
              backgroundColor: COLORS.white,
              backgroundGradientFrom: COLORS.light,
              backgroundGradientTo: COLORS.white,
              color: (opacity = 1) => `rgba(123, 97, 255, ${opacity})`,
              labelColor: () => COLORS.text,
              barPercentage: 0.6,
              decimalPlaces: 0,
            }}
            style={styles.chart}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: COLORS.cream },
  container: { padding: 20, paddingBottom: 40 },
  header: { fontSize: 24, fontWeight: '800', color: COLORS.primary, marginBottom: 16 },
  chartContainer: {
    backgroundColor: COLORS.white,
    borderRadius: 18,
    padding: 16,
    elevation: 4,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 12,
    textAlign: 'center',
  },
  chart: { borderRadius: 16, marginTop: 10 },
});

export default UserDetailScreen;
