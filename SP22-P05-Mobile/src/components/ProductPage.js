import React from "react";
import { Text, View, FlatList, ScrollView, StyleSheet, Image, TouchableOpacity } from "react-native";
import { useState, useEffect, useCallback, useContext } from 'react';
import {  Button, Headline, Subheading } from 'react-native-paper';
import { useIsFocused } from '@react-navigation/native'
import axios from 'axios';
import PPSkeleton from "../skeletons/ProductPageSkeleton";
import { useToast } from "react-native-toast-notifications";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { base } from "../components/BaseUrl.js"
import Ionicons from 'react-native-vector-icons/Ionicons';
import AuthCookieContext from "./context";


const ProductPage = (props) => {
  const prodId = props.route.params.id;
  const count = props.route.params.count;
  const baseUrl = `https://selu383-sp22-p05-g02.azurewebsites.net/api/products/${prodId}`;
  const [prod, setProd] = useState([]);
  const [cross, setCross] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cartTag, setCartTag] = useState(false);
  const [lib, setLib] = useState();
  const [libTag, setLibTag] = useState(true);
  const isFocused = useIsFocused();
  const toast = useToast();
  const navigation = useNavigation();
  const context = useContext(AuthCookieContext);

    
  useEffect(async() => {
    setLoading(true);
    let items = await AsyncStorage.getItem('cartItems')
    if (items)
    {
      if (items.includes(prodId))
      {
        setCartTag(true);
      }
      else
      {
      setCartTag(false);
      }
    }
    getItem();
  },[isFocused]);

  useEffect(()=> {
    
    if (context.token)
    {
      axios.get(`${base}/api/user/products/${context.userID}/all`)
      .then((response) => {
      const results = [];
      response.data.forEach(item=> {
        results.push({
          id: item.id
        })
      }) 
      setLib(results);
      
      })
      .catch(error => {
      console.log(error);
      })
    }
    else
    {
      setLib();
      setLibTag(false);
    }
    
  }, [navigation, isFocused])

  useEffect(() =>{
    setLibTag(false);
    let item = JSON.stringify(lib);
    if (item)
    {
      if (item.includes(prodId))
      {
        
        setLibTag(true);
      }
      else
      {
        
        setLibTag(false);
      }
    }
  },[lib])

  const buttonRender = () => {
    if (libTag)
    {
      return (
        <Button
          mode='contained'
          color="#205072"
          style={{marginTop: 20}}
          onPress={() => navigation.navigate("Library")}>
          In Library
        </Button>
      )
    }
    else if (cartTag)
    {
      return (
        <Button
          mode='contained'
          color="#205072"
          style={{marginTop: 20}}
          onPress={() => navigation.navigate("Cart")}>
          In Cart
        </Button>
      )
    }
    else
    {
      return (
        <Button
          mode='contained'
          color="#205072"
          style={{marginTop: 20}}
          onPress={() => addToCart(prod.id)}>
          Add to cart</Button>
      )
    }
  }
    
  const getItem = useCallback(() => {
    const isSubscribed = true;
    axios.get(baseUrl)
    .then((response) => {
    setProd(response.data);
    setLoading(false);
    })
    return () => (isSubscribed = false);
    }, [prodId]);

  useEffect(() =>{
    axios.get(`${base}/api/products/Tag/${prod.tag}/Genre/${prod.genre}`, { params: { id: prod.id } })
    .then((response) => {
    setCross(response.data);
    })
    }, [prod])



  const addToCart = async id => {
    let itemArray = await AsyncStorage.getItem('cartItems');
    console.log(itemArray);
    itemArray = JSON.parse(itemArray);
    if (itemArray) 
    {
      let array = itemArray;
      array.push(id);
      try 
      {
        await AsyncStorage.setItem('cartItems', JSON.stringify(array));
        toast.show('Item added to cart.');
        navigation.navigate('Cart');
      } 
      catch (error)
      {
        return error;
      }
    } 
    else 
    {
      let array = [];
      array.push(id);
      try 
      {
        await AsyncStorage.setItem('cartItems', JSON.stringify(array));
        toast.show('Item added to cart');
        navigation.navigate('Cart');
      } 
      catch (error) 
      {
        return error;
      }
    }
  };

  /* I apologize for the following code */
    return (
      <>
      <View style={{ backgroundColor: "#d9d9d9", flex: 1}}>
        {loading ?
        <View>
          <PPSkeleton />
        </View>
        :
        <><View style={styles.header_container}>
            <View style={styles.back_button}>
              <Ionicons
                name="arrow-back-outline"
                size={30}
                color="#fff"
                onPress={() => navigation.navigate("All Products")}>
              </Ionicons>
            </View>
            
            <View style={styles.header_name}>
              <Text 
              numberOfLines={1}
              style={styles.product_name}>
              {prod.name}
              </Text>
            </View>
            <View style={styles.cart_container}>
              <Ionicons name="cart-outline" size={30} color="#fff" onPress={() => navigation.navigate("Cart")} />
              <Text style={styles.cart_count}>
                {count}
              </Text>
            </View>
          </View>
          <ScrollView style={{ }}>
          <View style={{ padding: 15}}>
            <View style={{ alignItems: "center", marginTop: 10 }}>
              <Image source={{ uri: prod.imageURL }} style={{ height: 200, width: "90%" }} />
            </View>
            <Headline style={styles.pname}>{prod.name}</Headline>
            <Headline style={styles.description_container}>Description</Headline>
            <Subheading style={{
              color: '#205072',
              fontWeight: "bold",
              alignSelf: "center"
              }}>
              {prod.description}
            </Subheading>
          </View>
                
          <View style={{ flexDirection: "row", justifyContent: "flex-end", paddingRight: 15}}>
            <Text style={styles.price_container}>
              ${prod.price}
            </Text>
            {buttonRender()}
          </View>
          {(cross.length != 0) &&
        <><View style={{marginTop: 20}}>
            <Text style={styles.crossname_container}>
              Other {prod.genre} Products
            </Text>
          </View>
          <FlatList
            data={cross}
            contentContainerStyle={{flexGrow: 1}}
            horizontal
            keyExtractor={({ id }, index) => id}
            renderItem={({ item }) => (
            <View style={{ marginBottom: 20, paddingLeft: 10}}>
              <TouchableOpacity
                onPress={() => navigation.push('Product Page', { id: item.id, count: count })}>
                <Image source={{ uri: item.imageURL }} style={{ height: 200, width: 300 }}/>
              </TouchableOpacity>
              <Text 
                numberOfLines={1}
                style={styles.crosstext_container}>
                {item.name}
              </Text>
              
            </View>
            
            )} />
            </>
            }</ScrollView></>
        }</View>
      </> )}

