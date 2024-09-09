import React, { useEffect, useState } from 'react';
import { Text, View, StyleSheet } from 'react-native';

// React Native Paper
import { ActivityIndicator, MD2Colors, TextInput, Button } from 'react-native-paper';

// Vector Icons
import AntDesign from 'react-native-vector-icons/AntDesign';

// Formik
import { Formik } from 'formik';

// Yup
import * as Yup from 'yup';

// Firebase
import auth from '@react-native-firebase/auth';
import database from '@react-native-firebase/database';

// Toastify
import ToastManager, { Toast } from 'toastify-react-native'

// Validation Schema
const validationSchema = Yup.object().shape({
    email: Yup.string()
        .required("Please enter your email")
        .email("Invalid email address"),
    password: Yup.string()
        .required("Password is required")
        .min(6, "Password must be at least 6 characters long")
        .max(14, "Password is too Long")
});

const Signin = ({ navigation }) => {
    const [loader, setLoader] = useState(false)

    const SigninUser = async (values) => {
        try {
            setLoader(true);
            const userInfo = await auth().signInWithEmailAndPassword(values.email, values.password);

            const uid = userInfo.user.uid;
            database()
                .ref(`/users/${uid}`)
                .on('value', snapshot => {
                    if (snapshot.val().userType == 'admin') {
                        navigation.navigate('Drawer')
                    }
                    else {
                        navigation.navigate('Bottom')
                    }
                });
            Toast.success('Welcome Back');
        }
        catch (error) {
            switch (error.code) {
                case 'auth/email-already-in-use':
                    Toast.error('Email is already in use');
                    break;
                case 'auth/invalid-email':
                    Toast.error('Invalid email format');
                    break;
                case 'auth/wrong-password':
                    Toast.error('Incorrect password');
                    break;
                default:
                    Toast.error('Login failed: ' + error.message);
            }
        } finally {
            setLoader(false);
        }
    };


    return (
        <View style={styles.container}>
            <ToastManager />
            <Text style={styles.title}>Login</Text>

            <Formik
                initialValues={{ email: '', password: '' }}
                validationSchema={validationSchema}
                onSubmit={(values) => {
                    setLoader(true)
                    SigninUser(values);
                }}
            >
                {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
                    <>
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

                        <View style={styles.text}>
                            <Text onPress={() => navigation.navigate('Signup')} style={styles.left}>
                                Want To Create Account?
                            </Text>

                            <Text onPress={() => navigation.navigate('Forgot')} style={styles.right}>
                                Forgot Password?
                            </Text>
                        </View>

                        {loader ?
                            <ActivityIndicator animating={true} color={MD2Colors.red} /> :
                            <Button
                                mode="contained"
                                onPress={handleSubmit}
                                style={styles.redButton}>
                                Login
                            </Button>
                        }
                    </>
                )}
            </Formik>

            <Text style={styles.orText}>or sign in with</Text>
            <View style={styles.socialView}>
                <Button
                    icon={() => <AntDesign name="google" size={20} color="black" />}
                    mode="contained"
                    style={styles.socialButton}>
                </Button>
                <Button
                    icon={() => <AntDesign name="facebook-square" size={20} color="black" />}
                    mode="contained"
                    style={styles.socialButton}>
                </Button>
            </View>
        </View>
    );
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
        color: '#0772b9',
    },
    input: {
        marginBottom: 15,
        borderRadius: 5,
        width: '100%',
        backgroundColor: 'white',
        fontSize: 12,
    },
    text: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingTop: 20,
    },
    left: {
        color: 'black',
        fontSize: 13,
    },
    right: {
        color: 'black',
        fontSize: 13,
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
        alignItems: 'center',
    },
    orText: {
        textAlign: 'center',
        marginVertical: 40,
        position: 'relative',
        bottom: -50,
        fontSize: 12,
        color: 'gray',
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
    },
});

export default Signin;