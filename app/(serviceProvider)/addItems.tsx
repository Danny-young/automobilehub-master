import React, { useState } from 'react';
import { StyleSheet, Image, Text, View, TextInput, TouchableOpacity, ActivityIndicator, ScrollView } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { supabase } from '@/lib/supabase';
import { Formik } from 'formik';
import { defaultStyles } from '@/constants/Styles';
import * as ImagePicker from 'expo-image-picker';
import { useServices } from '@/api/service_providers';
import * as FileSystem from 'expo-file-system';
import { randomUUID } from 'expo-crypto';
import { decode } from 'base64-arraybuffer';

export default function AddItems() {
  const { data: services, error, isLoading } = useServices();
  const [image, setImage] = useState<string | null>(null);
  const defaultImage = "https://images.pexels.com/photos/1545743/pexels-photo-1545743.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2";

  if (isLoading) {
    return <ActivityIndicator />;
  }
  if (error) {
    return <Text>Failed to fetch service</Text>;
  }

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

  const renderServiceFields = (values, handleChange, setFieldValue) => {
    switch (values.category) {
      case 'maintenance':
        return (
          <>
            <TextInput style={styles.input} placeholder='Frequency' value={values.frequency} onChangeText={handleChange('frequency')} />
            <TextInput style={styles.input} placeholder='Time Duration' value={values.timeDuration} onChangeText={handleChange('timeDuration')} />
            <TextInput style={styles.input} placeholder='Required Parts' value={values.requiredParts} onChangeText={handleChange('requiredParts')} />
          </>
        );
      case 'repair':
        return (
          <>
            <TextInput style={styles.input} placeholder='Issue Type' value={values.issueType} onChangeText={handleChange('issueType')} />
            <TextInput style={styles.input} placeholder='Severity Level' value={values.severityLevel} onChangeText={handleChange('severityLevel')} />
            <TextInput style={styles.input} placeholder='Parts Required' value={values.partsRequired} onChangeText={handleChange('partsRequired')} />
            <TextInput style={styles.input} placeholder='Time Duration' value={values.timeDuration} onChangeText={handleChange('timeDuration')} />
          </>
        );
      case 'cleaning':
        return (
          <>
            <Picker
              selectedValue={values.cleaningType}
              style={styles.picker}
              onValueChange={(itemValue) => setFieldValue('cleaningType', itemValue)}
            >
              <Picker.Item label="Select cleaning type" value="" />
              <Picker.Item label="Interior" value="interior" />
              <Picker.Item label="Exterior" value="exterior" />
              <Picker.Item label="Both" value="both" />
            </Picker>
            <TextInput style={styles.input} placeholder='Cleaning Package' value={values.cleaningPackage} onChangeText={handleChange('cleaningPackage')} />
            <TextInput style={styles.input} placeholder='Time Duration' value={values.timeDuration} onChangeText={handleChange('timeDuration')} />
            <TextInput style={styles.input} placeholder='Add-ons' value={values.addOns} onChangeText={handleChange('addOns')} />
          </>
        );
      case 'inspection':
        return (
          <>
            <TextInput style={styles.input} placeholder='Inspection Type' value={values.inspectionType} onChangeText={handleChange('inspectionType')} />
            <TextInput style={styles.input} placeholder='Areas Covered' value={values.areasCovered} onChangeText={handleChange('areasCovered')} />
            <TextInput style={styles.input} placeholder='Time Duration' value={values.timeDuration} onChangeText={handleChange('timeDuration')} />
            <Picker
              selectedValue={values.reportProvided}
              style={styles.picker}
              onValueChange={(itemValue) => setFieldValue('reportProvided', itemValue)}
            >
              <Picker.Item label="Report Provided?" value="" />
              <Picker.Item label="Yes" value="yes" />
              <Picker.Item label="No" value="no" />
            </Picker>
          </>
        );
      case 'tire':
        return (
          <>
            <TextInput style={styles.input} placeholder='Tire Type' value={values.tireType} onChangeText={handleChange('tireType')} />
            <TextInput style={styles.input} placeholder='Service Type' value={values.serviceType} onChangeText={handleChange('serviceType')} />
            <TextInput style={styles.input} placeholder='Time Duration' value={values.timeDuration} onChangeText={handleChange('timeDuration')} />
            <TextInput style={styles.input} placeholder='Tire Brand' value={values.tireBrand} onChangeText={handleChange('tireBrand')} />
          </>
        );
      case 'emergency':
        return (
          <>
            <TextInput style={styles.input} placeholder='Emergency Type' value={values.emergencyType} onChangeText={handleChange('emergencyType')} />
            <TextInput style={styles.input} placeholder='Response Time' value={values.responseTime} onChangeText={handleChange('responseTime')} />
            <Picker
              selectedValue={values.availability}
              style={styles.picker}
              onValueChange={(itemValue) => setFieldValue('availability', itemValue)}
            >
              <Picker.Item label="Availability" value="" />
              <Picker.Item label="24/7" value="24/7" />
              <Picker.Item label="Business Hours" value="business_hours" />
            </Picker>
          </>
        );
      case 'customization':
        return (
          <>
            <TextInput style={styles.input} placeholder='Customization Type' value={values.customizationType} onChangeText={handleChange('customizationType')} />
            <TextInput style={styles.input} placeholder='Parts/Materials Required' value={values.partsRequired} onChangeText={handleChange('partsRequired')} />
            <TextInput style={styles.input} placeholder='Time Duration' value={values.timeDuration} onChangeText={handleChange('timeDuration')} />
          </>
        );
      case 'miscellaneous':
        return (
          <>
            <TextInput style={styles.input} placeholder='Service Category' value={values.serviceCategory} onChangeText={handleChange('serviceCategory')} />
            <TextInput style={styles.input} placeholder='Time Duration' value={values.timeDuration} onChangeText={handleChange('timeDuration')} />
          </>
        );
      case 'sales':
        return (
          <>
            <TextInput style={styles.input} placeholder='Part Name/Category' value={values.partName} onChangeText={handleChange('partName')} />
            <Picker
              selectedValue={values.availability}
              style={styles.picker}
              onValueChange={(itemValue) => setFieldValue('availability', itemValue)}
            >
              <Picker.Item label="Availability" value="" />
              <Picker.Item label="In stock" value="in_stock" />
              <Picker.Item label="Order" value="order" />
            </Picker>
            <Picker
              selectedValue={values.warrantyProvided}
              style={styles.picker}
              onValueChange={(itemValue) => setFieldValue('warrantyProvided', itemValue)}
            >
              <Picker.Item label="Warranty Provided?" value="" />
              <Picker.Item label="Yes" value="yes" />
              <Picker.Item label="No" value="no" />
            </Picker>
          </>
        );
      case 'rental':
        return (
          <>
            <TextInput style={styles.input} placeholder='Vehicle Type' value={values.vehicleType} onChangeText={handleChange('vehicleType')} />
            <TextInput style={styles.input} placeholder='Rental Duration' value={values.rentalDuration} onChangeText={handleChange('rentalDuration')} />
            <TextInput style={styles.input} placeholder='Price per Duration' value={values.pricePerDuration} onChangeText={handleChange('pricePerDuration')} />
            <Picker
              selectedValue={values.depositRequired}
              style={styles.picker}
              onValueChange={(itemValue) => setFieldValue('depositRequired', itemValue)}
            >
              <Picker.Item label="Deposit Required?" value="" />
              <Picker.Item label="Yes" value="yes" />
              <Picker.Item label="No" value="no" />
            </Picker>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Add New Service</Text>
      
        <View style={styles.imageContainer}>
          <Image 
            source={{uri: image || defaultImage }} 
            style={styles.image}
            resizeMode="contain"
          />
        </View>
        <Text style={styles.textButton} onPress={pickImage}>Select Image</Text>
        <Formik 
          initialValues={{
            name: '',
            description: '',
            price: '',
            category: '',
            // Add other fields here as needed
          }}
          onSubmit={async (values) => {
            console.log(values);
            // Here you would typically send the data to your backend
            // For example:
            // await supabase.from('services').insert(values);
          }}
        >
          {({handleChange, handleBlur, handleSubmit, values, setFieldValue}) => (
            <View>
              <TextInput 
                style={styles.input}
                placeholder='Name'
                value={values.name}
                onChangeText={handleChange('name')}
              />
              
              <TextInput 
                style={styles.input}
                placeholder='Description'
                value={values.description}
                numberOfLines={3}
                textAlignVertical='top'
                onChangeText={handleChange('description')}
              />

              <TextInput 
                style={styles.input}
                placeholder='Price'
                keyboardType='numeric'
                value={values.price}
                onChangeText={handleChange('price')}
              />

              <Picker
                selectedValue={values.category}
                style={styles.picker}
                onValueChange={(itemValue) => setFieldValue('category', itemValue)}
              >
                <Picker.Item label="Select service type" value="" />
                <Picker.Item label="Maintenance Services" value="maintenance" />
                <Picker.Item label="Repair Service" value="repair" />
                <Picker.Item label="Cleaning and Detailing Services" value="cleaning" />
                <Picker.Item label="Inspection Service" value="inspection" />
                <Picker.Item label="Tire Service" value="tire" />
                <Picker.Item label="Emergency Services" value="emergency" />
                <Picker.Item label="Customization and Performance Services" value="customization" />
                <Picker.Item label="Miscellaneous Service" value="miscellaneous" />
                <Picker.Item label="Sales and Parts" value="sales" />
                <Picker.Item label="Rental" value="rental" />
              </Picker>

              {renderServiceFields(values, handleChange, setFieldValue)}

              <TouchableOpacity 
                style={[defaultStyles.pillButton, styles.saveButton]} 
                onPress={() => handleSubmit()}
              >
                <Text style={styles.saveButtonText}>Save</Text>
              </TouchableOpacity>
            </View>
          )}
        </Formik>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 27, 
    fontStyle: 'italic', 
    fontWeight: '600', 
    marginBottom: 20
  },
  input: {
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    paddingHorizontal: 10,
    fontSize: 15,
    marginTop: 10, 
    marginBottom: 5
  },
  imageContainer: {
    width: '100%',
    aspectRatio: 16 / 9,
    marginBottom: 10,
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: '#f0f0f0', // Light gray background
  },
  image: {
    width: '100%',
    height: '100%',
  },
  textButton: {
    alignSelf: 'center',
    fontWeight: 'bold',
    color: 'blue',
    marginBottom: 20
  },
  picker: {
    height: 50,
    borderColor: '#ccc',
    marginBottom: 20,
  },
  saveButton: {
    backgroundColor: 'blue',
    marginTop: 20,
  },
  saveButtonText: {
    color: 'white', 
    fontSize: 16,
    fontWeight: 'bold',
  },
});