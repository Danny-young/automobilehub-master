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
		router.push('/modal/help-and-support' as never);
	};

	const navigateToPrivacyPolicy = () => {
		router.push('/modal/privacy-policy' as never);
	};
	const navigateToTermsandCondition = () => {
		router.push('/modal/terms-and-conditions' as never); // Note: Changed from 'condition' to 'conditions'
	};

	const navigateToEditProfile = () => {
		router.push('/modal/edit-profile' as never);
	};

	const navigateToMyCars = () => {
		router.push('/modal/my-cars' as never);
	};

	const navigateToLanguageSelection = () => {
		router.push('/modal/language-selection' as never);
	};

	const navigateToFavorites = () => {
		router.push('/modal/favorites' as never);
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

        <Settings 
					name='Edit Profile' 
					color='black' 
					iconName='user-edit' 
					size={22} 
					vectorName='FontAwesome5'
					onPress={navigateToEditProfile}
				/>
				<Settings name='Favorite' color='black' iconName='favorite' size={22} vectorName='MaterialIcons' onPress={navigateToFavorites}/>
        <Settings 
					name='My Cars' 
					color='black' 
					iconName='car' 
					size={22} 
					vectorName='FontAwesome5'
					onPress={navigateToMyCars}
				/>
        
				<Settings name='Language' color='black' iconName='language' size={22} vectorName='FontAwesome5' onPress={navigateToLanguageSelection}/>
				<Settings name='Terms and Condition' color='black' iconName='book' size={22} vectorName='FontAwesome5' onPress={navigateToTermsandCondition}/>
				<Settings 
					name='Help and support' 
					color='black' 
					iconName='help-circle-sharp' 
					size={26} 
					vectorName='Ionicons' 
					onPress={navigateToHelpAndSupport}
				/>
				<Settings 
					name='Privacy policy' 
					color='black' 
					iconName='policy' 
					size={22} 
					vectorName='MaterialIcons'
					onPress={navigateToPrivacyPolicy}
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