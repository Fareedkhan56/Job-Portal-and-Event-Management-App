import React, { useState, useEffect } from 'react';
import { ScrollView, StyleSheet, View, Modal, TouchableOpacity, Button } from 'react-native';

// React native Paper
import { Text, Card, ActivityIndicator } from 'react-native-paper';

// Firebase
import database from '@react-native-firebase/database';
import auth from '@react-native-firebase/auth'; 

// Vector Icons
import Icon from 'react-native-vector-icons/Ionicons';

const MainPage = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedJob, setSelectedJob] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  const fetchJobs = async () => {
    try {
      const jobSnapshot = await database().ref('jobs').once('value');
      const jobsData = [];
      jobSnapshot.forEach((childSnapshot) => {
        jobsData.push({ id: childSnapshot.key, ...childSnapshot.val() });
      });
      setJobs(jobsData);
    } catch (error) {
      console.error('Error fetching jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const handleCardPress = (job) => {
    setSelectedJob(job);
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    setSelectedJob(null);
  };

  const handleApplyJob = async () => {
    if (selectedJob) {
      const user = auth().currentUser;
      if (user) {
        const userId = user.uid; 
        try {
          await database().ref(`applications/jobs/${selectedJob.id}/${userId}`).set({
            timestamp: new Date().toISOString(),
            details: 'User applied for this job',
          });

          setJobs((prevJobs) => prevJobs.filter((job) => job.id !== selectedJob.id));
          handleCloseModal();
        } catch (error) {
          console.error('Error applying for job:', error);
        }
      } else {
        console.error('No user is currently signed in.');
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
      <Text style={styles.title}>Latest Jobs</Text>

      <ScrollView>
        {jobs.length > 0 ? (
          jobs.map((job) => (
            <Card key={job.id} style={styles.card}>
              <TouchableOpacity onPress={() => handleCardPress(job)}>
                <Card.Content>
                  <View style={styles.row}>
                    <Icon name="library-outline" size={20} color={'black'} />
                    <Text style={styles.jobTitle}>{job.title}</Text>
                  </View>
                  <View style={styles.row}>
                    <Icon name="cash-outline" size={16} color={'black'} />
                    <Text style={styles.salary}>Salary: {job.salary}</Text>
                  </View>
                  <View style={styles.row}>
                    <Icon name="briefcase-outline" size={16} color={'black'} />
                    <Text style={styles.level}>Position: {job.level}</Text>
                  </View>
                </Card.Content>
              </TouchableOpacity>
            </Card>
          ))
        ) : (
          <Text>No jobs available</Text>
        )}
      </ScrollView>

      {selectedJob && (
        <Modal
          transparent={true}
          visible={modalVisible}
          onRequestClose={handleCloseModal}
          animationType="slide"
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>{selectedJob.title}</Text>
              <Text>Description: {selectedJob.description}</Text>
              <Text>Level: {selectedJob.level}</Text>
              <View style={styles.buttonContainer}>
                <Button title="Apply" onPress={handleApplyJob} color="#4CAF50" />
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
  jobTitle: {
    fontSize: 20,
    color: '#218f37',
    fontWeight: 'bold',
    marginLeft: 10,
  },
  salary: {
    fontSize: 12,
    marginLeft: 10,
  },
  level: {
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
  buttonContainer: {
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});

export default MainPage;
