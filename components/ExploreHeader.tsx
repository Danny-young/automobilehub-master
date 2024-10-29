import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, TextInput, Modal } from 'react-native'
import React, { useRef, useState, useEffect } from 'react'
import { Link } from 'expo-router';
import { TabBarIcon } from './navigation/TabBarIcon';
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { Audio } from 'expo-av';
import { Platform } from 'react-native';
import { supabase } from '@/lib/supabase';
import Voice from '@react-native-voice/voice';

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

const ExploreHeader = ({ onCategoryChanged, onSearch }: Props) => {
  const scrollRef = useRef<ScrollView>(null);
  const itemRef = useRef<Array<TouchableOpacity | null >>([]) ;
  const [activeIndex, setActiveIndex] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [chatResponse, setChatResponse] = useState('');
  const [services, setServices] = useState<Service[]>([]);

  useEffect(() => {
    Voice.onSpeechError = onSpeechError;
    Voice.onSpeechResults = onSpeechResults;
    Voice.onSpeechEnd = onSpeechEnd;

    return () => {
      Voice.destroy().then(Voice.removeAllListeners);
    }
  }, []);

  const startSpeechToText = async () => {
    setIsListening(true);
    try {
      await Voice.start("en-UK");
    } catch (error) {
      console.error('Error starting voice recognition:', error);
      setIsListening(false);
    }
  };

  const stopSpeechToText = async () => {
    setIsListening(false);
    try {
      await Voice.stop();
    } catch (error) {
      console.error('Error stopping voice recognition:', error);
    }
  };

  const onSpeechResults = (result: any) => {
    const text = result.value[0];
    setSearchQuery(text);
    onSearch(text);
    setIsListening(false);
  };

  const onSpeechError = (error: any) => {
    console.log('Speech recognition error:', error);
    setIsListening(false);
  };

  const onSpeechEnd = () => {
    setIsListening(false);
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const { data, error } = await supabase
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
      scrollRef.current?.scrollTo({ x: x + 16, y: 0, animated: true });
    });

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onCategoryChanged(categories[index].name);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    onSearch(query);
  };

  const handleAIChat = async () => {
    const lowercaseInput = chatInput.toLowerCase();
    let response = "I'm sorry, I don't have information about that. Can you ask something else?";

    const matchingServices = services.filter((service) =>
      service.name.toLowerCase().includes(lowercaseInput) ||
      service.category.toLowerCase().includes(lowercaseInput) ||
      service.description.toLowerCase().includes(lowercaseInput)
    );

    if (matchingServices.length > 0) {
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
          <TextInput
            style={styles.searchInput}
            placeholder="Search services..."
            value={searchQuery}
            onChangeText={handleSearch}
          />
          <TouchableOpacity 
            style={[styles.filterBtn, isListening && styles.listeningBtn]} 
            onPress={isListening ? stopSpeechToText : startSpeechToText}
          >
            <MaterialCommunityIcons name={isListening ? "record" : "microphone"} size={24} color="black" />
          </TouchableOpacity>
        </View>

        <ScrollView
          ref={scrollRef}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{
            alignItems: 'center',
            gap: 20,
            paddingHorizontal: 16,
          }}>
          {categories.map((item, index) => (
            <TouchableOpacity
              onPress={() => selectCategory(index)}
              key={index}
              ref={(el) => { itemRef.current[index] = el }}
              style={activeIndex === index ? styles.categoryBtnActive : styles.categoriesBtn}>
              <MaterialCommunityIcons size={24} name={item.icon as any} color={activeIndex === index ? 'blue' : 'grey'} />
              <Text
                style={activeIndex === index ? styles.categoryTextActive : styles.categoryText}>{item.name}</Text>
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
    height: 130,
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingBottom: 16,
    gap: 10
  },
  filterBtn: {
    padding: 10,
    borderWidth: 1,
    borderColor: 'grey',
    borderRadius: 24,
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
      width: 1,
      height: 1,
    },
  },
  categoryText: {
    fontSize: 14,
    fontFamily: 'SpaceMono',
    color: 'grey',
  },
  categoryTextActive: {
    fontSize: 14,
    fontFamily: 'SpaceMono',
    color: 'blue',
  },
  categoryBtnActive: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 8,
    borderBottomColor: '#000',
    borderBottomWidth: 2,
  },
  categoriesBtn: {
    flex: 1,
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

export default ExploreHeader;

