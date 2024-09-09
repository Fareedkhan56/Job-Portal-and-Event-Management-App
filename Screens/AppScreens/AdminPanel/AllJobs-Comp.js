import React, { useEffect, useState } from 'react';
import { Text, View, StyleSheet, ScrollView, Alert } from 'react-native';
import { Button } from 'react-native-paper';
import database from '@react-native-firebase/database';

const JobList = ({ navigation }) => {
    
    const [jobs, setJobs] = useState([]);

    const fetchJobs = async () => {
        const jobSnapshot = await database().ref('jobs').once('value');
        const jobsData = [];
        jobSnapshot.forEach(childSnapshot => {
            const job = childSnapshot.val();
            jobsData.push({ id: childSnapshot.key, ...job });
        });
        setJobs(jobsData);
    };

    useEffect(() => {
        fetchJobs();
    }, []);

    const deleteJob = async (jobId) => {
        Alert.alert(
            'Delete Job',
            'Are you sure you want to delete this job?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete', style: 'destructive', onPress: async () => {
                        try {
                            await database().ref(`jobs/${jobId}`).remove();
                            alert('Job deleted successfully!');
                            fetchJobs();
                        } catch (error) {
                            alert('Failed to delete job.');
                        }
                    }
                }
            ],
            { cancelable: true }
        );
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Job Listings</Text>

            <ScrollView style={styles.jobList}>
                {jobs.map((job, index) => (
                    <View key={job.id || index} style={styles.jobItem}>
                        <Text style={styles.jobTitle}>{job.title}</Text>
                        <Text>{job.description}</Text>
                        <Text>Salary: {job.salary}</Text>
                        <Text>Level: {job.level}</Text>

                        <Button
                            mode="contained"
                            onPress={() => deleteJob(job.id)}
                            style={styles.deleteButton}
                        >
                            Delete
                        </Button>
                    </View>
                ))}
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
    jobList: {
        marginBottom: 20,
    },
    jobItem: {
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
    jobTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    deleteButton: {
        marginTop: 10,
        backgroundColor: '#0772b9',
    },
});

export default JobList;
