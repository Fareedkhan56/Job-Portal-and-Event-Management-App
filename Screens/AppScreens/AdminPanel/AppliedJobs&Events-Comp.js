import React, { useEffect, useState } from 'react';
import { Text, View, StyleSheet, ScrollView, Alert } from 'react-native';
import { Button } from 'react-native-paper';
import database from '@react-native-firebase/database';

const AdminViewApplications = () => {
  const [appliedJobs, setAppliedJobs] = useState([]);
  const [appliedEvents, setAppliedEvents] = useState([]);
  console.log(appliedEvents)

  const fetchUserInfo = async (userId) => {
    try {
      const userSnapshot = await database().ref(`users/${userId}`).once('value');
      return userSnapshot.val();
    } catch (error) {
      console.error('Error fetching user info:', error.message);
      return null;
    }
  };

  const fetchJobInfo = async (jobId) => {
    try {
      const jobSnapshot = await database().ref(`jobs/${jobId}`).once('value');
      return jobSnapshot.val();
    } catch (error) {
      console.error('Error fetching Job info:', error.message);
      return null;
    }
  };

  const fetchApplications = async (type, setApplications) => {
    try {
      const applicationsSnapshot = await database().ref(`applications/${type}`).once('value');
      const data = [];

      applicationsSnapshot.forEach((userSnapshot) => {
        const userId = userSnapshot.key;// Job Id
        userSnapshot.forEach(async (applicationSnapshot) => {
          const application = applicationSnapshot.val();
          const userInfo = await fetchUserInfo(applicationSnapshot.key);
          const applicationInfo = await fetchJobInfo(userId);
          data.push({
            userId,
            id: applicationSnapshot.key,
            type,
            userInfo,
            applicationInfo,
            ...application,
          });
          setApplications([...data]);
        });
      });
    } catch (error) {
      Alert.alert(`Error fetching ${type} applications:`, error.message);
    }
  };

  useEffect(() => {
    fetchApplications('jobs', setAppliedJobs);
    fetchApplications('events', setAppliedEvents);
  }, []);

  const handleAcceptApplication = async (type, userId, applicationId) => {
    try {
      await database().ref(`applications/${type}/${applicationId}/${userId}`).update({
        status: 'Accepted',
      });
      Alert.alert(`${type.charAt(0).toUpperCase() + type.slice(1)} application accepted.`);
      fetchApplications('jobs', setAppliedJobs);
      fetchApplications('events', setAppliedEvents);
    } catch (error) {
      Alert.alert('Error accepting application:', error.message);
    }
  };

  const handleRemoveApplication = async (type, userId, applicationId) => {
    try {
      await database().ref(`applications/${type}/${applicationId}/${userId}`).remove();
      Alert.alert(`${type.charAt(0).toUpperCase() + type.slice(1)} application removed.`);
      fetchApplications('jobs', setAppliedJobs);
      fetchApplications('events', setAppliedEvents);
    } catch (error) {
      Alert.alert('Error removing application:', error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Admin: View All Applications</Text>

      <ScrollView style={styles.applicationList}>
        {appliedJobs.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>Job Applications</Text>
            {appliedJobs.map((application, index) => (
              <View key={application.id || index} style={styles.applicationItem}>
                <Text style={styles.applicationTitle}>Job Title: {application.applicationInfo?.title}</Text>
                <Text>Description: {application.details}</Text>
                <Text>Applied On: {new Date(application.timestamp).toLocaleDateString()}</Text>
                <Text>User Name: {application.userInfo ? application.userInfo.userName : 'Loading...'}</Text>
                <Text>User Email: {application.userInfo ? application.userInfo.userEmail : 'Loading...'}</Text>
                <Text>Status: {application.status || 'Pending'}</Text>
                <View style={styles.buttonContainer}>
                  <Button
                    mode="contained"
                    onPress={() =>
                      handleAcceptApplication('jobs', application.userId, application.id)
                    }
                    style={styles.acceptButton}
                  >
                    Accept
                  </Button>
                  <Button
                    mode="contained"
                    onPress={() =>
                      handleRemoveApplication('jobs', application.userId, application.id)
                    }
                    style={styles.removeButton}
                  >
                    Remove
                  </Button>
                </View>
              </View>
            ))}
          </>
        )}

        {appliedEvents.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>Event Applications</Text>
            {appliedEvents.map((application, index) => (
              <View key={application.id} style={styles.applicationItem}>
                <Text style={styles.applicationTitle}>Event Title: {application.title?.title}</Text>
                <Text>Description: {application.details}</Text>
                <Text>Applied On: {new Date(application.timestamp).toLocaleDateString()}</Text>
                <Text>User Name: {application.userInfo ? application.userInfo.userName : 'Loading...'}</Text>
                <Text>User Email: {application.userInfo ? application.userInfo.email : 'Loading...'}</Text>
                <Text>Status: {application.status || 'Pending'}</Text>
                <View style={styles.buttonContainer}>
                  <Button
                    mode="contained"
                    onPress={() =>
                      handleAcceptApplication('events', application.userId, application.id)
                    }
                    style={styles.acceptButton}
                  >
                    Accept
                  </Button>
                  <Button
                    mode="contained"
                    onPress={() =>
                      handleRemoveApplication('events', application.userId, application.id)
                    }
                    style={styles.removeButton}
                  >
                    Remove
                  </Button>
                </View>
              </View>
            ))}
          </>
        )}

        {appliedJobs.length === 0 && appliedEvents.length === 0 && (
          <Text>No applications found.</Text>
        )}
      </ScrollView>
    </View>
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
  applicationList: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 10,
  },
  applicationItem: {
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
  applicationTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  acceptButton: {
    backgroundColor: '#4CAF50',
  },
  removeButton: {
    backgroundColor: '#F44336',
  },
});

export default AdminViewApplications;
