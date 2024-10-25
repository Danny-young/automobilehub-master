import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, TextInput, Modal } from 'react-native'
import React, { useRef, useState, useEffect } from 'react'
import { Link } from 'expo-router';
import { TabBarIcon } from './navigation/TabBarIcon';
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { Audio } from 'expo-av';
import { Platform } from 'react-native';
import { supabase } from '@/lib/supabase';

// Add this line to define the server address
const serverAddress = Platform.select({
  android: 'http://192.168.43.245:5000', // Replace with your computer's IP address
  ios: 'http://192.168.43.245:5000', // Replace with your computer's IP address
  default: 'http://192.168.43.245:5000', // Replace with your computer's IP address
});

console.log('Server address:', serverAddress);

const categories = [
  {
    name:"All Service",
    icon: "car-select"
  },

  {
    name:"Car Wash",
    icon: "car-wash"
  },
  {
    name:"Repairs",
    icon: "car-wrench"
  },
  {
    name:"Rental",
    icon: "car-back"
  },
  
  {
    name:"Sales & Part",
    icon: "car-battery"
  },
  {
    name:"Emergency",
    icon: "car-emergency"
  },
];

interface Props {
  onCategoryChanged: (category: string) => void;
  onSearch: (query: string) => void;
}

interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
}

// const serviceInfo = [
//   'We sell engine oil and spare parts',
//   'Car light is 200gh',
//   'Cost of renting Benz is between 500gh to 700gh',
//   'We offer car wash services starting from 50gh',
//   'Our mechanics can diagnose and fix most car issues',
// ];

