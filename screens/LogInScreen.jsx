import { useCallback, React, useState } from "react";
import Svg, { Path } from "react-native-svg";
import LottieView from "lottie-react-native";
import { registerIndieID } from 'native-notify';


import {
  Text,
  View,
  SafeAreaView,
  TextInput,
  Pressable,
  TouchableOpacity,

  Image,
  StatusBar,
} from "react-native";


import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { Dimensions } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { Audio } from "expo-av";
import {
  login,
  loginFailure,
  loginStart,
  loginSuccess,
} from "../redux/userSlice";
import Axios from "axios";

import domainSlice, { saveDomain } from "../redux/domainSlice";

import axios from "axios";
import { saveMenu } from "../redux/menuSlice";
import { saveModule } from "../redux/moduleSlice";
import { useRef } from "react";
import { Modal } from "react-native";
import { Button } from "react-native-paper";
import { BackHandler } from "react-native";
import { Alert } from "react-native";
import { useEffect } from "react";

SplashScreen.preventAutoHideAsync();

const LogInScreen = ({ navigation }) => {
  const animation = useRef(null);
  // const currentUser = useSelector(state => state.user.currentUser)
  const currentDomain = useSelector((state) => state.domain.value);
  const appSettings = useSelector((state) => state.app.app_info);
  
  const [hide, setHide] = useState(true);
 
  console.log(currentDomain)
    

  

  const windowWidth = Dimensions.get("window").width;
  const windowHeight = Dimensions.get("window").height;
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [domain, setDomain] = useState("");
  const [error, setError] = useState(false);
  const dispatch = useDispatch();
  const [sound, setSound] = useState();
  async function playSound() {
    const { sound } = await Audio.Sound.createAsync(
      require("../assets/error.mp3")
    );
    setSound(sound);

    try {
      await sound.playAsync();
    } catch (error) {
      console.log(error);
    }
  }

  const [isModalVisible, setModalVisible] = useState(false);
  const getSideBarItems = async () => {
    const titles = [];

    try {
      const res = await axios.get("https://" +currentDomain +"/api/method/frappe.desk.desktop.get_workspace_sidebar_items")
      titles.push(
        res.data.message.pages.map(({ title }) => {
          return title;
        })
      );
      
      dispatch(saveMenu(titles[0]));
    } catch (err) {console.log(err)}
  };

  const functionOne = () => {
    dispatch(saveDomain(domain));
  };
  const functionTwo = () => {
    toggleModal();
  };
  const combinedFunction = () => {
    functionOne();
    functionTwo();
  };

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };


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
  useEffect(()=> {
    BackHandler.addEventListener("hardwareBackPress", backActionHandler);

    return () =>
     
      BackHandler.removeEventListener("hardwareBackPress", backActionHandler);
  }, [])

  const handleLogin = async () => {
    dispatch(loginStart());
    try {
      const response = await Axios.post(
        "https://" + currentDomain + "/api/method/login",
        {
          usr: username,
          pwd: password,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        }
      );

      const splittedHeadData = response.headers["set-cookie"][0].split(";");
      const sid = Object.assign({}, splittedHeadData[0].split(";"));
      const expiresOnDate = Object.assign({}, splittedHeadData[1].split(";"));

      const cookie = sid["0"].split("=")[1];
      const cookieExpiresDate = expiresOnDate["0"].split("=")[1];

      dispatch(loginSuccess({ ...response.data, cookie, cookieExpiresDate }));
      
      registerIndieID(`${response.data.full_name}`, 7874, 'crrdA1uaMv7XAFPrujbfLj');
      console.log('registred indie ID')

      getSideBarItems();
      dispatch(saveModule("Home"));
      navigation.navigate("Test");
    } catch (error) {
      console.log(error);
      playSound();
      setError(true);

      dispatch(loginFailure());
    }
  };



  const [fontsLoaded] = useFonts({
    Mynerve: require("../assets/Fonts/MaShanZheng.ttf"),
    Merry: require("../assets/Fonts/MerriweatherLight.ttf"),
    Grand: require("../assets/Fonts/JustMeAgainDownHere.ttf"),
    Arabic: require("../assets/Fonts/GE_SS_Unique_Light.otf"),
  });
  const [text, setText] = useState('')
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
          backgroundColor: 'white'
        }}
      >
        <Modal
          animationType="slide"
          transparent={true}
          visible={isModalVisible}
          onRequestClose={() => toggleModal()}
        >
          <View style={{position: 'relative', gap: 20, width: windowWidth, height: windowHeight,gap:25, backgroundColor: 'white', alignItems: 'center',justifyContent: 'center'}} >
            <Text style={{fontSize: 16 , color: '#C33E1C'}} >Change Your Domain</Text>
            
             <TextInput
              onChangeText={setText}
              placeholderTextColor={"#454545"}
              placeholder={"New Domain"}
              style={{
                borderWidth: 1,
                borderColor: "lightgray",
                borderRadius: 15,
                height: 50,
                width: windowWidth - windowWidth * 0.3,
                
                paddingHorizontal: 15,
                color: "#454545",
              }}
              />

