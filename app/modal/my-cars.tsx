import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Modal, TextInput, Image, ActivityIndicator, Alert, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, useRouter } from 'expo-router';
import { supabase } from '@/lib/supabase';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system'
import { randomUUID } from 'expo-crypto';
import { decode } from 'base64-arraybuffer';
// import  RemoteImage  from '@/components/RemoteImage';
import Defaultcarlogo from '@/assets/images/carconnect.jpg'

type Car = {
  id: string;
  make: string;
  model: string;
  year: string;
  image_url?: string;
};

export default function MyCarsScreen() {
  const [cars, setCars] = useState<Car[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingCar, setEditingCar] = useState<Car | null>(null);
  const [make, setMake] = useState('');
  const [model, setModel] = useState('');
  const [year, setYear] = useState('');
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [image, setImage] = useState<string | null>(null);
  const [showYearPicker, setShowYearPicker] = useState(false);
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 100 }, (_, i) => currentYear - i);
  const router = useRouter();
  

  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const storedUserId = await AsyncStorage.getItem('userId');
        if (storedUserId) {
          setUserId(storedUserId);
          fetchCars(storedUserId);
        }
      } catch (error) {
        console.error('Failed to fetch userId from AsyncStorage:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchUserId();
  }, []);

  const fetchCars = async (userId: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('vehicles')
        .select('*')
        .eq('owner', userId);
      
      if (error) throw error;
      
      const carsData = data.map((car: any) => ({
        id: car.id.toString(),
        make: car.make || '',
        model: car.model || '',
        year: car.year ? new Date(car.year).getFullYear().toString() : '', // Extract just the year
        image_url: car.image_url
      }));
      
      setCars(carsData);
    } catch (error) {
      console.error('Error fetching cars:', error);
    } finally {
      setLoading(false);
    }
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const uploadImage = async (imageUri: string) => {
    if (!imageUri.startsWith('file://')) {
      console.error('Invalid image URI:', imageUri);
      return null;
    }

    try {
      const base64 = await FileSystem.readAsStringAsync(imageUri, {
        encoding: 'base64',
      });
      const filePath = `${randomUUID()}.png`;
      const contentType = 'image/png';
      const { data, error } = await supabase.storage
        .from('owner_vehicle')
        .upload(filePath, decode(base64), { contentType });

      if (error) {
        console.error('Supabase storage upload error:', error);
        throw error;
      }

      if (data) {
        const { data: publicUrlData } = supabase.storage
          .from('owner_vehicle')
          .getPublicUrl(data.path);
        
        return publicUrlData.publicUrl;
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      Alert.alert('Error', 'Failed to upload image. Please try again.');
      return null;
    }
  };

  const handleAddCar = async () => {
    try {
      const userId = await AsyncStorage.getItem('userId');
      if (!userId) throw new Error('User ID not found');
      
      let imageUrl = null;
      
      if (image) {
        imageUrl = await uploadImage(image);
      }

      // Create a full date using the selected year
      const fullDate = new Date(parseInt(year), 0, 1); // This sets the date to January 1st of the selected year
      const formattedDate = fullDate.toISOString().split('T')[0]; // Format as YYYY-MM-DD

      const { data, error } = await supabase
        .from('vehicles')
        .insert({
          owner: userId,  // Changed from user_id to owner
          make,
          model,
          year: formattedDate, // Use the formatted date here
          image_url: imageUrl
        })
        .select();

      if (error) throw error;
      
      await fetchCars(userId);
      setModalVisible(false);
      resetForm();
    } catch (error) {
      console.error('Error adding car:', error);
      Alert.alert('Error', error.message || 'Failed to add the car. Please try again.');
    }
  };

  const handleEditCar = async () => {
  const fullDate = new Date(parseInt(year), 0, 1); // This sets the date to January 1st of the selected year
  const formattedDate = fullDate.toISOString().split('T')[0]; // Format as YYYY-MM-DD

    try {
      if (editingCar) {
        let imageUrl = editingCar.image_url;
        if (image && image !== editingCar.image_url) {
          imageUrl = await uploadImage(image);
        }

        const { data, error } = await supabase
          .from('vehicles')
          .update({
            make,
            model,
            year:formattedDate,
            image_url: imageUrl,
          })
          .eq('id', editingCar.id)
          .select();

        if (error) throw error;

        await fetchCars(userId!);
        setModalVisible(false);
        resetForm();
      }
    } catch (error) {
      console.error('Error editing car:', error);
      Alert.alert('Error', 'Failed to update the car. Please try again.');
    }
  };

  const resetForm = () => {
    setMake('');
    setModel('');
    setYear('');
    setImage(null);
    setEditingCar(null);
  };


  const openAddModal = () => {
    resetForm();
    setModalVisible(true);
  };

  const handleYearSelect = (selectedYear: number) => {
    setYear(selectedYear.toString());
    setShowYearPicker(false);
  };

  const handleDeleteCar = async (carId: string) => {
    Alert.alert(
      "Confirm Deletion",
      "Are you sure you want to delete this car?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        { 
          text: "Yes, Delete", 
          onPress: async () => {
            try {
              setLoading(true);
              const { error } = await supabase
                .from('vehicles')
                .delete()
                .eq('id', carId);

              if (error) throw error;

              // Immediately update the local state
              setCars(prevCars => prevCars.filter(car => car.id !== carId));

              Alert.alert('Success', 'Car deleted successfully');
            } catch (error) {
              console.error('Error deleting car:', error);
              Alert.alert('Error', 'Failed to delete the car. Please try again.');
            } finally {
              setLoading(false);
            }
          }
        }
      ]
    );
  };

  const openEditModal = (car: Car) => {
    setEditingCar(car);
    setMake(car.make);
    setModel(car.model);
    setYear(car.year);
    setImage(car.image_url || null);
    setModalVisible(true);

    console.log(setMake)
  };

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen 
        options={{ 
          title: 'My Cars',
          headerRight: () => (
            <TouchableOpacity onPress={openAddModal}>
              <Ionicons name="add" size={24} color="blue" />
            </TouchableOpacity>
          ),
        }} 
      />
      {loading ? (
        <ActivityIndicator size="large" color="blue" style={styles.loading} />
      ) : (
        <FlatList
          data={cars}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.carItem}>
              {item.image_url && (
               /*  <RemoteImage
                fallback={Defaultcarlogo}
                path={item.image_url}
                style={styles.carImage}
                resizeMode="contain"
              /> */
                <Image source={{ uri: item.image_url }} style={styles.carImage} />
              )}
              <View style={styles.carInfo}>
                <Text>{`${item.make} ${item.model} (${item.year})`}</Text>
                <View style={styles.actionButtons}>
                  <TouchableOpacity onPress={() => openEditModal(item)}>
                    <Ionicons name="create-outline" size={24} color="blue" />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => handleDeleteCar(item.id)}>
                    <Ionicons name="trash-outline" size={24} color="red" />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          )}
        />
      )}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalView}>
          <Text style={styles.modalTitle}>{editingCar ? 'Edit Car' : 'Add New Car'}</Text>
          <TouchableOpacity style={styles.imagePickerButton} onPress={pickImage}>
            {image ? (
              <Image source={{ uri: image }} style={styles.pickedImage} />
            ) : (
              <Text>Pick an image</Text>
            )}
          </TouchableOpacity>
          <TextInput
            style={styles.input}
            placeholder="Make"
            value={make}
            onChangeText={setMake}
          />
          <TextInput
            style={styles.input}
            placeholder="Model"
            value={model}
            onChangeText={setModel}
          />
          <TouchableOpacity
            style={styles.input}
            onPress={() => setShowYearPicker(true)}
          >
            <Text>{year || 'Select Year'}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            onPress={editingCar ? handleEditCar : handleAddCar}
          >
            <Text style={styles.buttonText}>{editingCar ? 'Update' : 'Add'}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.cancelButton]}
            onPress={() => setModalVisible(false)}
          >
            <Text style={styles.buttonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </Modal>
      <Modal
        animationType="slide"
        transparent={true}
        visible={showYearPicker}
        onRequestClose={() => setShowYearPicker(false)}
      >
        <View style={styles.yearPickerModalView}>
          <ScrollView style={styles.yearPickerScrollView}>
            {years.map((y) => (
              <TouchableOpacity
                key={y}
                style={styles.yearPickerItem}
                onPress={() => handleYearSelect(y)}
              >
                <Text style={styles.yearPickerText}>{y}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
          <TouchableOpacity
            style={[styles.button, styles.cancelButton]}
            onPress={() => setShowYearPicker(false)}
          >
            <Text style={styles.buttonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  carItem: {
    flexDirection: 'row',
    marginBottom: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
  },
  carInfo: {
    flex: 1,
    justifyContent: 'center',
    paddingLeft: 10,
  },
  actionButtons: {
    flexDirection: 'row',
    marginTop: 10,
  },
  carImage: {
    width: 100,
    height: 100,
  },
  loading: {
    marginTop: 20,
  },
  modalView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalTitle: {
    fontSize: 20,
    marginBottom: 20,
  },
  imagePickerButton: {
    marginBottom: 10,
    width: 150,
    height: 150,
    backgroundColor: '#ddd',
    justifyContent: 'center',
    alignItems: 'center',
  },
  pickedImage: {
    width: '100%',
    height: '100%',
  },
  input: {
    width: 250,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginBottom: 10,
  },
  button: {
    padding: 10,
    backgroundColor: 'blue',
    borderRadius: 5,
    marginBottom: 10,
  },
  cancelButton: {
    backgroundColor: 'red',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  yearPickerModalView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 20,
  },
  yearPickerScrollView: {
    maxHeight: 300,
    width: '100%',
  },
  yearPickerItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    alignItems: 'center',
    // color: 'white',
  },
  yearPickerText: {
    fontSize: 18,
    color: 'white',
  },
});