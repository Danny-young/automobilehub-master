import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native'
import React from 'react'
import { Ionicons } from '@expo/vector-icons';
import { Tables } from '@/types/Tables';
import { Link } from 'expo-router';

interface ServiceListItemProps {
    service: Tables<'Services'> & {
      User_Business?: Tables<'User_Business'>;
    };
  }

export const defaultPizzaImage =
'https://notjustdev-dummy.s3.us-east-2.amazonaws.com/food/default.png';

const ServiceItemList = ({ service }: ServiceListItemProps) => {

   

  return (
    <Link href={`/listing/${service.id}`} asChild>
    <TouchableOpacity /* style={styles.flatimage} *//*  onPress={() => handlePress(item)} */>
            <View style={styles.listing}>
                <Image source={{ uri:  service?.image || defaultPizzaImage }} style={styles.image} />
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
                <View style={{ flexDirection: 'row', gap: 4 }}>
                  <Text style={{ fontFamily: 'mon-sb' }}>{service.User_Business?.address}</Text>
                                  
                </View>
              </View>
          </TouchableOpacity> 
          </Link>
  )
}

export default ServiceItemList


const styles = StyleSheet.create({
    titleContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
    },
    stepContainer: {
      gap: 8,
      marginBottom: 8,
    },
    reactLogo: {
      height: 178,
      width: 290,
      bottom: 0,
      left: 0,
      position: 'absolute',
    },
    listing: {
      padding: 16,
      gap: 10,
      marginVertical: 16,
      // backgroundColor: Colors.lightGray,
      // elevation: 2,
      // shadowColor: '#000',
      // shadowOpacity: 0.1,
      // shadowRadius: 6,
     
    },
    image: {
      
      width: '100%',
    aspectRatio: 1,   

      borderRadius: 10,
    },
    info: {
      textAlign: 'center',
      fontFamily: 'mon-sb',
      fontSize: 16,
      marginTop: 4,
    },
  });
  
   
  