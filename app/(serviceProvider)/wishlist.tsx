import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, FlatList, Alert } from 'react-native';
import { supabase } from '@/lib/supabase';
import { defaultStyles } from '@/constants/Styles';
import Header from '@/components/servicepage/Header';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';

interface Appointment {
  id: number;
  user_id: string;
  service_provider: string;
  service_type: string;
  service_category: string;
  appointment_date: string;
  appointment_time: string;
  appointment_type: string;
  status: 'pending' | 'accepted' | 'rejected';
}

// Configure notifications
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export default function Wishlist() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    registerForPushNotificationsAsync();
    const notificationListener = Notifications.addNotificationReceivedListener(handleNotification);
    const intervalId = setInterval(checkForNewAppointments, 60000); // Check every minute

    // Add this line to fetch appointments when the component mounts
    fetchAppointments();

    return () => {
      Notifications.removeNotificationSubscription(notificationListener);
      clearInterval(intervalId);
    };
  }, []);

  const registerForPushNotificationsAsync = async () => {
    try {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      if (finalStatus !== 'granted') {
        alert('Failed to get push token for push notification!');
        return;
      }
    } catch (error) {
      console.error('Error requesting push notification permissions:', error);
      alert('Error requesting push notification permissions');
    }
  };

  const handleNotification = (notification: Notifications.Notification) => {
    Alert.alert(
      notification.request.content.title || '',
      notification.request.content.body || ''
    );
  };

  const checkForNewAppointments = async () => {
    try {
      const userId = await AsyncStorage.getItem('userId');
      if (!userId) return;

      const { data, error } = await supabase
        .from('booking')
        .select('*')
        .eq('service_provider', userId)
        .eq('appointment_type', 'pending')
        .order('created_at', { ascending: false })
        .limit(1);

      if (error) {
        console.error('Error checking for new appointments:', error);
        return;
      }

      if (data && data.length > 0) {
        const latestAppointment = data[0];
        const lastCheckedTime = await AsyncStorage.getItem('lastCheckedTime');

        if (!lastCheckedTime || new Date(latestAppointment.created_at) > new Date(lastCheckedTime)) {
          await Notifications.scheduleNotificationAsync({
            content: {
              title: 'New Booking Request!',
              body: `You have a new booking request for ${latestAppointment.service_type}`,
            },
            trigger: null,
          });
          await AsyncStorage.setItem('lastCheckedTime', new Date().toISOString());
        }
      }
    } catch (error) {
      console.error('Error during check for new appointments:', error);
    }
  };

  const fetchAppointments = async () => {
    try {
      setLoading(true); // Set loading to true before fetching
      const userId = await AsyncStorage.getItem('userId');
      if (!userId) {
        throw new Error('User ID not found');
      }

      const { data, error } = await supabase
        .from('booking')
        .select('*')
        .eq('service_provider', userId)
        .eq('appointment_type', 'pending')
        .order('appointment_date', { ascending: true });

      if (error) throw error;

      const mappedData = data.map(item => ({
        ...item,
        status: item.appointment_type as 'pending' | 'accepted' | 'rejected'
      }));

      setAppointments(mappedData || []);
    } catch (error) {
      console.error('Error fetching appointments:', error);
      Alert.alert('Error', 'Failed to fetch appointments');
    } finally {
      setLoading(false);
    }
  };

  const handleAppointmentAction = async (appointmentId: number, action: 'accept' | 'reject') => {
    try {
      const { error } = await supabase
        .from('booking')
        .update({ 
          appointment_type: action === 'accept' ? 'accepted' : 'rejected',
          //updated_at: new Date().toISOString() // Add this line
        })
        .eq('id', appointmentId);

      if (error) throw error;

      Alert.alert('Success', `Appointment ${action}ed successfully`);
      fetchAppointments(); // Refresh the appointments list
    } catch (error) {
      console.error(`Error ${action}ing appointment:`, error);
      Alert.alert('Error', `Failed to ${action} appointment`);
    }
  };

  const renderAppointmentItem = ({ item }: { item: Appointment }) => (
    <View style={styles.appointmentItem}>
      <Text style={styles.appointmentText}>Service: {item.service_type} ({item.service_category})</Text>
      <Text style={styles.appointmentText}>Date: {item.appointment_date}</Text>
      <Text style={styles.appointmentText}>Time: {item.appointment_time}</Text>
      <Text style={styles.appointmentText}>Type: {item.appointment_type}</Text>
      <View style={styles.appointmentActions}>
        <TouchableOpacity 
          style={[styles.appointmentButton, styles.acceptButton]} 
          onPress={() => handleAppointmentAction(item.id, 'accept')}
        >
          <Text style={styles.appointmentButtonText}>Accept</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.appointmentButton, styles.rejectButton]} 
          onPress={() => handleAppointmentAction(item.id, 'reject')}
        >
          <Text style={styles.appointmentButtonText}>Reject</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Header />
      <Text style={defaultStyles.header}>Pending Appointments</Text>
      {loading ? (
        <Text>Loading appointments...</Text>
      ) : appointments.length > 0 ? (
        <FlatList
          data={appointments}
          renderItem={renderAppointmentItem}
          keyExtractor={(item) => item.id.toString()}
        />
      ) : (
        <Text style={styles.noAppointmentsText}>No pending appointments</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  appointmentItem: {
    backgroundColor: '#f0f0f0',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
  },
  appointmentText: {
    fontSize: 16,
    marginBottom: 5,
  },
  appointmentActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  appointmentButton: {
    padding: 10,
    borderRadius: 5,
    width: '48%',
    alignItems: 'center',
  },
  acceptButton: {
    backgroundColor: 'green',
  },
  rejectButton: {
    backgroundColor: 'red',
  },
  appointmentButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  noAppointmentsText: {
    fontSize: 16,
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: 20,
  },
});
