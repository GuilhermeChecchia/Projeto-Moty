import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

// Telas existentes
import RegisterScreen from '../screens/RegisterScreen';
import LoginScreen from '../screens/LoginScreen';
import HomeScreen from '../screens/HomeScreen';
import InsightsScreen from '../screens/InsightsScreen';

// 🆕 Nova tela do detalhe do usuário
import UserDetailScreen from '../screens/UserDetailScreen';

const Stack = createStackNavigator();

const AppNavigator = () => {
  return (
    <Stack.Navigator initialRouteName="Login">
      {/* 🔐 Tela de Login */}
      <Stack.Screen
        name="Login"
        component={LoginScreen}
        options={{ headerShown: false }}
      />

      {/* 📝 Tela de Cadastro */}
      <Stack.Screen
        name="Register"
        component={RegisterScreen}
        options={{ headerShown: false }}
      />

      {/* 🏠 Tela Inicial (Home) */}
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{ headerShown: false }}
      />

      {/* 📊 Tela de Insights (psicólogo) */}
      <Stack.Screen
        name="Insights"
        component={InsightsScreen}
        options={{
          title: 'Insights Emocionais',
          headerStyle: { backgroundColor: '#7B61FF' },
          headerTintColor: '#fff',
          headerTitleStyle: { fontWeight: 'bold' },
        }}
      />

      {/* 🧩 Tela de detalhe do usuário */}
      <Stack.Screen
        name="UserDetail"
        component={UserDetailScreen}
        options={{
          title: 'Detalhes do Usuário',
          headerStyle: { backgroundColor: '#7B61FF' },
          headerTintColor: '#fff',
          headerTitleStyle: { fontWeight: 'bold' },
        }}
      />
    </Stack.Navigator>
  );
};

export default AppNavigator;
