import Ionicons from '@expo/vector-icons/Ionicons';
import { StyleSheet, Image, Platform, Text, View, TextInput, Button, TouchableOpacity, Alert } from 'react-native';
import {Picker} from '@react-native-picker/picker';
import { supabase } from '@/lib/supabase';
import { Formik } from 'formik';
import { useEffect, useState } from 'react';
// import { useUser } from "@clerk/clerk-expo";
import { defaultStyles } from '@/constants/Styles';
import Header from '@/components/servicepage/Header';
import { useQuery } from '@tanstack/react-query'
import * as Location from 'expo-location';
import Entypo from '@expo/vector-icons/Entypo';
import { useInsertCompany } from '@/api/service_providers';


export default function Wishlist() {
  
//   const { isLoaded, isSignedIn, user } = useUser();
  const [location, setLocation] = useState<Coordinates | null>(null);
  const [businessname, setBusinessname] = useState('');
  const [description, setDescription] = useState('');
  const [address, setAddress] = useState('');
  const [email, setEmail] = useState('');
  const [telephone, setTelephone] = useState('');
  const [errors, setErrors] = useState('');

  
const { mutate: insertCompany} = useInsertCompany();

  type Coordinates = {
    coordinate: {
      lat: number;
      long: number;
    };

  };
 
    const getPermissions = async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.log("Please grant location permissions");
        return;
      }

  let currentLocation = await Location.getCurrentPositionAsync({});
      setLocation({
        coordinate: {
          lat: currentLocation.coords.latitude,
          long: currentLocation.coords.longitude
        }
      });
      console.log(currentLocation);
    };
    // getPermissions();


  // insertCompany(
  //   {  })
  const storeLocation = async () => {
    if (location) {
      
      insertCompany({businessname, description, location,});
   

   
      console.log('successfully saved')
    }
  };
   
   
   
  
  
return(
  <View style={{marginTop:20, padding:35}} >
    <Header/>
    <Text style={defaultStyles.header}>Company Registration</Text>
    <Text>Create your business account here</Text>
<TouchableOpacity onPress={storeLocation}>
  <Text>Store Images here Information</Text>
</TouchableOpacity>
<View> 
          <TextInput style={defaultStyles.inputField}
          placeholder='Business Name'
          value={businessname} 
          onChangeText={setBusinessname}
          />
          
          <TextInput style={defaultStyles.inputField}
          placeholder='Telephone'
          keyboardType='number-pad'
          value={telephone} 
          
          onChangeText={setTelephone}
          />
          <TextInput style={defaultStyles.inputField}
          placeholder='Address'
          value={address} 
          onChangeText={setAddress}
          />

          <TextInput style={defaultStyles.inputField}
          placeholder='Email'
          value={email} 
          onChangeText={setEmail}
          />
          {/* <TextInput style={{}}
          placeholder='Telephone'
          value={telephone} 
          onChangeText={setTelephone}
          /> */}
          <View style={{display:'flex', flexDirection:'row', gap:7, alignItems:'center'}}>
          <TextInput style={defaultStyles.inputField}
          placeholder='Coordinates'
          // value={}
          // onChangeText={}/
          />
          <TouchableOpacity style={[defaultStyles.btn, {padding:3}]} onPress={getPermissions}>
          <Text style={{color:'white', fontSize:14}}>location</Text>
          <Entypo name="location" size={24} color="white" />
          </TouchableOpacity>
          </View>

          <TextInput style={defaultStyles.descriptionText}
          placeholder='Description'
          value={description} 
          onChangeText={setDescription}
          numberOfLines={5}
          textAlignVertical='top'
          
          />
          
          
 <TouchableOpacity style={defaultStyles.btn} >
      <Text style={{color:'white', fontSize:14}}>Save</Text>
    </TouchableOpacity>
          
         
      

     

   
   
     </View>
       
  </View> 
)

}