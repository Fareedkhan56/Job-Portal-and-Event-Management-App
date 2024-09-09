import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, View, Alert } from 'react-native';
import { Avatar, Button, Card, Text, Title, Divider } from 'react-native-paper';
import Icon from 'react-native-vector-icons/Ionicons';
import auth from '@react-native-firebase/auth';
import database from '@react-native-firebase/database';

const Profile = ({ navigation }) => {
    const user = auth().currentUser
    const [userInfo, setUserInfo] = useState('')

    const userData = async () => {
        const userInfo = await database().ref(`users/${user.uid}`).once('value')
        setUserInfo(userInfo.val())
    }

    useEffect(() => {
        userData()
    }, [])


    const handleLogout = async () => {
        try {
            await auth().signOut();
            navigation.replace('Signin');
        } catch (error) {
            console.error('Error logging out:', error);
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <View style={styles.profileHeader}>
                <Avatar.Image
                    size={120}
                    source={{ uri: 'https://randomuser.me/api/portraits/men/32.jpg' }}
                    style={styles.avatar}
                />
                <Title style={styles.name}>{userInfo.userName}</Title>
                <Text style={styles.email}>{userInfo.userEmail}</Text>
            </View>

            <Card style={styles.card}>
                <Card.Content>
                    <View style={styles.infoRow}>
                        <Icon name="person-outline" size={20} color="#4CAF50" />
                        <Text style={styles.infoText}>Username: {userInfo.userName}</Text>
                    </View>
                    <Divider style={styles.divider} />
                    <View style={styles.infoRow}>
                        <Icon name="calendar-outline" size={20} color="#4CAF50" />
                        <Text style={styles.infoText}>Joined: January 12, 2023</Text>
                    </View>
                    <Divider style={styles.divider} />
                    <View style={styles.infoRow}>
                        <Icon name="briefcase-outline" size={20} color="#4CAF50" />
                        <Text style={styles.infoText}>Position: Senior Developer</Text>
                    </View>
                </Card.Content>
            </Card>

            <Button
                mode="contained"
                onPress={handleLogout}
                style={styles.logoutButton}
                color="#F44336"
            >
                Logout
            </Button>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        padding: 20,
        backgroundColor: '#F5F5F5',
    },
    profileHeader: {
        alignItems: 'center',
        marginBottom: 30,
    },
    avatar: {
        marginBottom: 15,
    },
    name: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    email: {
        fontSize: 16,
        color: '#666',
    },
    card: {
        marginVertical: 10,
        paddingHorizontal: 15,
        paddingVertical: 10,
        elevation: 4,
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 10,
    },
    infoText: {
        fontSize: 16,
        marginLeft: 10,
    },
    divider: {
        marginVertical: 10,
    },
    logoutButton: {
        marginTop: 30,
        paddingVertical: 10,
        backgroundColor: '#218f37'
    },
});

export default Profile;
