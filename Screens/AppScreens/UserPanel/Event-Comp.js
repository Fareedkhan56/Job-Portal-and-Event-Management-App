import React, { useState, useEffect } from 'react';
import { ScrollView, StyleSheet, View, Modal, TouchableOpacity, Button } from 'react-native';

// React Native Paper
import { Text, Card, ActivityIndicator } from 'react-native-paper';

// Firebase
import database from '@react-native-firebase/database';
import auth from '@react-native-firebase/auth';

// Vector Icons
import Icon from 'react-native-vector-icons/Ionicons';
import { Toast } from 'toastify-react-native';

const Events = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);

    const fetchEvents = async () => {
        try {
            const eventsSnapshot = await database().ref('events').once('value');
            const eventsData = [];
            eventsSnapshot.forEach((childSnapshot) => {
                eventsData.push({ id: childSnapshot.key, ...childSnapshot.val() });
            });
            setEvents(eventsData);
        } catch (error) {
            console.error('Error fetching events:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEvents();
    }, []);

    const handleCardPress = (event) => {
        setSelectedEvent(event);
        setModalVisible(true);
    };

    const handleCloseModal = () => {
        setModalVisible(false);
        setSelectedEvent(null);
    };

    const handleApplyEvent = async () => {
        if (selectedEvent) {
            const user = auth().currentUser;
            if (user) {
                const userId = user.uid;
                try {
                    await database().ref(`applications/events/${selectedEvent.id}/${userId}`).set({
                        timestamp: new Date().toISOString(),
                        details: 'User applied for this event',
                    });

                    setEvents((prevEvents) => prevEvents.filter((event) => event.id !== selectedEvent.id));
                    handleCloseModal();
                }
                catch (error) {
                    Toast.error('Error applying for Event:', error);
                }
            } else {
                Toast.error('No user is currently signed in.');
            }
        }
    };


    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Upcoming Events</Text>

            <ScrollView>
                {events.length > 0 ? (
                    events.map((event) => (
                        <Card key={event.id} style={styles.card}>
                            <TouchableOpacity onPress={() => handleCardPress(event)}>
                                <Card.Content>
                                    <View style={styles.row}>
                                        <Icon name="calendar-outline" size={20} color={'black'} />
                                        <Text style={styles.eventTitle}>{event.title}</Text>
                                    </View>
                                    <Text style={styles.eventDescription} numberOfLines={2}>
                                        {event.description}
                                    </Text>
                                    <View style={styles.row}>
                                        <Icon name="pricetag-outline" size={16} color={'black'} />
                                        <Text style={styles.category}>Category: {event.category}</Text>
                                    </View>
                                    <View style={styles.row}>
                                        <Icon name="location-outline" size={16} color={'black'} />
                                        <Text style={styles.location}>Location: {event.location}</Text>
                                    </View>
                                </Card.Content>
                            </TouchableOpacity>
                        </Card>
                    ))
                ) : (
                    <Text>No events available</Text>
                )}
            </ScrollView>

            {selectedEvent && (
                <Modal
                    transparent={true}
                    visible={modalVisible}
                    onRequestClose={handleCloseModal}
                    animationType="slide"
                >
                    <View style={styles.modalContainer}>
                        <View style={styles.modalContent}>
                            <Text style={styles.modalTitle}>{selectedEvent.title}</Text>
                            <Text style={styles.modalText}>
                                <Icon name="pricetag-outline" size={20} color={'black'} /> Category: {selectedEvent.category}
                            </Text>
                            <Text style={styles.modalText}>
                                <Icon name="location-outline" size={20} color={'black'} /> Location: {selectedEvent.location}
                            </Text>
                            <Text style={styles.modalText}>
                                <Icon name="information-circle-outline" size={20} color={'black'} /> Description: {selectedEvent.description}
                            </Text>
                            <View style={styles.buttonContainer}>
                                <Button title="Apply" onPress={handleApplyEvent} color="#4CAF50" />
                                <Button title="Close" onPress={handleCloseModal} color="#F44336" />
                            </View>
                        </View>
                    </View>
                </Modal>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        margin: 10,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    card: {
        margin: 20,
        borderRadius: 4,
        elevation: 10,
        padding: 20,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 5,
    },
    eventTitle: {
        fontSize: 20,
        color: '#218f37',
        fontWeight: 'bold',
        marginLeft: 10,
    },
    eventDescription: {
        fontSize: 14,
        color: '#333',
        marginVertical: 5,
    },
    category: {
        fontSize: 12,
        marginLeft: 10,
    },
    location: {
        fontSize: 12,
        marginLeft: 10,
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalContent: {
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 10,
        width: '80%',
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    modalText: {
        fontSize: 16,
        marginBottom: 10,
    },
    buttonContainer: {
        marginTop: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
});

export default Events;
