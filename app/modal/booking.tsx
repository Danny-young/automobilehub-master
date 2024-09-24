import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { supabase } from '@/lib/supabase';
import BookingSection from '@/components/BookAppointment/booking';
import AsyncStorage from '@react-native-async-storage/async-storage';

type Vehicle = {
  id: string;
  make: string;
  model: string;
  year: string;
  image_url?: string; // Image URL for car
};

export default function BookingScreen() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const { serviceId } = useLocalSearchParams();
  const router = useRouter();
  const [modalVisible, setModalVisible] = useState(false);
  const [make, setMake] = useState('');
  const [model, setModel] = useState('');
  const [year, setYear] = useState('');
  const [userId, setUserId] = useState<string | null>(null);
  const [image, setImage] = useState<string | null>(null);
  const [cars, setCars] = useState<Car[]>([]);
 

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

        console.log(carsData);
      }
    } catch (error) {
      console.error('Error fetching cars:', error);
    } finally {
      setLoading(false); // Stop loading
    }
  };

  const handleVehicleSelect = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle);
  };

  const handleBookAppointment = () => {
    if (selectedVehicle) {
      console.log('Booking appointment for:', { serviceId, vehicleId: selectedVehicle.id });
      router.back(); // Navigate back after booking
    } else {
      alert('Please select a vehicle');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen
        options={{
          title: 'Book Appointment',
          headerShown: true,
          presentation: 'modal',
        }}
      />
      <ScrollView>
        <Text style={styles.sectionTitle}>Select Your Vehicle:</Text>

        {loading ? (
          <ActivityIndicator size="large" color="blue" style={styles.loading} />
        ) : (
          vehicles.map((vehicle) => (
            <TouchableOpacity
              key={vehicle.id}
              style={[
                styles.vehicleItem,
                selectedVehicle?.id === vehicle.id && styles.selectedVehicle,
              ]}
              onPress={() => handleVehicleSelect(vehicle)}
            >
              {vehicle.image_url && (
                <Image source={{ uri: vehicle.image_url }} style={styles.carImage} />
              )}
              <View style={styles.carDetails}>
                <Text style={styles.carText}>{`${vehicle.year} ${vehicle.make} ${vehicle.model}`}</Text>
              </View>
            </TouchableOpacity>
          ))
        )}

        <BookingSection />

        <TouchableOpacity
          style={[styles.bookButton, !selectedVehicle && styles.disabledButton]}
          onPress={handleBookAppointment}
          disabled={!selectedVehicle}
        >
          <Text style={styles.bookButtonText}>Book Appointment</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'yellow',
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  vehicleItem: {
    flexDirection: 'row', // Align image and text horizontally
    padding: 15,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginBottom: 10,
  },
  selectedVehicle: {
    backgroundColor: '#e0e0e0',
  },
  carImage: {
    width: 100,
    height: 100,
    marginRight: 10,
  },
  carDetails: {
    flex: 1,
    justifyContent: 'center',
  },
  carText: {
    fontSize: 16,
  },
  loading: {
    marginTop: 20,
  },
  bookButton: {
    backgroundColor: 'blue',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20,
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
  bookButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
