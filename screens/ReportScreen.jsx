import { useCallback, React, useState, useEffect } from "react";



import {
  Text,
  View,
  SafeAreaView,

  TouchableOpacity,
 
  ScrollView,
  Image,
  RefreshControl,
  StatusBar
} from "react-native";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { Dimensions } from "react-native";
import { useSelector, useDispatch } from "react-redux";


import axios from "axios";




SplashScreen.preventAutoHideAsync();

const ReportScreen = ({ navigation }) => {
  const windowWidth = Dimensions.get("window").width;
  const windowHeight = Dimensions.get("window").height;

  const dispatch = useDispatch();

  const currentUser = useSelector((state) => state.user.currentUser);
  const currentDomain = useSelector((state) => state.domain.value);
  const company = useSelector((state)=>state.app.app_info.app)
  const module = useSelector((state) => state.module.value);
  const [rows, setRows] = useState([]);
  const [tableWidth, setTableWidth] = useState(windowWidth);
  const [data, setData] = useState([])
  const [headers, setHeaders] = useState([])
  const [filtersNames, setFiltersNames] = useState([])
  const reportName = useSelector((state)=> state.list.value.link_to)
  const [refresh, setRefresh] = useState(false);
  const listDetails = useSelector((state)=> state.list.value);
  const [finalStr, setFinalStr] =  useState({})
  // console.log(filtersNames)
  console.log(finalStr)

  
  


  
 

    
  
  
  

 
  
  

  

  const pullMe = () => {
    setRefresh(true);
    setTimeout(() => {
      setRefresh(false);
    }, 1000);
  };

  const getFiltersNames = async () => {

   
  
    
       axios.get ("https://"+currentDomain+"/api/method/slnee_app.api.get_report_filters?name="+reportName).then((res)=>{
         const t = res.data.message.script
         
         const d = t.substring(t.indexOf("\"filters\":"), t.indexOf("],")).replace(/frappe.defaults.get_user_default/g, '').replace(/__/g, '').replace(/\(/g, '').replace("\"filters\": ","").replace(/\)/g, '')
         const result = d.toString().slice(0, -1)+"]" 
   
         const finalResult =  eval(result)
         const reqf = finalResult.filter((f)=> f.default ).map((f)=> { return {"key": f.fieldname.toLowerCase(),"value": f.default.toLowerCase()}})
    
         
           
          setFiltersNames(reqf)

       }).catch((err) => {
        console.log(err)
       })

        // const res0 = await axios.get ("https://"+currentDomain+"/api/method/frappe.desk.query_report.run?report_name="+reportName+"&filters={\"company\":"+JSON.stringify(company)+"}")
  
       
        //   const data = res0.data.message

     
        //   setData(data)
        //   setHeaders(data.columns)
          
        //   setRows( data.result.filter((r)=> 
        //   data.columns.map((c)=>{
        //     return r[""+c.fieldname+""] 
        //   })
        // ).map((r)=> 
        //   data.columns.map((c)=>{
        //     return r[""+c.fieldname+""] 
        //   })))
        

      // const res1 = await axios.get("https://"+currentDomain+"/api/method/slnee_app.api.get_list_data?doctype="+listName+"&fields="+conf);
      

      // setRows(res1.data.message.map((item)=> item.filter((x)=> {return x.fieldname!== "name"})))
      
   
  };
  const getFilters = ()=>{
    const arr ={}
    
     filtersNames.map(async(filter)=>{
       
        
          axios.get("https://"+currentDomain+"/api/method/slnee_app.api.get_defaults?key="+filter.value).then((response)=>{
            const value = (response.data.message)
            var key = filter.key;
            // const c  = `\"`
            var obj = {};

            // obj[key] = value;
            arr[key] = value || filter.value
            // arr.push(obj);
            // return obj
            
             


          }).catch((err)=>{console.log(err)})
          
        
       
      
    })

    setFinalStr(arr)

  }
  const calculateWidth = () =>{
    if (data.length <= 4) {
     setTableWidth(windowWidth*1)
    }
    else if (data.length > 4 ) {
      setTableWidth(windowWidth*1.5)
    }
   
  }

  useEffect(() => {
    setFiltersNames([])
    setData([])
    setRows([])
    setHeaders([])
    getFiltersNames()
    getFilters()
    calculateWidth()
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
        <SafeAreaView SafeAreaView style={{ width: "100%", height: "100%", alignItems: "center", justifyContent:"center"}} onLayout={onLayoutRootView} >
  
         
  
  
  
  
          {/* <TopBar navigation={navigation} /> */}
          <ScrollView
            contentContainerStyle={{
              justifyContent: "center",
              alignItems: "center",
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
                
                marginBottom: 50
                
              }}
            >
              <View
                style={{ alignItems: "flex-start", justifyContent: "flex-start" }}
              
              >
                <View>
                      <TouchableOpacity onPress={() => navigation.navigate('Main')} style={{marginLeft: 10}}  >
                          <Image style={{tintColor: "#115748",resizeMode: "contain", width: 25, height: 25}} source={require("../assets/back.png")} />
                      </TouchableOpacity>
                  </View>
                <View>
                  <Text
                    style={{
                      fontSize: 22,
                      fontWeight: "bold",
                      color: "#28675a",
                      marginVertical: 15,
                      marginHorizontal: 10,
                    }}
                  >
                    {listDetails.label}
                  </Text>
                </View>
                {/* <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} style={{width: windowWidth}} contentContainerStyle={{alignItems: "center", justifyContent: "center"}} >
                    

                    <View style={{width: tableWidth}}>
                    <View style={{paddingVertical:15, paddingHorizontal: 10 ,width:"100%", flexDirection: "row", backgroundColor: "#28675a"}} >
                      {headers.map((head,i) => {return(<View key={i} style={{flex: 1, alignItems: "center", justifyContent: "center"}} ><Text  style={{color: "white", textAlign: "center", fontFamily: "Merry"}} >{head.label}</Text></View>)} )}
                    </View>
                    

                    {rows.map((row,i)=>
                     
                        <TouchableOpacity style={{paddingVertical:15, paddingHorizontal: 10 ,width:"100%", flexDirection: "row", backgroundColor: null}} key={i} >
                          {row.map((item,j)=> 
                        <View key={j} style={{flex: 1, alignItems: "center", iustifyContent: "center"}}><Text style={{color: "black", textAlign: "center", fontFamily: "Merry"}} key={j}>{item}</Text></View>
                          
                          )}
                 </TouchableOpacity>
                    
                    )}

                    

                  </View> 
              
                  
                </ScrollView  > */}
                <View><Text>aaaaa</Text></View>
              </View>

              
              
                   
                
            </View>
          </ScrollView>

        </SafeAreaView>
      );
                  
    } 
                
  else {
    navigation.navigate("Login");
  }
};

export default ReportScreen;
