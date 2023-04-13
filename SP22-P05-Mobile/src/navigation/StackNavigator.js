import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import Login from '../components/Login';
import SignUp from '../components/SignUp';

const Stack = createStackNavigator();

function StackNavigator() {
    return (
    <Stack.Navigator initialRouteName="LogSign">
        <Stack.Screen name="LogSign" component={Login} options={{headerShown: false}} />
        <Stack.Screen name="Signup" component={SignUp} options={{headerShown: false}} />
    </Stack.Navigator>
    )}

export default StackNavigator;