import "react-native-gesture-handler";

import registerNNPushToken from "native-notify";

import * as SplashScreen from "expo-splash-screen";
import * as Font from "expo-font";
import Entypo from "@expo/vector-icons/Entypo";
import { persistor, store } from "./redux/store.js";
import { Provider, useSelector } from "react-redux";
import DomainScreen from "./screens/DomainScreen";
import LogInScreen from "./screens/LogInScreen";
import TestScreen from "./screens/TestScreen.jsx";
import { createDrawerNavigator } from "@react-navigation/drawer";

import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import MainScreen from "./screens/MainScreen.jsx";
import ProfileScreen from "./screens/ProfileScreen.jsx";
import { PersistGate } from "redux-persist/integration/react";
import DrawerBody from "./screens/components/DrawerBody.jsx";
import { useCallback, useEffect, useState } from "react";
import ListScreen from "./screens/ListScreen.jsx";

import ReportScreen from "./screens/ReportScreen.jsx";
import ManufacturingScreen from "./screens/ManufacturingScreen.jsx";
import {
  ActivityIndicator,
  Provider as PaperProvider,
} from "react-native-paper";
import { StatusBar } from "expo-status-bar";
import { BackHandler } from "react-native";
import { Alert } from "react-native";
import Onboarding from "./screens/Onboarding.jsx";
import AsyncStorage from "@react-native-async-storage/async-storage";

SplashScreen.preventAutoHideAsync();

const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

const MainStackNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="Domain" component={DomainScreen} />
      <Stack.Screen name="Login" component={LogInScreen} />
      <Stack.Screen name="Test" component={TestScreen} />
    </Stack.Navigator>
  );
};

export default function App() {
  registerNNPushToken(7874, "crrdA1uaMv7XAFPrujbfLj");

  const [viewedOnboarding, setViewedOnboarding] = useState(false);

  const checkOnboarding = async () => {
    try {
      const value = await AsyncStorage.getItem("@viewedOnboarding");

      if (value !== null) {
        setViewedOnboarding(true);
      }
    } catch (error) {
      console.log("Error @checkOnboarding", error);
    }
  };

  const [appIsReady, setAppIsReady] = useState(false);

  useEffect(() => {
    async function prepare() {
      try {
        await Font.loadAsync(Entypo.font);

        await new Promise((resolve) => setTimeout(resolve, 2000));
      } catch (e) {
        console.warn(e);
      } finally {
        setAppIsReady(true);
      }
    }

    prepare();
    checkOnboarding();
  }, []);
  console.log(viewedOnboarding);
  const onLayoutRootView = useCallback(async () => {
    if (appIsReady) {
      await SplashScreen.hideAsync();
    }
  }, [appIsReady]);

  if (!appIsReady) {
    return null;
  }

  return (
    <Provider store={store}>
      <PaperProvider>

    
        <NavigationContainer>
          <PersistGate loading={null} persistor={persistor}>
            <StatusBar style="dark" />

            <Drawer.Navigator
              screenOptions={{ headerShown: false }}
              drawerContent={(props) => <DrawerBody {...props} />}
            >
          
              {viewedOnboarding ? (
                <Drawer.Group>
                  <Drawer.Screen
                    options={{ swipeEnabled: false }}
                    name="Auth"
                    component={MainStackNavigator}
                  />
                  <Drawer.Screen
                    name="Main"
                    component={MainScreen}
                    options={{ swipeEnabled: true }}
                  />

                  <Drawer.Screen
                    name="Profile"
                    component={ProfileScreen}
                    options={{ swipeEnabled: true }}
                  />
                  <Drawer.Screen
                    name="List"
                    component={ListScreen}
                    options={{ swipeEnabled: true }}
                  />
                  <Drawer.Screen
                    name="Report"
                    component={ReportScreen}
                    options={{ swipeEnabled: true }}
                  />
                  <Drawer.Screen
                    name="Manufacturing"
                    component={ManufacturingScreen}
                    options={{ swipeEnabled: true }}
                  />
                </Drawer.Group>
              ) : (
                <Drawer.Group>
                  <Drawer.Screen
                    name="on"
                    swipeEnabled={false}
                    component={Onboarding}
                  />
                  <Drawer.Screen
                    options={{ swipeEnabled: false }}
                    name="Auth"
                    component={MainStackNavigator}
                  />
                  <Drawer.Screen
                    name="Main"
                    component={MainScreen}
                    options={{ swipeEnabled: true }}
                  />

                  <Drawer.Screen
                    name="Profile"
                    component={ProfileScreen}
                    options={{ swipeEnabled: true }}
                  />
                  <Drawer.Screen
                    name="List"
                    component={ListScreen}
                    options={{ swipeEnabled: true }}
                  />
                  <Drawer.Screen
                    name="Report"
                    component={ReportScreen}
                    options={{ swipeEnabled: true }}
                  />
                  <Drawer.Screen
                    name="Manufacturing"
                    component={ManufacturingScreen}
                    options={{ swipeEnabled: true }}
                  />
                </Drawer.Group>
              )}
            </Drawer.Navigator>
          </PersistGate>
        </NavigationContainer>
      </PaperProvider>
    </Provider>
  );
}
