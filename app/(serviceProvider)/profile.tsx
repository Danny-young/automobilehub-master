import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Image,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  TextInput,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Colors from '@/constants/Colors';
import { useRouter } from 'expo-router';
import { supabase } from '@/lib/supabase';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Profile = () => {
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const userId = await AsyncStorage.getItem('userId');
      if (!userId) {
        throw new Error('User ID not found');
      }

      const { data, error } = await supabase
        .from('User_Business')
        .select('*')
        .eq('owner', userId)
        .single();

      if (error) throw error;

      setProfile(data);
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('userId');
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      router.replace('/(auth)');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const handleSave = async () => {
    try {
      const { error } = await supabase
        .from('User_Business')
        .update({
          business_name: profile.business_name,
          provider_email: profile.provider_email,
          telephone: profile.telephone,
          address: profile.address,
          description: profile.description,
        })
        .eq('id', profile.id);

      if (error) throw error;

      Alert.alert('Success', 'Profile updated successfully');
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      Alert.alert('Error', 'Failed to update profile');
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.header}>
          <Image
            source={{ uri: profile?.logo_url || 'https://via.placeholder.com/150' }}
            style={styles.profileImage}
          />
          {isEditing ? (
            <TextInput
              style={styles.input}
              value={profile.business_name}
              onChangeText={(text) => setProfile({ ...profile, business_name: text })}
            />
          ) : (
            <Text style={styles.businessName}>{profile?.business_name}</Text>
          )}
        </View>

        <View style={styles.infoSection}>
          <InfoItem
            icon="mail"
            label="Email"
            value={profile?.provider_email}
            isEditing={isEditing}
            onChangeText={(text) => setProfile({ ...profile, provider_email: text })}
          />
          <InfoItem
            icon="call"
            label="Phone"
            value={profile?.telephone}
            isEditing={isEditing}
            onChangeText={(text) => setProfile({ ...profile, telephone: text })}
          />
          <InfoItem
            icon="location"
            label="Address"
            value={profile?.address}
            isEditing={isEditing}
            onChangeText={(text) => setProfile({ ...profile, address: text })}
          />
          <InfoItem
            icon="document-text"
            label="Description"
            value={profile?.description}
            isEditing={isEditing}
            onChangeText={(text) => setProfile({ ...profile, description: text })}
          />
        </View>

        <View style={styles.actionSection}>
          {isEditing ? (
            <TouchableOpacity style={styles.actionButton} onPress={handleSave}>
              <Text style={styles.actionButtonText}>Save Changes</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity style={styles.actionButton} onPress={() => setIsEditing(true)}>
              <Text style={styles.actionButtonText}>Edit Profile</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity style={styles.actionButton} onPress={() => router.push('/myServices')}>
            <Text style={styles.actionButtonText}>My Services</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.actionButton, styles.logoutButton]} onPress={handleLogout}>
            <Text style={[styles.actionButtonText, styles.logoutButtonText]}>Logout</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const InfoItem = ({ icon, label, value, isEditing, onChangeText }: any) => (
  <View style={styles.infoItem}>
    <Ionicons name={icon} size={24} color={Colors.primary} style={styles.infoIcon} />
    <View>
      <Text style={styles.infoLabel}>{label}</Text>
      {isEditing ? (
        <TextInput
          style={styles.input}
          value={value}
          onChangeText={onChangeText}
        />
      ) : (
        <Text style={styles.infoValue}>{value || 'Not provided'}</Text>
      )}
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightGray,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 10,
  },
  businessName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.dark,
  },
  infoSection: {
    padding: 20,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  infoIcon: {
    marginRight: 10,
  },
  infoLabel: {
    fontSize: 16,
    color: Colors.gray,
  },
  infoValue: {
    fontSize: 16,
    color: Colors.dark,
  },
  actionSection: {
    padding: 20,
  },
  actionButton: {
    backgroundColor: Colors.primary,
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
  },
  actionButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  logoutButton: {
    backgroundColor: 'red',
  },
  logoutButtonText: {
    color: 'white',
  },
  input: {
    borderWidth: 1,
    borderColor: Colors.lightGray,
    borderRadius: 5,
    padding: 5,
    fontSize: 16,
    color: Colors.dark,
    minWidth: 200,
  },
});

export default Profile;