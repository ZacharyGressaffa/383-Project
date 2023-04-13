import axios from 'axios';
import React, { useState, useContext } from 'react';
import { Text, View, StyleSheet, TextInput } from "react-native";
import { Button } from 'react-native-elements';
import { useToast } from "react-native-toast-notifications";
import AuthCookieContext from '../components/context.js';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { base } from "../components/BaseUrl.js";
import AsyncStorage from "@react-native-async-storage/async-storage";

const SignUp = ({navigation}) => {

const [loading, setLoading] =useState(false);
const context = useContext(AuthCookieContext);

const [data, setData] = useState({
  username: '',
  password: '',
  confirmPass: '',
  role: ['User'],
  secureTextEntry: true,
  confirmSecureTextEntry: true,
  error: null
});

const secureToggle = () => {
  setData({
    ...data,
    secureTextEntry: !data.secureTextEntry
  });
}

const confirmSecureToggle = () => {
    setData({
      ...data,
      confirmSecureTextEntry: !data.confirmSecureTextEntry
    });
  }


const toast = useToast();

const signUpHandler = (user, pass, cpass) => {
  
  if (cpass != pass)
  {
    setData({
      ...data,
      error: "Your password fields do not match."
    })
  }
  else 
  {
    setLoading(true);
    axios.post(`${base}/api/users`, {
      username: user,
      password: pass,
      roles: data.role
      })
      .then(function (response) {
        console.log(response.status)
        if (response.status = 200) 
        {
          axios.post(`${base}/api/authentication/login`, {
            username: user,
            password: pass
          })
          .then(async function(response){
            console.log(response.status)
            if (response.status = 200)
            {
                console.log(response.headers['set-cookie'][0]);
                let cookie = response.headers['set-cookie'][0];
                await context.saveAuthCookie(cookie);
            }
          })
          .then(()=> {
            axios.get(`${base}/api/authentication/me`, {
              headers: {
                  AUTH_COOKIE: context.authCookie
              },
              withCredentials: true,
          })
          .catch(error => {
            console.log(error);
            toast.show("There was an error. Please try again.");
          })
          .then(async(response) =>{
            console.log(response.data)
            let user = JSON.stringify(response.data);
            await AsyncStorage.setItem('token', user);
            context.setToggle(!context.toggle);
            toast.show("Sign Up successful.");
          })
          .then(()=> {
            setLoading(false);
            navigation.navigate("All Products");
          })
          .catch((error) => {
            console.log(error);
            setLoading(false);
          })
        })  
      }
    })
  }
}
    return (
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.text_header}>Sign Up</Text>
            </View>  
          <View style={styles.footer}>
            <Text style={styles.text_footer}>Username</Text>
            <View style={styles.action}>
              <Ionicons
                name="person-circle-outline"
                color="#05375a"
                size={20}
                />
              <TextInput 
                placeholder="Your Username"
                style={styles.textInput}
                autoCapitalize="none"
                onChangeText={(value) => setData({...data, username: value})}
              />
            </View>
            <Text style={[styles.text_footer, {
              marginTop: 30
            }]}>Password</Text>
            <View style={styles.action}>
              <Ionicons
                name="lock-closed-outline"
                color="#05375a"
                size={20}
                />
              <TextInput 
                placeholder="Your Password"
                style={styles.textInput}
                autoCapitalize="none"
                secureTextEntry={data.secureTextEntry ? true : false}
                onChangeText={(value) => setData({...data, password: value})}
              />
              {data.secureTextEntry ? (
              <TouchableOpacity 
                onPress={secureToggle}>
              
              <Ionicons
                name="eye-off-outline"
                color="#05375a"
                size={20}
                />
                </TouchableOpacity> 
               ) : (
                <TouchableOpacity 
                onPress={secureToggle}>  
              <Ionicons
                name="eye-outline"
                color="#05375a"
                size={20}
                />
              </TouchableOpacity>
               )}
                
            </View>
            <Text style={[styles.text_footer, {
              marginTop: 30
            }]}>Confirm Password</Text>
            <View style={styles.action}>
              <Ionicons
                name="lock-closed-outline"
                color="#05375a"
                size={20}
                />
              <TextInput 
                placeholder="Confirm Password"
                style={styles.textInput}
                autoCapitalize="none"
                secureTextEntry={data.confirmSecureTextEntry ? true : false}
                onChangeText={(value) => setData({...data, confirmPass: value})}
              />
              {data.confirmSecureTextEntry ? (
              <TouchableOpacity 
                onPress={confirmSecureToggle}>
              
              <Ionicons
                name="eye-off-outline"
                color="#05375a"
                size={20}
                />
                </TouchableOpacity> 
               ) : (
                <TouchableOpacity 
                onPress={confirmSecureToggle}>  
              <Ionicons
                name="eye-outline"
                color="#05375a"
                size={20}
                />
              </TouchableOpacity>
               )}
               </View>
               {data.error && 
             <Text style={{color: 'red'}}>{data.error}</Text>} 
            <View style={styles.button}>
              {!loading ?
              <Button
                title="Sign Up"
                buttonStyle={{ backgroundColor: '#205072' }}
                textStyle={{
                  fontFamily: 'Roboto-Medium'
                }}
                onPress={() => signUpHandler(data.username, data.password, data.confirmPass)}>
                Sign Up</Button>
                :
                <Button
                onPress={() => loginHandler(data.username, data.password)}
                title="loading"
                loading
                buttonStyle={{ backgroundColor: '#205072' }}
                textStyle={{
                  fontFamily: 'Roboto-Medium'
                }}
              ></Button>
}
                <TouchableOpacity
                  
                  style={{
                    marginTop: 20,
                    alignContent: 'center'
                  }}>
                
                <Button
                onPress={() => navigation.navigate('LogSign')}
                title="Go Back To Login"
                buttonStyle={{ backgroundColor: '#205072' }}
                textStyle={{
                  fontFamily: 'Roboto-Medium'
                }}
                >
                </Button>
              </TouchableOpacity>
              </View>
            
          </View>
            
            
        </View>
    )
}

export default SignUp;

const styles = StyleSheet.create({
  container: {
    flex: 1, 
    backgroundColor: '#205072'
  },
  header: {
      flex: 1,
      justifyContent: 'flex-end',
      paddingHorizontal: 20,
      paddingBottom: 50
  },
  footer: {
    flex: 3,
    backgroundColor: '#d9d9d9',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: 20,
    paddingVertical: 30
},
text_header: {
  color: '#fff',
  fontWeight: 'bold',
  fontSize: 30,
  textAlign: 'center'
},
text_footer: {
  color: '#205072',
  fontSize: 18
},
action: {
  flexDirection: 'row',
  marginTop: 10,
  borderBottomWidth: 1,
  borderBottomColor: '#205072',
  paddingBottom: 5
},
textInput: {
  flex: 1,
  fontWeight: 'bold',
  paddingLeft: 10,
  color: '#05375a',
},
button: {
  marginBottom: 20,
  marginTop: 50,
  textAlign: 'center',
  
}
})
