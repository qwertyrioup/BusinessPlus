import { useCallback, React, useState, useEffect } from "react";

import {
  Text,
  View,
  SafeAreaView,
  
  
  ScrollView,
  RefreshControl,
  StatusBar,
  TouchableOpacity,
} from "react-native";
import { Button } from 'react-native-paper';

import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { Dimensions } from "react-native";
import { useSelector } from "react-redux";


import axios from "axios";


import CheckBox from "expo-checkbox";

SplashScreen.preventAutoHideAsync();

const ListScreen = ({ navigation }) => {
  const windowWidth = Dimensions.get("window").width;
  const windowHeight = Dimensions.get("window").height;


  const currentUser = useSelector((state) => state.user.currentUser);
  const currentDomain = useSelector((state) => state.domain.value);
  const [rows, setRows] = useState([]);
  const [tableWidth, setTableWidth] = useState(windowWidth);
  const [settings, setSettings] = useState([]);
  const [headers, setHeaders] = useState([]);
  const [emptyList, setEmptyList] = useState(false);

  const listDetails = useSelector((state) => state.list.value);
  const listName = useSelector((state) => state.list.value.link_to);
  const [refresh, setRefresh] = useState(false);

  const pullMe = () => {
    setRefresh(true);
    setTimeout(() => {
      setRefresh(false);
    }, 1000);
  };

  const getListData = async () => {
    axios
      .get(
        `https://${currentDomain}/api/method/slnee_app.api.list_settings?doctype=${listName}`
      )
      .then((response) => {
        const data = response.data.message;

        setSettings(data);
        const conf = JSON.stringify(
          data
            .filter(function (item) {
              return item.fieldname !== "status_field";
            })
            .map((item) => {
              if (item.fieldname !== "status_field") {
                return item.fieldname;
              }
            })
        );
        const titles = JSON.stringify(
          data
            .filter(function (item) {
              return item.fieldname !== "status_field";
            })
            .map((item) => {
              if (item.fieldname !== "status_field") {
                return item.label;
              }
            })
        );
        setHeaders(JSON.parse(titles));
        try {
          axios
            .get(
              "https://" +
                currentDomain +
                "/api/method/slnee_app.api.get_list_data?doctype=" +
                listName +
                "&fields=" +
                conf
            )
            .then((response) => {
              setRows(
                response.data.message.map((item) =>
                  item.filter((x) => {
                    return x.fieldname !== "name";
                  })
                )
              );
            });
        } catch (error) {
          setEmptyList(true);
          console.error(error);
        }
      })
      .catch((err) => {
        try {
          axios
            .get(
              "https://" +
                currentDomain +
                "/api/method/slnee_app.api.get_list_data?doctype=" +
                listName +
                '&fields=["name"]'
            )
            .then((response) => {
              if (response.data.message.length > 0) {
                setHeaders(["Name"]);
                setRows(response.data.message);
              } else {
                setEmptyList(true);
              }
            });
        } catch (error) {
          console.error(error);
        }
        console.error(err);
      });

  
  };
  const calculateWidth = () => {
    if (settings.length <= 4) {
      setTableWidth(windowWidth * 1);
    } else if (settings.length > 4) {
      setTableWidth(windowWidth * 1.5);
    }
  };

  useEffect(() => {
    setEmptyList(false);
    setSettings([]);
    setRows([]);
    setHeaders([]);
    getListData();
    calculateWidth();
  }, [listDetails, refresh]);

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
  } else if (currentUser) {
    return (
      <SafeAreaView
        style={{
          flex: 1,
          height: windowHeight,
          backgroundColor: "white",
          width: windowWidth,
          paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
        }}
        onLayout={onLayoutRootView}
      >
        {/* <TopBar navigation={navigation} /> */}
        <ScrollView
          contentContainerStyle={{
            justifyContent: "center",
            alignItems: "flex-start",
          }}
          showsVerticalScrollIndicator={false}
          style={{ width: "100%", paddingVertical: 25, paddingBottom: 25 }}
          refreshControl={
            <RefreshControl refreshing={refresh} onRefresh={pullMe} />
          }
        >
          <View style={{marginLeft: 10}} >
            <Button
              
              icon="arrow-left"
              style={{width: '150%'}}
              mode="outlined"
              // style={{backgroundColor: '#FA9884'}}
              onPress={()=> {navigation.navigate('Main')}}
            >
           Go Back
            </Button>
          </View>
          <View
            style={{
              width: windowWidth,

              // marginBottom: 50,
            }}
          >
            <View
              style={{ alignItems: "center", justifyContent: "center" }}
            >
              <View>
                <Text
                  style={{
                    fontSize: 22.5,
                    fontWeight: "400",
                    color: "#FA9884",
                    marginVertical: 15,
                    marginHorizontal: 10,
                  }}
                >
                  {listDetails.label}
                </Text>
              </View>
              <ScrollView
                horizontal={true}
                showsHorizontalScrollIndicator={false}
                style={{ width: windowWidth }}
                contentContainerStyle={{
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {!emptyList && (
                  <View style={{ width: tableWidth }}>
                    <View
                      style={{
                        paddingVertical: 15,
                        paddingHorizontal: 10,
                        width: "100%",
                        flexDirection: "row",
                        backgroundColor: "#FA9884",
                      }}
                    >
                      {headers.map((head, i) => {
                        return (
                          <View
                            key={i}
                            style={{
                              flex: 1,
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            <Text
                              style={{
                                color: "white",
                                textAlign: "center",
                                fontFamily: "Merry",
                                fontSize: 18,
                              }}
                            >
                              {head}
                            </Text>
                          </View>
                        );
                      })}
                    </View>

                    {rows.map((row, i) => (
                      <TouchableOpacity
                        style={{
                          paddingVertical: 15,
                          paddingHorizontal: 10,
                          width: "100%",
                          flexDirection: "row",
                          backgroundColor: null,
                        }}
                        key={i}
                      >
                        {row.map((item, j) => {
                          if (item.type === "Check") {
                            switch (item.value) {
                              case 0:
                                return (
                                  <View
                                    key={j}
                                    style={{
                                      flex: 1,
                                      alignItems: "center",
                                      justifyContent: "center",
                                    }}
                                  >
                                    <CheckBox
                                      value={false}
                                      color={"#28675a"}
                                      style={{ borderRadius: 50 }}
                                    />
                                  </View>
                                );

                                break;
                              case 1:
                                return (
                                  <View
                                    key={j}
                                    style={{
                                      flex: 1,
                                      alignItems: "center",
                                      justifyContent: "center",
                                    }}
                                  >
                                    <CheckBox
                                      value={true}
                                      color={"#28675a"}
                                      style={{ borderRadius: 50 }}
                                    />
                                  </View>
                                );

                                break;

                              default:
                                return (
                                  <View
                                    key={j}
                                    style={{
                                      flex: 1,
                                      alignItems: "center",
                                      justifyContent: "center",
                                    }}
                                  >
                                    <Text
                                      style={{
                                        color: "black",
                                        textAlign: "center",
                                        fontFamily: "Merry",
                                        fontSize: 16,
                                      }}
                                    >
                                      {item.value}
                                    </Text>
                                  </View>
                                );
                                break;
                            }
                          } else {
                            return (
                              <View
                                key={j}
                                style={{
                                  flex: 1,
                                  alignItems: "center",
                                  justifyContent: "center",
                                }}
                              >
                                <Text
                                  style={{
                                    color: "black",
                                    textAlign: "center",
                                    fontFamily: "Merry",
                                    fontSize: 16,
                                  }}
                                  key={j}
                                >
                                  {item.value}
                                </Text>
                              </View>
                            );
                          }
                        })}
                      </TouchableOpacity>
                    ))}
                  </View>
                )}
                {emptyList && (
                  <View style={{ width: tableWidth }}>
                    <View
                      style={{
                        paddingVertical: 15,
                        paddingHorizontal: 10,
                        width: "100%",
                        flexDirection: "row",
                        backgroundColor: null,
                      }}
                    >
                      <View
                        style={{
                          flex: 1,
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <Text
                          style={{
                            color: "#191919",
                            textAlign: "center",
                            fontFamily: "Merry",
                            fontSize: 17,
                          }}
                        >
                          🗅 Empty List
                        </Text>
                      </View>
                    </View>
                  </View>
                )}
              </ScrollView>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  } else {
    navigation.navigate("Login");
  }
};

export default ListScreen;