<Button icon="forward" mode="contained" onPress={() => {
  dispatch(saveDomain(text))
  toggleModal()
}}>
    Save
  </Button>

  <TouchableOpacity
              onPress={() => {
                toggleModal()
              }}
              style={{
                position: "absolute",
                top: StatusBar.currentHeight + 25,
                borderRadius: 50,
                right: 10,
                backgroundColor: "lightgray",
                width: 45,
                height: 45,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Text style={{ fontWeight: "700" }}>X</Text>
            </TouchableOpacity>
           
          </View>
          
        </Modal>
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
              Log in with Your username and password
            </Text>
          </View>
          <View style={{alignItems: 'center', justifyContent: 'center', gap: 50}} >
    
            
            <View style={{gap: 20, alignItems: 'center', justifyContent: 'center'}} >

            <TextInput
              onChangeText={setUsername}
              placeholderTextColor={"#454545"}
              placeholder={"username"}
              style={{
                borderWidth: 1,
                borderColor: error ? 'red' : "lightgray",
                borderRadius: 15,
                height: 50,
                width: windowWidth - windowWidth * 0.3,
                
                paddingHorizontal: 15,
                color: "#454545",
              }}
              />
            <TextInput
                  onChangeText={setPassword}
                  secureTextEntry={hide}
                  placeholderTextColor={"#454545"}
                  placeholder={"Password"}
                  style={{
                    borderWidth: 1,
                    borderColor: error ? 'red' : "lightgray",
                    borderRadius: 15,
                    height: 50,
                    width: windowWidth - windowWidth * 0.3,
                    
                    paddingHorizontal: 15,
                    color: "#454545",
                  }}
                  />

<TouchableOpacity onPress={()=> toggleModal()}>
              <Text
                style={{
                  fontFamily: "Merry",
                  fontSize: 14,

                  color: "#C33E1C",
                  fontWeight: "bold",
                  letterSpacing: 1,
                }}
              >
                Change Your Domain ?
              </Text>
            </TouchableOpacity>
                  </View>

            <Pressable onPress={handleLogin} style={{width: 100, backgroundColor: '#C33E1C', height: 40, alignItems: 'center', justifyContent: 'center', borderRadius: 10}} >
              <Text style={{fontFamily: 'Merry', fontSize: 18, color: 'white'}} >Login</Text>
            </Pressable>
          </View>
        </View>
      </View>
      {/* <Modal
          animationType="slide"
          transparent={true}
          visible={isModalVisible}
          onRequestClose={() => toggleModal()}
        >
          <View style={{position: 'relative', width: windowWidth, height: windowHeight,gap:25, backgroundColor: 'white', alignItems: 'center',justifyContent: 'center'}} >
            <Text style={{fontSize: 16 , color: '#FA9884'}} >Change Your Domain</Text>
            <TextInput
              onChangeText={setText}
              placeholderTextColor={"#454545"}
              placeholder={"New Domain"}
              style={{
                borderBottomWidth: 1.5,
                borderColor: "#FA9884",
                height: 50,
                width: windowWidth - windowWidth * 0.3,

                paddingHorizontal: 15,
                color: "#454545",
              }}
            />

<Button icon="forward" mode="contained" onPress={() => {
  dispatch(saveDomain(text))
  toggleModal()
}}>
    Save
  </Button>

  <TouchableOpacity
              onPress={() => {
                toggleModal()
              }}
              style={{
                position: "absolute",
                top: StatusBar.currentHeight + 25,
                borderRadius: 50,
                right: 10,
                backgroundColor: "lightgray",
                width: 45,
                height: 45,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Text style={{ fontWeight: "700" }}>X</Text>
            </TouchableOpacity>
           
          </View>
          
        </Modal>
      
      <View
        style={{
          backgroundColor: "white",
          height: "100%",
          width: "100%",
          position: "relative",
        }}
      >
        <View
          style={{
            height: 120,
            width: windowWidth,
            backgroundColor: "#FA9884",
            position: "relative",
          }}
        >
          <View
            style={{
              position: "absolute",
              top: 0,
              bottom: 0,
              left: 0,
              right: 0,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Text
              style={{
                fontFamily: "Arabic",
                fontSize: 30,
                color: "white",
                alignContent: "center",
                letterSpacing: 1,
                textAlign: "center",
                marginTop: 10
              }}
            >
              {appSettings.app}
            </Text>
          </View>

          <Svg height={280} width={windowWidth} viewBox="0 0 1440 320">
            <Path
              fill="#FA9884"
              d="M0,192L60,170.7C120,149,240,107,360,112C480,117,600,171,720,197.3C840,224,960,224,1080,208C1200,192,1320,160,1380,144L1440,128L1440,0L1380,0C1320,0,1200,0,1080,0C960,0,840,0,720,0C600,0,480,0,360,0C240,0,120,0,60,0L0,0Z"
            />
          </Svg>
        </View>
        <View
          style={{
            position: "absolute",
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <View style={{ marginBottom: 25 }}>
            <Text
              style={{
                fontFamily: "Merry",
                fontSize: 15,
                color: "#FA9884",

                letterSpacing: 1,
                textAlign: "center",
              }}
            >
              Enter Your Credentials Please !
            </Text>
          </View>
          <View style={{ marginBottom: 15 }}>
            <TextInput
              onChangeText={setUsername}
              placeholderTextColor={"#454545"}
              placeholder={"Username"}
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
          <View>
            <View
              style={{
                borderBottomWidth: 1.5,
                borderColor: "#FA9884",
                height: 50,
                width: windowWidth - windowWidth * 0.3,
                borderRadius: 5,
                paddingHorizontal: 15,
                color: "white",

                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <View>
                <TextInput
                  onChangeText={setPassword}
                  secureTextEntry={hide}
                  placeholderTextColor={"#454545"}
                  placeholder={"Password"}
                  style={{ height: 40, width: 200, color: "#454545" }}
                />
              </View>
              <Pressable
                onPress={() => {
                  setHide(!hide);
                }}
              >
                <Image
                  style={{
                    flex: 1,
                    width: 25,
                    height: 25,
                    resizeMode: "contain",
                    tintColor: "#454545",
                  }}
                  source={require("../assets/hide.png")}
                />
              </Pressable>
            </View>
          </View>
          <View style={{ marginTop: 25, marginBottom: 15 }}>
            <TouchableOpacity onPress={()=> toggleModal()}>
              <Text
                style={{
                  fontFamily: "Merry",
                  fontSize: 14,

                  color: "#FBAB7E",
                  fontWeight: "bold",
                  letterSpacing: 1,
                }}
              >
                Change Your Domain ?
              </Text>
            </TouchableOpacity>
          </View>

          <LottieView
      autoPlay={true}
      
      ref={animation}
      style={{
        display: !error ? "none" :  "flex",
        width: 50,
        height: 50,
        
      }}
      source={require("../assets/error1.json")}
    />
        </View>

        <View
          style={{
            position: "absolute",
            bottom: 50,
            right: -50,
            justifyContent: "center",
            alignItems: "flex-start",
            backgroundColor: "#FA9884",
            height: 100,
            width: 100,
            borderRadius: 50,
          }}
        >
          <Pressable onPress={handleLogin}>
            <Image
              source={require("../assets/go.png")}
              style={{
                tintColor: "white",
                resizeMode: "contain",
                height: 50,
                width: 50,
                marginLeft: 7,
              }}
            />
          </Pressable>
        </View>
      </View> */}
    </SafeAreaView>
  );
};

export default LogInScreen;
