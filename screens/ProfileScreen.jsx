import { useCallback, React } from "react";

import {
  Text,
  View,
  SafeAreaView,
  Pressable,
  Image,
  ScrollView,
  BackHandler,
  ImageBackground,
} from "react-native";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { Dimensions } from "react-native";
import Svg from "react-native-svg";
import { Path } from "react-native-svg";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../redux/userSlice";
import { deleteMenu } from "../redux/menuSlice";
import { deleteModule } from "../redux/moduleSlice";
import { deleteList } from "../redux/listSlice";
import { Button, Divider } from "react-native-paper";
import axios from "axios";
import { saveLang } from "../redux/languageSlice";
import { Alert } from "react-native-web";
import SelectDropdown from "react-native-select-dropdown";
import { useEffect } from "react";

SplashScreen.preventAutoHideAsync();

const DomainScreen = ({navigation}) => {
  const windowWidth = Dimensions.get("window").width;
  const windowHeight = Dimensions.get("window").height;
  const currentUser = useSelector((state) => state.user.currentUser);
  const currentDomain = useSelector((state) => state.domain.value);
  const lang = useSelector((state) => state.lang.value);
  const dispatch = useDispatch()
  const handleLogOut = async() => {
    try {
      const res = await axios.get('https://'+ currentDomain + '/api/method/logout')
      navigation.navigate("Login")
      dispatch(logout())
    } catch (error) {
      console.log(error)
    }

}

const select = (selectedItem, index) => {
                    
  Alert.alert('Done', 'language is set to '+selectedItem)
  dispatch(saveLang(selectedItem))
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
  BackHandler.addEventListener("hardwareBackPress", backActionHandler);

  return () =>
   
    BackHandler.removeEventListener("hardwareBackPress", backActionHandler);



}, []);

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
  }else if(currentUser) {
  return (
    <SafeAreaView style={{ flex: 1, height: windowHeight, width: windowWidth }}>
      <ImageBackground
      source={require('../assets/gradient.png')}
        style={{
          backgroundColor: "white",
          height: "100%",
          width: "100%",
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
        }}
      >
       
          <View style={{alignItems: 'center', justifyContent: 'center', gap: 10}} >
            <Image
              style={{
                resizeMode: "contain",
                width: 100,
                height: 100,
                borderRadius: 50,
              }}
              source={require("../assets/man.png")}
            />
            <Text
              style={{
                fontFamily: "Merry",
                fontSize: 25,
                color: "#fff",

                letterSpacing: 1,
                textAlign: "center",
              }}
            >
              {currentUser.full_name}
            </Text>


          </View>
            
          
          <Divider style={{width: '80%', height: 1, marginTop: 25, marginBottom: 25}} theme={{ colors: { primary: 'white' } }} />
          <View style={{display: 'flex', alignItems: 'flex-start', justifyContent: 'flex-start', gap: 30}} >
              <View style={{alignItems: 'flex-start', justifyContent: 'flex-start', display: 'flex'}} >

            <Text
              style={{
                fontFamily: "Merry",
                fontSize: 18,
                color: "#fff",
                
                letterSpacing: 1,
                textAlign: "center",
              }}
              >
              Your Current Domain is :{" "}
            </Text>
            <Text
              style={{
                fontFamily: "Merry",
                fontSize: 16,
                color: "#fff",
                marginTop: 25,
                letterSpacing: 1,
                textAlign: "center",
              }}
              >
              {currentDomain}{" "}
            </Text>

            </View>
            <View style={{alignItems: 'flex-start', justifyContent: 'flex-start', display: 'flex'}} >

            <Text
              style={{
                fontFamily: "Merry",
                fontSize: 18,
                color: "#fff",
                marginTop: 25,
                letterSpacing: 1,
                textAlign: "center",
              }}
              >
              Your Current Session Expires On :{" "}
            </Text>
            <Text
              style={{
                fontFamily: "Merry",
                fontSize: 14,
                color: "#fff",
                marginTop: 25,
                letterSpacing: 1,
                textAlign: "center",
              }}
            >
              {currentUser.cookieExpiresDate}{" "}
            </Text>
              </View>
             

            <View  style={{flexDirection: "row", marginTop: 20, alignItems: 'center', justifyContent: "center", gap: 20}}>
              <Text  style={{
                fontFamily: "Merry",
                fontSize: 18,
                color: "#fff",
                
                letterSpacing: 1,
                textAlign: "center",
              }} >Language</Text>
              <SelectDropdown
            
                  buttonStyle={{ width: 100, borderRadius: 25, backgroundColor: '#E6C0C0C0', height: 30 }}
                  data={['English', 'Arabic']}
                  onSelect={select}
                  defaultValue={"English"}
                  selectedRowStyle={{backgroundColor: '#E6C0C0C0'}}
                  rowStyle={{backgroundColor: '#E6C0C0C0'}}
                  rowTextStyle={{color: '#fff'}}
                  buttonTextStyle={{color: '#fff'}}
                />
            </View>
          <Button onPress={handleLogOut}  style={{width: 175, alignSelf: 'center', marginTop: 25, backgroundColor: '#d1C0C0C0' }} mode='contained' >Log Out</Button>
          </View>
          

          
       
    
       
      </ImageBackground>
    </SafeAreaView>
  );
  }
  else {
    navigation.navigate("Login");
  }
};

export default DomainScreen;
