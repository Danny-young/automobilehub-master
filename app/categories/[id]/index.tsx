import { View, Text, ActivityIndicator, FlatList } from 'react-native'
import React from 'react'
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Stack, useLocalSearchParams } from 'expo-router';
import { useSubCategory } from '@/api/service_providers';

const index = () => {
    const { top } = useSafeAreaInsets();
  const { id: idString } = useLocalSearchParams();
  const id = parseFloat(Array.isArray(idString) ? idString[0] : idString);
  const { data: subcategories, error, isLoading } = useSubCategory(id);
const category = subcategories?.[0]
  if (isLoading) {
    return <ActivityIndicator />;
  }
  // loom recording

  if (error || !subcategories) {
    return <Text>Failed to fetch categories</Text>;
  }
console.log(subcategories)
  return (
    <View>
        <Stack.Screen options={{ headerShown: true, headerTitle: ` ${category?.service_categories?.Name}` }} />
      {/* <Text>index categories, id: {idString} </Text> */}
      <FlatList
       data={subcategories}
       renderItem={({ item }) => <Text>{item.name}</Text>}
       />
       {/* <Text>{category?.category_id}</Text> */}
    </View>
  )
}

export default index