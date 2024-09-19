import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, Button, Image, Alert } from 'react-native';
import { supabase } from '@/lib/supabase';
import * as ImagePicker from 'expo-image-picker';
import { Picker } from '@react-native-picker/picker';
import * as Location from 'expo-location';

interface Car {
  id: string;
  user_id: string;
  make: string;
  model: string;
  year: number;
  license_plate: string;
  color: string;
  image_url?: string;
  latitude?: number;
  longitude?: number;
}

interface CarManagementProps {
  onClose: () => void;
}

const CAR_COLORS = [
  { name: 'Black', hex: '#000000' },
  { name: 'White', hex: '#FFFFFF' },
  { name: 'Silver', hex: '#C0C0C0' },
  { name: 'Gray', hex: '#808080' },
  { name: 'Red', hex: '#FF0000' },
  { name: 'Blue', hex: '#0000FF' },
  { name: 'Green', hex: '#008000' },
  { name: 'Yellow', hex: '#FFFF00' },
  { name: 'Orange', hex: '#FFA500' },
  { name: 'Brown', hex: '#A52A2A' },
  { name: 'Beige', hex: '#F5F5DC' },
  { name: 'Purple', hex: '#800080' },
  { name: 'Gold', hex: '#FFD700' },
];

const CarManagement: React.FC<CarManagementProps> = ({ onClose }) => {
  const [cars, setCars] = useState<Car[]>([]);
  const [newCar, setNewCar] = useState<Omit<Car, 'id' | 'user_id'>>({
    make: '',
    model: '',
    year: 0,
    license_plate: '',
    color: '',
    image_url: '',
    latitude: undefined,
    longitude: undefined,
  });
  const [editingCar, setEditingCar] = useState<Car | null>(null);

  useEffect(() => {
    fetchCars();
  }, []);

  const fetchCars = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data, error } = await supabase
        .from('cars')
        .select('*')
        .eq('user_id', user.id);
      if (error) {
        console.error('Error fetching cars:', error);
      } else {
        setCars(data || []);
      }
    }
  };

  const addCar = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data, error } = await supabase
        .from('cars')
        .insert({ ...newCar, user_id: user.id })
        .single();
      if (error) {
        console.error('Error adding car:', error);
      } else {
        setCars([...cars, data]);
        setNewCar({ make: '', model: '', year: 0, license_plate: '', color: '', image_url: '', latitude: undefined, longitude: undefined });
      }
    }
  };

  const updateCar = async () => {
    if (editingCar) {
      const { data, error } = await supabase
        .from('cars')
        .update(editingCar)
        .eq('id', editingCar.id);
      if (error) {
        console.error('Error updating car:', error);
      } else {
        setCars(cars.map(car => car.id === editingCar.id ? editingCar : car));
        setEditingCar(null);
      }
    }
  };

  const deleteCar = async (id: string) => {
    const { error } = await supabase
      .from('cars')
      .delete()
      .eq('id', id);
    if (error) {
      console.error('Error deleting car:', error);
    } else {
      setCars(cars.filter(car => car.id !== id));
    }
  };

  const pickImage = async (forNewCar: boolean) => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      const imageUrl = result.assets[0].uri;
      if (forNewCar) {
        setNewCar({ ...newCar, image_url: imageUrl });
      } else if (editingCar) {
        setEditingCar({ ...editingCar, image_url: imageUrl });
      }
    }
  };

  const getLocation = async (forNewCar: boolean) => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission to access location was denied');
      return;
    }

    let location = await Location.getCurrentPositionAsync({});
    if (forNewCar) {
      setNewCar({
        ...newCar,
        latitude: location.coords.latitude,
        longitude: location.coords.longitude
      });
    } else if (editingCar) {
      setEditingCar({
        ...editingCar,
        latitude: location.coords.latitude,
        longitude: location.coords.longitude
      });
    }
  };

  const renderCarForm = (car: Car | Omit<Car, 'id' | 'user_id'>, isEditing: boolean) => (
    <View>
      <TextInput
        value={car.make}
        onChangeText={(text) => isEditing ? setEditingCar({...editingCar!, make: text}) : setNewCar({...newCar, make: text})}
        placeholder="Make"
        style={styles.input}
      />
      <TextInput
        value={car.model}
        onChangeText={(text) => isEditing ? setEditingCar({...editingCar!, model: text}) : setNewCar({...newCar, model: text})}
        placeholder="Model"
        style={styles.input}
      />
      <TextInput
        value={car.year.toString()}
        onChangeText={(text) => isEditing ? setEditingCar({...editingCar!, year: parseInt(text) || 0}) : setNewCar({...newCar, year: parseInt(text) || 0})}
        placeholder="Year"
        keyboardType="numeric"
        style={styles.input}
      />
      <TextInput
        value={car.license_plate}
        onChangeText={(text) => isEditing ? setEditingCar({...editingCar!, license_plate: text}) : setNewCar({...newCar, license_plate: text})}
        placeholder="License Plate"
        style={styles.input}
      />
      {renderColorPicker(car.color, (color) => isEditing ? setEditingCar({...editingCar!, color}) : setNewCar({...newCar, color}))}
      <TouchableOpacity onPress={() => pickImage(!isEditing)} style={styles.imagePicker}>
        <Text>Pick an image</Text>
      </TouchableOpacity>
      {car.image_url && <Image source={{ uri: car.image_url }} style={styles.previewImage} />}
      <TouchableOpacity onPress={() => getLocation(!isEditing)} style={styles.locationButton}>
        <Text>Get Current Location</Text>
      </TouchableOpacity>
      {(car.latitude && car.longitude) && (
        <Text style={styles.locationText}>
          Location: {car.latitude.toFixed(6)}, {car.longitude.toFixed(6)}
        </Text>
      )}
      <TouchableOpacity onPress={isEditing ? updateCar : addCar} style={styles.addButton}>
        <Text>{isEditing ? 'Update Car' : 'Add Car'}</Text>
      </TouchableOpacity>
      {isEditing && (
        <TouchableOpacity onPress={() => setEditingCar(null)} style={styles.cancelButton}>
          <Text>Cancel Edit</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  const renderCarItem = ({ item }: { item: Car }) => (
    <View style={styles.carItem}>
      {item.image_url && <Image source={{ uri: item.image_url }} style={styles.carImage} />}
      <Text>{`${item.year} ${item.make} ${item.model}`}</Text>
      <Text>{`License: ${item.license_plate}, Color: ${item.color}`}</Text>
      {(item.latitude && item.longitude) && (
        <Text>Location: {item.latitude.toFixed(6)}, {item.longitude.toFixed(6)}</Text>
      )}
      <View style={styles.buttonContainer}>
        <TouchableOpacity onPress={() => setEditingCar(item)} style={styles.button}>
          <Text>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => deleteCar(item.id)} style={[styles.button, styles.deleteButton]}>
          <Text>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderColorPicker = (selectedColor: string, onColorChange: (color: string) => void) => (
    <Picker
      selectedValue={selectedColor}
      onValueChange={onColorChange}
      style={styles.picker}
    >
      {CAR_COLORS.map((color) => (
        <Picker.Item key={color.name} label={color.name} value={color.hex} />
      ))}
    </Picker>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Car Management</Text>
      
      {editingCar ? renderCarForm(editingCar, true) : renderCarForm(newCar, false)}

      <FlatList
        data={cars}
        renderItem={renderCarItem}
        keyExtractor={(item) => item.id}
        style={styles.list}
      />
      <Button title="Close" onPress={onClose} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
  addButton: {
    backgroundColor: '#007AFF',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 20,
  },
  list: {
    flex: 1,
  },
  carItem: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  button: {
    padding: 5,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#007AFF',
  },
  deleteButton: {
    borderColor: 'red',
  },
  picker: {
    height: 50,
    width: '100%',
    marginBottom: 10,
  },
  imagePicker: {
    backgroundColor: '#ddd',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 10,
  },
  previewImage: {
    width: 100,
    height: 100,
    resizeMode: 'cover',
    marginBottom: 10,
  },
  carImage: {
    width: '100%',
    height: 150,
    resizeMode: 'cover',
    marginBottom: 10,
  },
  cancelButton: {
    backgroundColor: '#ccc',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 20,
  },
  locationButton: {
    backgroundColor: '#4CAF50',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 10,
  },
  locationText: {
    marginBottom: 10,
  },
});

export default CarManagement;