const styles = StyleSheet.create({
  fab: {
    flex: 1,
    margin: 16,
    right: 0,
    bottom: 0,
  },
  header_container: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingTop: 30,
    backgroundColor: "#205072"
  },
  back_button: {
    display: "flex",
    justifyContent: "flex-start",
    backgroundColor: "#205072",
    paddingLeft: 20,
    paddingTop: 30,
    paddingBottom: 5,
    borderBottomWidth: 2,
    borderBottomColor: "black",
  },
  header_name: {
    display: "flex",
    flex: 1,
    justifyContent: "center",
    alignSelf: "center",
    backgroundColor: "#205072",
    borderBottomWidth: 2,
    borderBottomColor: "black",
  },
  product_name: {
    width: 300,
    color: "#fff",
    textAlign: "center",
    fontSize: 20,
    fontWeight: "bold",
    paddingTop: 30,
    backgroundColor: "#205072",
    flex: 1,
  },
  cart_container: {
    display: "flex",
    justifyContent: "flex-end",
    backgroundColor: "#205072",
    paddingRight: 20,
    paddingBottom: 5,
    borderBottomWidth: 2,
    borderBottomColor: "black",
    position: "relative"
  },
  cart_count: {
    position: "absolute",
    color: "#fff",
    paddingBottom: 5,
    fontWeight: "bold"
  },
  pname: {
    color: '#205072',
    alignSelf: 'center',
    fontWeight: "bold",
    fontSize: 25
  },
  description_container: {
    textAlign: "left", 
    color: "#205072", 
    textDecorationLine: "underline", 
    fontWeight: "bold", 
    fontSize: 22, 
    padding: 10
  },
  price_container: {
    fontSize: 20, 
    marginTop: 20, 
    paddingRight: 5, 
    textAlignVertical: "center", 
    color: "#205072", 
    backgroundColor: "white",
    borderWidth: 2,
    borderColor: "#205072",
    paddingLeft: 10,
    paddingRight: 5,
    borderRadius: 5
  },
  crosstext_container: {
    fontSize: 22,
    textAlign: "center",
    color: "#205072",
    fontWeight: "bold",
    marginBottom: 10,
    width: 200
  },
  crossname_container: {
    fontSize: 20,
    color: "#205072",
    fontWeight: "bold",
    width: "70%",
    paddingLeft: 10
  }
})

export default ProductPage;