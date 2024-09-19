import React from 'react';
import { SafeAreaView, ScrollView, Text, StyleSheet } from 'react-native';
import { Stack } from 'expo-router';

export default function TermsAndConditionsScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen 
        options={{ 
          title: 'Terms and Conditions',
          headerShown: true,
          presentation: 'modal'
        }} 
      />
      <ScrollView style={styles.content}>
        <Text style={styles.title}>Terms and Conditions</Text>
        <Text style={styles.paragraph}>
          Last updated: [Date]
        </Text>
        <Text style={styles.paragraph}>
          Please read these Terms and Conditions ("Terms", "Terms and Conditions") carefully before using the [your app name] mobile application (the "Service") operated by [Your Company Name] ("us", "we", or "our").
        </Text>
        <Text style={styles.paragraph}>
          Your access to and use of the Service is conditioned on your acceptance of and compliance with these Terms. These Terms apply to all visitors, users and others who access or use the Service.
        </Text>
        <Text style={styles.paragraph}>
          By accessing or using the Service you agree to be bound by these Terms. If you disagree with any part of the terms then you may not access the Service.
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