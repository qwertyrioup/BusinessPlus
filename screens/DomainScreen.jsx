import { useCallback, React, useState } from "react";
import Svg, { Path } from "react-native-svg";

import {
  Text,
  View,
  SafeAreaView,
  TextInput,
  Pressable,
  Image,
  Alert,
  BackHandler,
} from "react-native";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { Dimensions } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { saveDomain } from "../redux/domainSlice";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";

import { saveApp } from "../redux/appSlice";
import { useEffect } from "react";

SplashScreen.preventAutoHideAsync();

const DomainScreen = () => {
  const windowWidth = Dimensions.get("window").width;
  const windowHeight = Dimensions.get("window").height;
  const [domain, setDomain] = useState("");
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const backActionHandler = () => {
    Alert.alert("Exit !", "Are you sure to exit Slnee Mobile ?", [
      {
        text: "Cancel",
        onPress: () => null,
        style: "cancel",
      },
      { text: "Yes", onPress: () => BackHandler.exitApp()() },
    ]);
    return true;
  };
  useEffect(() => {
    BackHandler.addEventListener("hardwareBackPress", backActionHandler);

    return () =>
      BackHandler.removeEventListener("hardwareBackPress", backActionHandler);
  }, []);

  const handleDomain = () => {
    axios
      .get("https://" + domain + "/api/method/slnee_app.api.appSettings")
      .then((response) => {
        const d = response.data.message;
        dispatch(saveApp(d));
        dispatch(saveDomain(domain));
        navigation.navigate("Login");
      })
      .catch((error) => {
        console.log(error);
        Alert.alert("Error", "Review Your Domain Please !");
      });

    // dispatch(saveApp(response.data.message))
    // dispatch(saveDomain(domain));
    // navigation.navigate("Login");
  };

  const [fontsLoaded] = useFonts({
    Mynerve: require("../assets/Fonts/MaShanZheng.ttf"),
    Merry: require("../assets/Fonts/MerriweatherLight.ttf"),
    Grand: require("../assets/Fonts/JustMeAgainDownHere.ttf"),
    Arabic: require("../assets/Fonts/GE_SS_Unique_Light.otf"),
  });

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }
  return (
    <SafeAreaView style={{ flex: 1, height: windowHeight, width: windowWidth }}>
      <View
        style={{
          width: "100%",
          height: "100%",
          alignItems: "center",
          justifyContent: "flex-start",
        }}
      >
        <View>
          <Image
            style={{ width: 200, height: 200, resizeMode: "contain" }}
            source={require("../assets/bp.png")}
          />
        </View>
        <View style={{alignItems: "center", justifyContent: 'center', gap: 100}} >
          <View
            style={{ alignItems: "center", justifyContent: "center", gap: 10 }}
          >
            <Text
              style={{ color: "#012346", fontFamily: "Merry", fontSize: 25 }}
            >
              Welcome to <Text style={{ color: "#E4603E" }}>Business Plus</Text>
            </Text>
            <Text
              style={{ color: "#012346", fontFamily: "Merry", fontSize: 14 }}
            >
              Enter Your Domain Please
            </Text>
          </View>
          <View style={{alignItems: 'center', justifyContent: 'center', gap: 50}} >
            <TextInput
              onChangeText={setDomain}
              placeholderTextColor={"#454545"}
              placeholder={"example.domain.com"}
              style={{
                borderWidth: 1,
                borderColor: "lightgray",
                borderRadius: 5,
                height: 50,
                width: windowWidth - windowWidth * 0.3,

                paddingHorizontal: 15,
                color: "#454545",
              }}
            />

            <Pressable onPress={handleDomain} style={{width: 100, backgroundColor: '#C33E1C', height: 35, alignItems: 'center', justifyContent: 'center', borderRadius: 10}} >
              <Text style={{fontFamily: 'Merry', fontSize: 16, color: 'white'}} >Next</Text>
            </Pressable>
          </View>
        </View>
      </View>
      {/* <View style={{ backgroundColor: "white", height: "100%", width: "100%", position: "relative"}}  >
        <View style={{height: 120, width: windowWidth, backgroundColor: "#FA9884", position: "relative"}} >
          <View style={{position: "absolute", top: 0, bottom: 0, left: 0, right: 0, justifyContent: "center", alignItems: "center"}} >
          <Text
                    style={{
                      fontFamily: "Merry",
                      fontSize: 30,
                      color: "white",
                      alignContent: "center",
                      letterSpacing: 1.2,
                      textAlign: "center",

                    }}
                  >

                     Welcome To Slnee 
                  </Text>
          </View>

          <Svg 
            height={280}
            width={windowWidth}
            viewBox="0 0 1440 320"
            
          >
            <Path
              fill="#FA9884"
              d='M0,192L60,170.7C120,149,240,107,360,112C480,117,600,171,720,197.3C840,224,960,224,1080,208C1200,192,1320,160,1380,144L1440,128L1440,0L1380,0C1320,0,1200,0,1080,0C960,0,840,0,720,0C600,0,480,0,360,0C240,0,120,0,60,0L0,0Z'
            />
          </Svg>
        </View>
        <View style={{position: "absolute", top: 0, bottom: 0, left: 0, right: 0, justifyContent: "center", alignItems: "center"}} >
            <View style={{marginBottom: 25}} >
                   <Text
                    style={{
                      fontFamily: "Merry",
                      fontSize: 15,
                      color: "#FA9884",

                      letterSpacing: 1,
                      textAlign: "center",
                    }}
                  >
                    Type Your Company Domain Please !
                  </Text>
            </View>
            <View style={{marginBottom: 15}} >
                   <TextInput
                      onChangeText={setDomain}
                      placeholderTextColor={"#454545"}
                      placeholder={"example.domain.com"}
                      style={{
                        borderBottomWidth: 1.5,
                        borderColor: "#FA9884",
                        height: 50,
                        width: windowWidth - windowWidth * 0.3,
                        
                        paddingHorizontal: 15,
                        color: "#454545",
                      }}
                    />
                  </View>
            
                
                
                </View>
                            
                
                
                <View style={{position: "absolute",  bottom: 50, right: -50, justifyContent: "center", alignItems: "flex-start", backgroundColor: "#FA9884", height: 100, width: 100, borderRadius: 50}} >
                  <Pressable onPress={handleDomain}   >
                  <Image source={require("../assets/go.png")} style={{tintColor: "white", resizeMode: "contain", height: 50, width: 50, marginLeft: 7}} />

                  </Pressable >
                </View>
        </View> */}
    </SafeAreaView>
  );
};

export default DomainScreen;
