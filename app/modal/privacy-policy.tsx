import React from 'react';
import { SafeAreaView, ScrollView, Text, StyleSheet } from 'react-native';
import { Stack } from 'expo-router';

export default function PrivacyPolicyScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen 
        options={{ 
          title: 'Privacy Policy',
          headerShown: true,
          presentation: 'modal'
        }} 
      />
      <ScrollView style={styles.content}>
        <Text style={styles.title}>Privacy Policy</Text>
        <Text style={styles.paragraph}>
          Last updated: [Date]
        </Text>
        <Text style={styles.paragraph}>
          [Your Company Name] ("us", "we", or "our") operates [your app name] (the "Service"). This page informs you of our policies regarding the collection, use and disclosure of Personal Information when you use our Service.
        </Text>
        <Text style={styles.paragraph}>
          We will not use or share your information with anyone except as described in this Privacy Policy.
        </Text>
        {/* Add more sections as needed */}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  paragraph: {
    fontSize: 16,
    marginBottom: 15,
    lineHeight: 24,
  },
});