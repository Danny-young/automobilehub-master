import {
  View,
  Text,
  Button,
  StyleSheet,
  SafeAreaView,
  Image,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { defaultStyles } from '@/constants/Styles';
import { Ionicons } from '@expo/vector-icons';
import Colors from '@/constants/Colors';
import { Link, Redirect } from 'expo-router';
import { supabase } from '@/lib/supabase';

const handleLogout = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) {
    console.error('Error signing out:', error.message);
  } else {
    // Optionally, navigate the user to a login or welcome screen
    <Redirect href='/(auth)'/>
  }
};
const Page = () => { 
  return (
    <View style={{padding:50}}>
      <Text>Profile</Text>
      <TouchableOpacity onPress={handleLogout}>
  <Text>Outtttt</Text>
  </TouchableOpacity>
    </View>
  )
}

export default Page;
