import React, { useEffect, useState } from 'react';
import { StyleSheet, Image, Text, View, TextInput, TouchableOpacity, ActivityIndicator, ScrollView } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { supabase } from '@/lib/supabase';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { defaultStyles } from '@/constants/Styles';
import * as ImagePicker from 'expo-image-picker';
import { useServices } from '@/api/service_providers';
import * as FileSystem from 'expo-file-system';
import { randomUUID } from 'expo-crypto';
import { decode } from 'base64-arraybuffer';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface ChangeHandler {
  (field: string, value: any): void;
}

interface SetFieldValueHandler {
  (field: string, value: any): void;
}

const validationSchema = Yup.object().shape({
  name: Yup.string().required('Service name is required'),
  description: Yup.string().required('Description is required'),
  price: Yup.number().required('Price is required').positive('Price must be positive'),
  category: Yup.string().required('Category is required'),
  // Add more validations for other fields as needed
});

export default function AddItems() {
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const { data: services, error, isLoading } = useServices();
  const [image, setImage] = useState<string | null>(null);
  const defaultImage = "https://images.pexels.com/photos/1545743/pexels-photo-1545743.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2";
  const [successMessage, setSuccessMessage] = useState<string | null>(null);


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
  // <Text>User ID: {userId ? userId : 'No user ID found'}</Text>
  console.log(userId);

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



  const saveService = async (values: any) => {
    try {
      if (!userId) {
        throw new Error("User ID is not available. Please log in again.");
      }

      const price = values.price ? parseFloat(values.price) : 0;

      if (isNaN(price)) {
        throw new Error("Invalid price. Please enter a valid number.");
      }

      const { data: serviceData, error: serviceError } = await supabase
        .from('Services')
        .insert({
          name: values.name,
          description: values.description,
          price: price,
          category: values.category,
          image_url: values.image_url,
          provider_id: userId // Use the userId state variable here
        })
        .select();

      if (serviceError) throw serviceError;
      
      const serviceId = serviceData[0].id;
  
      // Insert into category-specific tables based on the category
      if (values.category === 'rental') {
        const { data: repairData, error: repairError } = await supabase
          .from('rental_service')
          .insert({
            service_id: serviceId,
            vehicle_type: values.vehicleType,
            rental_duration: values.rentalDuration,
            vehicle_model: values.vehicleModel,
            // rental_duration: values.pricePerDuration,
          });
        if (repairError) throw repairError;
      }
      
      // Similarly handle other categories (maintenance, cleaning, etc.)
      // Maintenance example:
      if (values.category === 'maintenance') {
        const { data: maintenanceData, error: maintenanceError } = await supabase
          .from('maintenance_service')
          .insert({
            service_id: serviceId,
            frequency: values.frequency,
            required_parts: values.requiredParts,
            estimated_time: values.timeDuration,
          });
        if (maintenanceError) throw maintenanceError;
      }

      if (values.category === 'tire') {
        const { data: repairData, error: repairError } = await supabase
          .from('tire_services')
          .insert({
            service_id: serviceId,
            tire_type: values.tireType,
            service_type: values.serviceType,
            tire_brand: values.tireBrand,
            // rental_duration: values.pricePerDuration,
          });
        if (repairError) throw repairError;
      }
      if (values.category === 'repair') {
        const { data: repairData, error: repairError } = await supabase
          .from('repair_service')
          .insert({
            service_id: serviceId,
            issue_type: values.issueType,
            severity_level: values.severityLevel,
            parts_required: values.partsRequired,
            // rental_duration: values.pricePerDuration,
          });
        if (repairError) throw repairError;
      }
      if (values.category === 'sales') {
        const { data: repairData, error: repairError } = await supabase
          .from('sales_and_parts')
          .insert({
            service_id: serviceId,
            category: values.partName,
            availability: values.availability,
            warrantyProvided: values.warrantyProvided,
            // rental_duration: values.pricePerDuration,
          });
        if (repairError) throw repairError;
      }
      if (values.category === 'cleaning') {
        const { data: repairData, error: repairError } = await supabase
          .from('cleaning_and_detailing')
          .insert({
            service_id: serviceId,
            cleaning_package: values.cleaning_package,
            type: values.timeDuration,
            add_ons: values.addOns,
            // rental_duration: values.pricePerDuration,
          });
        if (repairError) throw repairError;
      }
      
      if (values.category === 'inspection') {
        const { data: repairData, error: repairError } = await supabase
          .from('inspection_service')
          .insert({
            service_id: serviceId,
            inspection_type: values.inspectionType,
            areas_covered: values.areasCovered,
            // report_provided: values.addOns,
            // rental_duration: values.pricePerDuration,
          });
        if (repairError) throw repairError;
      }
      if (values.category === 'emergency') {
        const { data: repairData, error: repairError } = await supabase
          .from('emergency_service')
          .insert({
            service_id: serviceId,
            emergency_type: values.emergencyType,
            response_time: values.responseTime,
            // availability: values.addOns,
            // rental_duration: values.pricePerDuration,
          });
        if (repairError) throw repairError;
      }
      if (values.category === 'customization') {
        const { data: repairData, error: repairError } = await supabase
          .from('customization_and_performance')
          .insert({
            service_id: serviceId,
            customization_type: values.customizationType,
            parts_material: values.partsRequired,
           
          });
        if (repairError) throw repairError;
      }
      if (values.category === 'miscellaneous') {
        const { data: repairData, error: repairError } = await supabase
          .from('miscellanous_service')
          .insert({
            service_id: serviceId,
            service_categoru: values.serviceCategory,
            time_duration: values.timeDuaration,
            // report_provided: values.addOns,
            // rental_duration: values.pricePerDuration,
          });
        if (repairError) throw repairError;
      }
  
      console.log('Service saved successfully!');
    } catch (error) {
      console.error('Error saving service:', error);
      throw error; // Re-throw the error to be caught by the form submission handler
    }
  };

  const renderServiceFields = (values:any, handleChange:any, setFieldValue:any) => {
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
            {/* <TextInput style={styles.input} placeholder='Time Duration' value={values.timeDuration} onChangeText={handleChange('timeDuration')} /> */}
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
            <TextInput style={styles.input} placeholder='Type' value={values.timeDuration} onChangeText={handleChange('timeDuration')} />
            <TextInput style={styles.input} placeholder='Add-ons' value={values.addOns} onChangeText={handleChange('addOns')} />
          </>
        );
      case 'inspection':
        return (
          <>
            <TextInput style={styles.input} placeholder='Inspection Type' value={values.inspectionType} onChangeText={handleChange('inspectionType')} />
            <TextInput style={styles.input} placeholder='Areas Covered' value={values.areasCovered} onChangeText={handleChange('areasCovered')} />
            {/* <TextInput style={styles.input} placeholder='Report Provided' value={values.timeDuration} onChangeText={handleChange('timeDuration')} /> */}
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
            <TextInput style={styles.input} placeholder='Vehicle Model' value={values.vehicleModel} onChangeText={handleChange('vehicleModel')} />
            <TextInput style={styles.input} placeholder='Rental Duration' value={values.rentalDuration} onChangeText={handleChange('rentalDuration')} />
            {/* <TextInput style={styles.input} placeholder='Price per Duration' value={values.pricePerDuration} onChangeText={handleChange('pricePerDuration')} /> */}
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
        
        {successMessage && (
          <Text style={styles.successText}>{successMessage}</Text>
        )}

        <Formik 
          initialValues={{
            name: '',
            description: '',
            price: '',
            category: '',
            requiredParts: '',
            issueType: '',
            severityLevel: '',
            partsRequired: '',
            timeDuration: '',
            // Add other fields here as needed
          }}
          validationSchema={validationSchema}
          onSubmit={async (values, { setSubmitting, setStatus, resetForm }) => {
            try {
              await saveService(values);
              console.log('Service saved successfully!');
              setSuccessMessage('Service saved successfully!');
              resetForm();
              setImage(null);
              // Hide success message after 3 seconds
              setTimeout(() => setSuccessMessage(null), 3000);
            } catch (error: any) {
              console.error('Error saving service:', error);
              setStatus(error.message || 'An error occurred while saving the service.');
            } finally {
              setSubmitting(false);
            }
          }}
        >
          {({handleChange, handleBlur, handleSubmit, values, setFieldValue, isSubmitting, status, errors, touched, isValid}) => (
            <View>
              <TextInput 
                style={styles.input}
                placeholder='Name'
                value={values.name}
                onChangeText={handleChange('name')}
                onBlur={handleBlur('name')}
              />
              {touched.name && errors.name && <Text style={styles.errorText}>{errors.name}</Text>}
              
              <TextInput 
                style={styles.input}
                placeholder='Description'
                value={values.description}
                numberOfLines={3}
                textAlignVertical='top'
                onChangeText={handleChange('description')}
                onBlur={handleBlur('description')}
              />
              {touched.description && errors.description && <Text style={styles.errorText}>{errors.description}</Text>}

              <TextInput 
                style={styles.input}
                placeholder='Price'
                keyboardType='numeric'
                value={values.price}
                onChangeText={handleChange('price')}
                onBlur={handleBlur('price')}
              />
              {touched.price && errors.price && <Text style={styles.errorText}>{errors.price}</Text>}

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
              {touched.category && errors.category && <Text style={styles.errorText}>{errors.category}</Text>}

              {renderServiceFields(values, handleChange, setFieldValue)}

              {status && <Text style={styles.errorText}>{status}</Text>}

              <TouchableOpacity 
                style={[
                  defaultStyles.pillButton, 
                  styles.saveButton, 
                  (!isValid || isSubmitting) && styles.disabledButton
                ]} 
                onPress={() => handleSubmit()}
                disabled={!isValid || isSubmitting}
              >
                <Text style={styles.saveButtonText}>
                  {isSubmitting ? 'Saving...' : 'Save'}
                </Text>
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
  errorText: {
    color: 'red',
    fontSize: 12,
    marginTop: 5,
  },
  disabledButton: {
    opacity: 0.5,
  },
  successText: {
    color: 'green',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 10,
  },
});