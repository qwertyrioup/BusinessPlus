import { View, Text, SafeAreaViewBase, SafeAreaView, StyleSheet, FlatList,Animated } from 'react-native'
import React from 'react'
import OnboardingData from './components/OnboardingData'
import OnboardingItem from './components/OnboardingItem'
import { useRef } from 'react'
import { useState } from 'react'
import Paginator from './components/Paginator'
import NextButton from './components/NextButton'
import AsyncStorage from '@react-native-async-storage/async-storage'

const Onboarding = ({navigation}) => {
    const scrollX = useRef(new Animated.Value(0)).current
    const [currentIndex, setCurrentIndex] = useState(0)
    const viewableItemsChanged = useRef(({viewableItems}) => {
        setCurrentIndex(viewableItems[0].index)
    }).current
    const viewConfig = useState({viewAreaCoveragePercentThreshold: 50}).current
    const slidesRef = useRef(null)
//       const getState = async()=> {
//     const bbb = await AsyncStorage.getItem('@viewedOnboarding')
//     console.log('state',bbb)
// // 
//   }
//   getState()
    const scrollTo = async()=> {
        if(currentIndex < OnboardingData.length - 1) {
            slidesRef.current.scrollToIndex({index: currentIndex+1})
        } else {
            try {
                await AsyncStorage.setItem('@viewedOnboarding', 'true')
                navigation.navigate('Auth')
            } catch (error) {
                console.log('Error @setItem', error)
            }
        }
    }
  return (
    <SafeAreaView style={styles.container} >
        <View style={{flex: 3}} >

       
      <FlatList 
      data={OnboardingData} 
      renderItem={({item})=> <OnboardingItem item={item} />}
      horizontal
      showsHorizontalScrollIndicator={false}
      pagingEnabled
      bounces={false} 
      keyExtractor={(item)=> item.id}
      onScroll={Animated.event([{nativeEvent: {contentOffset: {x: scrollX}}}], {useNativeDriver: false})}
      onViewableItemsChanged={viewableItemsChanged}
      viewabilityConfig={viewConfig}
      scrollEventThrottle={32}
      ref={slidesRef}
      />
       </View>
       <Paginator data={OnboardingData} scrollX={scrollX}/>
       <NextButton scrollTo={scrollTo} percentage = {(currentIndex+1)*(100/OnboardingData.length)} />
    </SafeAreaView>
  )
}

export default Onboarding
const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    }
})