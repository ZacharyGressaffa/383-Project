import MyLoader from "../skeletons/ProductsSkeleton";
import { Text, View, FlatList, StyleSheet, Dimensions, ScrollView, TouchableOpacity, Image, StatusBar } from "react-native";
import axios from 'axios';
import { Card } from 'react-native-paper';
import React, { useState, useEffect, useRef } from 'react';
import { useNavigation, useIsFocused, DrawerActions } from '@react-navigation/native';
import Carousel from 'react-native-anchor-carousel';
import {carouselData} from './models';
import BannerSlider from './BannerSlider';
import Searchbar from "./Searchbar";
import DropDownPicker from 'react-native-dropdown-picker';
import * as Animatable from 'react-native-animatable';
import { base } from '../components/BaseUrl.js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Ionicons from 'react-native-vector-icons/Ionicons';


function Products() {
  /*I apologize for this as well. Forgot about this until it was too late */
    const allProd = 'https://selu383-sp22-p05-g02.azurewebsites.net/api/products'
    const baseUrl = 'https://selu383-sp22-p05-g02.azurewebsites.net/api/products/Tag/Software';
    const baseUrl1 = 'https://selu383-sp22-p05-g02.azurewebsites.net/api/products/Tag/Game';
    const baseUrl2 = `https://selu383-sp22-p05-g02.azurewebsites.net/api/products/Tag/Software/Genre/`
    const baseUrl3 = `https://selu383-sp22-p05-g02.azurewebsites.net/api/products/Tag/Game/Genre/`
    const [prod, setProd] = useState([]);
    const [count, setCount] = useState(0);
    const [searchProd, setSearchProd] = useState([]);
    const [loading, setLoading] = useState(false);
    const navigation = useNavigation();
    const {width: windowWidth} = Dimensions.get('window');
    const carouselRef = useRef(null);
    const [open, setOpen] = useState(false);
    const [open1, setOpen1] = useState(false);
    const [open2, setOpen2] = useState(false);
    const [value, setValue] = useState("Software");
    const [value1, setValue1] = useState("alls");
    const [value2, setValue2] = useState("allg");
    const isFocused = useIsFocused();
    
    const [items, setItems] = useState([
      {label: 'Software', value: 'Software'},
      {label: 'Games', value: 'Game'}
  ]);
  const [items1, setItems1] = useState([
    {label: 'All Software', value: 'alls'},
    {label: 'Finance', value: 'Finance'},
    {label: 'Developer Tools', value: 'Developer Tools'},
    {label: 'Music', value: 'Music'},
    {label: 'Productivity', value: 'Productivity'},
]);
const [items2, setItems2] = useState([
  {label: 'All Games', value: 'allg'},
  {label: 'Action', value: 'Action'},
  {label: 'Strategy', value: 'Strategy'},
  {label: 'FPS', value: 'FPS'},
  {label: 'Role-Playing', value: 'Role-Playing'},
  
]);
        
        useEffect(() => {
            setLoading(true)
            axios.get(allProd).then((response) => {
            setSearchProd(response.data);   
            setLoading(false);
            });
          }, []);

          useEffect(() => {
            setLoading(true)
            if (value === "Software") {
                if (value1 === "alls") {
                axios.get(baseUrl).then((response) => {
                setProd(response.data);
                setLoading(false);
                
                });
              }
                else {
                  axios.get(baseUrl2+value1).then((response) => {
                    setProd(response.data);
                    setLoading(false);
                  });
                }
            }
            else if ( value === "Game") {
                if (value2 === "allg") {
                axios.get(baseUrl1).then((response) => {
                setProd(response.data);
                setLoading(false);
            });
          }
            else {
              axios.get(baseUrl3+value2).then((response) => {
                setProd(response.data);
                setLoading(false);
              });
            }
        }  
        }, [value, value1, value2]);

        useEffect(async() => {
          let items = await AsyncStorage.getItem('cartItems');
          if (!items)
          {
            setCount(0);
          }
          else
          {
          items = JSON.parse(items);
          setCount(items.length)
          }
        
        }, [isFocused])
        
        useEffect(() => {
          setCount(count);
          }, [count]);
    
   
    const renderItem = ({item, index}) => {
        return (
            <BannerSlider data={item} />
        );
    }
    
        return (
        <><View style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          paddingTop: 30,
          backgroundColor: "#205072"
          
          }}>
            <View style={{
              display: "flex",
              justifyContent: "flex-start",
              backgroundColor: "#205072",
              paddingLeft: 20, 
              paddingTop: 30,
              paddingBottom: 5,
              borderBottomWidth: 2,
              borderBottomColor: "black",
            }}>
              <Ionicons 
                name="menu-outline" 
                size={30} 
                color="#fff"
                onPress={() => navigation.dispatch(DrawerActions.openDrawer())}>
                  </Ionicons> 
            </View>
            <View style={{
              display: "flex",
              flex: 1,
              justifyContent:"center",
              alignSelf: "center",
            }}>
            <Text style={{
              color: "#fff",
              textAlign: "center",
              fontSize: 20,
              fontWeight: "bold",
              borderBottomWidth: 2,
              borderBottomColor: "black",
              paddingTop: 30,
              backgroundColor: "#205072",
              flex: 1,
              
            }}>Products</Text>
            </View>
         
            <View style={{
              display: "flex",
              justifyContent: "flex-end",
              backgroundColor: "#205072",
              paddingRight: 20,
              paddingBottom: 5,
              borderBottomWidth: 2,
              borderBottomColor: "black",
              position: "relative"
            }}>
              <Ionicons name="cart-outline" size={30} color="#fff" onPress={() => navigation.navigate("Cart")}/>
              <Text style={{
                position: "absolute",
                color: "#fff",
                paddingBottom: 5,
                fontWeight: "bold"
              }}>{count}</Text>
            </View>
          </View>
          <View style={{
            flex: 1,
            backgroundColor: '#205072',
            
            
          }}>
              <Text style={{
                color: 'white',
                fontSize: 20,
                fontWeight: 'bold',
                marginTop: 10,
                marginBottom: 10,
              }}>Just Added</Text>
              <View>
                <Carousel
                  ref={carouselRef}
                  data={carouselData}
                  renderItem={renderItem}
                  style={style.carousel}
                  itemWidth={windowWidth * .8}
                  containerWidth={windowWidth}
                  separatorWidth={0} />
                <View style={{ paddingTop: 5 }}>
                </View>
                <View style={{ paddingTop: 10, }}>
                  <View style={{ alignItems: "center" }}>
                    <Searchbar placeholder="Search for a product" data={searchProd} />
                  </View>
                  <View style={{ flexDirection: "row", paddingLeft: 7, justifyContent: "center", paddingTop: 10 }}>
                    <View style={{ alignContent: "flex-end", flex: 1, justifyContent: "center", alignSelf: "auto" }}>

                      <DropDownPicker
                        open={open}
                        value={value}
                        items={items}
                        setOpen={setOpen}
                        setValue={setValue}
                        setItems={setItems}
                        style={{ width: "95%", height: 30, borderColor: "#fff", backgroundColor: "#205072", fontWeight: "bold" }}
                        labelStyle={{ fontWeight: "bold", color: "white" }}
                        arrowIconStyle={{ tintColor: "white" }} />
                    </View>
                    <View style={{ alignSelf: "flex-end", flex: 1, justifyContent: "center", alignSelf: "auto" }}>
                      {value == "Software" ?
                        <DropDownPicker
                          open={open1}
                          value={value1}
                          items={items1}
                          setOpen={setOpen1}
                          setValue={setValue1}
                          setItems={setItems1}
                          style={{ width: "95%", height: 30, borderColor: "#fff", backgroundColor: "#205072", fontWeight: "bold" }}
                          labelStyle={{ fontWeight: "bold", color: "white" }}
                          arrowIconStyle={{ tintColor: "white" }} />
                        :
                        <DropDownPicker
                          open={open2}
                          value={value2}
                          items={items2}
                          setOpen={setOpen2}
                          setValue={setValue2}
                          setItems={setItems2}
                          style={{ width: "95%", height: 30, borderColor: "#fff", backgroundColor: "#205072", fontWeight: "bold" }}
                          labelStyle={{ fontWeight: "bold", color: "white" }}
                          arrowIconStyle={{ tintColor: "white" }} />}
                    </View>
                  </View>
                </View>
              </View>
              {loading ?
                <><View style={{ alignItems: 'center' }}>
                  <MyLoader />
                </View><View style={{ marginTop: 5, alignItems: 'center' }}>
                    <MyLoader />
                  </View><View style={{ marginTop: 5, alignItems: 'center' }}>
                    <MyLoader />
                  </View></>
                :
                <FlatList data={prod}
                  keyExtractor={({ id }, index) => id}
                  renderItem={({ item }) => (
                    <View style={{
                      marginTop: 5,
                    }}>
                      <TouchableOpacity>

                        <Animatable.View animation="fadeInUp" style={{ alignItems: 'center' }}>
                          <Card
                            style={{ width: '95%', }}
                            mode={'elevated'}
                            backgroundColor={'#d9d9d9'}
                            elevation={5}
                            onPress={() => navigation.navigate('Product Page',
                              { id: item.id, count: count })}>
                            {item.imageURL ?
                              <Card.Cover source={{ uri: item.imageURL }} style={{}} />
                              :
                              <Card.Cover source={require('../images/qmark.jpg')} style={{}} />}
                            <Card.Content style={{ display: 'flex', flexDirection: 'row', }}>
                              <Text numberOfLines={1}
                                style={{
                                  color: '#205072',
                                  marginBottom: -10,
                                  justifyContent: 'flex-start',
                                  flex: 1,
                                  fontWeight: 'bold',
                                  fontSize: 22,
                                  textAlignVertical: 'center'
                                }}>{item.name}</Text>


                              <Text style={{
                                color: '#205072',
                                justifyContent: 'flex-end',
                                textAlign: 'right',
                                flex: 1,
                                fontWeight: 'bold',
                                fontSize: 22,
                                marginBottom: -10
                              }}>${item.price}</Text>


                            </Card.Content>
                          </Card>


                        </Animatable.View>
                      </TouchableOpacity>
                    </View>

                  )} />}
            </View></>
    )}
export default Products;

const style = StyleSheet.create({
    carousel: {
     flexGrow: 0,
     height: 150,
    },
    categoryBtn: {
        height: 35,
        width: 100,
        marginRight: 7,
        borderRadius: 30,
        alignItems: 'center',
        paddingHorizontal: 5,
        flexDirection: 'row',
      },
      button: {
        alignContent: 'flex-end',
        alignSelf: 'flex-end',
        justifyContent: 'flex-end',
        backgroundColor: "#205072"
      }
      
   });