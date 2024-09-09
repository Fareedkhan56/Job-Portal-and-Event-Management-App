import React, { useEffect, useState } from 'react';
import { NavigationContainer } from "@react-navigation/native";

// Async Storage
import { AsyncStorage } from 'react-native';

// Stack Navigation
import { createNativeStackNavigator } from '@react-navigation/native-stack'
const Stack = createNativeStackNavigator();

// Bottom Navigation
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
const Bottom = createBottomTabNavigator();

// Drawer Navigation
import { createDrawerNavigator } from '@react-navigation/drawer';
const Drawer = createDrawerNavigator();

// Components
import AppIntro from '../Intro/AppIntro';
import Intro from '../Intro/Intro';

import Signup from "../Auth/Signup-Comp";
import Signin from "../Auth/Signin-Comp";
import Forgot from "../Auth/Forgot-Comp";

import MainPage from "../AppScreens/UserPanel/MainPage-Comp"
import Events from "../AppScreens/UserPanel/Event-Comp"
import Search from "../AppScreens/UserPanel/Search-Comp"
import Profile from "../AppScreens/UserPanel/Profile-Comp"

import AdminMainPage from '../AppScreens/AdminPanel/AdminMainPage-Comp'
import AllJobs from '../AppScreens/AdminPanel/AllJobs-Comp'
import Applied from '../AppScreens/AdminPanel/AppliedJobs&Events-Comp'
import AddEvents from '../AppScreens/AdminPanel/AddEvent-Comp'
import AllEvents from '../AppScreens/AdminPanel/AllEvents-Comp'
import AdminProfile from '../AppScreens/AdminPanel/Profile'

const Navigation = () => {

    const [isUserFirstTime, setIsUserFirstTime] = useState(null);

    useEffect(() => {
        const checkFirstTime = async () => {
            try {
                const value = await AsyncStorage.getItem('isUserFirstTime');
                if (value === null) {
                    setIsUserFirstTime(true);
                    await AsyncStorage.setItem('isUserFirstTime', 'false');
                } else {
                    setIsUserFirstTime(false);
                }
            } catch (e) {
                console.error("Error reading AsyncStorage:", e);
            }
        };
        checkFirstTime();
    }, []);

    return (
        <NavigationContainer>
            <Stack.Navigator>
                {
                    isUserFirstTime == false ?
                        <Stack.Screen name="commonIntro" component={Intro} options={{
                            headerShown: false
                        }} /> :
                        <Stack.Screen name="intro" component={AppIntro} options={{
                            headerShown: false
                        }} />
                }
                <Stack.Screen name="Signup" component={Signup} options={{
                    headerShown: false
                }} />
                <Stack.Screen name="Signin" component={Signin} options={{
                    headerShown: false
                }} />
                <Stack.Screen name="Forgot" component={Forgot} options={{
                    headerShown: false
                }} />
                <Stack.Screen name="Bottom" component={BottomNav} options={{
                    headerShown: false
                }} />
                <Stack.Screen name="Drawer" component={DrawerNav} options={{
                    headerShown: false
                }} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}

import Icon from 'react-native-vector-icons/Ionicons';

const BottomNav = () => {
    return (
        <Bottom.Navigator
            screenOptions={({ route }) => ({
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName;

                    if (route.name == 'MainPage') {
                        iconName = focused ? 'home' : 'home-outline';
                    } else if (route.name == 'Events') {
                        iconName = focused ? 'bar-chart-sharp' : 'bar-chart-outline';
                    } else if (route.name == 'Search') {
                        iconName = focused ? 'search' : 'search-outline';
                    } else if (route.name == 'Profile') {
                        iconName = focused ? 'person' : 'person-outline';
                    }

                    return <Icon name={iconName} size={size} color={color} />;
                },
                tabBarActiveTintColor: 'black',
                tabBarInactiveTintColor: 'white',
                tabBarStyle: { height: 70, backgroundColor: '#0772b9', paddingBottom: 15 },
            })}
        >
            <Bottom.Screen name="MainPage" component={MainPage} options={{ title: 'Home', headerShown: false }} />
            <Bottom.Screen name="Events" component={Events} options={{ title: 'Events', headerShown: false }} />
            <Bottom.Screen name="Search" component={Search} options={{ title: 'Search', headerShown: false }} />
            <Bottom.Screen name="Profile" component={Profile} options={{ title: 'Profile', headerShown: false }} />
        </Bottom.Navigator>
    );
};

const DrawerNav = () => {
    return (
        <Drawer.Navigator
            initialRouteName="Home"
            screenOptions={{
                drawerStyle: { backgroundColor: '#218f37' },
                drawerActiveTintColor: 'white',
                drawerInactiveTintColor: 'white',
                drawerLabelStyle: { fontSize: 16 },
            }}
        >
            <Drawer.Screen
                name="Profile"
                component={AdminProfile}
            />
            <Drawer.Screen
                name="AdminMainPage"
                component={AdminMainPage}
                options={{ title: 'Add Jobs' }}
            />
            <Drawer.Screen
                name="AllJobs"
                component={AllJobs}
                options={{ title: 'Jobs' }}
            />
            <Drawer.Screen
                name="Applied"
                component={Applied}
                options={{ title: 'Applied Jobs & Events' }}
            />
            <Drawer.Screen
                name="AddEvents"
                component={AddEvents}
                options={{ title: 'Add Events' }}
            />
            <Drawer.Screen
                name="AllEvents"
                component={AllEvents}
                options={{ title: 'Events' }}
            />
        </Drawer.Navigator>

    )
}

export default Navigation;
