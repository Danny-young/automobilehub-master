import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { FontAwesome5, Ionicons } from '@expo/vector-icons';
import Settings from '@/components/userSettings';
import { supabase } from '@/lib/supabase';
import { Redirect, router } from 'expo-router';
import { useRouter } from 'expo-router';

export default function Profile() {
	const { top } = useSafeAreaInsets();
	const [user, setUser] = useState<any>(null);
	const router = useRouter();

	useEffect(() => {
		fetchUser();
	}, []);

	const fetchUser = async () => {
		const { data: { user } } = await supabase.auth.getUser();
		if (user) {
			setUser(user);
		}
	};

	const handleLogout = async () => {
		const { error } = await supabase.auth.signOut();
		if (error) {
			console.error('Error signing out:', error.message);
		} else {
			// Optionally, navigate the user to a login or welcome screen
			return <Redirect href='/(auth)' />;
		}
	};
  
	const navigateToHelpAndSupport = () => {
		router.push('/modal/help-and-support');
	};

	return (
		<View style={[styles.container, { paddingTop: top }]}>
			<Text style={styles.title}>Profile</Text>

			{user && (
				<View style={styles.userInfo}>
					<Image
						source={{ uri: user.user_metadata?.avatar_url || 'https://via.placeholder.com/150' }}
						style={styles.avatar}
					/>
					<View style={styles.userDetails}>
						<Text style={styles.username}>{user.user_metadata?.full_name || 'User'}</Text>
						<Text style={styles.email}>{user.email}</Text>
					</View>
				</View>
			)}

			<Settings name='Edit' color='black' iconName='user' size={22} vectorName='FontAwesome5'/>
			<Settings name='Favorite' color='black' iconName='favorite' size={22} vectorName='MaterialIcons'/>
			<Settings name='My car' color='black' iconName='car' size={22} vectorName='FontAwesome5'/>
			<Settings name='Language' color='black' iconName='language' size={22} vectorName='FontAwesome5'/>
			<Settings name='Terms and Condition' color='black' iconName='book' size={22} vectorName='FontAwesome5'/>
			<Settings name='Privacy policy' color='black' iconName='policy' size={22} vectorName='MaterialIcons'/>
			<Settings 
				name='Help and support' 
				color='black' 
				iconName='help-circle-sharp' 
				size={26} 
				vectorName='Ionicons' 
				onPress={navigateToHelpAndSupport}
			/>
			
			<TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
				<Text style={styles.logoutText}>Logout</Text>
			</TouchableOpacity>
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		padding: 20,
	},
	title: {
		fontSize: 22,
		fontWeight: 'bold',
		textAlign: 'center',
		marginBottom: 20,
	},
	userInfo: {
		flexDirection: 'row',
		alignItems: 'center',
		marginBottom: 30,
	},
	avatar: {
		width: 80,
		height: 80,
		borderRadius: 40,
		marginRight: 20,
	},
	userDetails: {
		flex: 1,
	},
	username: {
		fontSize: 18,
		fontWeight: 'bold',
		marginBottom: 5,
	},
	email: {
		fontSize: 16,
		color: 'gray',
	},
	logoutButton: {
		backgroundColor: 'red',
		padding: 15,
		borderRadius: 10,
		alignItems: 'center',
		marginTop: 20,
	},
	logoutText: {
		color: 'white',
		fontSize: 16,
		fontWeight: 'bold',
	},
});