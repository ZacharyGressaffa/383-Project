import React, { useEffect, useState, useContext } from "react";
import { Text, View, StyleSheet, FlatList, Image, Dimensions } from "react-native";
import { Card } from "react-native-paper"
import axios from "axios";
import { base } from "../components/BaseUrl";
import AuthCookieContext from "./context";
import { useIsFocused } from '@react-navigation/native';
import LottieView from 'lottie-react-native';

function Library() {
    const [lib, setLib] = useState();
    const context = useContext(AuthCookieContext);
    const isFocused = useIsFocused();
    
    

    

    useEffect(() => {
        axios.get(`${base}/api/user/products/${context.userID}/all`)
        .then((response) => {
            if (response.data.length == 0)
            {
                setLib(null);
            }
            else
            {
            setLib(response.data);
            }
        })
        .catch((error) => {
            console.log(error);
        })
    }, [isFocused]);

    return (
        <View style={styles.page_container}>
            <Text style={styles.header}>{context.token}'s Products</Text>
            {!lib ?
            <View>
                <View style={{ height: 300, width: Dimensions.get('window').width, justifyContent: "center", display: "flex"}}>
                    <LottieView source={require("../images/tumble.json")} autoPlay loop style={{ alignSelf: "center"}} /> 
                </View>
                    <Text style={{ fontSize: 22, textAlign: "center", fontWeight: "bold", color: "#205072"}}>Your library is empty.</Text>
                </View>
                :
                <View style={{}}>
                        <FlatList
                            data={lib}
                            numColumns={2}
                            contentContainerStyle={{ paddingBottom: 100 }}
                            keyExtractor={({ id }, index) => id}
                            renderItem={({ item }) => (
                                <View style={styles.card_container}>
                                    <Card style={styles.card}>
                                        <Card.Cover style={styles.image} source={{ uri: item.imageURL }} />
                                        <Card.Content style={styles.content}>
                                            <Text numberOfLines={1} style={styles.card_title}>{item.name}</Text>

                                        </Card.Content>
                                        <Card.Content style={{ display: "flex", alignItems: "flex-end" }}>

                                        </Card.Content>
                                    </Card>
                                </View>
                            )}>
                        </FlatList>
            </View>}
        </View>
    )}

export default Library;

const styles = StyleSheet.create({
    header : {
        textAlign: "center",
        fontSize: 30,
        color: "#205072",
        fontWeight: "bold",
        paddingTop: 20,
        borderBottomWidth: 2,
        borderColor: "#fff",
        paddingBottom: 20
    },
    page_container: {
        flex: 1,
        backgroundColor: "#d9d9d9",
    },
    card: {
        marginBottom: 5,
        marginTop: 5,
        height: 150,
        width: Dimensions.get('window').width /2,
        
        
    },
    card_container: {
        display: "flex",
        flexDirection: "row",
        flex: 1,
        
        height: "50%",
        alignSelf: "center"
    },
    image: {
        padding: 10,
        height: 110
    },
    content: {
        marginBottom: -10
    },
    card_title: {
        fontSize: 26,
        color: "#205072",
        alignSelf: "flex-start",
        
    },
    button: {
        alignSelf: "flex-end",
        backgroundColor: "#205072",
        
    }
    

})