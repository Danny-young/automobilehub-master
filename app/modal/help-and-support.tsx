import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack } from 'expo-router';
import HelpAndSupport from '@/components/HelpAndSupport';

export default function HelpAndSupportScreen() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Stack.Screen 
        options={{ 
          title: 'Help and Support',
          headerShown: true,
          presentation: 'modal'
        }} 
      />
      <HelpAndSupport />
    </SafeAreaView>
  );
}