import React, { useState } from 'react';
import { Text, View, StyleSheet, Alert } from 'react-native';
import { TextInput, Button, Menu, Divider, Provider } from 'react-native-paper';
import database from '@react-native-firebase/database';

const AddEvent = () => {
  const [eventTitle, setEventTitle] = useState('');
  const [eventDescription, setEventDescription] = useState('');
  const [eventLocation, setEventLocation] = useState('');
  const [eventCategory, setEventCategory] = useState('');
  const [loading, setLoading] = useState(false);

  const [visible, setVisible] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('');

  const showMenu = () => setVisible(true);
  const hideMenu = () => setVisible(false);

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    setEventCategory(category);
    hideMenu();
  };

  const addEvent = async () => {
    if (!eventTitle || !eventDescription || !eventLocation || !eventCategory) {
      Alert.alert('Error', 'Please fill in all fields.');
      return;
    }

    setLoading(true);
    try {
      await database().ref('events').push({
        title: eventTitle,
        description: eventDescription,
        location: eventLocation,
        category: eventCategory,
      });
      Alert.alert('Success', 'Event added successfully!');
      setEventTitle('');
      setEventDescription('');
      setEventLocation('');
      setEventCategory('');
    } catch (error) {
      Alert.alert('Failed', 'Failed to add event. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Provider>
      <View style={styles.container}>
        <Text style={styles.title}>Add New Event</Text>

        <TextInput
          label="Event Title"
          value={eventTitle}
          onChangeText={setEventTitle}
          style={styles.input}
        />

        <TextInput
          label="Event Description"
          value={eventDescription}
          onChangeText={setEventDescription}
          multiline
          numberOfLines={4}
          style={styles.input}
        />

        <TextInput
          label="Event Location"
          value={eventLocation}
          onChangeText={setEventLocation}
          style={styles.input}
        />

        <Menu
          visible={visible}
          onDismiss={hideMenu}
          anchor={<Button mode="outlined" onPress={showMenu}>{selectedCategory || 'Select Category'}</Button>}
        >
          <Menu.Item onPress={() => handleCategorySelect('Conference')} title="Conference" />
          <Menu.Item onPress={() => handleCategorySelect('Workshop')} title="Workshop" />
          <Menu.Item onPress={() => handleCategorySelect('Seminar')} title="Seminar" />
          <Menu.Item onPress={() => handleCategorySelect('Webinar')} title="Webinar" />
          <Divider />
        </Menu>

        <Button
          mode="contained"
          onPress={addEvent}
          loading={loading}
          style={styles.button}
        >
          Add Event
        </Button>
      </View>
    </Provider>
  );
};

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
  input: {
    marginBottom: 15,
    backgroundColor: 'white',
    borderRadius: 5,
  },
  button: {
    marginTop: 20,
    backgroundColor: '#0772b9',
  },
});

export default AddEvent;
