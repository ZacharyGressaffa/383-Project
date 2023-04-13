import React, { useState, useEffect, useContext } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Image, Dimensions } from 'react-native';
import { Provider, Modal, Title, Surface, Portal } from 'react-native-paper';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Button } from 'react-native-elements';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AuthCookieContext from '../components/context.js';
import { base } from "../components/BaseUrl.js";




function Cart({ navigation }) {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [checkOut, setCheckOut] = useState([11]);
  const [visible, setVisible] = useState(false);
  const [visible2, setVisible2] = useState(false);
  const [receipt, setReceipt] = useState([]);
  const baseUrl = 'https://selu383-sp22-p05-g02.azurewebsites.net/api/products';
  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);
  const showModal2 = () =>
    {
    hideModal();
    setVisible2(true);
    }
  const hideModal2 = () => setVisible2(false);
  const context = useContext(AuthCookieContext);
  
  
  useEffect(() => {
    axios.get(baseUrl).then((response) => {
    setProducts(response.data);
    });
  }, []);

  useEffect(() => {
    setLoading(true);
    const unsubscribe = navigation.addListener('focus', () => {
      getData();
    });
    return unsubscribe;
  }, [navigation, products]);

  const checkoutHandler = () => {
    setLoading(true);
    axios.post(`${base}/api/user/products/checkout`, {
      userID: context.userID,
      products: checkOut
    })
    .then( async(response) => {
      console.log(response.data);
      showModal2();
      await AsyncStorage.removeItem("cartItems");
      getData();
      
      setLoading(false);
    })
    .catch((error) => {
      console.log(error);
    })
  }

  const getData = async () => {
    let items = await AsyncStorage.getItem('cartItems');
    let productData = [];
    let ids = [];
    if (items) 
    {
      products.forEach(data => 
      {
        if (items.includes(data.id)) 
        {
          productData.push(data);
          ids.push(data.id)
          return;
        }
      });
      setCheckOut(ids)
      setCart(productData);
      getTotal(productData);
      setReceipt(productData);
    } 
    else 
    {
      setCart(false);
      getTotal(false);
      setLoading(false);
    }
  };

  const getTotal = productData => {
    let total = 0;
    for (let index = 0; index < productData.length; index++) {
      const productPrice = productData[index].price;
      total = total + productPrice;
    }
    setTotal(total);
  };

  const removeItem = async id => {
    let itemArray = await AsyncStorage.getItem('cartItems');
    itemArray = JSON.parse(itemArray);
    if (itemArray) 
    {
      for (let index = 0; index < itemArray.length; index++) {
        if (itemArray[index] == id) 
        {
          itemArray.splice(index, 1);
        }
        await AsyncStorage.setItem('cartItems', JSON.stringify(itemArray));
        getData();
      }
    }
  };

  // <Modal visible={visible} onDismiss={hideModal} contentContainerStyle={styles.containerStyle}>
  //           <Text style={styles.modal_confirm}>
  //             By clicking the button below, you are confirming you want to purchase the items in your cart for ${total.toFixed(2)}
  //           </Text>
  //           <View style={{paddingTop: 50}}>
  //             <Button
  //               title="Confirm"
  //               onPress={checkoutHandler}
  //               buttonStyle={{
  //                 paddingTop: 10,
  //                 backgroundColor: "#205072"}}>
  //             </Button>
  //           </View>
  //         </Modal>

  return (
    <Provider>
      <View style={styles.container}>
        <Portal>
          <Modal visible={visible2} onDismiss={hideModal2} contentContainerStyle={styles.receipt_container}>
            <Text
              style={{
                fontSize: 30,
                fontWeight: "bold",
                textAlign: "center",
                marginBottom: "auto",
                textDecorationLine: "underline",
                color: "#205072"
              }}
              >Purchase Successful</Text>
              <Text style={{
                fontSize: 20,
                marginTop: 40,
                fontWeight: "bold",
                textDecorationLine: "underline"
              }}>Your Products</Text>
              <FlatList data={receipt}
                keyExtractor={({ id }, index) => id}
                renderItem={({ item }) => (
                  <View style={{ display: "flex", flexDirection: "row", paddingTop: 20}}>
                    <Image source={{uri: item.imageURL}} style={{ height: 75, width: 75 }}/>
                    <Text style={{
                      textAlignVertical: "center",
                      fontSize: 22,
                      paddingLeft: 10,
                    }}>{item.name}</Text>
                    
                  </View>
                )}/>
                <View style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", paddingBottom: 50, marginTop: 20}}>
                  <View>
                <Button
                  onPress={() => navigation.navigate("Library")}
                  title="Go To Library" 
                  buttonStyle={{backgroundColor: '#205072', width: 150}}>
                </Button>
                </View>
                <View style={{ alignSelf: "flex-end"}}>
                <Button
                  onPress={() => navigation.navigate("All Products")}
                  title="Go To Products" 
                  buttonStyle={{backgroundColor: '#205072', width: 150,}}>
                </Button>
                </View>
                </View>
          </Modal>
          {total ?
          <Modal visible={visible} onDismiss={hideModal} contentContainerStyle={styles.containerStyle}>
            <Text style={styles.modal_confirm}>
              By clicking the button below, you are confirming you want to purchase the items in your cart for ${total.toFixed(2)}
            </Text>
            <View style={{paddingTop: 50}}>
              <Button
                title="Confirm"
                onPress={checkoutHandler}
                buttonStyle={{
                  paddingTop: 10,
                  backgroundColor: "#205072"}}>
              </Button>
            </View>
          </Modal>
        :
          <Modal visible={visible} onDismiss={hideModal} contentContainerStyle={styles.containerStyle}>
            <Text style={styles.modal_empty}>
            Your Cart is Currently Empty
            </Text>
            
        </Modal>
        }
        </Portal>
        <View>
        <Text style={styles.title}> Your Items</Text>

        <FlatList data={cart}
          keyExtractor={({ id }, index) => id}
          renderItem={({ item }) => (
            <View style={{marginTop: 5}}>
              <TouchableOpacity>
                <Surface style={styles.surface}>
                  <View style={styles.cart_item}>
                    <Image source={{ uri: item.imageURL }} style={{ height: 75, width: 75 }} />
                    <Text style={styles.cart_name} >{item.name}</Text>
                    <Text style={styles.cart_price}>${item.price}</Text>
                    <Ionicons name="close-circle" color="red" onPress={() => removeItem(item.id)} style={styles.cart_remove} />
                  </View>
                </Surface>
              </TouchableOpacity>
            </View>
          )}/>
          <Surface style={styles.total}>
          <View style={{display: 'flex', flexDirection: 'row'}}>
            <Title style={styles.total_title}>Estimated Total</Title>
            <Text style={styles.total_price}>${total.toFixed(2)}</Text>
          </View>
          <View style={styles.button_container}>
            <Text 
              onPress={() => AsyncStorage.removeItem('cartItems').then(getData())}
              style={styles.clear_cart}>Clear Cart
            </Text>
            {context.token ?
            <Button
              title="Checkout"
              onPress={showModal}
              buttonStyle={{ backgroundColor: '#205072', marginTop: 20, fontSize: 20, width: 150 }}
              textStyle={{fontFamily: 'Roboto-Medium'}}>
            </Button>
            :
            <Button
            title="Checkout"
            onPress={() => navigation.navigate("Login")}
            buttonStyle={{ backgroundColor: '#205072', marginTop: 20, fontSize: 20, width: 150 }}
            textStyle={{fontFamily: 'Roboto-Medium'}}></Button>
            }
          </View>
          <View style={styles.continue_container}>
            <Button
              onPress={() => navigation.navigate("All Products")}
              title="Continue Shopping" 
              buttonStyle={{backgroundColor: '#205072',width: 200}}>
            </Button>
          </View>
        </Surface>
      </View>
    </View>
    </Provider>
  )
}

