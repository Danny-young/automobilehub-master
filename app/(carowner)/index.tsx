import React, { useState, useEffect } from 'react';
import { View, FlatList, ActivityIndicator, Text } from 'react-native';
import ExploreHeader from '@/components/ExploreHeader';
import Listing from '@/components/Listings/serviceItemList';
import { useServices } from '@/api/service_providers/index';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function CarOwnerHome() {
  const { top } = useSafeAreaInsets();
  const [selectedCategory, setSelectedCategory] = useState('All Service');
  const [searchQuery, setSearchQuery] = useState('');
  const { data: allServices, isLoading, error } = useServices();

  const filteredServices = allServices?.filter(service => 
    (selectedCategory === 'All Service' || service.category === selectedCategory) &&
    ((service.name?.toLowerCase().includes(searchQuery.toLowerCase())) ||
     (service.User_Business && service.User_Business.business_name?.toLowerCase().includes(searchQuery.toLowerCase())))
  );

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
  };

  const handleSearch = (query: string) => {
    console.log('Searching for:', query);
    setSearchQuery(query);
    // The filtering is already handled by the `filteredServices` variable
  };

  if (isLoading) {
    return <ActivityIndicator style={{ marginTop: 20 }} />;
  }

  if (error) {
    return <Text style={{ color: 'red', textAlign: 'center', marginTop: 20 }}>Failed to fetch services</Text>;
  }

  return (
    <View style={{ flex: 1, paddingTop: top }}>
      <ExploreHeader onCategoryChanged={handleCategoryChange} onSearch={handleSearch} />
      <FlatList
        data={filteredServices}
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
              }
            }}
          />
        )}
      />
    </View>
  );
}
