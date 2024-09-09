import React, { useEffect, useState } from 'react'
import { Text, View, ScrollView, StyleSheet,Alert } from 'react-native'
import database from '@react-native-firebase/database';
import { Button } from 'react-native-paper';

const AllEvents = () => {

    const [events, setEvents] = useState([]);

    const fetchData = async () => {
        const eventsSnapshot = await database().ref('events').once('value')
        const eventsData = [];
        eventsSnapshot.forEach(childSnapshot => {
            const event = childSnapshot.val();
            eventsData.push({ id: childSnapshot.key, ...event });
        });
        setEvents(eventsData);
    }

    useEffect(() => {
        fetchData()
    }, [])

    const deleteEvent = async (eventId) => {
        Alert.alert(
            'Delete Event',
            'Are you sure you want to delete this Event?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await database().ref(`events/${eventId}`).remove();
                            alert('Event deleted successfully!');
                            fetchData(); 
                        } catch (error) {
                            alert('Failed to delete Event.');
                        }
                    }
                }
            ],
            { cancelable: true }
        );
    };
    

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Event Listings</Text>

            <ScrollView style={styles.eventList}>
                {events.map((event, index) => (
                    <View key={event.id || index} style={styles.eventItem}>
                        <Text style={styles.eventTitle}>{event.title}</Text>
                        <Text>{event.description}</Text>
                        <Text>Category: {event.category}</Text>
                        <Text>Location: {event.location}</Text>

                        <Button
                            mode="contained"
                            onPress={() => deleteEvent(event.id)}
                            style={styles.deleteButton}
                        >
                            Delete
                        </Button>
                    </View>
                ))}
            </ScrollView>
        </View>
    )
}

export default AllEvents

const styles = StyleSheet.create({
    container: {
        padding: 20,
        backgroundColor: '#F5F5F5',
        height: '100%',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
    eventList: {
        marginBottom: 20,
    },
    eventItem: {
        padding: 15,
        marginBottom: 10,
        backgroundColor: '#fff',
        borderRadius: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 5,
        elevation: 2,
    },
    eventTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    deleteButton: {
        marginTop: 10,
        backgroundColor: '#0772b9',
    },
});
