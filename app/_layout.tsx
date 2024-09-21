import Colors from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useFonts } from 'expo-font';
import { Link, Stack, useRouter, useSegments } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import QueryProvider from '@/providers/QueryProvider';
import { TouchableOpacity, Text, View, ActivityIndicator } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Slot } from "expo-router";
const CLERK_PUBLISHABLE_KEY ='pk_test_YWRqdXN0ZWQtYnV6emFyZC02LmNsZXJrLmFjY291bnRzLmRldiQ';
import AuthProvider from '@/providers/AuthProvider'

/* pk_test_dG91Y2hpbmctYmVkYnVnLTQ0LmNsZXJrLmFjY291bnRzLmRldiQ'; */


  const InitialLayout = () => {

 const [loaded, error] = useFonts({
  SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),   
  mon: require('../assets/fonts/Montserrat-Regular.ttf'),
  'mon-sb': require('../assets/fonts/Montserrat-SemiBold.ttf'),
  'mon-b': require('../assets/fonts/Montserrat-Bold.ttf'), 


 });


    const segments = useSegments();
    const router = useRouter();
    
    return (
              <Stack>
            <Stack.Screen name="index" options={{ headerShown: false }} />
            <Stack.Screen name="(auth)" options={{ headerShown: false }} />
            <Stack.Screen name="(carowner)" options={{ headerShown: false,  }} />
            <Stack.Screen name="(serviceProvider)" options={{ headerShown: false }} />
            <Stack.Screen name="(onboarding)" options={{ headerShown: false }} />
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="listing" options={{ headerShown: false }} />
            <Stack.Screen name="modal" options={{ headerShown: false }} />
  
            {/* <Stack.Screen name="+not-found" /> */}
          </Stack>
         );
  };
  
  
  
  const RootLayout = () => {
    return (     
        <AuthProvider>
       <QueryProvider>
        <InitialLayout />
        </QueryProvider>
        </AuthProvider>   
    );
  };
  
  export default RootLayout;
