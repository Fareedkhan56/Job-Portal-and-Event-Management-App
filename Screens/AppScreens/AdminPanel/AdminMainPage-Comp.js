import React, { useState } from 'react';
import { Text, View, StyleSheet } from 'react-native';

// Firebase
import database from '@react-native-firebase/database';

// React Native Paper
import { ActivityIndicator, MD2Colors, TextInput, Button, Menu, Divider, Provider as PaperProvider } from 'react-native-paper';
import ToastManager, { Toast } from 'toastify-react-native'

const AdminMainPage = () => {
  // Loader
  const [loader, setLoader] = useState(false)

  // State for job details
  const [jobTitle, setJobTitle] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [category, setCategory] = useState('');
  const [salary, setSalary] = useState('Select Salary');
  const [level, setLevel] = useState('');

  // State for Dropdown
  const [menuVisible, setMenuVisible] = useState(false);

  const addJob = async () => {
    setLoader(true)
    try {
      await database().ref('jobs').push({
        title: jobTitle,
        description: jobDescription,
        category: category,
        salary: salary,
        level: level,
      });
      Toast.success('Job added successfully!');

      setJobTitle('');
      setJobDescription('');
      setCategory('');
      setSalary('Select Salary');
      setLevel('');
    } catch (error) {
      Toast.error('Error adding job:', error);
      alert('Failed to add job. Try again.');
    }
    finally {
      setLoader(false)
    }
  };

  return (
    <PaperProvider>
      <View style={styles.container}>
      <Text style={styles.title}>Add Job</Text>

        <ToastManager />
        <TextInput
          label="Job Title"
          value={jobTitle}
          onChangeText={setJobTitle}
          style={styles.input}
        />

        <TextInput
          label="Job Description"
          value={jobDescription}
          onChangeText={setJobDescription}
          style={styles.input}
        />

        <TextInput
          label="Category"
          value={category}
          onChangeText={setCategory}
          style={styles.input}
        />

        <View style={{ margin: 10 }}>
          <Menu
            visible={menuVisible}
            onDismiss={() => setMenuVisible(false)}
            anchor={
              <Button onPress={() => setMenuVisible(true)} style={styles.dropdownButton}>
                {salary}
              </Button>
            }>
            <Menu.Item onPress={() => setSalary('20,000 - 30,000')} title="20,000 - 30,000" />
            <Divider />
            <Menu.Item onPress={() => setSalary('30,000 - 40,000')} title="30,000 - 40,000" />
            <Divider />
            <Menu.Item onPress={() => setSalary('40,000 - 50,000')} title="40,000 - 50,000" />
            <Menu.Item onPress={() => setSalary('50,000 - 60,000')} title="50,000 - 60,000" />
            <Menu.Item onPress={() => setSalary('60,000 - 100,000')} title="60,000 - 100,000" />
          </Menu>
        </View>

        <TextInput
          label="Level (e.g., Junior, Senior)"
          value={level}
          onChangeText={setLevel}
          style={styles.input}
        />

        {
          loader ?
            <ActivityIndicator animating={true} color={MD2Colors.red} />
            :
            <Button mode="contained" onPress={addJob} style={styles.addButton}>
              Add Job
            </Button>
        }
      </View>
    </PaperProvider>
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
  },
  dropdownButton: {
    marginTop: 10,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#ccc',
    paddingVertical: 10,
  },
  addButton: {
    marginTop: 20,
    backgroundColor: '#0772b9',
  },
});

export default AdminMainPage;
