import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';

const UserName = () => {
  const [name, setName] = useState('');
  const router = useRouter();

  const completeUserName = async () => {
    if (name) {
      try {
        // Save the name in AsyncStorage
        await AsyncStorage.setItem('userName', name);

        // Log success message
        console.log('Username saved:', name);

        // Navigate to AccountType screen
        router.push('/(onboarding)/AccountType');
      } catch (error) {
        console.error('Error saving username:', error);
        alert('Failed to save username. Please try again.');
      }
    } else {
      alert('Please enter your name.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Enter Your Name</Text>
      <TextInput
        style={styles.input}
        placeholder="Your Name"
        value={name}
        onChangeText={setName}
      />
      <Button title="Next" onPress={completeUserName} />
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
  input: {
    width: '80%',
    padding: 10,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 20,
    borderRadius: 5,
  },
});

export default UserName;
