import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Linking } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Colors from '@/constants/Colors';

const FAQs = [
  { question: "How do I book a service?", answer: "You can book a service by navigating to the service provider's page and clicking on the 'Book Now' button." },
  { question: "Can I cancel my booking?", answer: "Yes, you can cancel your booking up to 24 hours before the scheduled time without any penalty." },
  { question: "How do I contact a service provider?", answer: "You can contact a service provider through the contact details provided on their profile page." },
  { question: "Is my payment information secure?", answer: "Yes, we use industry-standard encryption to protect your payment information." },
  { question: "What if I'm not satisfied with the service?", answer: "If you're not satisfied, please contact our customer support within 24 hours of the service completion." },
];

const HelpAndSupport = () => {
  const openEmail = () => {
    Linking.openURL('mailto:support@yourapp.com');
  };

  const openPhone = () => {
    Linking.openURL('tel:+1234567890');
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Help & Support</Text>

      <Text style={styles.sectionTitle}>Frequently Asked Questions</Text>
      {FAQs.map((faq, index) => (
        <View key={index} style={styles.faqItem}>
          <Text style={styles.question}>{faq.question}</Text>
          <Text style={styles.answer}>{faq.answer}</Text>
        </View>
      ))}

      <Text style={styles.sectionTitle}>Contact Us</Text>
      <TouchableOpacity style={styles.contactItem} onPress={openEmail}>
        <Ionicons name="mail" size={24} color={Colors.primary} />
        <Text style={styles.contactText}>support@yourapp.com</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.contactItem} onPress={openPhone}>
        <Ionicons name="call" size={24} color={Colors.primary} />
        <Text style={styles.contactText}>+1 (234) 567-890</Text>
      </TouchableOpacity>

      <Text style={styles.additionalInfo}>
        Our support team is available Monday to Friday, 9 AM to 5 PM EST.
        For urgent matters outside these hours, please email us and we'll get back to you as soon as possible.
        </Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
  },
  faqItem: {
    marginBottom: 15,
  },
  question: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  answer: {
    fontSize: 14,
    color: '#666',
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  contactText: {
    fontSize: 16,
    marginLeft: 10,
  },
  additionalInfo: {
    marginTop: 20,
    fontSize: 14,
    color: '#666',
    fontStyle: 'italic',
    
  },
});

export default HelpAndSupport;