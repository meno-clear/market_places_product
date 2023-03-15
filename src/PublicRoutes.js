
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import LoginPage from './screens/login_page';
import SignupPage from './screens/signup_page';
import Welcome from './screens/welcome_page';
// Imports End

const Stack = createStackNavigator();

export const PublicRoutes = () =>
  <Stack.Navigator initialRouteName='Welcome' screenOptions={{cardStyle: {backgroundColor: '#fff'}}}>
    {/* Routes Start */}
       <Stack.Screen name='Welcome' component={Welcome} options={{ headerShown: false }} />
       <Stack.Screen name='Login' component={LoginPage} options={{ headerShown: false }} />
       <Stack.Screen name='Register' component={SignupPage} options={{ headerShown: false }} />
    {/* Routes End */}
  </Stack.Navigator>
