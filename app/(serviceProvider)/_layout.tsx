import { Redirect, Slot, Tabs } from 'expo-router';
import React from 'react';
import { FontAwesome ,  Ionicons } from '@expo/vector-icons';

import { TabBarIcon } from '@/components/navigation/TabBarIcon';
// import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useAuth } from '@/providers/AuthProvider';
import { Stack } from 'expo-router';

export default function TabLayout() {
  const { isAuthenticated} = useAuth();
  console.log('isAuthenticated', isAuthenticated);

  if (!isAuthenticated) {
    return <Redirect href="/(auth)/" />;
  }

  // return <Slot/>
  //   
  return  (
  <Tabs
    screenOptions={{
      // tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
      headerShown: false,
    }}>
    <Tabs.Screen
      name="index"
      options={{
        title: 'Home',
        tabBarIcon: ({ color }) => <FontAwesome size={28} name="home" color={color} /> 
      }}
    />
    <Tabs.Screen
      name="addItems"
      options={{
        title: 'Add Items',
        tabBarIcon: ({ color }) => <Ionicons size={30} name="add-circle" color={color} /> 
      }}
    />
    <Tabs.Screen
      name="wishlist"
      options={{
        title: 'Appointment',
        tabBarIcon: ({ color }) => <Ionicons size={28} name="reader-outline" color={color} />          
      }}
    />
    <Tabs.Screen
      name="profile"
      options={{
        title: 'Profile',
        tabBarIcon: ({ color }) => <FontAwesome size={28} name="user-circle" color={color} />
      
      }}/>
  </Tabs>)


}
