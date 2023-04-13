import axios from 'axios';
import React, { useRef, useState, useEffect, useContext } from 'react';
import { Text, View, StyleSheet, TextInput } from "react-native";
import { Button } from 'react-native-elements';
import AuthCookieContext from '../components/context.js';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useToast } from "react-native-toast-notifications";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { base } from "../components/BaseUrl.js"

const Login = ({ navigation }) => {
  const context = useContext(AuthCookieContext);
  const [loading, setLoading] = useState(false);
  const baseUrl1 = 'https://selu383-sp22-p05-g02.azurewebsites.net/api/authentication/me'
  const toast = useToast();
  

  const [data, setData] = useState({
    username: '',
    password: '',
    secureTextEntry: true,
    error: null
  });

  const secureToggle = () => {
    setData({
      ...data,
      secureTextEntry: !data.secureTextEntry
    });
  }

  

  const loginHandler = (user, pass) => {
    setLoading(true);
    const baseUrl = 'https://selu383-sp22-p05-g02.azurewebsites.net/api/authentication/login';
    axios.post(baseUrl, {
      username: user,
      password: pass
    })
      .then(async function(response) {
      if (response.status == 200)
        {
          console.log(response.headers['set-cookie'][0]);
          let cookie = response.headers['set-cookie'][0];
          await context.saveAuthCookie(cookie);
        }
        })
        .catch(error => {
          console.log(error);
          
          setLoading(false);
        })
          .then(()=> {
          axios.get(baseUrl1, {
            headers: {
                AUTH_COOKIE: context.authCookie
            },
            withCredentials: true,
            })
            .catch(error => {
              console.log(error);
              toast.show("There was an error. Please try again.")
            })
            .then(async(response) =>{
              console.log(response.data)
              let user = JSON.stringify(response.data);
              await AsyncStorage.setItem('token', user);
              context.setToggle(!context.toggle);
              toast.show("Log in successful.");
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
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.text_header}>Login</Text>
      </View>
      <View style={styles.footer}>
        <Text style={styles.text_footer}>Username</Text>
        <View style={styles.inputs}>
          <Ionicons
            name="person-circle-outline"
            color="#05375a"
            size={20}
          />
          <TextInput
            placeholder="Your Username"
            style={styles.textInput}
            autoCapitalize="none"
            onChangeText={(value) => setData({ ...data, username: value })}
          />
        </View>
        <Text style={[styles.text_footer, {
          marginTop: 30
        }]}>Password</Text>
        <View style={styles.inputs}>
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
            onChangeText={(value) => setData({ ...data, password: value })}
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
        <View style={styles.button}>
          {!loading ?
            <Button
              onPress={() => loginHandler(data.username, data.password)}
              title="Sign In"
              buttonStyle={{ backgroundColor: '#205072' }}
              textStyle={{
                fontFamily: 'Roboto-Medium'
              }}>
              Sign In
            </Button>
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
            <Text style={{ color: '#205072', fontWeight: 'bold', fontSize: 16, textAlign: 'center', marginBottom: 5 }}>Need an account?</Text>
            <Button
              onPress={() => navigation.navigate('Signup')}
              title="Sign Up"
              buttonStyle={{ backgroundColor: '#205072' }}>
              Sign Up
            </Button>
          </TouchableOpacity>
        </View>
        <View>
          <Text
            style={{
              textAlign: 'center',
              color: '#205072',
              fontWeight: 'bold',
              textDecorationLine: 'underline'
            }}>Forgot Password?</Text>
        </View>
      </View>
    </View>
  )
}

export default Login;

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
  inputs: {
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
    fontFamily: 'Roboto-Medium'

  }
})
