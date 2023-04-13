import 'react-native-gesture-handler'
import React, { useState, useContext } from 'react';
import Cart from '../components/Cart';
import { createDrawerNavigator } from "@react-navigation/drawer"
import ProductPage from '../components/ProductPage';
import CustomDrawer from '../components/CustomDrawer';
import Ionicons from 'react-native-vector-icons/Ionicons';
import StackNavigator from './StackNavigator';
import Library from '../components/Library.js'
import AuthCookieContext from '../components/context.js';
import ProductsStack from './ProductsStack';

const Drawer = createDrawerNavigator();



function DrawerStack(props) {
  const context = useContext(AuthCookieContext);
  
  return (
    
    <Drawer.Navigator initialRouteName="Products" drawerContent={props => <CustomDrawer {...props} />}
      screenOptions={{
          drawerActiveTintColor: '#080808',
          drawerInactiveTintColor: '#fff',
          drawerActiveBackgroundColor: '#56C596',
          drawerLabelStyle: {
            marginLeft: -25,
            fontFamily: 'Roboto-Medium'}}}>
        <Drawer.Screen name="Products" component={ProductsStack} 
          
          options={{
            headerShown: false,
         
          headerTintColor: '#fff',
          headerTitleAlign: 'center',
          headerStyle: {
            
            backgroundColor: '#205072',
            borderBottomColor: 'black',
            borderBottomWidth: 2
            
            },
          drawerIcon: ({color}) => (
            <Ionicons name="cube" size={22} color={color}/>
          )
        }}
         />
        
        {!context.token &&
        <Drawer.Screen name="Login" component={StackNavigator} options={{
          headerShown: false,
          drawerIcon: ({color}) => (
            <Ionicons name="person-circle-outline" size={22} color={color}/>
          )
        }} />
        }
        <Drawer.Screen name="Cart" component={Cart} options={{
          headerTintColor: '#fff',
          headerTitleAlign: 'center',
          headerStyle: {
            backgroundColor: '#205072',
            },
          drawerIcon: ({color}) => (
            
            <Ionicons name="cart-outline" size={22} color={color} />
            
          )
        }} />
        {context.token &&
        <Drawer.Screen name="Library" component={Library} options={{
          headerTintColor: '#fff',
          headerTitleAlign: 'center',
          headerStyle: {
            backgroundColor: '#205072',
            },
          drawerIcon: ({color}) => (
            <Ionicons name="library-outline" size={22} color={color}/>
          )
        }} />
      }
        <Drawer.Screen name="Product Page" component={ProductPage} options={{ 
          headerTintColor: '#fff',
          headerTitleAlign: 'center',
          headerStyle: {
            backgroundColor: '#205072',
            
            },
          drawerItemStyle: {display: "none",},}}/>
    </Drawer.Navigator>
    
  );
};

export default DrawerStack;