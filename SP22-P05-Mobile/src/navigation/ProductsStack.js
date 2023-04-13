import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import Products from '../components/Products';
import ProductPage from '../components/ProductPage';

const Stack = createStackNavigator();

function ProductsStack() {
    return (
    <Stack.Navigator initialRouteName="All Products">
        <Stack.Screen name="All Products" component={Products} options={{
            headerShown: false,
            }} />
        <Stack.Screen name="Product Page" component={ProductPage} 
        
        options={{ 
          headerShown: false
            
            
            
        }}/>
    </Stack.Navigator>
    )}

export default ProductsStack;