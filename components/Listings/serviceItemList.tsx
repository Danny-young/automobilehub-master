import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native'
import React from 'react'
import { Ionicons } from '@expo/vector-icons';
import { Tables } from '@/types/Tables';
import { Link } from 'expo-router';
import Defaultcarlogo from '@/assets/images/carconnect.jpg' // Import your local image

interface ServiceListItemProps {
    service: Tables<'Services'> & {
      User_Business?: Tables<'User_Business'>;
    };
}

const ServiceItemList = ({ service }: ServiceListItemProps) => {
  return (
    <Link href={`/listing/${service.id}`} asChild>
      <TouchableOpacity>
        <View style={styles.listing}>
          <Image
            source={service?.image ? { uri: service.image } : Defaultcarlogo}
            style={styles.image}
            resizeMode="contain" // Ensure the image fits within the container
          />
          <TouchableOpacity style={{ position: 'absolute', right: 30, top: 30 }}>
            <Ionicons name="heart-outline" size={28} color="#000" />
          </TouchableOpacity>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <Text style={{ fontSize: 16, fontFamily: 'mon-sb' }}>{service.name}</Text>
            <View style={{ flexDirection: 'row', gap: 4 }}>
              <Ionicons name="star" size={16} />
              <Text style={{ fontFamily: 'mon-sb' }}>{service.duration || 0 / 20}</Text>
            </View>
          </View>
          <Text style={{ fontFamily: 'mon' }}>{service.User_Business?.business_name}</Text>
          <View style={{ flexDirection: 'row', gap: 4, justifyContent: 'space-between' }}>
            <Text style={{ fontFamily: 'mon-sb' }}>{service.User_Business?.address}</Text>
            <View style={styles.category}>
            <Text style={{ fontFamily: 'mon-sb', color: 'white' }}>{service.category}</Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    </Link>
  );
}

export default ServiceItemList;

const styles = StyleSheet.create({
  listing: {
    padding: 16,
    gap: 10,
    marginVertical: 16,
  },
  image: {
    width: '100%',
    height: 350, // Set a fixed height to control image size
    borderRadius: 10,
  },
  category: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginLeft: 5,
    backgroundColor: '#2196F3',
  },
});
