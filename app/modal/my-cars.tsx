import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Modal, TextInput, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, useRouter } from 'expo-router';
import { supabase } from '@/lib/supabase';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';

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
  const [image, setImage] = useState<string | null>(null);
  const router = useRouter();

  // useEffect(() => {
  //   fetchCars();
  // }, []);

  // const fetchCars = async () => {
  //   const { data: { user } } = await supabase.auth.getUser();
  //   if (user) {
  //     const { data, error } = await supabase
  //       .from('cars')
  //       .select('*')
  //       .eq('user_id', user.id);
  //     if (error) console.error('Error fetching cars:', error);
  //     else setCars(data || []);
  //   }
  // };

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
    if (!user) return null;

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
      return null;
    }

    const { data: { publicUrl }, error: urlError } = supabase.storage
      .from('car-images')
      .getPublicUrl(filePath);

    if (urlError) {
      console.error('Error getting public URL:', urlError);
      return null;
    }

    return publicUrl;
  };

  const handleAddCar = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      let imageUrl = null;
      if (image) {
        imageUrl = await uploadImage(image);
      }

      const { data, error } = await supabase
        .from('cars')
        .insert({ user_id: user.id, make, model, year, image_url: imageUrl })
        .select();
      if (error) console.error('Error adding car:', error);
      else {
        fetchCars();
        setModalVisible(false);
        resetForm();
      }
    }
  };

  const handleEditCar = async () => {
    if (editingCar) {
      let imageUrl = editingCar.image_url;
      if (image && image !== editingCar.image_url) {
        imageUrl = await uploadImage(image);
      }

      const { data, error } = await supabase
        .from('cars')
        .update({ make, model, year, image_url: imageUrl })
        .eq('id', editingCar.id)
        .select();
      if (error) console.error('Error updating car:', error);
      else {
        fetchCars();
        setModalVisible(false);
        resetForm();
      }
    }
  };

  const handleDeleteCar = async (id: string) => {
    const { error } = await supabase
      .from('cars')
      .delete()
      .eq('id', id);
    if (error) console.error('Error deleting car:', error);
    else fetchCars();
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
    setMake(car.make);
    setModel(car.model);
    setYear(car.year);
    setImage(car.image_url || null);
    setModalVisible(true);
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
      <FlatList
        data={cars}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.carItem}>
            {item.image_url && (
              <Image source={{ uri: item.image_url }} style={styles.carImage} />
            )}
            <View style={styles.carInfo}>
              <Text>{`${item.year} ${item.make} ${item.model}`}</Text>
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
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  carImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 10,
  },
  carInfo: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  actionButtons: {
    flexDirection: 'row',
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  input: {
    height: 40,
    width: '100%',
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  button: {
    backgroundColor: 'blue',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  cancelButton: {
    backgroundColor: 'red',
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
  },
  imagePickerButton: {
    width: 100,
    height: 100,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  pickedImage: {
    width: 100,
    height: 100,
    borderRadius: 10,
  },
});