import Ionicons from '@expo/vector-icons/Ionicons';
import { StyleSheet, Image, Platform, Text, View, TextInput, Button, TouchableOpacity, ActivityIndicator } from 'react-native';
import {Picker} from '@react-native-picker/picker';
import { supabase } from '@/lib/supabase';
import { Formik } from 'formik';
import { useEffect, useState } from 'react';
import { defaultStyles } from '@/constants/Styles';
import * as ImagePicker from 'expo-image-picker';
import { useServices } from '@/api/service_providers';
import * as FileSystem from 'expo-file-system';
import { randomUUID } from 'expo-crypto';
import { decode } from 'base64-arraybuffer'; 
export default function addItems() {

  const {data: services, error, isLoading} = useServices();


  if (isLoading) {
    return <ActivityIndicator />;
  }
  if (error) { 
    return <Text>Failed to fetch servioce</Text>}
 
  const [image, setImage] = useState< string | null >(null);
 const defaultimage = "https://images.pexels.com/photos/1545743/pexels-photo-1545743.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
  const [categoryList, setCategoryList] = useState<{ name: string }[]>([]);
 const [loading, setLoading] = useState(true);
 const [selectedCategory, setSelectedCategory] = useState('');
 

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data: service_categories, error } = await supabase
          .from('service_categories')
          .select('Name');

        if (error) {
          throw error;
        }

        // Update the state with the fetched data
        // setCategoryList(service_categories || []);
        //(eligible_students as Ieligible_students[])?.map((eligibleStudents, index)
      } catch (error) {
        console.error('Error fetching categories:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  if (loading) {
    return <ActivityIndicator />;
  }

  // Create Item
// const onCreate = async () => {
//   // if (!validateInput()) {
//     return;


  //const imagePath = await uploadImage();
//insert product here  

// insertProduct(
// {name, price: parseFloat(price), image: imagePath },
// {
//   onSuccess: () => {
//     resetField();
//     router.back();
//   }
// }
// )
// }
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    } else {
      alert('You did not select any image.');
    }
  };

  const uploadImage = async () => {
    if (!image?.startsWith('file://')) {
      return;
    }
  
    const base64 = await FileSystem.readAsStringAsync(image, {
      encoding: 'base64',
    });
    const filePath = `${randomUUID()}.png`;
    const contentType = 'image/png';
    const { data, error } = await supabase.storage
      .from('service')
      .upload(filePath, decode(base64), { contentType });
  
    if (data) {
      return data.path;
    }
  };


  return (
    <View style={{padding:50}}>
      <Text style={{fontSize:27, fontStyle:'italic', fontWeight:'600', marginBottom:5}}>Add New Service</Text>
    
      <Image source={{uri: image || defaultimage }} style={styles.image}/>
      <Text style={styles.textButton} onPress={pickImage}>Select Image</Text>
    <Formik 
    initialValues={{name:'',description:'',qty:'',price:'',category:''}}
    onSubmit={value=>console.log(value)}>
      {({handleChange,handleBlur,handleSubmit,values,setFieldValue})=> (
        <View> 
          <TextInput style={styles.input}
          placeholder='Name'
          value={values?.name}
          onChangeText={handleChange('name')}/>
          
          <TextInput style={styles.input}
          placeholder='Description'
          value={values?.description}
          numberOfLines={3}
          textAlignVertical='top'
          onChangeText={handleChange('description')}/>

          <TextInput style={styles.input}
          placeholder='Quantity'
          value={values?.qty}
          keyboardType='numeric'
          onChangeText={handleChange('qty')}/>

          <TextInput style={styles.input}
          placeholder='Price'
          keyboardType='numeric'
          value={values?.price}
          onChangeText={handleChange('price')}/>

          
         
      {/* Category List Dropdown */}

      <Picker
        selectedValue={selectedCategory}
        onValueChange={(itemValue) => setSelectedCategory(itemValue)}
      >
        <Picker.Item label="Select Category" value="" />
        {categoryList.map((item, index) => (
          <Picker.Item key={index} label={item.name} value={item.name} />
        ))}
      </Picker>

      {/* You can render the selected category below if needed */}
      {selectedCategory ? (
        <Text>Selected Category: {selectedCategory}</Text>
      ) : null}

     

    <TouchableOpacity style={[defaultStyles.pillButton, {backgroundColor:'blue'}]} onPress={handleSubmit}>
      <Text style={{color:'white', fontSize:14}}>Save</Text>
    </TouchableOpacity>
   
        </View>
      )}

    </Formik>
    </View>
  );
}


const styles = StyleSheet.create({
  input: {
    borderWidth:1,
    borderRadius:10,
    padding:10,
    paddingHorizontal:10,
    fontSize:15,
     marginTop:10, marginBottom:5
  },
  titleContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  image: {
    width: '50%',
    aspectRatio: '1',
    alignSelf: 'center',
    borderRadius:10,
      },
    
    
  textButton: {
    alignSelf: 'center',
    fontWeight: 'bold',
    color: 'blue',
    marginTop: 10
  }
});
