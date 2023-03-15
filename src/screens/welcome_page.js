import React, { useCallback, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useAuth } from '../contexts';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { trackPromise } from 'react-promise-tracker';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Welcome() {
  const navigation = useNavigation();
  const { 
    getUser,
  } = useAuth();

  useFocusEffect(
    useCallback(() => {
      trackPromise(
        getUser()
      )
    }, [])
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Welcome</Text>
        <Text style={{ fontSize: 18 }}>This app was generated with the Clear Builder API </Text>
        <Text style={{ fontSize: 18, fontWeight: 'bold' }}>This app features: </Text>
      </View>
      <View style={styles.footer}>
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("Login")}>
          <Text style={styles.buttonText}>Log in</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.signUpButton} onPress={() => navigation.navigate("Register")}>
          <Text style={styles.signUpButtonText}>Sign up</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 3,
    justifyContent: 'center',
    alignItems: 'center',
  },
  footer: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    width: '100%'
  },
  title: {
    fontSize: 40,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  button: {
    marginTop: 10,
    borderRadius: 8,
    paddingVertical: 15,
    width: "90%",
    alignItems: 'center',
    backgroundColor: '#4286f4',
  },
  signUpButton: {
    marginTop: 10,
    borderRadius: 8,
    paddingVertical: 15,
    width: "90%",
    alignItems: 'center',
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: "#4286f4",
  },
  buttonText: {
    fontSize: 18,
    color: '#fff',
  },
  signUpButtonText: {
    fontSize: 18,
    color: '#4286f4',
  }
})