export default Cart;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#d9d9d9'
  },
  title: {
    fontSize: 22,
    textAlign: 'left'
  },
  surface: {
    width: Dimensions.get('window').width,
  },
  total: {
    width: Dimensions.get('window').width,
    marginTop: 5,
    height: 300
  },
  containerStyle: {
    backgroundColor: 'white',
    padding: 20,
    height: "50%",
    width: "90%",
    
    alignSelf: 'center'
  },
  receipt_container: {
    backgroundColor: 'white',
    padding: 20,
    height: "90%",
    width: "90%",
    
    alignSelf: 'center'
  },
  modal_confirm: {
    fontSize: 22,
    fontWeight: 'bold',
    color: "#205072",
    textAlign: 'center',
  },
  modal_empty: {
    fontSize: 22,
    fontWeight: 'bold',
    color: "#205072",
    textAlign: 'center',
    
  },
  cart_item: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap-reverse'
  },
  cart_name: {
    color: '#205072',
    marginLeft: 5,
    justifyContent: 'center',
    textAlignVertical: 'center',
    fontSize: 20,
    fontWeight: 'bold',
    flex: 1,
  },
  cart_price: {
    color: '#205072',
    fontSize: 20,
    justifyContent: 'flex-end',
    textAlignVertical: 'center',
    fontWeight: 'bold',
    marginLeft: 10
  },
  cart_remove: {
    justifyContent: 'flex-end',
    textAlignVertical: 'center',
    fontSize: 25,
    paddingRight: 5,
    marginLeft: 5,
    fontWeight: 'bold'
  },
  total_title: {
    marginTop: 5,
    marginLeft: 5,
    flex: 1,
    justifyContent: 'flex-start'
  },
  total_price: {
    marginTop: 5,
    fontSize: 22,
    justifyContent: 'flex-end',
    color: '#205072',
    fontWeight: 'bold',
    paddingRight: 5
  },
  button_container: {
    display: 'flex',
    flexDirection: 'row',
    alignContent: 'flex-end',
    justifyContent: 'space-between',
    marginRight: 10
  },
  clear_cart: {
    display: 'flex',
    alignContent: 'flex-start',
    fontSize: 18,
    textAlignVertical: 'center',
    fontWeight: 'bold',
    color: "#205072",
    textDecorationLine: 'underline',
    paddingTop: 5,
    paddingLeft: 5,
  },
  continue_container: {
    display: 'flex',
    flexDirection: 'column',
    alignContent: 'center',
    justifyContent: 'center',
    marginBottom: 'auto',
    marginTop: 'auto',
    alignItems: 'center'
  }
})
