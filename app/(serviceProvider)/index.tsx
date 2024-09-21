import React, { useRef, useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Image, 
  ActivityIndicator, 
  FlatList, 
  Dimensions, 
  TouchableOpacity 
} from 'react-native';
import Carousel from 'react-native-snap-carousel';
import { useCategories } from '@/api/service_providers';
import Header from '@/components/servicepage/Header';
import { router } from 'expo-router';

interface CarouselItem {
  image: any; // Replace 'any' with the actual type of your image source
  title: string;
}

const defaultimage = "https://images.pexels.com/photos/1545743/pexels-photo-1545743.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2";

const Page = () => {
  const [entries] = useState<CarouselItem[]>([
    { title: 'Emergency', image: require('@/assets/images/cars/emergency.jpeg') },
    { title: 'Spare parts', image: require('@/assets/images/cars/spareparts.jpeg') },
    { title: 'Inspection', image: require('@/assets/images/cars/mechanic.jpeg') },
    { title: 'Rental', image: require('@/assets/images/cars/rental.jpeg') },
    { title: 'Car Service', image: require('@/assets/images/cars/car-service.jpg') },
  ]);

  const carouselRef = useRef<Carousel<CarouselItem> | null>(null);
  const { data: service_categories, error, isLoading } = useCategories();
  const { width: screenWidth } = Dimensions.get('window');

  // Check if entries are correctly defined
  console.log('Entries:', entries);

  // Handle loading and error states
  if (isLoading) {
    return <ActivityIndicator style={styles.loading} />;
  }

  if (error) { 
    return <Text style={styles.error}>Failed to fetch services</Text>;
  }

  const renderItem = ({ item }: { item: CarouselItem; index: number }) => (
    <View style={styles.slide}>
      <Image source={item.image} style={styles.image} />
      <Text style={styles.title}>{item.title}</Text>
    </View>
  );

  const handlePress = (item: any) => {
    // Navigate to subcategories page with the category ID
    // router.push(`/categories/${item.id}`);
  };

  return (
    <FlatList
      data={service_categories}
      keyExtractor={(item) => item.id.toString()} // Ensuring each key is unique
      renderItem={({ item }) => (
        <TouchableOpacity style={styles.flatimage} onPress={() => handlePress(item)}>
          <Image 
            source={{ uri: item?.image_url || defaultimage }} 
            style={styles.flatImageItem} 
          />
          <Text style={styles.flatImageText}>{item.Name?.slice(0, 20)}</Text>
        </TouchableOpacity>
      )}
      numColumns={2}
      contentContainerStyle={styles.listContent}
      columnWrapperStyle={styles.columnWrapper}
      ListHeaderComponent={() => (
        <>
          <Header />
          <Text style={styles.title}>Categories</Text>
          {/* <Carousel
            ref={carouselRef}
            data={entries}
            renderItem={renderItem}
            sliderWidth={screenWidth}
            itemWidth={screenWidth * 0.95}
            autoplay={true}
            autoplayDelay={500}
            autoplayInterval={3000}
            loop={true}
          /> */}
        </>
      )}
    />
  );
};

export default Page;

const styles = StyleSheet.create({
  slide: {
    padding: 20,
    borderRadius: 8,
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 8,
  },
  title: {
    marginTop: 10,
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  flatimage: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 2,
    borderRadius: 8,
    borderColor: 'gray',
    backgroundColor: 'steelblue', // Changed to a valid color
  },
  flatImageItem: {
    borderRadius: 5,
    height: 100,
    width: 160,
  },
  flatImageText: {
    color: '#000',
    fontWeight: '500',
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  error: {
    color: 'red',
    textAlign: 'center',
    marginTop: 20,
  },
  listContent: {
    gap: 10,
    padding: 10,
  },
  columnWrapper: {
    gap: 10,
  },
});
