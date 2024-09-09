import React, { useEffect, useState } from 'react';
import { Text, View, StyleSheet, ActivityIndicator, Button } from 'react-native';
import database from '@react-native-firebase/database';
import auth from '@react-native-firebase/auth';
import { Avatar } from 'react-native-paper';

const Profile = ({ navigation }) => {
    const adminKey = "dDY8lmQUyacx4QBOFjjL9Ank3IA2";
    const [adminInfo, setAdminInfo] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const loadAdminProfile = async () => {
        try {
            const adminData = await database().ref(`users`).child(adminKey).once('value');
            setAdminInfo(adminData.val());
        } catch (err) {
            setError('Failed to load profile.');
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = async () => {
        try {
            await auth().signOut();
            navigation.replace('Signin');
        } catch (error) {
            console.error('Error logging out:', error);
        }
    };

    useEffect(() => {
        loadAdminProfile();
    }, []);

    if (loading) return <ActivityIndicator size="large" color="#0000ff" style={styles.container} />;

    if (error) return <Text style={styles.errorText}>{error}</Text>;

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Profile</Text>
            {adminInfo ? (
                <>
                    <Avatar.Image size={100} source={{ uri: 'https://static.vecteezy.com/system/resources/previews/020/429/953/non_2x/admin-icon-vector.jpg' }} />
                    <Text style={styles.label}>Name: {adminInfo.userName}</Text>
                    <Text style={styles.label}>Email: {adminInfo.userEmail}</Text>
                    <Button
                        title="Logout"
                        onPress={handleLogout}
                        style={styles.Button}
                    >Log out</Button>
                </>
            ) : (
                <Text>No profile data available</Text>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#F5F5F5',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    label: {
        fontSize: 18,
        marginVertical: 5,
    },
    errorText: {
        color: 'red',
        fontSize: 16,
    },
    Button: {
        marginTop: 10,
        backgroundColor: '#0772b9',
        color: "white",
    }
});

export default Profile;
