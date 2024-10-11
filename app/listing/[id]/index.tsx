import { View, Text, StyleSheet, ActivityIndicator, Image, Dimensions, TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from 'react';
import { Link, useLocalSearchParams, useRouter } from 'expo-router';
import { useService } from '@/api/service_providers';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Defaultcarlogo from '@/assets/images/carconnect.jpg'; // Import your local image
import { Ionicons } from '@expo/vector-icons';
import Colors from '@/constants/Colors';
import Animated, { SlideInDown } from 'react-native-reanimated';
import { defaultStyles } from '@/constants/Styles';
import { supabase } from '@/lib/supabase';

const { width } = Dimensions.get('window');
const IMG_HEIGHT = 300;

const Page = () => {
  const { top } = useSafeAreaInsets();
  const { id: idString } = useLocalSearchParams();
  const id = parseFloat(Array.isArray(idString) ? idString[0] : idString);
  const router = useRouter();
  
  const [categoryDetails, setCategoryDetails] = useState<unknown[]>([]);
  const { data: services, error, isLoading } = useService(id);


  useEffect(() => {
    const fetchCategoryDetails = async () => {
      
      if (services && services.category) {
        try {
          let { data, error } = {};
          if (services.category === 'Car Wash') {
            ({ data, error } = await supabase.from('cleaning_and_detailing').select('*').eq('service_id', id));
          } else if (services.category === 'Rental') {
            ({ data, error } = await supabase.from('rental_service').select('*').eq('service_id', id));
          } else if (services.category === 'Maintenance') {
            ({ data, error } = await supabase.from('maintenance_service').select('*').eq('service_id', id));
          } else if (services.category === 'Repairs') {
            ({ data, error } = await supabase.from('repair_service').select('*').eq('service_id', id));
          } else if (services.category === 'Sales & Part') {
            ({ data, error } = await supabase.from('sales_and_parts').select('*').eq('service_id', id));
          } else if (services.category === 'Inspection') {
            ({ data, error } = await supabase.from('inspection_service').select('*').eq('service_id', id));
          } else if (services.category === 'Tire') {
            ({ data, error } = await supabase.from('tire_services').select('*').eq('service_id', id));
          } else if (services.category === 'Emergency') {
            ({ data, error } = await supabase.from('emergency_service').select('*').eq('service_id', id));
          }
          if (error) {
            console.error("Error fetching category details:", error);
            setCategoryDetails([]);
          } else {
            setCategoryDetails(data);
          }
        } catch (err) {
          console.error("Error fetching category details:", err);
          setCategoryDetails([]);
        }
      }
    };

    if (services?.category) {
      fetchCategoryDetails();
    }
  }, [services]);

  if (isLoading) {
    return <ActivityIndicator />;
  }

  if (error || !services) {
    return <Text>Failed to fetch service</Text>;
  }

  console.log(id)

  const createdAtDate = new Date(services.User_Business?.created_at || new Date()).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const handleAppointmentPress = () => {
    router.push({
      pathname: '/modal/booking',
      params: { serviceId: id }
    });
  };
console.log(categoryDetails)
  const renderCategoryDetails = () => {
    if (!Array.isArray(categoryDetails) || categoryDetails.length === 0) {
      return <Text>No details available for this service.</Text>;
    }
    if (services.category === 'Car Wash') {
      return (
        <View style={styles.carDetails}>
          {categoryDetails.map((item: any) => (
  <>
    <Text style={styles.carDetailText}>Type: {item.type}</Text>
    <Text style={styles.carDetailText}>Package: {item.add_ons}</Text>
  </>
))}
        </View>
      );
    } else if (services.category === 'Rental') {
      return (
        <View style={styles.carDetails}>
          {categoryDetails.map((item: any) => (
            <>
  <Text style={styles.carDetailText}>Vehicle type: {item.vehicle_type}</Text>
  <Text style={styles.carDetailText}>Model: {item.vehicle_model}</Text>
  <Text style={styles.carDetailText}>Duration: {item.vehicle_duration}</Text>
  </>
      ))}
        </View>
      );
    } else if (services.category === 'Repairs') {
      return (
        <View style={styles.carDetails}>
          {categoryDetails.map((item: any) => (
     <>
     <Text style={styles.carDetailText}>Issue: {item.issue_type}</Text>
     <Text style={styles.carDetailText}>Severity: {item.severity_level}</Text>
     <Text style={styles.carDetailText}>Parts required: {item.parts_required}</Text>
     </>
      ))}
        </View>
      );
    } else if (services.category === 'Sales & Part') {
      return (
        <View style={styles.carDetails}>
          {categoryDetails.map((item: any) => (
     <>
     <Text style={styles.carDetailText}>Category: {item.category}</Text>
     <Text style={styles.carDetailText}>Available: {item.availability}</Text>
     <Text style={styles.carDetailText}>Warranty: {item.warrantyProvided}</Text>
     </>
      ))}
        </View>
      );
    }else if (services.category === 'Tire') {
      return (
        <View style={styles.carDetails}>
          {categoryDetails.map((item: any) => (
     <>
     <Text style={styles.carDetailText}>Type: {item.tire_type}</Text>
     <Text style={styles.carDetailText}>Service type: {item.service_type}</Text>
     <Text style={styles.carDetailText}>Brand: {item.tire_brand}</Text>
     </>
      ))}
        </View>
      );
    } else if (services.category === 'Maintenance') {
      return (
        <View style={styles.carDetails}>
          {categoryDetails.map((item: any) => (
     <>
     <Text style={styles.carDetailText}>Duration: {item.frequency}</Text>
     <Text style={styles.carDetailText}>Model: {item.required_part}</Text>
     <Text style={styles.carDetailText}>estimatated time: {item.estimated_time}</Text>
     </>
      ))}
        </View>
      );
    } else if (services.category === 'Inspection') {
      return (
        <View style={styles.carDetails}>
          {categoryDetails.map((item: any) => (
     <>
     <Text style={styles.carDetailText}>Type: {item.inspection_type}</Text>
     <Text style={styles.carDetailText}>Areas Covered: {item.areas_covered}</Text>
     <Text style={styles.carDetailText}>report provided: {item.report_provided}</Text>
     </>
      ))}
        </View>
      );
    } else if (services.category === 'Emergency') {
      return (
        <View style={styles.carDetails}>
          {categoryDetails.map((item: any) => (
     <>
     <Text style={styles.carDetailText}>Type: {item.emergency_type}</Text>
     <Text style={styles.carDetailText}>response time: {item.response_time}</Text>
     <Text style={styles.carDetailText}>Availability: {item.availability}</Text>
     </>
      ))}
        </View>
      );
    }
    return null;
  };

  return (
    <View style={styles.container}>
      <Animated.ScrollView
        contentContainerStyle={{ paddingBottom: 100 }}
        scrollEventThrottle={16}>
        <Animated.Image
          source={services.image ? { uri: services.image } : Defaultcarlogo}
          style={[styles.image]}
          resizeMode="cover"
        />
        <View style={styles.infoContainer}>
          <Text style={styles.name}>{services.name}</Text>
          {/* <View style={{ flexDirection: 'row', gap: 4 }}>
            <Ionicons name="star" size={16} />
            <Text style={styles.ratings}>{services.quantity ?? 0 / 20}</Text>
            </View> */}

          {/* Render category-specific details */}
          {renderCategoryDetails()}
            <Text style={styles.location}>{services.category}</Text>

          <View style={styles.divider} />
          <View style={styles.hostView}>
            <Image 
              source={services.provider_id ? { uri: services.provider_id } : Defaultcarlogo} 
              style={styles.host} 
            />
            <Link href={`/listing/${services.id}/provider`} asChild>
              <TouchableOpacity>
                <Text style={{ fontWeight: '500', fontSize: 16 }}>
                  Service by {services.User_Business?.business_name}
                </Text>
                <Text>Member since {createdAtDate}</Text>
              </TouchableOpacity>
            </Link>
          </View>
          <View style={styles.divider} />
          <Text style={styles.description}>{services.description}</Text>
        </View>
      </Animated.ScrollView>
      
      {/* Footer */}
      <Animated.View style={defaultStyles.footer} entering={SlideInDown.delay(200)}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <TouchableOpacity style={styles.footerText}>
            <Text style={styles.footerPrice}>Ghc{services.price}</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[defaultStyles.btn, { paddingRight: 20, paddingLeft: 20 }]}
            onPress={handleAppointmentPress}
          >
            <Text style={defaultStyles.btnText}>Appointment</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </View>
  );
};

export default Page;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  image: {
    height: IMG_HEIGHT,
    width: width,
  },
  infoContainer: {
    padding: 24,
    backgroundColor: '#fff',
  },
  name: {
    fontSize: 26,
    fontWeight: 'bold',
    fontFamily: 'mon-sb',
  },
  location: {
    fontSize: 18,
    marginTop: 10,
    fontFamily: 'mon-sb',
  },
  ratings: {
    fontSize: 16,
    fontFamily: 'mon-sb',
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: Colors.gray,
    marginVertical: 16,
  },
  host: {
    width: 50,
    height: 50,
    borderRadius: 50,
    backgroundColor: Colors.gray,
  },
  hostView: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  footerText: {
    height: '100%',
    justifyContent: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  footerPrice: {
    fontSize: 18,
    fontFamily: 'mon-sb',
  },
  description: {
    fontSize: 16,
    marginTop: 10,
    fontFamily: 'mon',
  },
  carDetailText: {
    fontSize: 16,
    marginBottom: 8,
  },
  carDetails: {
    marginVertical: 16,
  },
});
