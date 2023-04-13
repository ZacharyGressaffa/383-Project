import React, { useContext } from 'react';
import { DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import AuthCookieContext from '../components/context.js';
import {
    View,
    Text,
    ImageBackground,
    Image,
    TouchableOpacity
    } from 'react-native';
import  AsyncStorage  from '@react-native-async-storage/async-storage';
import Ionicons from 'react-native-vector-icons/Ionicons';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import { useToast } from "react-native-toast-notifications";
import { base } from "../components/BaseUrl.js";

function CustomDrawer (props) {
    const context = useContext(AuthCookieContext);
    const toast = useToast();
    const navigation = useNavigation();
    const signOutHandler = () => {
        axios.post(`${base}/api/authentication/logout`, {
        })
        .then( async(response) => {
            if (response.status == 200) {
                context.setToggle(!context.toggle)
                toast.show("Log out successful");
                context.saveAuthCookie("");
                await AsyncStorage.removeItem('token')
                navigation.navigate("Products");
                context.setToken(null);
            }
        })
        .catch((error)=>{
        toast.show("There was an error.")
        console.log(error)
        })
    }
     return (
        <View style={{flex: 1 }}>
            <DrawerContentScrollView {...props} contentContainerStyle={{backgroundColor:'#205072', flex: 1}}>
                <ImageBackground style={{padding:20}}>
                    {context.token === "galkadi" ?
                    <Image
                    source={require('../images/galkadiPhoto.jpg')}
                    style={{height: 150, width: 150, borderRadius: 100, marginBottom: 10, marginLeft: 'auto', marginRight: 'auto', borderWidth: 2, borderColor: "black"}}/>
                    :
                    <Image
                    source={require('../images/SMOKE_Other.png')}
                    style={{height: 150, width: 150, borderRadius: 100, marginBottom: 10, marginLeft: 'auto', marginRight: 'auto', borderWidth: 2, borderColor: "black"}}/>
                    }
                    {context.token ? (
                        <Text style={{color:'#56C596', fontFamily:'Roboto-Medium', padding: 10, fontSize: 22, textAlign: "center"}}>Welcome, {context.token}</Text>
                        ) : (
                        <Text style={{color:'#56C596', fontFamily:'Roboto-Medium',  fontSize: 22, textAlign: "center"}}>Welcome to SMOKE</Text>
                    )}
                </ImageBackground>
                <View style={{ borderTopWidth: 1, borderTopColor: '#fff', marginTop: -10, marginBottom: 10, }}></View>
                <DrawerItemList {...props} />
                </DrawerContentScrollView>
        {context.token &&
        <View style={{padding: 20, borderTopWidth: 1, borderTopColor: '#ccc', backgroundColor: '#205072'}}>
        <TouchableOpacity  style={{paddingVertical: 15}} onPress={() => signOutHandler()}>
          <View style={{flexDirection: 'row', alignItems: 'center', backgroundColor: '#205072'}}>
           <Ionicons name="log-out-outline" size={28} color="#fff" />
            <Text
              style={{
                fontSize: 15,
                fontFamily: 'Roboto-Medium',
                marginLeft: 5,
                color: "#fff"
            }}>
              Log Out
            </Text>
          </View>
        </TouchableOpacity>
        </View> 
        }
        </View>
    )
}

export default CustomDrawer;