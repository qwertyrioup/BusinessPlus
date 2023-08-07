import { View, Text, useWindowDimensions, StyleSheet, Image } from 'react-native'
import React from 'react'

const OnboardingItem = ({item}) => {
    const {width} = useWindowDimensions()
  return (
    <View style={[styles.container, {width}]} >
      <Image source={item.image} style={[styles.image, {width}]}/>
      <Text style={styles.dsc} >{item.dsc}</Text>
    </View>
  )
}

export default OnboardingItem
const styles = StyleSheet.create({
    container : {
        flex : 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    image: {
        flex: 0.7,
        justifyContent: 'center',
        resizeMode: 'contain'
    },
    dsc: {
        fontWeight: '400',
        fontSize: 16,
        color: '#62656b',
        textAlign: 'center',
        paddingHorizontal: 64,
        marginTop: 25
    }
})