import React, { useState } from 'react';
import { View, Text, Button, StyleSheet, TouchableOpacity, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { supabase } from '@/lib/supabase';

const AccountType = () => {
  const [userType, setUserType] = useState('');
  const router = useRouter();

  const selectAccountType = async (type: string) => {
    const userId = await AsyncStorage.getItem('userId');       
    const userType = await AsyncStorage.setItem('userType', type);
    if (type === 'Service_Provider') {
       router.push('/(onboarding)/BusinessInfo');
    } else if (type === 'Car_Owner') {
       router.push('/(carowner)/');
    }
  };

  return (
    <View style={{flex:1 /* ,backgroundColor:'yellow' */, alignItems: 'center',justifyContent:'center', gap:45}}>
                
                
                <TouchableOpacity onPress={() => selectAccountType('Car_Owner')}>
                <View style={{display: 'flex', alignItems:'center'}}>
                <Image source={require('@/assets/images/cars/carowner.jpeg')} style={{width: 150, height: 150, borderRadius: 10,}}/>
                <Text> Car Owner</Text>
                </View></TouchableOpacity>


                <TouchableOpacity onPress={() => selectAccountType('Service_Provider')}>
                <View style={{display: 'flex', alignItems:'center'}}>
                <Image source={require('@/assets/images/cars/serviceman.jpeg')} style={{width: 150, height: 150, borderRadius: 10}}/>
                <Text> Service Provider</Text>
                </View></TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
});

export default AccountType;