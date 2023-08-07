import {
  View,
  StyleSheet,
  TouchableOpacity,
  Pressable,
  Dimensions,
  SafeAreaView,
  Text,
  ImageBackground,
} from "react-native";
import React, { useCallback } from "react";
import { DrawerContentScrollView, DrawerItem } from "@react-navigation/drawer";
import * as SplashScreen from "expo-splash-screen";
import { Image } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { useFonts } from "expo-font";

import { logout } from "../../redux/userSlice";
import { deleteModule, saveModule } from "../../redux/moduleSlice";
import { Platform } from "react-native";
import { StatusBar } from "react-native";
import { Button, Divider } from "react-native-paper";
import { deleteList } from "../../redux/listSlice";
import { deleteMenu } from "../../redux/menuSlice";
import axios from "axios";

SplashScreen.preventAutoHideAsync();

const DrawerBody = (props) => {
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.user.currentUser);
  console.log(currentUser);
  const currentDomain = useSelector((state) => state.domain.value);
  const currentMenus = useSelector((state) => state.menu.List);
  const windowWidth = Dimensions.get("window").width;
  const windowHeight = Dimensions.get("window").height;
  const handleLogOut = async () => {
    try {
      const res = await axios.get(
        "https://" + currentDomain + "/api/method/logout"
      );
      props.navigation.navigate("Login");
      dispatch(logout());
    } catch (error) {
      console.log(error);
    }
  };

  const [fontsLoaded] = useFonts({
    Mynerve: require("../../assets/Fonts/MaShanZheng.ttf"),
    Merry: require("../../assets/Fonts/MerriweatherLight.ttf"),
    Grand: require("../../assets/Fonts/JustMeAgainDownHere.ttf"),
  });

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  } else if (currentMenus) {
    return (
      <SafeAreaView
        SafeAreaView
        style={{
          height: windowHeight,
          alignItems: "flex-start",
          justifyContent: "center",
          paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
        }}
        onLayout={onLayoutRootView}
      >
        <ImageBackground
          resizeMode="cover"
          style={{ width: "100%", height: "100%" }}
          source={require("../../assets/gradient.png")}
        >
          <View style={{ flex: 1 }}>
            <DrawerContentScrollView
              showsVerticalScrollIndicator={false}
              {...props}
            >
              <View style={{ position: "relative", paddingBottom:30 }}>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "center",
                    alignItems: "center",
                    width: "100%",
                    marginBottom: 30,
                    gap: 15,
                  }}
                >
                  <View>
                    <Image
                      style={{
                        resizeMode: "contain",
                        width: 65,
                        height: 65,
                        borderRadius: 50,
                      }}
                      source={require("../../assets/man.png")}
                    />
                  </View>

                  <View
                    style={{
                      alignItems: "cneter",
                      justifyContent: "center",
                      gap: 10,
                    }}
                  >
                    <View>
                      <Text
                        style={{
                          color: "white",
                          fontFamily: "Merry",
                          fontSize: 20,
                        }}
                      >
                        {currentUser ? currentUser.full_name : "User"}
                      </Text>
                    </View>
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 10,
                      }}
                    >
                      <View>
                        <TouchableOpacity
                          onPress={() => {
                            props.navigation.navigate("Profile");
                          }}
                          style={{
                            width: 90,
                            height: 30,
                            backgroundColor: "#E6C0C0C0",
                            borderRadius: 20,
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <Text
                            style={{
                              color: "white",
                              fontFamily: "Merry",
                              fontSize: 14,
                            }}
                          >
                            Edit Profile
                          </Text>
                        </TouchableOpacity>
                      </View>
                      <View
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: 5,
                        }}
                      >
                        <Text
                          style={{
                            color: "white",
                            fontFamily: "Merry",
                            fontSize: 14,
                          }}
                        >
                          Log out
                        </Text>
                        <TouchableOpacity
                          onPress={handleLogOut}
                          style={{
                            width: 30,
                            height: 30,
                            backgroundColor: "#E6C0C0C0",
                            borderRadius: 20,
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <Image source={require("../../assets/Vector0.png")} />
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                </View>

                <View>
                  <Divider theme={{ colors: { primary: "white" } }} />
                </View>
                {currentMenus.map((menu) => (
                  <DrawerItem
                    style={{ width: "100%" }}
                    key={menu}
                    icon={() => {
                      switch (menu) {
                        case "Home":
                          return (
                            <Image
                              source={require("../../assets/Home.png")}
                              style={{
                                width: 30,
                                height: 30,
                                tintColor: "#fff",
                                resizeMode: "contain",
                                marginLeft: 20,
                              }}
                            />
                          );
                        case "Accounting":
                          return (
                            <Image
                              source={require("../../assets/Accounting.png")}
                              style={{
                                width: 30,
                                height: 30,
                                tintColor: "#fff",
                                resizeMode: "contain",
                                marginLeft: 20,
                              }}
                            />
                          );
                        case "Assets":
                          return (
                            <Image
                              source={require("../../assets/Assets.png")}
                              style={{
                                width: 30,
                                height: 30,
                                tintColor: "#fff",
                                resizeMode: "contain",
                                marginLeft: 20,
                              }}
                            />
                          );
                        case "Build":
                          return (
                            <Image
                              source={require("../../assets/Build.png")}
                              style={{
                                width: 30,
                                height: 30,
                                tintColor: "#fff",
                                resizeMode: "contain",
                                marginLeft: 20,
                              }}
                            />
                          );
                        case "Buying":
                          return (
                            <Image
                              source={require("../../assets/Buying.png")}
                              style={{
                                width: 30,
                                height: 30,
                                tintColor: "#fff",
                                resizeMode: "contain",
                                marginLeft: 20,
                              }}
                            />
                          );
                        case "CRM":
                          return (
                            <Image
                              source={require("../../assets/CRM.png")}
                              style={{
                                width: 30,
                                height: 30,
                                tintColor: "#fff",
                                resizeMode: "contain",
                                marginLeft: 20,
                              }}
                            />
                          );
                        case "Customization":
                          return (
                            <Image
                              source={require("../../assets/Customization.png")}
                              style={{
                                width: 30,
                                height: 30,
                                tintColor: "#fff",
                                resizeMode: "contain",
                                marginLeft: 20,
                              }}
                            />
                          );
                        case "Employee Lifecycle":
                          return (
                            <Image
                              source={require("../../assets/EmployeeLifecycle.png")}
                              style={{
                                width: 30,
                                height: 30,
                                tintColor: "#fff",
                                resizeMode: "contain",
                                marginLeft: 20,
                              }}
                            />
                          );
                        case "ERPNext Integrations":
                          return (
                            <Image
                              source={require("../../assets/ERPNextIntegrations.png")}
                              style={{
                                width: 30,
                                height: 30,
                                tintColor: "#fff",
                                resizeMode: "contain",
                                marginLeft: 20,
                              }}
                            />
                          );
                        case "ERPNext Settings":
                          return (
                            <Image
                              source={require("../../assets/ERPNextSettings.png")}
                              style={{
                                width: 30,
                                height: 30,
                                tintColor: "#fff",
                                resizeMode: "contain",
                                marginLeft: 20,
                              }}
                            />
                          );
                        case "Expense Claims":
                          return (
                            <Image
                              source={require("../../assets/ExpenseClaims.png")}
                              style={{
                                width: 30,
                                height: 30,
                                tintColor: "#fff",
                                resizeMode: "contain",
                                marginLeft: 20,
                              }}
                            />
                          );
                        case "HR":
                          return (
                            <Image
                              source={require("../../assets/HR.png")}
                              style={{
                                width: 30,
                                height: 30,
                                tintColor: "#fff",
                                resizeMode: "contain",
                                marginLeft: 20,
                              }}
                            />
                          );
                        case "Integrations":
                          return (
                            <Image
                              source={require("../../assets/Integrations.png")}
                              style={{
                                width: 30,
                                height: 30,
                                tintColor: "#fff",
                                resizeMode: "contain",
                                marginLeft: 20,
                              }}
                            />
                          );
                        case "Manufacturing":
                          return (
                            <Image
                              source={require("../../assets/Manufacturing.png")}
                              style={{
                                width: 30,
                                height: 30,
                                tintColor: "#fff",
                                resizeMode: "contain",
                                marginLeft: 20,
                              }}
                            />
                          );
                        case "Projects":
                          return (
                            <Image
                              source={require("../../assets/Projects.png")}
                              style={{
                                width: 30,
                                height: 30,
                                tintColor: "#fff",
                                resizeMode: "contain",
                                marginLeft: 20,
                              }}
                            />
                          );
                        case "Quality":
                          return (
                            <Image
                              source={require("../../assets/Quality.png")}
                              style={{
                                width: 30,
                                height: 30,
                                tintColor: "#fff",
                                resizeMode: "contain",
                                marginLeft: 20,
                              }}
                            />
                          );
                        case "Loans":
                          return (
                            <Image
                              source={require("../../assets/Loans.png")}
                              style={{
                                width: 30,
                                height: 30,
                                tintColor: "#fff",
                                resizeMode: "contain",
                                marginLeft: 20,
                              }}
                            />
                          );
                        case "Leaves":
                          return (
                            <Image
                              source={require("../../assets/Leaves.png")}
                              style={{
                                width: 30,
                                height: 30,
                                tintColor: "#fff",
                                resizeMode: "contain",
                                marginLeft: 20,
                              }}
                            />
                          );
                        case "Menu":
                          return (
                            <Image
                              source={require("../../assets/Menu.png")}
                              style={{
                                width: 30,
                                height: 30,
                                tintColor: "#fff",
                                resizeMode: "contain",
                                marginLeft: 20,
                              }}
                            />
                          );
                        case "Payroll":
                          return (
                            <Image
                              source={require("../../assets/Payroll.png")}
                              style={{
                                width: 30,
                                height: 30,
                                tintColor: "#fff",
                                resizeMode: "contain",
                                marginLeft: 20,
                              }}
                            />
                          );
                        case "Performance":
                          return (
                            <Image
                              source={require("../../assets/Performance.png")}
                              style={{
                                width: 30,
                                height: 30,
                                tintColor: "#fff",
                                resizeMode: "contain",
                                marginLeft: 20,
                              }}
                            />
                          );
                        case "Recruitment":
                          return (
                            <Image
                              source={require("../../assets/Recruitment.png")}
                              style={{
                                width: 30,
                                height: 30,
                                tintColor: "#fff",
                                resizeMode: "contain",
                                marginLeft: 20,
                              }}
                            />
                          );
                        case "Retail":
                          return (
                            <Image
                              source={require("../../assets/Retail.png")}
                              style={{
                                width: 30,
                                height: 30,
                                tintColor: "#fff",
                                resizeMode: "contain",
                                marginLeft: 20,
                              }}
                            />
                          );
                        case "Salary Payout":
                          return (
                            <Image
                              source={require("../../assets/SalaryPayout.png")}
                              style={{
                                width: 30,
                                height: 30,
                                tintColor: "#fff",
                                resizeMode: "contain",
                                marginLeft: 20,
                              }}
                            />
                          );
                        case "Selling":
                          return (
                            <Image
                              source={require("../../assets/Selling.png")}
                              style={{
                                width: 30,
                                height: 30,
                                tintColor: "#fff",
                                resizeMode: "contain",
                                marginLeft: 20,
                              }}
                            />
                          );
                        case "Shift Attendance":
                          return (
                            <Image
                              source={require("../../assets/ShiftAttendance.png")}
                              style={{
                                width: 30,
                                height: 30,
                                tintColor: "#fff",
                                resizeMode: "contain",
                                marginLeft: 20,
                              }}
                            />
                          );
                        case "Settings":
                          return (
                            <Image
                              source={require("../../assets/Settings.png")}
                              style={{
                                width: 30,
                                height: 30,
                                tintColor: "#fff",
                                resizeMode: "contain",
                                marginLeft: 20,
                              }}
                            />
                          );
                        case "Stock":
                          return (
                            <Image
                              source={require("../../assets/Stock.png")}
                              style={{
                                width: 30,
                                height: 30,
                                tintColor: "#fff",
                                resizeMode: "contain",
                                marginLeft: 20,
                              }}
                            />
                          );
                        case "Support":
                          return (
                            <Image
                              source={require("../../assets/Support.png")}
                              style={{
                                width: 30,
                                height: 30,
                                tintColor: "#fff",
                                resizeMode: "contain",
                                marginLeft: 20,
                              }}
                            />
                          );
                        case "Tools":
                          return (
                            <Image
                              source={require("../../assets/Tools.png")}
                              style={{
                                width: 30,
                                height: 30,
                                tintColor: "#fff",
                                resizeMode: "contain",
                                marginLeft: 20,
                              }}
                            />
                          );
                        case "Users":
                          return (
                            <Image
                              source={require("../../assets/Users.png")}
                              style={{
                                width: 30,
                                height: 30,
                                tintColor: "#fff",
                                resizeMode: "contain",
                                marginLeft: 20,
                              }}
                            />
                          );
                        case "Utilities":
                          return (
                            <Image
                              source={require("../../assets/Utilities.png")}
                              style={{
                                width: 30,
                                height: 30,
                                tintColor: "#fff",
                                resizeMode: "contain",
                                marginLeft: 20,
                              }}
                            />
                          );
                        case "Website":
                          return (
                            <Image
                              source={require("../../assets/Website.png")}
                              style={{
                                width: 30,
                                height: 30,
                                tintColor: "#fff",
                                resizeMode: "contain",
                                marginLeft: 20,
                              }}
                            />
                          );
                        case "Tax Benefits":
                          return (
                            <Image
                              source={require("../../assets/TaxBenefits.png")}
                              style={{
                                width: 30,
                                height: 30,
                                tintColor: "#fff",
                                resizeMode: "contain",
                                marginLeft: 20,
                              }}
                            />
                          );

                          break;

                        default:
                          return (
                            <Image
                              source={require("../../assets/Menu.png")}
                              style={{
                                width: 30,
                                height: 30,
                                tintColor: "#fff",
                                resizeMode: "contain",
                                marginLeft: 20,
                              }}
                            />
                          );
                          break;
                      }
                    }}
                    activeTintColor="#fff"
                    inactiveTintColor="#fff"
                    label={menu}
                    labelStyle={{ fontSize: 18, fontWeight: "normal" }}
                    onPress={() => {
                      dispatch(saveModule(menu));

                      if (menu === "Manufacturing") {
                        props.navigation.navigate("Manufacturing");
                      } else {
                        props.navigation.navigate("Main");
                      }
                    }}
                  />
                ))}
              </View>
            </DrawerContentScrollView>
          </View>
        </ImageBackground>
      </SafeAreaView>
    );
  } else {
    return <View></View>;
  }
};

export default DrawerBody;
const styles = StyleSheet.create({
  drawerContent: {
    flex: 1,
  },
  userInfoSection: {
    paddingLeft: 20,
  },
  title: {
    fontSize: 16,
    marginTop: 3,
    fontWeight: "bold",
  },
  caption: {
    fontSize: 14,
    lineHeight: 14,
  },
  row: {
    marginTop: 20,
    flexDirection: "row",
    alignItems: "center",
  },
  section: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 15,
  },
  paragraph: {
    fontWeight: "bold",
    marginRight: 3,
  },
  drawerSection: {
    marginTop: 15,
  },
  bottomDrawerSection: {
    marginBottom: 15,
    borderTopColor: "#f4f4f4",
    borderTopWidth: 1,
  },
  preference: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
});
