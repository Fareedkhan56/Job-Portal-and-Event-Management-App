import React from 'react';
import { Image, StyleSheet, View, Text } from 'react-native';

// App Intro Slider
import AppIntroSlider from 'react-native-app-intro-slider';

// Slides
const Slide1 = require('../../Assets/App-Intro-Slides/1.png');
const Slide2 = require('../../Assets/App-Intro-Slides/2.png');
const Slide3 = require('../../Assets/App-Intro-Slides/3.png');

const slides = [
    {
        key: 1,
        title: 'Welcome to SMIT Job Portal',
        text: 'Your gateway to career opportunities Connect with top employers. apply for jobs. and track your applications—all in one place.SMIT Job Portal brings your dream job closer than ever',
        image: Slide1,
        backgroundColor: '#59b2ab',
    },
    {
        key: 2,
        title: 'Exclusive Events for Growth',
        text: 'Stay updated with professional events Discover, register, and participate in events designed to boost your career growth. Network with industry leaders and peers through our event management system.',
        image: Slide2,
        backgroundColor: '#febe29',
    },
    {
        key: 3,
        title: 'Manage Your Career with Ease',
        text: 'Simplified job and event management Track job applications, event participation, and manage your profile effortlessly. SMIT is your one-stop platform for both job hunting and career-building events',
        image: Slide3,
        backgroundColor: '#22bcb5',
    }
];

function AppIntro({ navigation }) {

    const RenderItem = ({ item }) => {
        return (
            <View style={styles.slide}>
                <Image source={item.image} style={styles.image} />
                <View style={styles.textContainer}>
                    <Text style={styles.title}>{item.title}</Text>
                    <Text style={styles.text}>{item.text}</Text>
                </View>
            </View>
        );
    }

    return (
        <AppIntroSlider
            renderItem={RenderItem}
            showSkipButton={true}
            data={slides}
            onDone={() => navigation.navigate('Signup')}
            activeDotStyle={{ backgroundColor: 'black' }}
        />
    );
}

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
    textContainer: {
        position: 'absolute',
        top: '30%',
        width: '80%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: {
        width: 400,
        fontSize: 24,
        fontWeight: 'bold',
        color: '#0168b3',
        textAlign: 'center',
        marginBottom: 20,
    },
    text: {
        fontSize: 15,
        color: 'grey',
        textAlign: 'auto',
    },
});

export default AppIntro;
