import React, { useEffect, useState } from "react";
import { FlatList, StyleSheet, Text, TouchableOpacity, View, ScrollView } from "react-native";
import moment from "moment";
import Colors from "@/constants/Colors";

interface BookingSectionProps {
  onDateSelect: (date: string) => void;
  onTimeSelect: (time: string) => void;
}

const BookingSection: React.FC<BookingSectionProps> = ({ onDateSelect, onTimeSelect }) => {
    const [next7Days, setNext7Days] = useState<Array<{ date: moment.Moment, day: string, formattedDate: string }>>([]);
    const [timeList, setTimeList] = useState<Array<{ time: string }>>([]);
    const [selectedDate, setSelectedDate] = useState<moment.Moment | null>(null);
    const [selectedTime, setSelectedTime] = useState<string | null>(null);

    useEffect(() => {
        getDays();
        getTime();
    }, []);

    const getDays = () => {
        const today = moment();
        const nextSevenDays = [];
        for (let i = 0; i < 7; i++) {
            const date = moment(today).add(i, 'days');
            nextSevenDays.push({
                date: date,
                day: date.format('ddd'),
                formattedDate: date.format('DD MMM'),
            });
        }
        setNext7Days(nextSevenDays);
    };

    const getTime = () => {
        const times = [];
        for (let i = 9; i <= 17; i++) {
            times.push({ time: moment({ hour: i }).format("HH:mm:00") });
            if (i !== 17) {
                times.push({ time: moment({ hour: i, minute: 30 }).format("HH:mm:00") });
            }
        }
        setTimeList(times);
    };

    const handleDateSelect = (date: moment.Moment) => {
        setSelectedDate(date);
        const formattedDate = date.format('YYYY-MM-DD');
        onDateSelect(formattedDate);
    };

    const handleTimeSelect = (time: string) => {
        setSelectedTime(time);
        onTimeSelect(time);
    };

    return (
        <ScrollView style={styles.container}>
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
                        onPress={() => handleDateSelect(item.date)}
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
                        onPress={() => handleTimeSelect(item.time)}
                    >
                        <Text
                            style={[
                                styles.timeText,
                                selectedTime === item.time ? { color: 'white' } : {}
                            ]}
                        >
                            {moment(item.time, "HH:mm:00").format("h:mm A")}
                        </Text>
                    </TouchableOpacity>
                )}
            />
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    subTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginTop: 20,
        marginBottom: 10,
    },
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
        color: Colors.gray,
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
        color: Colors.gray,
    },
});

export default BookingSection;