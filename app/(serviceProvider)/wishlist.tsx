import React, { useEffect, useState, useRef, useMemo, useCallback } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, FlatList, Alert, Image } from 'react-native';
import { supabase } from '@/lib/supabase';
import { defaultStyles } from '@/constants/Styles';
import Header from '@/components/servicepage/Header';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';
import BottomSheet, { BottomSheetBackdrop, BottomSheetView } from '@gorhom/bottom-sheet';
import Icon from 'react-native-vector-icons/MaterialIcons'; // Import the icon library

interface Appointment {
  id: number;
  user_id: string;
  service_provider: string;
  service_id: number;
  vehicle_type: number;
  service_type: string;
  service_category: string;
  appointment_date: string;
  appointment_time: string;
  appointment_type: string;
  status: 'pending' | 'accepted' | 'rejected';
}

interface Service {
  id: number;
  name: string;
  description: string;
}

interface Vehicle {
  id: number;
  make: string | null;
  model: string | null;
  year: string | null;
  // Add other fields as needed
  color: string | null;
  licence_plate: string | null;
  image_url: string | null;
  owner: string | null;
  created_at: string;
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
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [serviceDetails, setServiceDetails] = useState<Service | null>(null);
  const [vehicleDetails, setVehicleDetails] = useState<Vehicle | null>(null);

  const bottomSheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ['25%', '50%', '75%'], []);

  useEffect(() => {
    registerForPushNotificationsAsync();
    const notificationListener = Notifications.addNotificationReceivedListener(handleNotification);
    const intervalId = setInterval(checkForNewAppointments, 60000);

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
              body: `You have a new booking request for ${latestAppointment.service_category}`,
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
  const renderBackdrop = useCallback(
    (props: any) => <BottomSheetBackdrop appearsOnIndex={2} disappearsOnIndex={-1}{...props} />,
     []
  )

  const fetchAppointments = async () => {
    try {
      setLoading(true);
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

  const fetchServiceDetails = async (serviceId: number) => {
    try {
      const { data: servicedata, error } = await supabase
        .from('Services') // Update this to the correct table name
        .select('*')
        .eq('id', serviceId)
        .single();
  
      if (error) throw error;
  
      setServiceDetails(servicedata as Service);
    } catch (error) {
      console.error('Error fetching service details:', error);
      setServiceDetails(null);
    }
  };

  const fetchVehicleDetails = async (vehicleId: number) => {
    try {
      if (vehicleId === undefined) {
        console.log('Vehicle ID is undefined, skipping fetch', vehicleId);
        setVehicleDetails(null);
        console.log("Vehicle id", vehicleId)
        return;
      }
  
      const { data, error } = await supabase
        .from('vehicles')
        .select('*')
        .eq('id', vehicleId)
        .single();
  
      if (error) throw error;
  
      setVehicleDetails(data as Vehicle);
    } catch (error) {
      console.error('Error fetching vehicle details:', error);
      setVehicleDetails(null);
    }
  };
console.log("Vehicle Info", vehicleDetails)

const openBottomSheet = (appointment: Appointment) => {
  setSelectedAppointment(appointment);
  fetchServiceDetails(appointment.service_id);
  fetchVehicleDetails(appointment.vehicle_type);
  bottomSheetRef.current?.expand();
};

  const handleAppointmentAction = async (appointmentId: number, action: 'accept' | 'reject') => {
    try {
      const { error } = await supabase
        .from('booking')
        .update({ 
          appointment_type: action === 'accept' ? 'accepted' : 'rejected',
        })
        .eq('id', appointmentId);

      if (error) throw error;

      Alert.alert('Success', `Appointment ${action}ed successfully`);
      fetchAppointments();
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
          style={[styles.iconButton, styles.viewButton]} 
          onPress={() => openBottomSheet(item)}
        >
          <Icon name="visibility" size={24} color="white" />
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.iconButton, styles.acceptButton]} 
          onPress={() => handleAppointmentAction(item.id, 'accept')}
        >
          <Icon name="check-circle" size={24} color="white" />
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.iconButton, styles.rejectButton]} 
          onPress={() => handleAppointmentAction(item.id, 'reject')}
        >
          <Icon name="cancel" size={24} color="white" />
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

      <BottomSheet
        ref={bottomSheetRef}
        snapPoints={snapPoints}
        index={-1}
        enablePanDownToClose={true}
        backdropComponent={renderBackdrop}
        //onChange={handleSheetChanges}
      >
        <BottomSheetView style={styles.contentContainer}>
          {selectedAppointment && (
            <View>
              <Text style={styles.appointmentText}>Service ID: {selectedAppointment.id}</Text>
              <Text style={styles.appointmentText}>Category: {selectedAppointment.service_category}</Text>
              <Text style={styles.appointmentText}>Date: {selectedAppointment.appointment_date}</Text>
              <Text style={styles.appointmentText}>Time: {selectedAppointment.appointment_time}</Text>
              <Text style={styles.appointmentText}>Type: {selectedAppointment.appointment_type}</Text>
              <Text style={styles.appointmentText}>Status: {selectedAppointment.status}</Text>
              {serviceDetails && (
                <>
                  <Text style={styles.appointmentText}>Service Name: {serviceDetails.name}</Text>
                  <Text style={styles.appointmentText}>Service Description: {serviceDetails.description}</Text>
                </>
              )}
              {vehicleDetails && (
                <>
                  <Text style={styles.appointmentText}>Vehicle Make: {vehicleDetails.make}</Text>
                  <Text style={styles.appointmentText}>Vehicle Model: {vehicleDetails.model}</Text>
                  <Text style={styles.appointmentText}>Vehicle Year: {vehicleDetails.year}</Text>
                  {vehicleDetails.image_url && (
                    <Image
                      source={{ uri: vehicleDetails.image_url }}
                      style={styles.vehicleImage}
                    />
                  )}
                </>
              )}
            </View>
          )}
        </BottomSheetView>
      </BottomSheet>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 20,
    paddingHorizontal: 10,
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
  iconButton: {
    padding: 5,
    borderRadius: 5,
    width: '32%',
    alignItems: 'center',
  },
  acceptButton: {
    backgroundColor: 'green',
  },
  rejectButton: {
    backgroundColor: 'red',
  },
  viewButton: {
    backgroundColor: 'blue',
  },
  noAppointmentsText: {
    fontSize: 16,
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: 20,
  },
  bottomSheetContent: {
    padding: 20,
    backgroundColor: 'black',
  },
  contentContainer: {
    flex: 1,
    padding: 36,
    alignItems: 'center',
  },
  vehicleImage: {
    width: 200,
    height: 150,
    borderRadius: 8,
    marginTop: 10,
  },
});
