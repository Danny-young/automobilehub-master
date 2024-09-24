import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Modal, TextInput, Image, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, useRouter } from 'expo-router';
import { supabase } from '@/lib/supabase';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';

type Car = {
  id: string;
  name: string;
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
  const [loading, setLoading] = useState<boolean>(true); // Loading state
  const [image, setImage] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const storedUserId = await AsyncStorage.getItem('userId');
        if (storedUserId) {
          setUserId(storedUserId);
          fetchCars(storedUserId); // Fetch cars after userId is available
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
    setLoading(true); // Start loading
    try {
      const { data, error } = await supabase
        .from('vehicles')
        .select('*')
        .eq('owner', userId);
  
      if (error) {
        console.error('Error fetching cars:', error);
      } else {
        // Convert the data to Car[] type
        const carsData = data.map((car: any) => ({
          id: car.id.toString(), // Convert number to string
          name: car.name,
          model: car.model,
          year: car.year,
          image_url: car.image_url
        }));
  
        setCars(carsData || []);
      }
    } catch (error) {
      console.error('Error fetching cars:', error);
    } finally {
      setLoading(false); // Stop loading
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

  const uploadImage = async (uri: string) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return undefined;
  
    const fileExt = uri.split('.').pop();
    const fileName = `${user.id}/${Date.now()}.${fileExt}`;
    const filePath = `${fileName}`;
  
    let { error: uploadError } = await supabase.storage
      .from('car-images')
      .upload(filePath, {
        uri: uri,
        type: `image/${fileExt}`,
        name: fileName,
      });
  
    if (uploadError) {
      console.error('Error uploading image:', uploadError);
      return undefined;
    }
  
    const { data: { publicUrl }, error: urlError } = supabase.storage
      .from('car-images')
      .getPublicUrl(filePath);
  
    if (urlError) {
      console.error('Error getting public URL:', urlError);
      return undefined;
    }
  
    return publicUrl.toString(); // Convert to string
  };

  const handleAddCar = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      let imageUrl = null;
      if (image) {
        imageUrl = await uploadImage(image);
      }

      const { data, error } = await supabase
        .from('vehicles')
        .insert({ user_id: user.id, make, model, year, image_url: imageUrl })
        .select();
      if (error) console.error('Error adding car:', error);
      else {
        fetchCars(user.id);
        setModalVisible(false);
        resetForm();
      }
    }
  };

  const handleEditCar = async () => {
    if (editingCar) {
      let imageUrl = editingCar.image_url;
      if (image && image !== editingCar.image_url) {
        imageUrl  = await uploadImage(image);
      }

      const { data, error } = await supabase
        .from('vehicles')
        .update({ make, model, year, image_url: imageUrl })
        .eq('id', editingCar.id)
        .select();
      if (error) console.error('Error updating car:', error);
      else {
        fetchCars(userId!);
        setModalVisible(false);
        resetForm();
      }
    }
  };

  const handleDeleteCar = async (id: string) => {
    const { error } = await supabase
      .from('vehicles')
      .delete()
      .eq('id', id);
    if (error) console.error('Error deleting car:', error);
    else fetchCars(userId!);
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

  const openEditModal = (car: Car) => {
    setEditingCar(car);
    setMake(car.name);
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
                <Image source={{ uri: item.image_url }} style={styles.carImage} />
              )}
              <View style={styles.carInfo}>
                <Text>{`${item.name} ${item.model}`}</Text>
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
          <TextInput
            style={styles.input}
            placeholder="Year"
            value={year}
            onChangeText={setYear}
            keyboardType="numeric"
          />
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
});
