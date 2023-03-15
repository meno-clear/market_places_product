import { useSelector } from 'react-redux';
import api_client from '../config/api_client';
import { useAuth } from '../contexts';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import ReduxTester from '../components/shared/redux_tester';
import { useCallback, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

export default function HomePage() {
  const main = useSelector(state => state.main);
  const { 
    user, 
    signOut, 
  } = useAuth();
 useFocusEffect(
   useCallback(() => {
     if (user) {
       api_client.get('/user')
       .catch(() => {
         signOut()
       })
     }
   }, [])
 );

  return (
    <View style={styles.container}>
      <View style={{alignItems: 'center'}}>
        <Text style={styles.title}>Hello from builder</Text>
        {main.redux_state && <Text>Redux state: { main.redux_state }</Text>}
      </View>
      <ReduxTester />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  button: {
    marginTop: 10,
    borderRadius: 4,
    padding: 10,
    backgroundColor: '#4286f4',
  },
  buttonText: {
    fontSize: 15,
    color: '#fff',
  }
})