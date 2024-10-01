import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { supabase } from '@/lib/supabase';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Colors from '@/constants/Colors';

interface Appointment {
  id: number;
  service_provider: string;
  service_category: string;
  appointment_date: string;
  appointment_time: string;
  appointment_type: string;
}

const Wishlist = () => {
  const [currentAppointments, setCurrentAppointments] = useState<Appointment[]>([]);
  const [pastAppointments, setPastAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const userId = await AsyncStorage.getItem('userId');
      if (!userId) {
        throw new Error('User ID not found');
      }

      const { data, error } = await supabase
        .from('booking')
        .select('*, User_Business(*)')
        .eq('user_id', userId)
        .order('appointment_date', { ascending: false });

      if (error) throw error;

      const current = data.filter(app => ['pending', 'accepted'].includes(app.appointment_type));
      const past = data.filter(app => app.appointment_type === 'completed');

      setCurrentAppointments(current);
      setPastAppointments(past);
    } catch (error) {
      console.error('Error fetching appointments:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderAppointmentItem = ({ item }: { item: Appointment }) => (
    <View style={styles.appointmentItem}>
      <Text style={styles.appointmentText}>Service: {item.service_provider}</Text>
      <Text style={styles.appointmentText}>Category: {item.service_category}</Text>
      <Text style={styles.appointmentText}>Date: {item.appointment_date}</Text>
      <Text style={styles.appointmentText}>Time: {item.appointment_time}</Text>
      <Text style={styles.appointmentText}>Status: {item.appointment_type}</Text>
    </View>
  );

  if (loading) {
    return <Text style={styles.loadingText}>Loading appointments...</Text>;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Current Appointments</Text>
      {currentAppointments.length > 0 ? (
        <FlatList
          data={currentAppointments}
          renderItem={renderAppointmentItem}
          keyExtractor={(item) => item.id.toString()}
          style={styles.list}
        />
      ) : (
        <Text style={styles.noAppointmentsText}>No current appointments</Text>
      )}

      <Text style={styles.sectionTitle}>Past Appointments</Text>
      {pastAppointments.length > 0 ? (
        <FlatList
          data={pastAppointments}
          renderItem={renderAppointmentItem}
          keyExtractor={(item) => item.id.toString()}
          style={styles.list}
        />
      ) : (
        <Text style={styles.noAppointmentsText}>No past appointments</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: Colors.background,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
    color: Colors.dark,
  },
  appointmentItem: {
    backgroundColor: Colors.lightGray,
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
  },
  appointmentText: {
    fontSize: 16,
    marginBottom: 5,
    color: Colors.dark,
  },
  noAppointmentsText: {
    fontSize: 16,
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: 10,
    color: Colors.gray,
  },
  loadingText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
    color: Colors.dark,
  },
  list: {
    maxHeight: 300, // Adjust this value as needed
  },
});

export default Wishlist;