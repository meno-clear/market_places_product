import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, useContext, useEffect } from "react";
import { useState } from "react";
import { Alert } from "react-native";
import api_client from "../config/api_client";

const AuthContext = createContext({})

export const AuthProvider = ({ children }) => {
  const [signed, setSigned] = useState(false);
  const [user, setUser] = useState(null)

  const signIn = async (email, password) => {
    await api_client.post(
      '/login',
      { user: { email, password } },
      { 'ContentType': 'application/json' }
    ).then(async (response) => {
      await AsyncStorage.setItem('@user', JSON.stringify(response.data.user))
      setUser(response.data.user)
      setSigned(true)
    }).catch(() => {
      Alert.alert("Wrong e-mail or password, please try again.")
    });
  };

  const signUp = async (email, password, first_name, last_name) => {
    await api_client.post(
      '/signup',
      { user: { email, password, first_name, last_name } },
      { 'ContentType': 'application/json' }
    )
      .then(async response => {
        await AsyncStorage.setItem('@user', JSON.stringify(response.data.user))
        setUser(response.data.user)
        setSigned(true)
      })
      .catch(() => {
        Alert.alert("Something went wrong, please try again.")
      });
  };

  const signOut = async () => {
    await api_client.delete('/logout')
      .then(async () => {
        await AsyncStorage.removeItem('@user')
        setSigned(false);
        setUser(null);
      })
      .catch(err => console.log(err))
  };

  const getUser = async () => {
    try {
      const user = await AsyncStorage.getItem("@user");
      if (user !== null) {
        setSigned(true);
        setUser(JSON.parse(user));
      }
    } catch (error) {
      console.log(error);
    }
  };

  const refreshUser = async () => {
    AsyncStorage.setItem('@user', JSON.stringify(user))
  }

  useEffect(() => {
    if (user) {
      refreshUser()
    }
  }, [user])


  return (
    <AuthContext.Provider value={{
      signed, 
      setSigned, 
      user, 
      setUser, 
      signIn, 
      signUp, 
      signOut, 
      getUser 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
}