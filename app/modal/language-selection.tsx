import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, useRouter } from 'expo-router';
import { supabase } from '@/lib/supabase';

const languages = [
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Spanish' },
  { code: 'fr', name: 'French' },
  // Add more languages as needed
];

export default function LanguageSelectionScreen() {
  const [selectedLanguage, setSelectedLanguage] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    fetchUserLanguage();
  }, []);

  const fetchUserLanguage = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      setSelectedLanguage(user.user_metadata?.language || 'en');
    }
  };

  const handleLanguageSelect = async (language: string) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { error } = await supabase.auth.updateUser({
        data: { language },
      });

      if (error) {
        console.error('Error updating language:', error.message);
      } else {
        setSelectedLanguage(language);
        router.back();
      }
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen 
        options={{ 
          title: 'Select Language',
          headerShown: true,
          presentation: 'modal'
        }} 
      />
      <FlatList
        data={languages}
        keyExtractor={(item) => item.code}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.languageItem,
              item.code === selectedLanguage && styles.selectedLanguageItem,
            ]}
            onPress={() => handleLanguageSelect(item.code)}
          >
            <Text style={styles.languageText}>{item.name}</Text>
          </TouchableOpacity>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  languageItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  selectedLanguageItem: {
    backgroundColor: '#e0e0e0',
  },
  languageText: {
    fontSize: 18,
  },
});