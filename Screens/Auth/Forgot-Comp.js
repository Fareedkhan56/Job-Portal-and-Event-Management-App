import React, { useState } from 'react';
import { Text, View, StyleSheet } from 'react-native';

// React Native Paper
import { TextInput, Button } from 'react-native-paper';

const Forgot = () => {
    const [email, setEmail] = useState('');

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Forgot Password</Text>

            <Text style={styles.text}>Please Enter Your Email Address You Will Receive a Link To Create a New Password Via Email</Text>

            <TextInput
                label="Email"
                value={email}
                onChangeText={setEmail}
                style={styles.input} />

            <Button
                mode="contained"
                onPress={() => console.log('Pressed')}
                style={styles.redButton}>
                Send
            </Button>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        height: '100%',
        padding: 20,
        backgroundColor: '#F9F9F9',
    },
    title: {
        fontSize: 30,
        fontWeight: '800',
        textAlign: 'center',
        margin: 40,
        color: '#0772b9'
    },
    input: {
        marginBottom: 15,
        borderRadius: 5,
        width: '100%',
        backgroundColor: 'white',
        fontSize: 12,
    },
    text: {
        marginVertical: 30,
        fontWeight: '600',
        color: 'black'
    },
    redButton: {
        marginTop: 10,
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#218f37',
    }
});

export default Forgot;