const ExploreHeader = ({ onCategoryChanged, onSearch }: Props) => {
const scrollRef = useRef<ScrollView>(null);
  const itemRef = useRef<Array<TouchableOpacity | null >>([]) ;
  const [activeIndex, setActiveIndex] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [isListening, setIsListening] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [chatResponse, setChatResponse] = useState('');
  const [services, setServices] = useState<Service[]>([]);

  useEffect(()=> {
    fetchServices();

  }, []);

  const fetchServices = async () => {
    try {
      const {data, error } = await supabase
        .from('Services')
        .select('*');
        if (error) {
          throw new Error(error.message);
        }
        if (data) {
          setServices(data);
        }
      } catch (error) {
        console.error('Error fetching services:', error);
      }
       
  };









  const selectCategory = (index: number) => {
  const selected = itemRef.current[index];
  setActiveIndex(index);
  selected?.measure((x) => {
    scrollRef.current?.scrollTo({x: x + 16, y: 0, animated: true});
  });

  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  onCategoryChanged(categories[index].name);
};

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    onSearch(query);
  };

  const startListening = async () => {
    setIsListening(true);
    setSearchQuery('');
    try {
      await Audio.requestPermissionsAsync();
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );
      setRecording(recording);
    } catch (err) {
      console.error('Failed to start recording', err);
      setIsListening(false);
    }
  };

  const stopListening = async () => {
    setIsListening(false);
    if (!recording) return;

    setRecording(null);
    await recording.stopAndUnloadAsync();
    const uri = recording.getURI();
    if (uri) {
      await sendAudioToServer(uri);
    }
  };

  const sendAudioToServer = async (uri: string) => {
    const formData = new FormData();
    formData.append('audio', {
      uri: uri,
      type: 'audio/x-wav',
      name: 'speech.wav',
    } as any);

    try {
      console.log('Sending request to:', `${serverAddress}/speech-to-text`);
      console.log('Audio URI:', uri);
      
      const response = await fetch(`${serverAddress}/speech-to-text`, {
        method: 'POST',
        body: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log('Response status:', response.status);
      console.log('Response headers:', JSON.stringify(response.headers));

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error! status: ${response.status}, body: ${errorText}`);
      }

      const text = await response.text();
      console.log('Response text:', text);

      // Parse the response text as JSON
      const data = JSON.parse(text);
      if (data.text) {
        console.log('Recognized text:', data.text);
        setSearchQuery(data.text);
        onSearch(data.text);
      } else if (data.error) {
        console.error('Error from server:', data.error);
      }
    } catch (error) {
      console.error('Error sending audio to server:', error);
      if (error instanceof Error) {
        console.error('Error name:', error.name);
        console.error('Error message:', error.message);
        console.error('Error stack:', error.stack);
      }
      if (error instanceof TypeError) {
        console.error('TypeError details:', error);
      }
    }
  };

  const handleSpeechToText = async () => {
    if (isListening) {
      await stopListening();
    } else {
      await startListening();
    }
  };

  const handleAIChat = async () => {
    const lowercaseInput = chatInput.toLowerCase();
    let response = "I'm sorry, I don't have information about that. Can you ask something else?";

    // if (lowercaseInput.includes('engine') || lowercaseInput.includes('spare')) {
    //   response = serviceInfo[0];
    // } else if (lowercaseInput.includes('light')) {
    //   response = serviceInfo[1];
    // } else if (lowercaseInput.includes('benz') || lowercaseInput.includes('rent')) {
    //   response = serviceInfo[2];
    // } else if (lowercaseInput.includes('wash')) {
    //   response = serviceInfo[3];
    // } else if (lowercaseInput.includes('mechanic') || lowercaseInput.includes('fix')) {
    //   response = serviceInfo[4];
    // }

    const matchingServices = services.filter((service) =>
      service.name.toLowerCase().includes(lowercaseInput) ||
      service.category.toLowerCase().includes(lowercaseInput) ||
      service.description.toLowerCase().includes(lowercaseInput) || 
      service.category.toLowerCase().includes(lowercaseInput)
    );

    if (matchingServices.length > 0 ) {
      const service = matchingServices[0];
      response = `${service.name} service: ${service.description}` + `  Category: ${service.category}`;
    }
    setChatResponse(response);
    setChatInput('');
  };

  return (
    <SafeAreaView>

      <View style={styles.container}>
        <View style={styles.actionRow}>
        {/* <Link href={'/(modals)/booking'} asChild> */}
        <TextInput
            style={styles.searchInput}
            placeholder="Search services..."
            value={searchQuery}
            onChangeText={handleSearch}
          />
        <TouchableOpacity style={[styles.filterBtn, isListening && styles.listeningBtn]} onPress={handleSpeechToText}>
        <TabBarIcon name={isListening ? "stop" : "microphone"} />
        </TouchableOpacity>
        </View>
     
      
      <ScrollView 
      ref={scrollRef}
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{
        alignItems: 'center',
        gap:20,
        paddingHorizontal: 16,
      }} >
          {categories.map((item, index) =>
          (
            <TouchableOpacity
            onPress={()=> selectCategory(index)} 
              key={index}
              ref={(el) => {itemRef.current[index] = el}}
              style={activeIndex === index ? styles.categoryBtnActive : styles.categoriesBtn}>
              <MaterialCommunityIcons size={24} name={item.icon as any} color={activeIndex === index ? 'blue': 'grey'}/>
              <Text 
              style={activeIndex === index ? styles.categoryTextActive: styles.categoryText}>{item.name}</Text>
            </TouchableOpacity>
          ))}
      </ScrollView>
      </View>
   
    <TouchableOpacity 
      style={styles.floatingButton} 
      onPress={() => setIsChatOpen(true)}
    >
      <MaterialCommunityIcons name="robot" size={24} color="white" />
    </TouchableOpacity>

    <Modal
      visible={isChatOpen}
      animationType="slide"
      transparent={true}
      onRequestClose={() => setIsChatOpen(false)}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <TouchableOpacity 
            style={styles.closeButton} 
            onPress={() => setIsChatOpen(false)}
          >
            <MaterialCommunityIcons name="close" size={24} color="black" />
          </TouchableOpacity>
          <Text style={styles.modalTitle}>AI Assistant</Text>
          <Text style={styles.chatResponse}>{chatResponse}</Text>
          <View style={styles.chatInputContainer}>
            <TextInput
              style={styles.chatInput}
              value={chatInput}
              onChangeText={setChatInput}
              placeholder="Ask about our services..."
            />
            <TouchableOpacity 
              style={styles.sendButton} 
              onPress={handleAIChat}
            >
              <MaterialCommunityIcons name="send" size={24} color="white" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
    </SafeAreaView>
  )
}
 const styles = StyleSheet.create({
   container: {
     backgroundColor: '#fff',
     height:130,
     
   },
   actionRow: {
     flexDirection: 'row',
     alignItems: 'center',
     justifyContent: 'space-between',
     paddingHorizontal:24,
     paddingBottom:16,
     gap:10

   },
   filterBtn: {
     padding:10,
     borderWidth:1,
     borderColor: 'grey',
     borderRadius:24,
   },
   searchInput: {
      flex: 1,
      padding: 14,
      borderRadius: 30,
      backgroundColor: '#fff',
      borderWidth: StyleSheet.hairlineWidth,
      elevation: 2,
      shadowColor: '#000',
      shadowOpacity: 0.12,
      shadowRadius: 8,
      shadowOffset: {
        width:1,
        height:1,
                     },
   },

   categoryText: {
    fontSize: 14,
    fontFamily: 'SpaceMono',
    color:'grey',
   },

   categoryTextActive: {
    fontSize: 14,
    fontFamily: 'SpaceMono',
    color:'blue',
   },

   categoryBtnActive: {
    flex:1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 8,
    borderBottomColor: '#000',
    borderBottomWidth:2,
   },

   categoriesBtn: {
    flex:1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 8,
    
   },

   listeningBtn: {
    backgroundColor: 'red',
   },

   floatingButton: {
    position: 'absolute',
    right: 20,
    bottom: 10,
    backgroundColor: 'blue',
    borderRadius: 30,
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    height: '70%',
  },
  closeButton: {
    alignSelf: 'flex-end',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  chatResponse: {
    fontSize: 16,
    marginBottom: 20,
  },
  chatInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  chatInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 20,
    padding: 10,
    marginRight: 10,
  },
  sendButton: {
    backgroundColor: 'blue',
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ExploreHeader