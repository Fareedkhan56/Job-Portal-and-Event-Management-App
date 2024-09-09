import React, { useEffect } from 'react';
import { Image, StyleSheet, View } from 'react-native';

// Slides
const logo = require('../../Assets/App-Intro-Slides/4.png');

const Intro = ({ navigation }) => {

    useEffect(() => {
        setTimeout(() => {
            navigation.navigate('Signin');
        }, 2000);
    }, []);

    return (
        <View style={styles.slide}>
            <Image source={logo} style={styles.image} />
        </View>
    );
};

const styles = StyleSheet.create({
    slide: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    image: {
        width: '100%',
        height: '100%',
        position: 'absolute',
    },
});

export default Intro;
