import Colors from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useFonts } from 'expo-font';
import { Link, Stack, useRouter, Slot, Redirect } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { TouchableOpacity, Text, View, ActivityIndicator, Pressable } from 'react-native';
import { useAuth } from '@/providers/AuthProvider';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Spinner from 'react-native-loading-spinner-overlay';

export default function AuthLayout() {
  const { isAuthenticated } = useAuth();
  const [loading, setLoading] = useState(true);
  const [userType, setUserType] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const checkUserType = async () => {
      try {
        const storedUserType = await AsyncStorage.getItem('userType');
        setUserType(storedUserType);
      } catch (error) {
        console.error('Failed to retrieve user type:', error);
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated) {
      checkUserType();
    } else {
      setLoading(false);
    }
  }, [isAuthenticated]);

  if (loading) {
    return <Spinner visible={loading} />;
  }

  if (isAuthenticated && userType) {
    if (userType === 'Car_Owner') {
      return <Redirect href="/(carowner)" />;
    } else if (userType === 'Service_Provider') {
      return <Redirect href="/(serviceProvider)" />;
    }
  }

  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="login" options={{ headerShown: false }} />
      <Stack.Screen name="signup" options={{ headerShown: false }} />
     
    </Stack>
  );
}