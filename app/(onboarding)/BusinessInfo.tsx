import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import * as Location from 'expo-location';
import { supabase } from '@/lib/supabase';
import { defaultStyles } from '@/constants/Styles';
import { Entypo } from '@expo/vector-icons';

type Coordinates = {
  latitude: number;
  longitude: number;
};

const BusinessInfo = () => {
  const [location, setLocation] = useState<Coordinates | null>(null);
  const [businessName, setBusinessname] = useState('');
  const [description, setDescription] = useState('');
  const [address, setAddress] = useState('');
  const [email, setEmail] = useState('');
  const [telephone, setTelephone] = useState('');
  const [locationError, setLocationError] = useState<string | null>(null);

  const router = useRouter();

  useEffect(() => {
    getPermissions();
  }, []);

  const getPermissions = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      setLocationError('Location permissions are not granted');
      console.log('Please grant location permissions');
      return;
    }

    const currentLocation = await Location.getCurrentPositionAsync({});
    setLocation({
      latitude: currentLocation.coords.latitude,
      longitude: currentLocation.coords.longitude,
    });
    console.log('Current Location:', currentLocation);
  };

  const completeBusinessInfo = async () => {
    if (businessName && address) {
      try {
        // Retrieve data from AsyncStorage
        const userId = await AsyncStorage.getItem('userId');
        const nname = await AsyncStorage.getItem('userName');
        const userType = await AsyncStorage.getItem('userType');
  
        // Log the retrieved data to verify it
        console.log('User ID:', userId);
        console.log('Username:', nname);
        console.log('User Type:', userType);
  
        // Insert business information into the User_Business table
        const { data, error } = await supabase.from('User_Business').insert({
          owner: userId,
          business_name: businessName,
          address,
          description,
          provider_email: email,
          telephone,
          coordinates: location
        });
  
        // Check for errors in the insertion process
        if (error) {
          console.error('Insert Error:', error);
          alert('Failed to save business information. Please try again.');
          return;
        }
  
        console.log('Inserted Business Data:', data);
  
        // Update user information in the users table
        const { error: updateError } = await supabase.from('users').update({
          user_type: userType,
          name: nname,
        }).eq('id', userId);
  
        // Check for errors in the update process
        if (updateError) {
          console.error('Update Error:', updateError);
          alert('Failed to update user information. Please try again.');
          return;
        }
  
        console.log('User information updated successfully');
  
        // Mark onboarding as complete and navigate to the next screen
        await AsyncStorage.setItem('onboardingComplete', 'true');
        router.replace('/(ServiceProvider)/');
      } catch (error) {
        console.error('Unexpected Error:', error);
        alert('An unexpected error occurred. Please try again.');
      }
    } else {
      alert('Please enter all business details.');
    }
  };

  return (
    <View style={{ marginTop: 20, padding: 35 }}>
      <Text style={defaultStyles.header}>Company Registration</Text>
      <Text>Create your business account here</Text>
      <TouchableOpacity onPress={() => console.log('Image upload placeholder')}>
        <Text>Store Images here Information</Text>
      </TouchableOpacity>
      <View>
        <TextInput
          style={defaultStyles.inputField}
          placeholder='Business Name'
          value={businessName}
          onChangeText={setBusinessname}
        />

        <TextInput
          style={defaultStyles.inputField}
          placeholder='Telephone'
          keyboardType='number-pad'
          value={telephone}
          onChangeText={setTelephone}
        />
        <TextInput
          style={defaultStyles.inputField}
          placeholder='Address'
          value={address}
          onChangeText={setAddress}
        />

        <TextInput
          style={defaultStyles.inputField}
          placeholder='Email'
          value={email}
          onChangeText={setEmail}
          keyboardType='email-address'
        />
        
        <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', marginBottom: 20 }}>
          <Text style={{ marginRight: 10 }}>Coordinates:</Text>
          <Text>{location ? `${location.latitude.toFixed(4)}, ${location.longitude.toFixed(4)}` : 'Fetching location...'}</Text>
          <TouchableOpacity style={[defaultStyles.btn, { padding: 3, marginLeft: 10 }]} onPress={getPermissions}>
            <Text style={{ color: 'white', fontSize: 14 }}>Refresh</Text>
            <Entypo name="location" size={24} color="white" />
          </TouchableOpacity>
        </View>

        {locationError && <Text style={{ color: 'red' }}>{locationError}</Text>}

        <TextInput
          style={defaultStyles.descriptionText}
          placeholder='Description'
          value={description}
          onChangeText={setDescription}
          numberOfLines={5}
          textAlignVertical='top'
        />

        <TouchableOpacity style={defaultStyles.btn} onPress={completeBusinessInfo}>
          <Text style={{ color: 'white', fontSize: 14 }}>Save</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default BusinessInfo;
