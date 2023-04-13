import React, { useState } from 'react';
import { TextInput, View, StyleSheet, Text, Image } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';

function Searchbar({placeholder, data}) {
    const [filteredData, setFilteredData] = useState("");
    const [focus, setFocus] = useState(false);
    const navigation = useNavigation();

    const handleFilter = (text) => {
        if (text) {
        
        const tempList = data.filter(item => {
            return item.name.toLowerCase().includes(text.toLowerCase())
        })
        setFilteredData(tempList)
    }
        else {
            setFilteredData("")
        }
    }
    return (
        <View style={styles.search}>
            <View styles={styles.searchInput}>
               <TextInput onFocus={() => setFocus(true)} onBlur={() => setFocus(false)} placeholder={placeholder} onChangeText={(e) => handleFilter(e)}></TextInput>
                </View>
            <View> 
        </View>
        {(filteredData.length !== 0 && focus) && (
        
        <View>
        {filteredData.map((value, key) => {
            return <TouchableOpacity key={value.id}  onPress={() => navigation.navigate('Product Page', 
            {id: value.id})}>
                <View  style={styles.result}  >
                <View style={{  alignContent: 'flex-start', justifyContent: 'center' }} >
                <Image source={{uri: value.imageURL}}
                                        style={{ height: 50, width: 100}}/>
                </View>
                <View style={styles.searchItem}>
                    <Text style={{ fontWeight: 'bold', fontSize: 18, color: "#205072"}} >{value.name}
                    </Text>
                    <Text style={{ fontWeight: 'bold', fontSize: 18, color: "#205072"}}>${value.price}</Text>
                </View>
            </View></TouchableOpacity>})}
            
        </View>
        
        )}
        </View>
    )
}

export default Searchbar;

const styles = StyleSheet.create({
    search: {
        backgroundColor: 'white',
        color: 'red',
        borderRadius: 2,
        borderBottomLeftRadius: 0,
        borderBottomRightRadius: 0,
        padding: 5,
        marginBottom: 5,
        width: "95%",
        
        textShadowColor: 'black'
        },
    searchInput: {
        
        color: 'black'
    },
    result: {
        paddingTop: 5,
        width: "100%",
        height: 70,
        shadowColor: "black",
        overflow: "hidden",
        textAlignVertical: "center",
        flexDirection: 'row',
        display: 'flex',
        borderTopWidth: 1,
        textAlign: 'right',
    },
    searchItem: {
        width: "100%",
        height: "100%",
        paddingLeft: 5,
        justifyContent: 'center',
        flex: 1,
        
        
        
    }
    
})