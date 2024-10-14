import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Image, TouchableOpacity } from 'react-native';
import { Stack, useLocalSearchParams } from 'expo-router';
import { supabase } from '@/lib/supabase'; // Assuming you're using Supabase for data
import Defaultcarlogo from '@/assets/images/carconnect.jpg';
import { useService } from '@/api/service_providers';
import Colors from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import { Linking, Alert, Platform } from 'react-native';

const ProviderInfo = () => {

  const { id: idString } = useLocalSearchParams();
  const id = parseFloat(Array.isArray(idString) ? idString[0] : idString);

  // Fetch service provider details by business name
  const { data: services, error, isLoading } = useService(id);
 
 
  if (isLoading) {
    return <ActivityIndicator size="large" style={styles.loader} />;
  }

  if (error) {
    return <Text style={styles.errorText}>{error.message}</Text>;
  }

  if (!services) {
    return <Text style={styles.errorText}>No service provider found</Text>;
  }

  const openMaps = (latitude: number, longitude: number) => {
    const scheme = Platform.select({ ios: 'maps:0,0?q=', android: 'geo:0,0?q=' });
    const latLng = `${latitude},${longitude}`;
    const label = 'Custom Label';
    const url = Platform.select({
      ios: `${scheme}${label}@${latLng}`,
      android: `${scheme}${latLng}(${label})`
    });

    if (url) {
      Linking.openURL(url);
    } else {
      Alert.alert('Error', 'Unable to open maps on this device');
    }
  };

  return (
    
    <View style={styles.container}>
       {/* Stack.Header to set the dynamic title */}
       <Stack.Screen
        options={{
          title: services?.User_Business?.business_name || 'Service Provider',
          headerTitleAlign: 'center',
          headerStyle: {
           backgroundColor: Colors.primary, // Custom header style
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      />
      <View style={{position: 'absolute', zIndex:10, margin:15}}>
     
      </View>

      <View>
      <Image
        source={services.image ? { uri: services.image } : Defaultcarlogo} // Add provider's image if available
        style={styles.image}
      />

      <View style={{marginTop:-20, borderTopRightRadius:20, 
      borderTopLeftRadius:20
    
      }}>


      <View style={{paddingHorizontal:20, marginTop:10}}><Text style={styles.businessName}>{services.User_Business?.business_name}</Text></View>
      <View style={styles.divider} />
      <View style={{paddingHorizontal:10,display: 'flex', flexDirection: 'row', gap:5, alignItems:'center', }}>
      <Ionicons name='location' size={25} color={Colors.primary} />
      <Text style={styles.description}>{services.User_Business?.address}</Text></View>
      <View style={{paddingHorizontal:10,display: 'flex', flexDirection: 'row', gap:5, alignItems:'center', }}>
      <Ionicons name='time' size={25} color={Colors.primary} />
      <Text style={styles.description}>Mon Sun | 10:00 AM - 9:00 PM </Text></View>
      <View style={styles.divider} />
      <View style={{display: 'flex', flexDirection: 'row', gap:10, alignItems:'center', justifyContent:'space-around', marginTop:10 }}>

      <TouchableOpacity
  style={{ alignItems: 'center', justifyContent: 'center' }}
  onPress={() => {
    const phoneNumber = services.User_Business?.telephone;
    if (phoneNumber) {
      Linking.openURL(`tel:${phoneNumber}`);
    }
  }}
>
  <View style={{ padding: 10, borderRadius: 99, alignItems: 'center', justifyContent: 'center', backgroundColor: Colors.lightGray }}>
    <Ionicons name="call" size={25} color={Colors.primary} />
  </View>
  <Text style={styles.details}>Call</Text>
</TouchableOpacity>

<TouchableOpacity style={{ alignItems: 'center', justifyContent: 'center' }}>
  <View
    style={{
      padding: 10,
      borderRadius: 99,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: Colors.lightGray,
    }}
  >
  <Ionicons name="earth" size={25} color={Colors.primary} />
  </View>
  <Text style={[styles.details, { textAlign: 'center', marginTop: 5 }]}>Website</Text>
</TouchableOpacity>
<TouchableOpacity style={{ alignItems: 'center', justifyContent: 'center' }}>
  <View
    style={{
      padding: 10,
      borderRadius: 99,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: Colors.lightGray,
    }}
  >
  <Ionicons name="mail" size={25} color={Colors.primary} />
  </View>
  <Text style={[styles.details, { textAlign: 'center', marginTop: 5 }]}>Email</Text>
</TouchableOpacity>

<TouchableOpacity
  style={{ alignItems: 'center', justifyContent: 'center' }}
  onPress={() => {
    const coordinates = services.User_Business?.coordinates;
    if (coordinates) {
      let latitude, longitude;
      if (typeof coordinates === 'string') {
        try {
          const parsedCoordinates = JSON.parse(coordinates);
          latitude = parsedCoordinates.lat;
          longitude = parsedCoordinates.long;
        } catch (err) {
          console.error('Error parsing coordinates:', err);
          Alert.alert('Error', 'Invalid coordinates format');
          return;
        }
      } else if (typeof coordinates === 'object' && coordinates !== null) {
        // Check if coordinates is an object with lat and long properties
        if ('lat' in coordinates && 'long' in coordinates) {
          latitude = coordinates.lat;
          longitude = coordinates.long;
        } else {
          console.error('Invalid coordinates object structure');
          Alert.alert('Error', 'Invalid coordinates format');
          return;
        }
      } else {
        console.error('Unsupported coordinates format');
        Alert.alert('Error', 'Unsupported coordinates format');
        return;
      }

      if (typeof latitude === 'number' && typeof longitude === 'number') {
        openMaps(latitude, longitude);
      } else {
        Alert.alert('Error', 'Coordinates not available or invalid');
      }
    } else {
      Alert.alert('Error', 'Coordinates not available');
    }
  }}
>
  <View style={{ padding: 10, borderRadius: 99, alignItems: 'center', justifyContent: 'center', backgroundColor: Colors.lightGray }}>
    <Ionicons name="location-outline" size={25} color="blue" />
  </View>
  <Text style={styles.details}>Get Location</Text>
</TouchableOpacity>






<TouchableOpacity
  style={{ alignItems: 'center', justifyContent: 'center' }}
  onPress={() => {
    const phoneNumber = services.User_Business?.telephone;
    const message = "Hello, I am interested in your services."; // Optional prefilled message
    if (phoneNumber) {
      const url = `whatsapp://send?phone=${phoneNumber}&text=${encodeURIComponent(message)}`;
      Linking.canOpenURL(url)
        .then(supported => {
          if (supported) {
            Linking.openURL(url);
          } else {
            Alert.alert('Error', 'WhatsApp is not installed on this device');
          }
        })
        .catch(err => console.error('Error:', err));
    }
  }}
>
  <View style={{ padding: 10, borderRadius: 99, alignItems: 'center', justifyContent: 'center', backgroundColor: Colors.lightGray }}>
    <Ionicons name="logo-whatsapp" size={25} color="green" />
  </View>
  <Text style={styles.details}>WhatsApp</Text>
</TouchableOpacity>

     

      </View>
      <View style={styles.divider} />
      <Text style={styles.details}>About: {services.User_Business?.description}</Text>
      {/* <Text style={styles.details}>Phone: {services.User_Business?.telephone}</Text>
      <Text style={styles.details}>Address: {services.User_Business?.provider_email}</Text> */}
      {/* <Text style={styles.details}>Website: {services.User_Business?.website}</Text> */}
     

      </View>
   
      </View>
    </View>
  );
};
 
export default ProviderInfo;

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      
    },
    image: {
      width: '100%',
      height: 260,
      borderRadius: 5,
      marginBottom: 10,
    },
    businessName: {
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 10,
    },
    description: {
      fontSize: 16,
      marginBottom: 10,
    },
    details: {
      fontSize: 14,
      marginBottom: 5,
    },
    loader: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    errorText: {
      color: 'red',
      textAlign: 'center',
      marginTop: 20,
    },
    divider: {
      height: StyleSheet.hairlineWidth,
      backgroundColor: Colors.gray,
      marginVertical: 2,
    },
  });