import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { supabase } from '@/lib/supabase';
import BookingSection from '@/components/BookAppointment/booking';

type Vehicle = {
  id: string;
  make: string;
  model: string;
  year: string;
};

export default function BookingScreen() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const { serviceId } = useLocalSearchParams();
  const router = useRouter();

  useEffect(() => {
    fetchVehicles();
  }, []);

  const fetchVehicles = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    // if (user) {
    //   const { data, error } = await supabase
    //     .from('vehicles')
    //     .select('*')
    //     .eq('user_id', user.id);
    //   if (error) console.error('Error fetching vehicles:', error);
    //   else setVehicles(data || []);
    // }
  };

  const handleVehicleSelect = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle);
  };

  const handleBookAppointment = () => {
    if (selectedVehicle) {
      // Here you would typically send the booking data to your backend
      console.log('Booking appointment for:', { serviceId, vehicleId: selectedVehicle.id });
      // After successful booking, navigate back or to a confirmation screen
      router.back();
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
          presentation: 'modal'
        }} 
      />
      <ScrollView>
        <Text style={styles.sectionTitle}>Select Your Vehicle:</Text>
        {vehicles.map((vehicle) => (
          <TouchableOpacity
            key={vehicle.id}
            style={[
              styles.vehicleItem,
              selectedVehicle?.id === vehicle.id && styles.selectedVehicle
            ]}
            onPress={() => handleVehicleSelect(vehicle)}
          >
            <Text>{`${vehicle.year} ${vehicle.make} ${vehicle.model}`}</Text>
          </TouchableOpacity>
        ))}

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
    padding: 15,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginBottom: 10,
  },
  selectedVehicle: {
    backgroundColor: '#e0e0e0',
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