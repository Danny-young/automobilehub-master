import React, { useEffect, useState } from "react";
import { FlatList, StyleSheet, Text, TouchableOpacity, View, ScrollView } from "react-native";
import moment from "moment";
import Colors from "@/constants/Colors";

const BookingSection = () => {
    const [next7Days, setNext7Days] = useState<Array<{ date: moment.Moment, day: string, formattedDate: string }>>([]);
    const [timeList, setTimeList] = useState<Array<{ time: string }>>([]);
    const [selectedDate, setSelectedDate] = useState<moment.Moment | null>(null);
    const [selectedTime, setSelectedTime] = useState<string | null>(null);
    const [selectedService, setSelectedService] = useState<string | null>(null);

    useEffect(() => {
        getDays();
    }, []);

    // Function to get the next 7 days
    const getDays = () => {
        const today = moment();
        const nextSevenDays = [];
        for (let i = 0; i < 7; i++) {
            const date = moment(today).add(i, 'days');
            nextSevenDays.push({
                date: date,
                day: date.format('ddd'), // Tue, Wed, etc.
                formattedDate: date.format('DD MMM'), // 08 Mar
            });
        }
        setNext7Days(nextSevenDays);
    };

    // Function to generate time slots (9 AM - 5 PM)
    const getTime = () => {
        const times = [];
        for (let i = 9; i <= 17; i++) {
            times.push({ time: moment({ hour: i }).format("h:mm A") });
            if (i !== 17) {
                times.push({ time: moment({ hour: i, minute: 30 }).format("h:mm A") });
            }
        }
        setTimeList(times);
    };

    const services = ["Oil Change", "Tire Rotation", "Brake Inspection", "General Maintenance"];

    const handleBooking = () => {
        if (selectedDate && selectedTime && selectedService) {
            // Here you would typically send this data to your backend or state management
            console.log("Booking:", { date: selectedDate.format('YYYY-MM-DD'), time: selectedTime, service: selectedService });
            // Reset selections after booking
            setSelectedDate(null);
            setSelectedTime(null);
            setSelectedService(null);
        } else {
            console.log("Please select all required fields");
        }
    };

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.sectionTitle}>Book an Appointment</Text>

            <Text style={styles.subTitle}>Select a Service:</Text>
            <View style={styles.serviceContainer}>
                {services.map((service) => (
                    <TouchableOpacity
                        key={service}
                        style={[
                            styles.serviceButton,
                            selectedService === service ? { backgroundColor: Colors.primary } : {}
                        ]}
                        onPress={() => setSelectedService(service)}
                    >
                        <Text style={[
                            styles.serviceText,
                            selectedService === service ? { color: 'white' } : {}
                        ]}>
                            {service}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>

            <Text style={styles.subTitle}>Select a Date:</Text>
            <FlatList
                data={next7Days}
                horizontal
                showsHorizontalScrollIndicator={false}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        style={[
                            styles.dayButton,
                            selectedDate && selectedDate.isSame(item.date, 'day') ? { backgroundColor: Colors.primary } : {}
                        ]}
                        onPress={() => {
                            setSelectedDate(item.date);
                            getTime(); // Load time slots once a date is selected
                        }}
                    >
                        <Text
                            style={[
                                styles.dayText,
                                selectedDate && selectedDate.isSame(item.date, 'day') ? { color: 'white' } : {}
                            ]}
                        >
                            {item.day}
                        </Text>
                        <Text
                            style={[
                                styles.dayText,
                                selectedDate && selectedDate.isSame(item.date, 'day') ? { color: 'white' } : {}
                            ]}
                        >
                            {item.formattedDate}
                        </Text>
                    </TouchableOpacity>
                )}
            />

            <Text style={styles.subTitle}>Select a Time:</Text>
            {selectedDate && (
                <FlatList
                    data={timeList}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={({ item }) => (
                        <TouchableOpacity
                            style={[
                                styles.timeButton,
                                selectedTime === item.time ? { backgroundColor: Colors.primary } : {}
                            ]}
                            onPress={() => setSelectedTime(item.time)}
                        >
                            <Text
                                style={[
                                    styles.timeText,
                                    selectedTime === item.time ? { color: 'white' } : {}
                                ]}
                            >
                                {item.time}
                            </Text>
                        </TouchableOpacity>
                    )}
                />
            )}
{/* 
            <TouchableOpacity
                style={[
                    styles.bookButton,
                    (!selectedDate || !selectedTime || !selectedService) ? styles.disabledButton : {}
                ]}
                onPress={handleBooking}
                disabled={!selectedDate || !selectedTime || !selectedService}
            >
                <Text style={styles.bookButtonText}>Book Appointment</Text>
            </TouchableOpacity> */}
        </ScrollView>
    );
};

export default BookingSection;

const styles = StyleSheet.create({
    dayButton: {
        borderWidth: 1,
        borderRadius: 99,
        padding: 5,
        paddingHorizontal: 20,
        alignItems: 'center',
        marginRight: 10,
        borderColor: Colors.gray
    },
    dayText: {
        color: Colors.gray, // Default text color
    },
    timeButton: {
        borderWidth: 1,
        borderRadius: 99,
        padding: 5,
        paddingHorizontal: 20,
        alignItems: 'center',
        marginRight: 10,
        borderColor: Colors.gray
    },
    timeText: {
        color: Colors.gray, // Default text color
    },
    container: {
        flex: 1,
        // padding: 20,
    },
    sectionTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    subTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginTop: 20,
        marginBottom: 10,
    },
    serviceContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    serviceButton: {
        borderWidth: 1,
        borderRadius: 10,
        padding: 10,
        marginBottom: 10,
        width: '48%',
        alignItems: 'center',
        borderColor: Colors.gray
    },
    serviceText: {
        color: Colors.gray,
    },
    bookButton: {
        backgroundColor: Colors.primary,
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        marginTop: 30,
    },
    bookButtonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
    disabledButton: {
        backgroundColor: Colors.gray,
    },
});