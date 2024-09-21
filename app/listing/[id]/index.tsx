import { View, Text, StyleSheet, ActivityIndicator, Image, Dimensions, TouchableOpacity, Share } from 'react-native';
import React, { useLayoutEffect } from 'react';
import { Link, Stack, useLocalSearchParams, useNavigation, useRouter } from 'expo-router';
import { useService } from '@/api/service_providers';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { defaultPizzaImage } from '@/components/Listings/serviceItemList';
import { Ionicons } from '@expo/vector-icons';
import Colors from '@/constants/Colors';
import Animated, {
  SlideInDown,
  interpolate,
  useAnimatedRef,
  useAnimatedStyle,
  useScrollViewOffset,
} from 'react-native-reanimated';
import { defaultStyles } from '@/constants/Styles';

const { width } = Dimensions.get('window');
const IMG_HEIGHT = 300;

const Page = () => {
  const { top } = useSafeAreaInsets();
  const { id: idString } = useLocalSearchParams();
  const navigation = useNavigation();
  const router = useRouter();
  const id = parseFloat(Array.isArray(idString) ? idString[0] : idString);
  const scrollRef = useAnimatedRef<Animated.ScrollView>();

  const { data: services, error, isLoading } = useService(id);
//   const shareListing = async () => {
//     try {
//       await Share.share({
//         title: listing.name,
//         url: listing.listing_url,
//       });
//     } catch (err) {
//       console.log(err);
//     }
//   };

//   useLayoutEffect(() => {
//     navigation.setOptions({
//       headerTitle: '',
//       headerTransparent: true,

//       headerBackground: () => (
//         <Animated.View /* style={[ styles.header]} */></Animated.View>
//       ),
//       headerRight: () => (
//         <View /* style={styles.bar} */>
//           <TouchableOpacity /* style={styles.roundButton} */ /* onPress={shareListing} */>
//             <Ionicons name="share-outline" size={22} color={'#000'} />
//           </TouchableOpacity>
//           <TouchableOpacity /* style={styles.roundButton} */>
//             <Ionicons name="heart-outline" size={22} color={'#000'} />
//           </TouchableOpacity>
//         </View>
//       ),
//       headerLeft: () => (
//         <TouchableOpacity /* style={styles.roundButton}  */onPress={() => navigation.goBack()}>
//           <Ionicons name="chevron-back" size={24} color={'#000'} />
//         </TouchableOpacity>
//       ),
//     });
//   }, []);
  if (isLoading) {
    return <ActivityIndicator />;
  }
  // loom recording

  if (error || !services) {
    return <Text>Failed to fetch service</Text>;
  }



  const createdAtDate = new Date(
    services.User_Business?.created_at || new Date().toISOString()
  ).toLocaleDateString('en-US', {
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

  return (
       <View style={styles.container}>
      <Animated.ScrollView
        contentContainerStyle={{ paddingBottom: 100 }}
        ref={scrollRef}
        scrollEventThrottle={16}>
        <Animated.Image
          source={{ uri: services.image || defaultPizzaImage }}
          style={[styles.image]}
          resizeMode="cover"
        />

        <View style={styles.infoContainer}>
          <Text style={styles.name}>{services.name}</Text>
          <Text style={styles.location}>
            {services.category} 
          </Text>
          
          <View style={{ flexDirection: 'row', gap: 4 }}>
            <Ionicons name="star" size={16} />
            <Text style={styles.ratings}>
              {services.quantity ?? 0 / 20  } {/* · {services.number_of_reviews} reviews */}
            </Text>
          </View>
          <View style={styles.divider} />

          <View style={styles.hostView}>
            <Image source={{ uri: services.provider_id  || defaultPizzaImage}} style={styles.host} />

            <Link href={`/listing/${services.id}/provider`}  asChild>
            <TouchableOpacity >
              <Text style={{ fontWeight: '500', fontSize: 16 }}>Service by {services.User_Business?.business_name}</Text>
              <Text>Member since {createdAtDate}</Text>
            </TouchableOpacity>
            </Link>
          </View>

          <View style={styles.divider} />

          <Text style={styles.description}>{services.description}</Text>
        </View>
      </Animated.ScrollView>

      <Animated.View style={defaultStyles.footer} entering={SlideInDown.delay(200)}>
        <View
          style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
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
    rooms: {
      fontSize: 16,
      color: Colors.gray,
      marginVertical: 4,
      fontFamily: 'mon',
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
    roundButton: {
      width: 40,
      height: 40,
      borderRadius: 50,
      backgroundColor: 'white',
      alignItems: 'center',
      justifyContent: 'center',
      color: Colors.primary,
    },
    bar: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 10,
    },
    header: {
      backgroundColor: '#fff',
      height: 100,
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderColor: Colors.gray,
    },
  
    description: {
      fontSize: 16,
      marginTop: 10,
      fontFamily: 'mon',
    },
  });
