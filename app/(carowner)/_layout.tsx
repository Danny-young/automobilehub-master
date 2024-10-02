import { useFonts } from 'expo-font';
import { Link, router, Stack, Redirect, useSegments, Tabs } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { TouchableOpacity, Text, View, ActivityIndicator, Pressable } from 'react-native';
import { useAuth } from '@/providers/AuthProvider';
import { Slot } from 'expo-router';
import { TabBarIcon } from '@/components/navigation/TabBarIcon';
import { FontAwesome, Ionicons } from '@expo/vector-icons';

export default function CarOwnerLayout() {
  const { isAuthenticated } = useAuth();
  const [isLoading, setIsLoading] = useState(true); // New state for handling loading
  console.log('isAuthenticated:', isAuthenticated);

  useEffect(() => {
    // Simulate fetching authentication status
    if (isAuthenticated !== undefined) {
      setIsLoading(false); // Stop loading when authentication status is determined
    }
  }, [isAuthenticated]);

  if (isLoading) {
    // Show a loading indicator while determining authentication status
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (!isAuthenticated) {
    // Redirect to the authentication screen if not authenticated
    return <Redirect href="/(auth)/" />;
  }

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <FontAwesome size={28} name="home" color={color} />,
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Map',
          tabBarIcon: ({ color }) => <Ionicons size={30} name="map" color={color} />,
        }}
      />
      <Tabs.Screen
        name="wishlist"
        options={{
          title: 'Booking',
          tabBarIcon: ({ color }) => <Ionicons size={28} name="reader-outline" color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color }) => <Ionicons size={28} name="person-circle-outline" color={color} />,
        }}
      />
    </Tabs>
  );
}
