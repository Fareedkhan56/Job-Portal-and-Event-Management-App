import React, { useState } from 'react';
import { Text, View, StyleSheet } from 'react-native';

// React Native Paper
import { ActivityIndicator, MD2Colors, TextInput, Button } from 'react-native-paper';

// Vector Icons
import Icon from 'react-native-vector-icons/AntDesign';

// Formik
import { Formik } from "formik";

// Yup
import * as Yup from "yup";

// Firebase
import auth from '@react-native-firebase/auth';
import database from '@react-native-firebase/database';

// Toastify
import ToastManager, { Toast } from 'toastify-react-native'

// Validation Schema
const validationSchema = Yup.object().shape({
    name: Yup.string()
        .required("Name is required")
        .min(4, "Name is too short")
        .max(12, "Name is too long"),
    email: Yup.string()
        .required("Please enter your email")
        .email("Invalid email address"),
    password: Yup.string()
        .required("Password is required")
        .min(6, "Password must be at least 6 characters long")
        .max(14, "Password is too Long")
});

const Signup = ({ navigation }) => {

    const [loader, setLoader] = useState(false)

    const SignupUser = async (values) => {
        await auth().createUserWithEmailAndPassword(values.email, values.password)
            .then(async (userInfo) => {
                userInfoObj = {
                    userName: values.name,
                    userEmail: values.email,
                    userPassword: values.password,
                    userType: 'user',
                    userUid: userInfo.user.uid
                }
                database().ref('users').child(userInfo.user.uid).set(userInfoObj)
                navigation.navigate('Signin');
                setLoader(false)
            })
            .catch(error => {
                if (error.code === 'auth/email-already-in-use') {
                    Toast.error('Email is Already in Use')
                }
                if (error.code === 'auth/invalid-email') {
                    Toast.error('Invalid Email')
                }
                else {
                    Toast.error(error.code)
                }
                setLoader(false)
            });
    }

    return (
        <View style={styles.container}>
            <ToastManager />
            <Text style={styles.title}>Create Account</Text>

            <Formik
                initialValues={{ name: '', email: '', password: '' }}
                validationSchema={validationSchema}
                onSubmit={(values) => {
                    setLoader(true)
                    SignupUser(values);
                }}
            >
                {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
                    <>
                        <TextInput
                            label="Full Name"
                            onChangeText={handleChange('name')}
                            onBlur={handleBlur('name')}
                            value={values.name}
                            style={styles.input}
                        />
                        {touched.name && errors.name ? (
                            <Text style={styles.errorText}>{errors.name}</Text>
                        ) : null}

                        <TextInput
                            label="Email"
                            onChangeText={handleChange('email')}
                            onBlur={handleBlur('email')}
                            value={values.email}
                            style={styles.input}
                        />
                        {touched.email && errors.email ? (
                            <Text style={styles.errorText}>{errors.email}</Text>
                        ) : null}

                        <TextInput
                            label="Password"
                            onChangeText={handleChange('password')}
                            onBlur={handleBlur('password')}
                            value={values.password}
                            secureTextEntry
                            style={styles.input}
                        />
                        {touched.password && errors.password ? (
                            <Text style={styles.errorText}>{errors.password}</Text>
                        ) : null}

                        <Text style={styles.text} onPress={() => { navigation.navigate('Signin') }}>
                            Already Have An Account?
                        </Text>
                        {loader ?
                            <ActivityIndicator animating={true} color={MD2Colors.red} /> :
                            <Button
                                mode="contained"
                                onPress={handleSubmit}
                                style={styles.redButton}>
                                Create Account
                            </Button>
                        }
                    </>
                )}
            </Formik>

            <Text style={styles.orText}>or sign up with</Text>
            <View style={styles.socialView}>
                <Button
                    icon={() => <Icon name="google" size={20} color="black" />}
                    mode="contained"
                    style={styles.socialButton}>
                </Button>
                <Button
                    icon={() => <Icon name="facebook-square" size={20} color="black" />}
                    mode="contained"
                    style={styles.socialButton}>
                </Button>
            </View>
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
        marginBottom: 12,
        borderRadius: 5,
        width: '100%',
        backgroundColor: 'white',
        fontSize: 12,
    },
    text: {
        flex: 0.5,
        flexDirection: 'row',
        alignItems: 'flex-start',
        justifyContent: 'flex-end',
        paddingTop: 20,
        color: 'black'
    },
    redButton: {
        marginTop: 10,
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#218f37',
    },
    socialButton: {
        width: 50,
        height: 50,
        margin: 10,
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center'
    },
    orText: {
        textAlign: 'center',
        marginVertical: 10,
        position: 'relative',
        bottom: -10,
        fontSize: 12,
        color: 'gray'
    },
    socialView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
    },
    errorText: {
        color: 'red',
        fontSize: 10,
        marginBottom: 10,
    }
});

export default Signup;
