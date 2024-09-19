import { useNavigation } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";

const Listing = () => {
    const navigation = useNavigation();
    return ( 
        <View>
            <Text>This is a listing page.</Text>
            {/* Add listing components here */}
            {/* <TouchableOpacity  onPress={() => navigation.navigate('AddListing')} /> */}
        </View>
     );
}
 
export default Listing;