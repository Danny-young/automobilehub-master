import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, useRouter } from 'expo-router';
import { supabase } from '@/lib/supabase';
import { Ionicons } from '@expo/vector-icons';

type Favorite = {
  id: string;
  name: string;
  description: string;
};

export default function FavoritesScreen() {
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const router = useRouter();

  // useEffect(() => {
  //   fetchFavorites();
  // }, []);

  // const fetchFavorites = async () => {
  //   const { data: { user } } = await supabase.auth.getUser();
  //   if (user) {
  //     const { data, error } = await supabase
  //       .from('favorites')
  //       .select('*')
  //       .eq('user_id', user.id);
  //     if (error) console.error('Error fetching favorites:', error);
  //     else setFavorites(data || []);
  //   }
  // };

  // const handleDeleteFavorite = async (id: string) => {
  //   const { error } = await supabase
  //     .from('favorites')
  //     .delete()
  //     .eq('id', id);
  //   if (error) console.error('Error deleting favorite:', error);
  //   else fetchFavorites();
  // };

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen 
        options={{ 
          title: 'Favorites',
          headerShown: true,
          presentation: 'modal'
        }} 
      />
      <FlatList
        data={favorites}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.favoriteItem}>
            <View style={styles.favoriteInfo}>
              <Text style={styles.favoriteName}>{item.name}</Text>
              <Text style={styles.favoriteDescription}>{item.description}</Text>
            </View>
            <TouchableOpacity onPress={() => handleDeleteFavorite(item.id)}>
              <Ionicons name="trash-outline" size={24} color="red" />
            </TouchableOpacity>
          </View>
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
  favoriteItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  favoriteInfo: {
    flex: 1,
  },
  favoriteName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  favoriteDescription: {
    fontSize: 14,
    color: '#666',
  },
});