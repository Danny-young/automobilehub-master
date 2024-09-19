
import { Image, Text, View } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";

const Header = () => {




    const [userId, setUserId] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchUserId = async () => {
            try {
                const storedUserId = await AsyncStorage.getItem('userId');
                setUserId(storedUserId);  // storedUserId is a string or null
            } catch (error) {
                console.error('Failed to fetch userId from AsyncStorage:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchUserId();
    }, []);

    if (loading) {
        return <Text>Loading...</Text>;
    }


    return ( 
        <View style={{display:'flex', flexDirection:'row', alignItems:'center', gap:5}} >
            {/* <Image source={{uri:user?.imageUrl}} style={{borderRadius:50, height:50, width:50}} /> */}
        <View>
        <Text /* style={styles.title} */>Welcome</Text>
        {/* <Text style={{fontSize:20, fontWeight:'bold'}}>{user?.fullName}</Text> */}
        <Text>User ID: {userId ? userId : 'No user ID found'}</Text>
        </View>

        </View>
     );
}
 
export default Header;