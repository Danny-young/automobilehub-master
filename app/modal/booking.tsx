import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { supabase } from '@/lib/supabase';
import BookingSection from '@/components/BookAppointment/booking';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native'; // Assuming Alert is imported from expo

type Vehicle = {
  id: string;
  name: string;
  model: string;
  year: string;
  image_url?: string; // Image URL for car
};

type Service = {
  id: string | number;
  name: string;
  description: string;
  price: number;
  image_url?: string;
  category: string;
  user_business_id: string;
};

export default function BookingScreen() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [service, setService] = useState<Service | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const { serviceId } = useLocalSearchParams(); // Correctly extract serviceId
  const router = useRouter();
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');

  useEffect(() => {
    const fetchUserIdAndData = async () => {
      try {
        const storedUserId = await AsyncStorage.getItem('userId');
        if (storedUserId && serviceId) {
          fetchVehicles(storedUserId);
          fetchServiceDetails(serviceId); // Now this should work correctly
        }
      } catch (error) {
        console.error('Failed to fetch userId from AsyncStorage:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserIdAndData();
  }, [serviceId]);

  const fetchVehicles = async (userId: string) => {
    setLoading(true); // Start loading
    try {
      const { data, error } = await supabase
        .from('vehicles')
        .select('*')
        .eq('owner', userId);

      if (error) {
        console.error('Error fetching vehicles:', error);
      } else {
        setVehicles(data || []);
      }
    } catch (error) {
      console.error('Error fetching vehicles:', error);
    } finally {
      setLoading(false); // Stop loading
    }
  };

  const fetchServiceDetails = async (serviceId: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('Services')
        .select('*, User_Business!inner(id)')
        .eq('id', serviceId)
        .single();

      if (error) throw error;

      setService({
        ...data,
        user_business_id: data.User_Business.id
      });
    } catch (error) {
      console.error('Error fetching service details:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleVehicleSelect = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle);
  };

  const handleBookAppointment = async () => {
    if (selectedVehicle && service && selectedDate && selectedTime) {
      try {
        const userId = await AsyncStorage.getItem('userId');
        if (!userId) throw new Error('User ID not found');

        const { data, error } = await supabase
          .from('booking')
          .insert({
            user_id: userId,
            service_provider: service.user_business_id,
            service_type: selectedVehicle.id,
            service_category: service.category,
            appointment_date: selectedDate,
            appointment_time: selectedTime,
            appointment_type: 'pending',
            
          })
          .select();

        if (error) throw error;

        console.log('Booking created:', data);
        Alert.alert('Success', 'Appointment booked successfully!');
        router.back();
      } catch (error) {
        console.error('Error booking appointment:', error);
        Alert.alert('Error', 'Failed to book appointment. Please try again.');
      }
    } else {
      Alert.alert('Error', 'Please select a vehicle, service, date, and time');
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
        <Text style={styles.sectionTitle}>Service Details:</Text>
        {service && (
          <View style={styles.serviceDetails}>
            {service.image_url && (
              <Image source={{ uri: service.image_url }} style={styles.serviceImage} />
            )}
            <Text style={styles.serviceName}>{service.name}</Text>
            <Text style={styles.serviceDescription}>{service.description}</Text>
            <Text style={styles.servicePrice}>Price: ${service.price}</Text>
          </View>
        )}

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
                <Text style={styles.carText}>{`${vehicle.year} ${vehicle.name} ${vehicle.model}`}</Text>
              </View>
            </TouchableOpacity>
          ))
        )}

        <BookingSection
          onDateSelect={(date) => setSelectedDate(date)}
          onTimeSelect={(time) => setSelectedTime(time)}
        />

        <TouchableOpacity
          style={[styles.bookButton, (!selectedVehicle || !service || !selectedDate || !selectedTime) && styles.disabledButton]}
          onPress={handleBookAppointment}
          disabled={!selectedVehicle || !service || !selectedDate || !selectedTime}
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
    backgroundColor: '#fff',
    padding: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  serviceDetails: {
    marginBottom: 20,
  },
  serviceImage: {
    width: '100%',
    height: 200,
    marginBottom: 10,
  },
  serviceName: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  serviceDescription: {
    fontSize: 16,
    marginBottom: 10,
  },
  servicePrice: {
    fontSize: 16,
    fontWeight: 'bold',
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