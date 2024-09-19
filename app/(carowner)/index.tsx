import { Image, StyleSheet, Dimensions, View, Text, ActivityIndicator, FlatList, TouchableOpacity } from 'react-native';
import { Link } from 'expo-router';
import ExploreHeader from '@/components/ExploreHeader';
import { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { useServices } from '@/api/service_providers/index';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Listing from '@/components/Listings/serviceItemList';

export const defaultPizzaImage = 'https://notjustdev-dummy.s3.us-east-2.amazonaws.com/food/default.png';

const { width: screenWidth } = Dimensions.get('window');

export default function CarOwnerHome() {
  const { top } = useSafeAreaInsets();
  const [category, setCategory] = useState<string>('Tiny homes');
  const { data: services, error, isLoading } = useServices();

  const onDataChanged = (category: string) => setCategory(category);

  const handlePress = (item: any) => {
    console.log('Item pressed:', item);
    // Uncomment the following line if you decide not to use Link for navigation
    // router.push(`/(Listing)/${item.id}`);
  };

  if (isLoading) {
    return <ActivityIndicator style={{ marginTop: 20 }} />;
  }

  if (error) {
    return <Text style={{ color: 'red', textAlign: 'center', marginTop: 20 }}>Failed to fetch services</Text>;
  }

  console.log('Service List', services?.length);

  return (
    <View style={[styles.container, { paddingTop: top }]}>
      <ExploreHeader onCategoryChanged={onDataChanged} />
      <FlatList
  data={services}
  keyExtractor={(item) => item.id.toString()}
  renderItem={({ item }) => (
    <Listing
      service={{
        ...item,
        User_Business: item.User_Business ? item.User_Business : {
          address: null,
          business_name: null,
          coordinates: {},
          created_at: '',
          description: null,
          id: 0,
          owner: null,
          provider_email: null,
          telephone: null
        }      }}
    />
  )}
/>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listing: {
    padding: 16,
    marginVertical: 16,
  },
  image: {
    width: screenWidth - 32,
    height: screenWidth - 32,
    borderRadius: 10,
  },
  heartIcon: {
    position: 'absolute',
    right: 30,
    top: 30,
  },
  detailsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 16,
    fontFamily: 'mon-sb',
  },
  ratingContainer: {
    flexDirection: 'row',
    gap: 4,
  },
  rating: {
    fontFamily: 'mon-sb',
  },
  businessName: {
    fontFamily: 'mon',
  },
  price: {
    fontFamily: 'mon-sb',
  },
});
