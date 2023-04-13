import 'react-native-gesture-handler'
import AppLoading from 'expo-app-loading';

import { useFonts } from 'expo-font';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';

import DrawerStack from './src/navigation/DrawerStack';
import { AuthCookieProvider } from './src/components/context.js';
import { ToastProvider } from 'react-native-toast-notifications'

export default function App(props) {

  
  let [fontsLoaded] = useFonts({
    'Roboto-Medium': require('./assets/fonts/Roboto-Medium.ttf'),
    'Roboto-Light': require('./assets/fonts/Roboto-Light.ttf'),
  });
  if (!fontsLoaded) {
    return <AppLoading />;
  }
  return (
    <ToastProvider>
      <AuthCookieProvider >
        <NavigationContainer>
          <DrawerStack/>
        </NavigationContainer>
      </AuthCookieProvider>
    </ToastProvider>
  );
};


