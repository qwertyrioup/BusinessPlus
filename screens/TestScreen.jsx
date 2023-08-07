import { useCallback, React, useState, useEffect, useRef } from "react";
import LottieView from "lottie-react-native";

import {
  View,
  SafeAreaView,
  BackHandler,
  Alert,
  Image,
} from "react-native";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { Dimensions } from "react-native";
import { useSelector, useDispatch } from "react-redux";

import { Audio } from "expo-av";
import { Platform } from "react-native";
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import axios from "axios";
import { Text } from "react-native";
import { width } from "deprecated-react-native-prop-types/DeprecatedImagePropType";


SplashScreen.preventAutoHideAsync();

const TestScreen = ({ navigation }) => {
  const windowWidth = Dimensions.get("window").width;
  const windowHeight = Dimensions.get("window").height;
  const animation = useRef(null);

  const currentUser = useSelector((state) => state.user.currentUser);
  const currentDomain = useSelector((state) => state.domain.value);
  const [sound, setSound] = useState();
  const [expoToken, setExpoToken] = useState("");
  console.log(expoToken)
  async function playSound() {
    const { sound } = await Audio.Sound.createAsync(
      require("../assets/auth.mp3")
      );
      setSound(sound);
      
      await sound.playAsync();
    }




    const backActionHandler = () => {
      Alert.alert("Exit !", "Are you sure to exit Slnee Mobile ?", [
        {
          text: "Cancel",
          onPress: () => null,
          style: "cancel"
        },
        { text: "Yes", onPress: () => BackHandler.exitApp()
        () }
      ]);
      return true;
    };


    

    
    
    useEffect(() => {
      playSound();
      BackHandler.addEventListener("hardwareBackPress", backActionHandler);
      setTimeout(()=>{navigation.navigate('Main')},3000)
  
      return () =>
       
        BackHandler.removeEventListener("hardwareBackPress", backActionHandler);
    
   
    
  }, []);

  const [fontsLoaded] = useFonts({
    Mynerve: require("../assets/Fonts/MaShanZheng.ttf"),
    Merry: require("../assets/Fonts/MerriweatherLight.ttf"),
    Grand: require("../assets/Fonts/JustMeAgainDownHere.ttf"),
  });

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  } 
  
  else if (currentUser) {
    return (
      <SafeAreaView
        style={{ flex: 1, height: windowHeight, width: windowWidth }}
      >
        <View
          style={{
            backgroundColor: "white",
            height: "100%",
            width: "100%",
            alignItems: "center",
            justifyContent: "center",
            gap: 50,
            position: 'relative'
          }}
        >
          <LottieView
        autoPlay
        ref={animation}
        style={{
          width: 200,
          height: 200,
          backgroundColor: 'none',
        }}
        // Find more Lottie files at https://lottiefiles.com/featured
        source={require('../assets/fanimation.json')}
      />
          <Text style={{fontFamily: 'Merry', fontSize: 45, fontWeight: 'bold'}} >Woohoo !</Text>
          <Text
              style={{ color: "#012346", fontFamily: "Merry", fontSize: 20 }}
            >
              Welcome to <Text style={{ color: "#E4603E" }}>Business Plus</Text>
            </Text>

            <Text style={{ color: "#DC3545", fontFamily: 'Merry', position: 'absolute', bottom:20, fontSize: 16 }} >auto redirect after 3s</Text>
        </View>
      </SafeAreaView>
    );
  } else {
    navigation.navigate("Domain");
  }
};

export default TestScreen;
