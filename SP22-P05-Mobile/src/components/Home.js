import React, { useContext } from 'react';
import {StyleSheet, TouchableHighlight, Text, View} from 'react-native';
import AuthCookieContext from './context';
import axios from 'axios';
import { base } from "../components/BaseUrl.js";


export default function ExampleProgram() {
  const context = useContext(AuthCookieContext);
  const onPress = async() => {
    axios.delete(`${base}/api/user/products/`, { params: { userID: context.userID, productID: 13, id: 2 }})
    .then((response) => {
      console.log(response.data);
    })
    .catch((error) => {
      console.log(error);
    })
  };

  return (
    <View style={styles.container}>
      <TouchableHighlight
        underlayColor={'#283593'}
        style={styles.touchable}
        onPress={onPress}>
        <Text style={styles.text}>Click Me</Text>
      </TouchableHighlight>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    margin: 12,
  },
  touchable: {
    alignItems: 'center',
    backgroundColor: '#7986cb',
    padding: 10,
  },
  text: {
    color: 'white',
  },
});