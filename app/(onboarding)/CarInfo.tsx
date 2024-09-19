import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { supabase } from '@/lib/supabase';
import { defaultStyles } from '@/constants/Styles';

const CarInfo = () => {
  const [carMake, setCarMake] = useState('');
  const [carModel, setCarModel] = useState('');
  const [carImage, setCarImage] = useState('');
  const [carYear, setCarYear] = useState('');
  const [carColor, setCarColor] = useState('');
  const [carLicensePlate, setCarLicensePlate] = useState('');
  const router = useRouter();

  const completeCarInfo = async () => {
    if (carMake && carModel){ //&& carYear ) {
      try {
        // Retrieve user info from AsyncStorage
        const userId = await AsyncStorage.getItem('userId') || '';
        const name = await AsyncStorage.getItem('userName'); // Consistent naming
        const userType = await AsyncStorage.getItem('userType');

        // Save car information to Supabase
        const { data, error } = await supabase.from('vehicles').insert({
          name: carMake,
          model: carModel,
          image_url: carImage,
         // year: carYear,
          color: carColor,
          //licence_plate: carLicensePlate,
          owner: userId,
      
        });

        // Log data to check the inserted information
        console.log('Inserted vehicle data:', data);

        if (error) {
          throw error;
        }

        // Update user information in the users table
        const { data: updatedData, error: updateError } = await supabase.from('users').update({
          user_type: userType,
          name: name,
        }).eq('id', userId);

        // Log data to check the update information
        console.log('Updated user data:', updatedData);

        if (updateError) {
          throw updateError;
        }

        await AsyncStorage.setItem('onboardingComplete', 'true');
        router.replace('/(CarOwner)/');
      } catch (error) {
        console.error('Error saving car info:', error);
        alert('Failed to save information. Please try again.');
      }
    } else {
      alert('Please enter all car details.');
    }
  };

  return (
    <View style={{ marginTop: 20, padding: 35 }}>
      <Text style={defaultStyles.header}>Vehicle Information</Text>
      <Text>Add your cars</Text>
      <TouchableOpacity>
        <Text>Store Images here Information</Text>
      </TouchableOpacity>
      <View>
        {/* <TextInput
          style={defaultStyles.inputField}
          placeholder='Car Make'
          value={carMake}
          onChangeText={setCarMake}
        /> */}
        <TextInput
          style={defaultStyles.inputField}
          placeholder='Car Name'
          value={carMake}
          onChangeText={setCarMake}
        />
        <TextInput
          style={defaultStyles.inputField}
          placeholder='Model'
          value={carModel}
          onChangeText={setCarModel}
        />
        {/* <TextInput
          style={defaultStyles.inputField}
          placeholder='Year'
          keyboardType='number-pad'
          value={carYear}
          onChangeText={setCarYear}
        /> */}
        <TextInput
          style={defaultStyles.inputField}
          placeholder='Color'
          value={carColor}
          onChangeText={setCarColor}
        />
        {/* <TextInput
          style={defaultStyles.inputField}
          placeholder='Plate Number'
          value={carLicensePlate}
          onChangeText={setCarLicensePlate}
        /> */}
        <TouchableOpacity style={defaultStyles.btn} onPress={completeCarInfo}>
          <Text style={{ color: 'white', fontSize: 14 }}>Save</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default CarInfo;
