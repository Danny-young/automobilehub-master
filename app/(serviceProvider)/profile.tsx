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
  
  
  const Page = () => { 
    return (
      <View>
        <Text>Profile</Text>
      </View>
    )
  }
  
  export default Page;
  