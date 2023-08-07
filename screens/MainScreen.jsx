import { useCallback, React, useState, useEffect } from "react";

import {
  Text,
  View,
  SafeAreaView,
  ScrollView,
  Image,
  RefreshControl,
  StatusBar,
  ImageBackground,
  Alert,
} from "react-native";
import { Button, DataTable, Divider } from "react-native-paper";

import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { Dimensions } from "react-native";
import { useSelector, useDispatch } from "react-redux";

import axios from "axios";

import { saveList } from "../redux/listSlice.js";
import {
  LineChart,
  Grid,
  YAxis,
  XAxis,
  BarChart,
} from "react-native-svg-charts";
import { TouchableOpacity } from "react-native";
import { Modal } from "react-native";
import { Pressable } from "react-native";
import { BackHandler } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

SplashScreen.preventAutoHideAsync();

const HomeScreen = ({ navigation }) => {
  const windowWidth = Dimensions.get("window").width;
  const windowHeight = Dimensions.get("window").height;
  const [listModal, setListModal] = useState(false);
  const [rows, setRows] = useState([]);
  const [tableWidth, setTableWidth] = useState(windowWidth);
  const [settings, setSettings] = useState([]);
  const [headers, setHeaders] = useState([]);
  const [emptyList, setEmptyList] = useState(false);
  const [listName, setListName] = useState('')
  const dispatch = useDispatch();

 

  const companyName = useSelector((state) => state.app.app_info.app);

  const currentUser = useSelector((state) => state.user.currentUser);
  const currentDomain = useSelector((state) => state.domain.value);
  const module = useSelector((state) => state.module.value);
  const lang = useSelector((state) => state.lang.value);

  const [shortcuts, setShortcuts] = useState([]);
  const [cards, setCards] = useState([]);
  const [charts, setCharts] = useState([]);
  const [refresh, setRefresh] = useState(false);
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

  const ArrayAvg = (myArray) => {
    var i = 0,
      summ = 0,
      ArrayLen = myArray.length;
    while (i < ArrayLen) {
      summ = summ + myArray[i++];
    }
    return summ / ArrayLen;
  };

  const pullMe = () => {
    setRefresh(true);
    setTimeout(() => {
      setRefresh(false);
    }, 1000);
  };

  const clearAsync = async()=> {
    try {
      await AsyncStorage.removeItem('@viewedOnboarding')
      Alert.alert('cleared')
    } catch (error) {
      console.log('Error @clearOnboarding', error);
      
    }
  }

  const getListData = async (listname) => {
    
    try {
      const response  = await axios.get(`https://${currentDomain}/api/method/slnee_app.api.list_settings?doctype=${listname}`)
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

        const res = await axios
        .get(
          "https://" +
            currentDomain +
            "/api/method/slnee_app.api.get_list_data?doctype=" +
            listname +
            "&fields=" +
            conf
        )

        if (response.data.message.length > 0) {
          setEmptyList(false)
          setRows(
            res.data.message.map((item) =>
              item.filter((x) => {
                return x.fieldname !== "name";
              })
            )
          );
        } else {
          setEmptyList(true);
        }
    } catch (error) {
      const response = await axios
      .get(
        "https://" +
          currentDomain +
          "/api/method/slnee_app.api.get_list_data?doctype=" +
          listname +
          '&fields=["name"]'
      )
      
        if (response.data.message.length > 0) {
          setHeaders(["Name"]);
          setRows(response.data.message);
        } else {
          setEmptyList(true);
        }
      
    }
    
    // axios
    //   .get(
    //     `https://${currentDomain}/api/method/slnee_app.api.list_settings?doctype=${listname}`
    //   )
    //   .then((response) => {
    //     const data = response.data.message;

    //     setSettings(data);
    //     const conf = JSON.stringify(
    //       data
    //         .filter(function (item) {
    //           return item.fieldname !== "status_field";
    //         })
    //         .map((item) => {
    //           if (item.fieldname !== "status_field") {
    //             return item.fieldname;
    //           }
    //         })
    //     );
    //     const titles = JSON.stringify(
    //       data
    //         .filter(function (item) {
    //           return item.fieldname !== "status_field";
    //         })
    //         .map((item) => {
    //           if (item.fieldname !== "status_field") {
    //             return item.label;
    //           }
    //         })
    //     );
    //     setHeaders(JSON.parse(titles));
    //     try {
    //       axios
    //         .get(
    //           "https://" +
    //             currentDomain +
    //             "/api/method/slnee_app.api.get_list_data?doctype=" +
    //             listName +
    //             "&fields=" +
    //             conf
    //         )
    //         .then((response) => {
    //           setRows(
    //             response.data.message.map((item) =>
    //               item.filter((x) => {
    //                 return x.fieldname !== "name";
    //               })
    //             )
    //           );
    //         });
    //     } catch (error) {
    //       setEmptyList(true);
    //       console.error(error);
    //     }
    //   })
    //   .catch((err) => {
    //     try {
    //       axios
    //         .get(
    //           "https://" +
    //             currentDomain +
    //             "/api/method/slnee_app.api.get_list_data?doctype=" +
    //             listName +
    //             '&fields=["name"]'
    //         )
    //         .then((response) => {
    //           if (response.data.message.length > 0) {
    //             setHeaders(["Name"]);
    //             setRows(response.data.message);
    //           } else {
    //             setEmptyList(true);
    //           }
    //         });
    //     } catch (error) {
    //       console.error(error);
    //     }
    //     console.error(err);
    //   });
  };
  const calculateWidth = () => {
    if (settings.length <= 4) {
      setTableWidth(windowWidth * 1);
    } else if (settings.length > 4) {
      setTableWidth(windowWidth * 1.5);
    }
  };

  const getHomeData = async () => {
    try {
      const res1 = await axios.get(
        `https://${currentDomain}/api/method/slnee_app.api.get_workspace?page=${module}`
      );

      //  const res = await axios.get("https://"+currentDomain+"/api/method/frappe.desk.desktop.get_desktop_page?page={\"name\":\"Home\",\"title\":\"Home\"}" );

      setCards(res1.data.message.cards.items.map((item) => item));

      setShortcuts(
        res1.data.message.shortcuts.items.map((item) => {
          return { label: item.label, link_to: item.link_to, type: item.type };
        })
      );
      setCharts(res1.data.message.charts.items.map((item) => item));
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    
    setShortcuts([]);
    setCards([]);
    setCharts([]);
    getHomeData();
    setTimeout(()=>{navigation.navigate('Main')},1500)
  
      return () =>
       
        BackHandler.removeEventListener("hardwareBackPress", backActionHandler);
    
   
  }, [module, refresh]);

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
        SafeAreaView
        style={{
          flex: 1,
          height: windowHeight,
          backgroundColor: "white",
          width: windowWidth,
          paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
          alignItems: "center",
          justifyContent: "center",
        }}
        onLayout={onLayoutRootView}
      >
        <Modal
          animationType="slide"
          // style={{width: windowWidth, height: windowHeight, backgroundColor: 'white'}}
          transparent={true}
          visible={listModal}
          onRequestClose={() => {
            setListModal(!listModal);
          }}
        >
          <View
            style={{
              height: windowHeight,
              width: windowWidth,
              alignItems: "center",
              justifyContent: "flex-start",
              backgroundColor: "white",
              position: "relative",
            }}
          >
            <TouchableOpacity
              onPress={() => {
                setListModal(false);
              }}
              style={{
                position: "absolute",
                top: StatusBar.currentHeight + 25,
                borderRadius: 50,
                right: 10,
                backgroundColor: "lightgray",
                width: 30,
                height: 30,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Text style={{ fontWeight: "700" }}>X</Text>
            </TouchableOpacity>
            <View style={{marginTop: 25}} >
                    <Text
                      style={{
                        fontSize: 22.5,
                        fontWeight: "400",
                        color: "#505050",
                        marginVertical: 30,
                        marginHorizontal: 10,
                      }}
                    >
                      {listName}
                    </Text>
                  </View>

         
                   <DataTable>
      <DataTable.Header style={{width: windowWidth}} >
        {headers.map((f,i)=>
        <DataTable.Title style={{textAlign: 'center'}} key={i}>{f}</DataTable.Title>
        
        )}
      
      </DataTable.Header>
      <ScrollView>

      {rows.map((row, i) => (
     
                    <DataTable.Row onPress={() => {
                      setInfotitles(workOrderFields)
                      setInfoData(row)
                      setInfostate(!infostate)
                    }} style={{width: windowWidth, flex: 1}}  key={i}>
                      {row.map((item, j) => {
                        return (
                          <DataTable.Cell key={j} style={{display:'flex'}} >{item.value}</DataTable.Cell>
                        );
                      })}
                      </DataTable.Row>
                  ))}

      </ScrollView>
 

     
    </DataTable>
          {/* <View
            style={{
              height: windowHeight,
              width: windowWidth,
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "white",
              position: "relative",
            }}
          >
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
                        marginVertical: 30,
                        marginHorizontal: 10,
                      }}
                    >
                      {listName}
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

            <TouchableOpacity
              onPress={() => {
                setListModal(false);
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
          </View> */}
           </View>
        </Modal>
        <View
          style={{
            width: windowWidth,
            height: 75,
            backgroundColor: "white",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",

            zIndex: 999,
          }}
        >
          <View>
            <Text
              style={{
                marginLeft: 10,
                color: "#C4401E",
                fontSize: 30,
                fontFamily: 'Merry',
                fontWeight: "400",
              }}
            >
              {companyName.length > 6 && companyName.substring(0,8)}
              {companyName.length <= 6 && companyName}
            </Text>
          </View>
          <View>
            <TouchableOpacity
              onPress={() => {
                navigation.toggleDrawer();
              }}
              style={{ marginRight: 10 }}
            >
              <Image
                style={{
                  width: 30,
                  height: 30,
                  resizeMode: "cover",
                  tintColor: "#C4401E",
                }}
                source={require("../assets/user0.png")}
              />
            </TouchableOpacity>
          </View>
        </View>
        <ScrollView
          contentContainerStyle={{
            justifyContent: "center",
            alignItems: "center",
          }}
          showsVerticalScrollIndicator={false}
          style={{
            width: "100%",
            height: "100%",
            paddingVertical: 25,
            paddingBottom: 25,
          }}
          refreshControl={
            <RefreshControl refreshing={refresh} onRefresh={pullMe} />
          }
        >
          <View
            style={{
              width: windowWidth,

              marginBottom: 10,
            }}
          >
            <View style={{ alignItems: "center", justifyContent: "center" }}>
            {/* <Button icon="camera" mode="contained" onPress={() => {
              clearAsync()
              console.log('cleared')
              }}>
    Press me
  </Button> */}
              {shortcuts.length > 0 && (
                <View>
                  <Text
                    style={{
                      fontSize: 25,
                      fontWeight: "400",

                      color: "#C4401E",
                      marginVertical: 15,
                      marginHorizontal: 10,
                    }}
                  >
                    {lang === "Arabic" ? "الاختصارات" : "Your Shortcuts"}
                  </Text>
                </View>
              )}
              <View
                style={{
                  flexDirection: "row",
                  flexWrap: "wrap",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {shortcuts.length > 0 &&
                  shortcuts.map((shortcut, index) => (
                    <View
                      key={index}
                      style={{ marginHorizontal: 10, marginVertical: 10 }}
                    >
                      <Button
                        mode="outlined"
                        textColor="#7A868C"
                        style={{ width: "100%", padding: 0, borderColor: "#7A868C" }}
                        onPress={async() => {
                          setListName(shortcut.link_to)
                          
                          if (shortcut.type === "Report") {
                            // navigation.navigate("Report");
                          } else if (shortcut.type === "DocType") {
                            calculateWidth();
                            getListData(shortcut.link_to);
                            setListModal(!listModal);
                          } else {
                            navigation.navigate("Main");
                          }
                        }}
                      >
                        {shortcut.label}
                      </Button>
                    </View>
                  ))}
              </View>
            </View>
            <View style={{ alignItems: "center", justifyContent: "center" }}>
              {charts.length > 0 && (
                <View>
                  <Text
                    style={{
                      fontSize: 25,
                      fontWeight: "400",
                      color: "#C4401E",
                      marginVertical: 15,
                      marginHorizontal: 10,
                    }}
                  >
                    {lang === "Arabic" ? "الرسوم البيانية" : "Your Charts"}
                  </Text>
                </View>
              )}

              {charts.map((chart, index) => {
                const fill = "rgb(250,152,132)";

                if (chart.type === "Line") {
                  const data = chart.data.datasets[0].values;
                  const moy = ArrayAvg(data);
                  return (
                    <View
                      key={index}
                      style={{
                        alignItems: "center",
                        justifyContent: "center",
                        width: windowWidth,
                      }}
                    >
                      <View
                        style={{
                          alignItems: "center",
                          justifyContent: "center",
                          width: "100%",
                        }}
                      >
                        <Text
                          style={{
                            fontSize: 14,
                            fontWeight: "400",
                            color: "#505050",
                            marginVertical: 10,
                            marginHorizontal: 20,
                          }}
                        >
                          {chart.chart_name}
                        </Text>
                      </View>
                      <View style={{ height: 300, flexDirection: "column" }}>
                        <View style={{ height: 250, flexDirection: "row" }}>
                          {moy >= 1000 && moy < 1000000 && (
                            <YAxis
                              data={data}
                              contentInset={{ top: 20, bottom: 20 }}
                              svg={{
                                fill: "grey",
                                fontSize: 12,
                              }}
                              numberOfTicks={10}
                              formatLabel={(value) => `${value / 1000}ºK`}
                            />
                          )}
                          {moy > 1000000 && (
                            <YAxis
                              data={data}
                              contentInset={{ top: 20, bottom: 20 }}
                              svg={{
                                fill: "grey",
                                fontSize: 12,
                              }}
                              numberOfTicks={10}
                              formatLabel={(value) => `${value / 1000000}ºM`}
                            />
                          )}
                          {moy < 1000 && (
                            <YAxis
                              data={data}
                              contentInset={{ top: 20, bottom: 20 }}
                              svg={{
                                fill: "grey",
                                fontSize: 10,
                              }}
                              numberOfTicks={10}
                              formatLabel={(value) => `${value}`}
                            />
                          )}

                          <LineChart
                            style={{ height: 250, width: windowWidth * 0.85 }}
                            data={data}
                            svg={{ stroke: "rgb(250,152,132)" }}
                            contentInset={{ top: 20, bottom: 20 }}
                          >
                            <Grid />
                          </LineChart>
                        </View>
                        <XAxis
                          style={{ marginLeft: 20 }}
                          data={[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]}
                          formatLabel={(value, index) => index + 1}
                          contentInset={{ left: 10, right: 10 }}
                          svg={{ fontSize: 10, fill: "grey" }}
                        />
                      </View>
                    </View>
                  );
                } else if (chart.type === "Bar") {
                  if (chart.data !== null) {
                    const barData = chart.data.datasets.map((b) => b.values[0]);
                    const moyBar = ArrayAvg(barData);
                    const x = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
                    return (
                      <View
                        key={index}
                        style={{
                          alignItems: "center",
                          justifyContent: "center",
                          width: windowWidth,
                        }}
                      >
                        <View
                          style={{
                            alignItems: "center",
                            justifyContent: "center",
                            width: "100%",
                          }}
                        >
                          <Text
                            style={{
                              fontSize: 14,
                              fontWeight: "400",
                              color: "#505050",
                              marginVertical: 10,
                              marginHorizontal: 20,
                            }}
                          >
                            {chart.chart_name}
                          </Text>
                        </View>
                        <View style={{ height: 250, flexDirection: "row" }}>
                          {moyBar >= 1000 && moyBar < 1000000 && (
                            <YAxis
                              data={barData}
                              contentInset={{ top: 20, bottom: 20 }}
                              svg={{
                                fill: "grey",
                                fontSize: 12,
                              }}
                              numberOfTicks={10}
                              formatLabel={(value) => `${value / 1000}ºK`}
                            />
                          )}
                          {moyBar > 1000000 && (
                            <YAxis
                              data={barData}
                              contentInset={{ top: 20, bottom: 20 }}
                              svg={{
                                fill: "grey",
                                fontSize: 12,
                              }}
                              numberOfTicks={10}
                              formatLabel={(value) => `${value / 1000000}ºM`}
                            />
                          )}
                          {moyBar < 1000 && (
                            <YAxis
                              data={barData}
                              contentInset={{ top: 20, bottom: 20 }}
                              svg={{
                                fill: "grey",
                                fontSize: 10,
                              }}
                              numberOfTicks={10}
                              formatLabel={(value) => `${value}`}
                            />
                          )}
                          <View style={{ height: 250, flexDirection: "row" }}>
                            <BarChart
                              style={{ height: 250, width: windowWidth * 0.85 }}
                              data={barData}
                              svg={{ fill }}
                              contentInset={{ top: 20, bottom: 20 }}
                            >
                              <Grid />
                            </BarChart>
                          </View>
                        </View>
                      </View>
                    );
                  }
                }

                // return (
                //   <View
                //   key={index}
                //     style={{
                //       alignItems: "center",
                //       justifyContent: "center",
                //       width: "100%",
                //     }}
                //   >
                //     <Text
                //       style={{
                //         fontSize: 14,
                //         fontWeight: "400",
                //         color: "#505050",
                //         marginVertical: 10,
                //         marginHorizontal: 20,
                //       }}
                //     >
                //       {chart.chart_name}
                //     </Text>

                {
                  /* {chart.type === "Line" && (
                        <View style={{ height: 300, flexDirection: "column" }}>
                          <View style={{ height: 250, flexDirection: "row" }}>
                            {moy >= 1000 && moy < 1000000 && (
                              <YAxis
                                data={data}
                                contentInset={{ top: 20, bottom: 20 }}
                                svg={{
                                  fill: "grey",
                                  fontSize: 12,
                                }}
                                numberOfTicks={10}
                                formatLabel={(value) => `${value / 1000}ºK`}
                              />
                            )}
                            {moy > 1000000 && (
                              <YAxis
                                data={data}
                                contentInset={{ top: 20, bottom: 20 }}
                                svg={{
                                  fill: "grey",
                                  fontSize: 12,
                                }}
                                numberOfTicks={10}
                                formatLabel={(value) => `${value / 1000000}ºM`}
                              />
                            )}
                            {moy < 1000 && (
                              <YAxis
                                data={data}
                                contentInset={{ top: 20, bottom: 20 }}
                                svg={{
                                  fill: "grey",
                                  fontSize: 10,
                                }}
                                numberOfTicks={10}
                                formatLabel={(value) => `${value}`}
                              />
                            )}

                            <LineChart
                              style={{ height: 250, width: windowWidth * 0.85 }}
                              data={data}
                              svg={{ stroke: "rgb(250,152,132)" }}
                              contentInset={{ top: 20, bottom: 20 }}
                            >
                              <Grid />
                            </LineChart>
                          </View>
                          <XAxis
                            style={{ marginLeft: 20 }}
                            data={x}
                            formatLabel={(value, index) => index + 1}
                            contentInset={{ left: 10, right: 10 }}
                            svg={{ fontSize: 10, fill: "grey" }}
                          />
                        </View>
                      )} */
                }

                {
                  /* {chart.type === "Bar" && (
                        <View style={{ height: 250, flexDirection: "row" }}>
                          {moyBar >= 1000 && moyBar < 1000000 && (
                            <YAxis
                              data={barData}
                              contentInset={{ top: 20, bottom: 20 }}
                              svg={{
                                fill: "grey",
                                fontSize: 12,
                              }}
                              numberOfTicks={10}
                              formatLabel={(value) => `${value / 1000}ºK`}
                            />
                          )}
                          {moyBar > 1000000 && (
                            <YAxis
                              data={barData}
                              contentInset={{ top: 20, bottom: 20 }}
                              svg={{
                                fill: "grey",
                                fontSize: 12,
                              }}
                              numberOfTicks={10}
                              formatLabel={(value) => `${value / 1000000}ºM`}
                            />
                          )}
                          {moyBar < 1000 && (
                            <YAxis
                              data={barData}
                              contentInset={{ top: 20, bottom: 20 }}
                              svg={{
                                fill: "grey",
                                fontSize: 10,
                              }}
                              numberOfTicks={10}
                              formatLabel={(value) => `${value}`}
                            />
                          )}
                          <View style={{ height: 250, flexDirection: "row" }}>
                            <BarChart
                              style={{ height: 250, width: windowWidth * 0.85 }}
                              data={barData}
                              svg={{ fill }}
                              contentInset={{ top: 20, bottom: 20 }}
                            >
                              <Grid />
                            </BarChart>
                          </View>
                        </View>
                      )} */
                }
                //   </View>
                // );
              })}
            </View>
          </View>
          <View
            style={{
              alignItems: "center",
              justifyContent: "center",
              marginBottom: 25,
            }}
          >
            {cards.length > 0 && (
              <View>
                <Text
                  style={{
                    fontSize: 25,
                    fontWeight: "400",

                    color: "#C4401E",
                    marginVertical: 15,
                    marginHorizontal: 10,
                  }}
                >
                  {lang === "Arabic" ? "التقارير" : "Reports & Masters"}
                </Text>
              </View>
            )}
            <View>
              {cards.length > 0 &&
                cards.map((card, index) => {
                  return (
                    <View key={index}>
                      <View
                        style={{
                          alignItems: "center",
                          justifyContent: "flex-start",
                          flexDirection: "row",
                          marginLeft: 15,
                        }}
                      >
                        <Image
                          source={require("../assets/Menu.png")}
                          style={{
                            width: 25,
                            height: 25,
                            resizeMode: "contain",
                            tintColor: "#C4401E",
                          }}
                        />
                        <Text
                          style={{
                            fontSize: 20,
                            fontWeight: "400",

                            color: "#C4401E",
                            marginVertical: 10,
                            marginLeft: 10,
                          }}
                        >
                          {card.label}
                        </Text>
                      </View>

                      <View
                        style={{
                          flexDirection: "row",
                          flexWrap: "wrap",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        {card.links.map((link, index) => {
                          return (
                            <View
                              key={index}
                              style={{
                                marginHorizontal: 10,
                                marginVertical: 10,
                              }}
                            >
                              <Button
                                // icon="camera"
                                style={{ width: "100%", borderColor: '#7A868C' }}
                                mode="outlined"
                                textColor="#7A868C"
                                
                                onPress={async () => {
                                  setListName(link.link_to)
                                  calculateWidth();
                                  getListData(link.link_to);
                                  setListModal(!listModal);
                                }}
                              >
                                {link.label}
                              </Button>
                            </View>
                          );
                        })}
                      </View>
                    </View>
                  );
                })}
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  } else {
    navigation.navigate("Login");
  }
};

export default HomeScreen;
