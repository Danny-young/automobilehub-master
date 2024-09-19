import Colors from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useFonts } from 'expo-font';
import { Link, router, Stack, useRouter, useSegments } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { TouchableOpacity, Text, View, ActivityIndicator, Pressable } from 'react-native';





export default function listingLayout() {
  
  return (
    <Stack>
    <Stack.Screen name="help-and-support" options={{ headerShown: false }} />          
    <Stack.Screen name="privacy-policy" options={{ headerShown: false }} />          
    <Stack.Screen name="terms-and-conditions" options={{ headerShown: false }} />          
    <Stack.Screen name="edit-profile" options={{ headerShown: false }} />          
    {/* <Stack.Screen name="[id]" options={{ headerShown: false }} />           */}
 
               
  </Stack>
  );

}