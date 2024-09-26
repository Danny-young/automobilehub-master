import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { supabase } from '@/lib/supabase';
import BookingSection from '@/components/BookAppointment/booking';
import AsyncStorage from '@react-native-async-storage/async-storage';

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
};

export default function BookingScreen() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [service, setService] = useState<Service | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const { serviceId } = useLocalSearchParams(); // Correctly extract serviceId
  const router = useRouter();

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
    setLoading(true); // Start loading
    try {
      const { data, error } = await supabase
        .from('Services')
        .select('*')
        .eq('id', serviceId)
        .single();

      if (error) {
        console.error('Error fetching service details:', error);
      } else {
        setService(data);
      }
    } catch (error) {
      console.error('Error fetching service details:', error);
    } finally {
      setLoading(false); // Stop loading
    }
  };

  const handleVehicleSelect = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle);
  };

  const handleBookAppointment = () => {
    if (selectedVehicle && service) {
      console.log('Booking appointment for:', { serviceId, vehicleId: selectedVehicle.id });
      router.back(); // Navigate back after booking
    } else {
      alert('Please select a vehicle and service');
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

        <BookingSection />

        <TouchableOpacity
          style={[styles.bookButton, (!selectedVehicle || !service) && styles.disabledButton]}
          onPress={handleBookAppointment}
          disabled={!selectedVehicle || !service}
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
