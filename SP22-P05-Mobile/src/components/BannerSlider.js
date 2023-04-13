import React from 'react';
import { View, Text, ImageBackground } from 'react-native';


function BannerSlider({ data }) {
    return (
        <View>
            <ImageBackground source={data.image}
                style={{
                    height: 150,
                    width: 325,
                }}>
                <Text style={{
                    color: 'white',
                    position: 'absolute',
                    bottom: 0,
                    fontSize: 22

                }}>{data.title}</Text>
            </ImageBackground>
        </View>
    )
}

export default BannerSlider;