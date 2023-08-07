import {
  View,
  SafeAreaView,
  ScrollView,
  Modal,
  StyleSheet,
  Pressable,
  Dimensions,
  Alert,
  Platform,
  TouchableOpacity,
  StatusBar,
  Text,
} from "react-native";
<DataTable>
        <DataTable.Header>
          <DataTable.Title
            sortDirection='descending'
          >
            Dessert
          </DataTable.Title>
          <DataTable.Title numeric>Calories</DataTable.Title>
          <DataTable.Title numeric>Fat (g)</DataTable.Title>
        </DataTable.Header>
      </DataTable>
import { TextInput } from "react-native-paper";
import { Button } from "react-native-paper";

import Carousel from "react-native-reanimated-carousel";
import { Camera, CameraType } from "expo-camera";

import SelectDropdown from "react-native-select-dropdown";

import React, { useEffect, useState, useRef } from "react";
import { Image } from "react-native";

import axios from "axios";
import { useSelector } from "react-redux";
import PieChartWithCenteredLabels from "./components/ManufacturingScreenChart";
import { RefreshControl } from "react-native";
import { DataTable, FAB, Portal } from "react-native-paper";
import Checkbox from "expo-checkbox";

const ManufacturingScreen = () => {
  const [modalVisible, setModalVisible] = useState({
    index: null,
    state: false,
  });
  const [state, setState] = React.useState({ open: false });
  const onStateChange = ({ open }) => setState({ open });
  const [qtyToTransfer, setQtyToTransfer] = React.useState("");
  const { open } = state;
  const [itemData, setItemData] = useState({});
  const [workOrder, setWorkOrder] = useState([]);
  const [jobCard, setJobCard] = useState([]);
  const [stockEntry, setStockEntry] = useState([]);
  const [bom, setBom] = useState([]);
  const [items, setItems] = useState([]);
  const [plusMenu, setPlusMenu] = useState(false);
  const windowWidth = Dimensions.get("window").width;
  const windowHeight = Dimensions.get("window").height;

  const baseOptions = {
    vertical: false,
    width: windowWidth,
    height: windowHeight,
  };
  const cards = [
    { color: "#FF7A00", value: "Job Card" },
    { color: "#EC4899", value: "Work Order" },
    { color: "#6366F1", value: "Stock Entry" },
    { color: "#3B82F6", value: "Bill Of Materials" },
    {color: "#14B8A6", value: "items"},
  ];

  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const currentUser = useSelector((state) => state.user.currentUser);
  const currentDomain = useSelector((state) => state.domain.value);
  const appSettings = useSelector((state) => state.app.app_info);
  const module = useSelector((state) => state.module.value);
  const [refresh, setRefresh] = useState(false);
  const [itemsCount, setItemsCount] = useState(0);
  const [jobCardCount, setJobCardCount] = useState(0);
  const [workOrderCount, setWorkOrderCount] = useState(0);
  const [stockEntryCount, setStockEntryCount] = useState(0);
  const [bomCount, setBomCount] = useState(0);
  const [Warehouses, setWarehouses] = useState([]);
  const [moveState, setMoveState] = useState(false);
  const [sellState, setSellState] = useState(false);
  const [sellMenu, setSellMenu] = useState(false);
  const [infostate, setInfostate] = useState(false);
  const [allItems, setAllItems] = useState([]);
  const [scannedForSell, setScannedForSell] = useState(false);

  const getWarehouses = async () => {
    axios
      .get(
        "https://" +
          currentDomain +
          "/api/method/slnee_app.api.getWarehouses?doctype=Warehouse"
      )
      .then((response) => setWarehouses(response.data.message))
      .catch((error) => console.log(error));
  };
  const getCounts = async () => {
    axios
      .get(
        "https://" +
          currentDomain +
          "/api/method/frappe.desk.reportview.get_count?doctype=Job Card"
      )
      .then((response) => {
        setJobCardCount(response.data.message);
      })
      .catch((err) => console.log(err));

      axios
      .get(
        "https://" +
          currentDomain +
          "/api/method/frappe.desk.reportview.get_count?doctype=Item"
      )
      .then((response) => {
        setItemsCount(response.data.message);
      })
      .catch((err) => console.log(err));
    axios
      .get(
        "https://" +
          currentDomain +
          "/api/method/frappe.desk.reportview.get_count?doctype=Work Order"
      )
      .then((response) => {
        setWorkOrderCount(response.data.message);
      })
      .catch((err) => console.log(err));
    axios
      .get(
        "https://" +
          currentDomain +
          "/api/method/frappe.desk.reportview.get_count?doctype=Stock Entry"
      )
      .then((response) => {
        setStockEntryCount(response.data.message);
      })
      .catch((err) => console.log(err));
    axios
      .get(
        "https://" +
          currentDomain +
          "/api/method/frappe.desk.reportview.get_count?doctype=BOM"
      )
      .then((response) => {
        setBomCount(response.data.message);
      })
      .catch((err) => console.log(err));
  };

  const pullMe = () => {
    setRefresh(true);
    setTimeout(() => {
      setRefresh(false);
    }, 1000);
  };
const [infotitles, setInfotitles] = useState([])
const [infoData, setInfoData] = useState([])
console.log(infoData)
  const workOrderFields = [
    "Item To Manufacture",
    "Status",
    "Company",
    "Quantity",
    "BOM No",
  ];
  const jobCardFields = [
    "Operation",
    "Status",
    "Work Order",
    "Qty To Manufacture",
    "Workstation",
    "ID",
  ];
  const stockEntryFields = [
    "Type",
    "Purpose",
    "Source ",
    "Target ",
    "ID",
  ];
  const bomFields = ["ID", "Item", "Is Active", "Is Default", "Quantity"];
  const itemFields = ["Item Name", "Item Code", "Item Group"]

  const getItems = async() => {
    axios
    .get(
      "https://" +
        currentDomain +
        '/api/method/frappe.desk.reportview.get?doctype=Item&fields=["`tabItem`.`name`","`tabItem`.`owner`","`tabItem`.`creation`","`tabItem`.`modified`","`tabItem`.`modified_by`","`tabItem`.`_user_tags`","`tabItem`.`_comments`","`tabItem`.`_assign`","`tabItem`.`_liked_by`","`tabItem`.`docstatus`","`tabItem`.`idx`","`tabItem`.`item_code`","`tabItem`.`item_name`","`tabItem`.`item_group`","`tabItem`.`is_stock_item`","`tabItem`.`image`","`tabItem`.`stock_uom`","`tabItem`.`has_variants`","`tabItem`.`end_of_life`","`tabItem`.`disabled`"]'
    )
    .then((response) => {
      const d = response.data.message;

      setItems(
        d.values.map((i) => {
          return [
            {
              key: "name",
              value: i[d.keys.indexOf("name")],
            },
            {
              key: "item_code",
              value: i[d.keys.indexOf("item_code")],
            },
            {
              key: "item_group",
              value: i[d.keys.indexOf("item_group")],
            },
      
          ];
        })
      );
    })
    .catch((err) => {
      console.log(err);
    });

  }

  const getBom = async () => {
    axios
      .get(
        "https://" +
          currentDomain +
          '/api/method/frappe.desk.reportview.get?doctype=BOM&fields=["`tabBOM`.`name`","`tabBOM`.`owner`","`tabBOM`.`creation`","`tabBOM`.`modified`","`tabBOM`.`modified_by`","`tabBOM`.`_user_tags`","`tabBOM`.`_comments`","`tabBOM`.`_assign`","`tabBOM`.`_liked_by`","`tabBOM`.`docstatus`","`tabBOM`.`idx`","`tabBOM`.`item`","`tabBOM`.`is_active`","`tabBOM`.`is_default`","`tabBOM`.`operating_cost`","`tabBOM`.`raw_material_cost`","`tabBOM`.`scrap_material_cost`","`tabBOM`.`total_cost`","`tabBOM`.`has_variants`","`tabBOM`.`image`","`tabBOM`.`currency`","`tabBOM`.`quantity`"]'
      )
      .then((response) => {
        const d = response.data.message;

        setBom(
          d.values.map((i) => {
            return [
              {
                key: "name",
                value: i[d.keys.indexOf("name")],
              },
              {
                key: "item",
                value: i[d.keys.indexOf("item")],
              },
              {
                key: "is_active",
                value: i[d.keys.indexOf("is_active")],
              },
              {
                key: "is_default",
                value: i[d.keys.indexOf("is_default")],
              },

              {
                key: "quantity",
                value: i[d.keys.indexOf("quantity")],
              },
            ];
          })
        );
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const getStockEntry = async () => {
    axios
      .get(
        "https://" +
          currentDomain +
          '/api/method/frappe.desk.reportview.get?doctype=Stock+Entry&fields=["`tabStock+Entry`.`name`","`tabStock+Entry`.`owner`","`tabStock+Entry`.`creation`","`tabStock+Entry`.`modified`","`tabStock+Entry`.`modified_by`","`tabStock+Entry`.`_user_tags`","`tabStock+Entry`.`_comments`","`tabStock+Entry`.`_assign`","`tabStock+Entry`.`_liked_by`","`tabStock+Entry`.`docstatus`","`tabStock+Entry`.`idx`","`tabStock+Entry`.`stock_entry_type`","`tabStock+Entry`.`purpose`","`tabStock+Entry`.`from_warehouse`","`tabStock+Entry`.`to_warehouse`","`tabStock+Entry`.`per_transferred`","`tabStock+Entry`.`is_return`"]'
      )
      .then((response) => {
        const d = response.data.message;

        setStockEntry(
          d.values.map((i) => {
            return [
              {
                key: "stock_entry_type",
                value: i[d.keys.indexOf("stock_entry_type")],
              },
              {
                key: "purpose",
                value: i[d.keys.indexOf("purpose")],
              },
              {
                key: "from_warehouse",
                value: i[d.keys.indexOf("from_warehouse")],
              },
              {
                key: "to_warehouse",
                value: i[d.keys.indexOf("to_warehouse")],
              },

              {
                key: "name",
                value: i[d.keys.indexOf("name")],
              },
            ];
          })
        );
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const getJobCard = async () => {
    axios
      .get(
        "https://" +
          currentDomain +
          '/api/method/frappe.desk.reportview.get?doctype=Job+Card&fields=["`tabJob+Card`.`name`","`tabJob+Card`.`owner`","`tabJob+Card`.`creation`","`tabJob+Card`.`modified`","`tabJob+Card`.`modified_by`","`tabJob+Card`.`_user_tags`","`tabJob+Card`.`_comments`","`tabJob+Card`.`_assign`","`tabJob+Card`.`_liked_by`","`tabJob+Card`.`docstatus`","`tabJob+Card`.`idx`","`tabJob+Card`.`work_order`","`tabJob+Card`.`for_quantity`","`tabJob+Card`.`operation`","`tabJob+Card`.`workstation`","`tabJob+Card`.`status`"]'
      )
      .then((response) => {
        const d = response.data.message;

        setJobCard(
          d.values.map((i) => {
            return [
              {
                key: "operation",
                value: i[d.keys.indexOf("operation")],
              },
              {
                key: "status",
                value: i[d.keys.indexOf("status")],
              },
              {
                key: "work_order",
                value: i[d.keys.indexOf("work_order")],
              },

              {
                key: "for_quantity",
                value: i[d.keys.indexOf("for_quantity")],
              },
              {
                key: "workstation",
                value: i[d.keys.indexOf("workstation")],
              },
              {
                key: "name",
                value: i[d.keys.indexOf("name")],
              },
            ];
          })
        );
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const getWorkOrder = async () => {
    axios
      .get(
        "https://" +
          currentDomain +
          '/api/method/frappe.desk.reportview.get?doctype=Work Order&fields=["`tabWork+Order`.`name`","`tabWork+Order`.`owner`","`tabWork+Order`.`creation`","`tabWork+Order`.`modified`","`tabWork+Order`.`modified_by`","`tabWork+Order`.`_user_tags`","`tabWork+Order`.`_comments`","`tabWork+Order`.`_assign`","`tabWork+Order`.`_liked_by`","`tabWork+Order`.`docstatus`","`tabWork+Order`.`idx`","`tabWork+Order`.`status`","`tabWork+Order`.`production_item`","`tabWork+Order`.`image`","`tabWork+Order`.`bom_no`","`tabWork+Order`.`sales_order`","`tabWork+Order`.`qty`","`tabWork+Order`.`produced_qty`","`tabWork+Order`.`expected_delivery_date`","`tabWork+Order`.`planned_start_date`","`tabWork+Order`.`planned_end_date`","`tabWork+Order`.`_seen`"]'
      )
      .then((response) => {
        setWorkOrder(
          response.data.message.values.map((i) => {
            return [
              {
                key: "production_item",
                value: i[response.data.message.keys.indexOf("production_item")],
              },
              {
                key: "status",
                value: i[response.data.message.keys.indexOf("status")],
              },
              { key: "company", value: appSettings.app },
              {
                key: "qty",
                value: i[response.data.message.keys.indexOf("qty")],
              },
              {
                key: "bom_no",
                value: i[response.data.message.keys.indexOf("bom_no")],
              },
            ];
          })
        );
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const [type, setType] = useState(CameraType.back);
  const [source, setSource] = useState("");
  const [target, setTarget] = useState("");
  const transferItem = async () => {
    try {
      const res = await axios.post(
        "https://" +
          currentDomain +
          "/api/method/erpnext.stock.doctype.stock_entry.stock_entry_utils.make_stock_entry?item_code=" +
          itemData.item_code +
          "&source=" +
          source +
          "&target=" +
          target +
          "&qty=" +
          qtyToTransfer
      );
      Alert.alert(
        "New Item Transferred",
        `Item Name : ${itemData.item_name}\nItem Code : ${itemData.item_code}\nQuantity : ${qtyToTransfer}\nSource Warehouse : ${source}\nTarget Warehouse : ${target}`
      );
      setSource("");
      setTarget("");
      setQtyToTransfer("");
    } catch (error) {
      Alert.alert(
        "Transfer Error",
        "Please Check Your Source, Target and Quantity"
      );
      console.log(error);
    }
  };
  const getBarCodeScannerPermissions = async () => {
    const { status } = await Camera.requestCameraPermissionsAsync();
    setHasPermission(status === "granted");
  };
  const [itemsForSell, setItemsForSell] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [sellTarget, setSellTarget] = useState("");

  const SellItems = async () => {
    try {
      const res = await axios.post(
        "https://" +
          currentDomain +
          "/api/method/slnee_app.api.sellItems?Customer=" +
          sellTarget +
          "&item_codes=" +
          JSON.stringify(itemsForSell)
      );
      Alert.alert("Success", "New Sales Invoice Created");
    } catch (error) {
      Alert.alert("Error", "Please review Customer and Quantities");
      console.log(error);
    }
  };

  const getCustomers = async () => {
    try {
      const res = await axios.get(
        "https://" +
          currentDomain +
          "/api/method/frappe.desk.reportview.get?doctype=Customer"
      );
      const d = res.data.message.values.map((v) => v[0]);
      setCustomers(d);
    } catch (error) {
      console.log(error);
    }
  };
  const a = ["1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1"]
  console.log(a.includes("3"))

  useEffect(() => {
    getCustomers();
    getBarCodeScannerPermissions();
    getWarehouses();
    getCounts();
    getWorkOrder();
    getItems()
    getJobCard();
    getStockEntry();
    getBom();
  }, [module, refresh]);
  const handleScanForSell = async ({ type, data }) => {
    setScannedForSell(true); 
    Alert.alert("New BARCODE Scanned", `Data : ${data}\nType : ${type}`);
    try {
      const response = await axios
      .post(
        "https://" +
          currentDomain +
          "/api/method/slnee_app.api.getItemByBarcode?barcode=" +
          data
      )
      console.log(response.data.message)
      const isFound = allItems.some(element => {
        if (element === response.data.message.item_code) {
          return true;
        }
    
        return false;
      });
    
      if (!isFound) {
        
        setAllItems(allItems => [...allItems, response.data.message.item_code])
            const newArr = [
              ...itemsForSell,
              {
                item_code: response.data.message.item_code,
                price: response.data.message.prices.price_list_rate,
                qty: 1,

              }
            ];
            setItemsForSell(newArr);
      }
    } catch (error) {
      console.log(error);
    }

    setTimeout(() => {
      setScannedForSell(false);
  }, 3000);
 
     
 
  };
  // setScanned(false)
  const handleBarCodeScanned = async ({ type, data }) => {
    setScanned(true);
    Alert.alert("New BARCODE Scanned", `Data : ${data}\nType : ${type}`);
    axios
      .post(
        "https://" +
          currentDomain +
          "/api/method/slnee_app.api.getItemByBarcode?barcode=" +
          data
      )
      .then((response) => {
        setItemData(response.data.message);
      })
      .catch((error) => console.log(error));
  };

  if (hasPermission === null) {
    return (
      <SafeAreaView
        style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
      >
        <Text>Requesting for camera permission</Text>
      </SafeAreaView>
    );
  }
  if (hasPermission === false) {
    return (
      <SafeAreaView
        style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
      >
        <Text>No access to camera</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      style={{
        flex: 1,
        height: windowHeight,
        backgroundColor: "white",
        width: windowWidth,
        paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
      }}
    >
      <View
        style={{
          position: "absolute",
          bottom: windowHeight * 0.125,
          right: windowWidth * 0.125,
          zIndex: 999,
        }}
      >
        <Portal>
          <FAB.Group
          
            color="#C33E1C"
            fabStyle={{backgroundColor: 'white'}}
            open={open}
            icon={open ? "minus" : "plus"}
            actions={[
              {
                icon: "transfer",
                label: "Transfer Items",
                onPress: () => setPlusMenu(true),
              },
              {
                icon: "send",
                label: "Sell Items",
                onPress: () => setSellMenu(true),
              },
            ]}
            onStateChange={onStateChange}
            onPress={() => {
              if (open) {
                // do something if the speed dial is open
              }
            }}
          />
        </Portal>
      </View>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refresh} onRefresh={pullMe} />
        }
        showsVerticalScrollIndicator={false}
        style={{
          height: "100%",
          position: "relative",
          backgroundColor: "white",
        }}
      >
        <View style={{height: 150}} >
          <Carousel
            loop
            // style={{ position: "absolute", top: 0 }}
            {...baseOptions}
            withAnimation={{
              type: "spring",
              config: {
                damping: 10,
              },
            }}
            mode="parallax"
            width={windowWidth}
            height={windowWidth / 2}
            autoPlay={false}
            data={cards}
            // onSnapToItem={(index) => console.log(index)}
            scrollAnimationDuration={2000}
            renderItem={({ item, index }) => (
              <TouchableOpacity
                style={{ height: 100 }}
                activeOpacity={1}
                onPress={() => setModalVisible({ index: index, state: true })}
              >
                <View
                  style={{
                    height: "100%",
                    borderWidth: 1,
                    borderColor: item.color,
                    borderRadius: 30,
                    backgroundColor: item.color,
                    justifyContent: "center",
                  }}
                >
                  <Text
                    style={{
                      textAlign: "center",
                      fontSize: 30,
                      color: "white",
                    }}
                  >
                    {item.value}
                  </Text>
                </View>
              </TouchableOpacity>
            )}
          />
        </View>
        <View style={{ width: windowWidth, flexDirection: "column", alignItems: 'flex-start', justifyContent: 'flex-start', height: '100%', gap: 75 }}>
        <View style={{ width: windowWidth }}>
            <PieChartWithCenteredLabels
              jobCard={jobCardCount}
              workOrder={workOrderCount}
              stockEntry={stockEntryCount}
              billOfMaterials={bomCount}
              items={itemsCount}
            />
          </View>
          <View
            style={{
              width: windowWidth,
              flexDirection: "column",
              alignItems: "flex-start",
              justifyContent: "center",
              gap: 35
            }}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "flex-start",
                justifyContent: "flex-start",
                width: windowWidth / 2,
              }}
            >
              <View
                style={{
                  height: 25,
                  width: 25,
                  borderRadius: 50,
                  marginHorizontal: 15,
                  backgroundColor: "#FF7A00",
                }}
              ></View>
              <Text
                style={{ fontSize: 17, color: "#505050", fontWeight: "500" }}
              >
                Job Card
              </Text>
            </View>
            <View
              style={{
                flexDirection: "row",
                alignItems: "flex-start",
                justifyContent: "flex-start",
                width: windowWidth / 2,
              }}
            >
              <View
                style={{
                  height: 25,
                  width: 25,
                  borderRadius: 50,
                  marginHorizontal: 15,
                  backgroundColor: "#EC4899",
                }}
              ></View>
              <Text
                style={{ fontSize: 17, color: "#505050", fontWeight: "500" }}
              >
                Work Order
              </Text>
            </View>
            <View
              style={{
                flexDirection: "row",
                alignItems: "flex-start",
                justifyContent: "flex-start",
                width: windowWidth / 2,
              }}
            >
              <View
                style={{
                  height: 25,
                  width: 25,
                  borderRadius: 50,
                  marginHorizontal: 15,
                  backgroundColor: "#6366F1",
                }}
              ></View>
              <Text
                style={{ fontSize: 17, color: "#505050", fontWeight: "500" }}
              >
                Stock Entry
              </Text>
            </View>
            <View
              style={{
                flexDirection: "row",
                alignItems: "flex-start",
                justifyContent: "flex-start",
                width: windowWidth / 2,
              }}
            >
              <View
                style={{
                  height: 25,
                  width: 25,
                  borderRadius: 50,
                  marginHorizontal: 15,
                  backgroundColor: "#3B82F6",
                }}
              ></View>
              <Text
                style={{ fontSize: 17, color: "#505050", fontWeight: "500" }}
              >
                Bill Of Materials
              </Text>
            </View>
            <View
              style={{
                flexDirection: "row",
                alignItems: "flex-start",
                justifyContent: "flex-start",
                width: windowWidth / 2,
              }}
            >
              <View
                style={{
                  height: 25,
                  width: 25,
                  borderRadius: 50,
                  marginHorizontal: 15,
                  backgroundColor: "#14B8A6",
                }}
              ></View>
              <Text
                style={{ fontSize: 17, color: "#505050", fontWeight: "500" }}
              >
                Items
              </Text>
            </View>
          </View>
        
        </View>
        <View></View>

        {/* MODAL 1 */}

        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible.index === 0 && modalVisible.state === true}
          onRequestClose={() => {
            setModalVisible({ ...modalVisible, state: !modalVisible.state });
          }}
        >
          <Modal
            animationType="slide"
            transparent={true}
            visible={infostate}
            onRequestClose={() => {
              setInfostate(!infostate);
            }}
          >
            <View
              style={{
                width: windowWidth * 0.75,
                height: windowWidth * 0.75,
                backgroundColor: "#fefefe",
                borderRadius: 25,
                position: "relative",
                top: (windowHeight - windowWidth) / 2,
                bottom: (windowHeight - windowWidth) / 2,
                right: windowWidth * 0.125,
                left: windowWidth * 0.125,
                justifyContent: "space-around",
                alignItems: "center",
                flexDirection: 'row',
                margin: "auto",
              }}
            >
                <Pressable
                  onPress={() => setInfostate(!infostate)}
                  style={{
                    marginRight: 10,
                    width: 25,
                    height: 25,
                    backgroundColor: "darkgray",
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: 50,
                    position: 'absolute',
                    top: 10,
                    right: 3,
                  }}
                >
                  <Text style={{ fontSize: 16, color: "white" }}>X</Text>
                </Pressable>
                <View style={{gap: 15}} >
                  {infotitles.map((t,i)=> 
                <Text key={i} >{t} :</Text>
                  
                  )}

                </View>
                <View style={{gap: 15}} >
                {infoData.map((t,i)=> 
                <Text key={i} >{t.value}</Text>
                  
                  )}
                </View>
            </View>
          </Modal>
          <View style={styles.centeredView}>
            <View
              style={{
                height: windowHeight,
                width: windowWidth,
                alignItems: "center",
                justifyContent: "flex-start",
                backgroundColor: "#F9F5EB",
              }}
            >
              <Text style={styles.modalText}>Job Card</Text>

               <DataTable>
      <DataTable.Header style={{width: windowWidth}} >
        {jobCardFields.map((f,i)=>
        <DataTable.Title style={{textAlign: 'center'}} key={i}>{f}</DataTable.Title>
        
        )}
      
      </DataTable.Header>
      <ScrollView>

      {jobCard.map((row, i) => (
     
                    <DataTable.Row onPress={() => {
                      setInfotitles(jobCardFields)
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
              <Pressable
                style={[styles.button, styles.buttonClose]}
                onPress={() =>
                  setModalVisible({
                    ...modalVisible,
                    state: !modalVisible.state,
                  })
                }
              >
                <Text style={styles.textStyle}>X</Text>
              </Pressable>
            </View>
          </View>
        </Modal>
        {/* MODAL 2 */}

        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible.index === 1 && modalVisible.state === true}
          onRequestClose={() => {
            setModalVisible({ ...modalVisible, state: !modalVisible.state });
          }}
        >
           <Modal
            animationType="slide"
            transparent={true}
            visible={infostate}
            onRequestClose={() => {
              setInfostate(!infostate);
            }}
          >
            <View
              style={{
                width: windowWidth * 0.75,
                height: windowWidth * 0.75,
                backgroundColor: "#fefefe",
                borderRadius: 25,
                position: "relative",
                top: (windowHeight - windowWidth) / 2,
                bottom: (windowHeight - windowWidth) / 2,
                right: windowWidth * 0.125,
                left: windowWidth * 0.125,
                justifyContent: "space-around",
                alignItems: "center",
                flexDirection: 'row',
                margin: "auto",
              }}
            >
                <Pressable
                  onPress={() => setInfostate(!infostate)}
                  style={{
                    marginRight: 10,
                    width: 25,
                    height: 25,
                    backgroundColor: "darkgray",
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: 50,
                    position: 'absolute',
                    top: 10,
                    right: 3,
                  }}
                >
                  <Text style={{ fontSize: 16, color: "white" }}>X</Text>
                </Pressable>
                <View style={{gap: 15}} >
                  {infotitles.map((t,i)=> 
                <Text key={i} >{t} :</Text>
                  
                  )}

                </View>
                <View style={{gap: 15}} >
                {infoData.map((t,i)=> 
                <Text key={i} >{t.value}</Text>
                  
                  )}
                </View>
            </View>
          </Modal>
          <View style={styles.centeredView}>
            <View
              style={{
                height: windowHeight,
                width: windowWidth,
                alignItems: "center",
                justifyContent: "flex-start",
                backgroundColor: "#F9F5EB",
              }}
            >
              <Text style={styles.modalText}>Work Order</Text>
              <DataTable>
      <DataTable.Header style={{width: windowWidth}} >
        {workOrderFields.map((f,i)=>
        <DataTable.Title style={{textAlign: 'center'}} key={i}>{f}</DataTable.Title>
        
        )}
      
      </DataTable.Header>
      <ScrollView>

      {workOrder.map((row, i) => (
     
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
      {/* if (j === 2 || j ===3) {
                          return <Checkbox
                                          key={j}
                                          value={item.value === 1 ? true : false}
                                          color={"#28675a"}
                                          style={{ borderRadius: 50 }}
                                        />
                        } else {
                          <DataTable.Cell key={j} style={{display:'flex'}} >{item.value}</DataTable.Cell>
                          return 
                        } */}

     
    </DataTable>

              <Pressable
                style={[styles.button, styles.buttonClose]}
                onPress={() =>
                  setModalVisible({
                    ...modalVisible,
                    state: !modalVisible.state,
                  })
                }
              >
                <Text style={styles.textStyle}>X</Text>
              </Pressable>
            </View>
          </View>
        </Modal>

        {/* MODAL 3 */}

        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible.index === 2 && modalVisible.state === true}
          onRequestClose={() => {
            setModalVisible({ ...modalVisible, state: !modalVisible.state });
          }}
        >
           <Modal
            animationType="slide"
            transparent={true}
            visible={infostate}
            onRequestClose={() => {
              setInfostate(!infostate);
            }}
          >
            <View
              style={{
                width: windowWidth * 0.75,
                height: windowWidth * 0.75,
                backgroundColor: "#fefefe",
                borderRadius: 25,
                position: "relative",
                top: (windowHeight - windowWidth) / 2,
                bottom: (windowHeight - windowWidth) / 2,
                right: windowWidth * 0.125,
                left: windowWidth * 0.125,
                justifyContent: "space-around",
                alignItems: "center",
                flexDirection: 'row',
                margin: "auto",
              }}
            >
                <Pressable
                  onPress={() => setInfostate(!infostate)}
                  style={{
                    marginRight: 10,
                    width: 25,
                    height: 25,
                    backgroundColor: "darkgray",
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: 50,
                    position: 'absolute',
                    top: 10,
                    right: 3,
                  }}
                >
                  <Text style={{ fontSize: 16, color: "white" }}>X</Text>
                </Pressable>
                <View style={{gap: 15}} >
                  {infotitles.map((t,i)=> 
                <Text key={i} >{t} :</Text>
                  
                  )}

                </View>
                <View style={{gap: 15}} >
                {infoData.map((t,i)=> 
                <Text key={i} >{t.value}</Text>
                  
                  )}
                </View>
            </View>
          </Modal>
          <View style={styles.centeredView}>
            <View
              style={{
                height: windowHeight,
                width: windowWidth,
                alignItems: "center",
                justifyContent: "flex-start",
                backgroundColor: "#F9F5EB",
              }}
            >
              <Text style={styles.modalText}>Stock Entry</Text>

      
               <DataTable>
      <DataTable.Header style={{width: windowWidth}} >
        {stockEntryFields.map((f,i)=>
        <DataTable.Title style={{textAlign: 'center'}} key={i}>{f}</DataTable.Title>
        
        )}
      
      </DataTable.Header>
      <ScrollView>

      {stockEntry.map((row, i) => (
     
                    <DataTable.Row onPress={() => {
                      setInfotitles(stockEntryFields)
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
        
             
              <Pressable
                style={[styles.button, styles.buttonClose]}
                onPress={() =>
                  setModalVisible({
                    ...modalVisible,
                    state: !modalVisible.state,
                  })
                }
              >
                <Text style={styles.textStyle}>X</Text>
              </Pressable>
            </View>
          </View>
        </Modal>

        {/* MODAL 4 */}

        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible.index === 3 && modalVisible.state === true}
          onRequestClose={() => {
            setModalVisible({ ...modalVisible, state: !modalVisible.state });
          }}
        >
           <Modal
            animationType="slide"
            transparent={true}
            visible={infostate}
            onRequestClose={() => {
              setInfostate(!infostate);
            }}
          >
            <View
              style={{
                width: windowWidth * 0.75,
                height: windowWidth * 0.75,
                backgroundColor: "#fefefe",
                borderRadius: 25,
                position: "relative",
                top: (windowHeight - windowWidth) / 2,
                bottom: (windowHeight - windowWidth) / 2,
                right: windowWidth * 0.125,
                left: windowWidth * 0.125,
                justifyContent: "space-around",
                alignItems: "center",
                flexDirection: 'row',
                margin: "auto",
              }}
            >
                <Pressable
                  onPress={() => setInfostate(!infostate)}
                  style={{
                    marginRight: 10,
                    width: 25,
                    height: 25,
                    backgroundColor: "darkgray",
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: 50,
                    position: 'absolute',
                    top: 10,
                    right: 3,
                  }}
                >
                  <Text style={{ fontSize: 16, color: "white" }}>X</Text>
                </Pressable>
                <View style={{gap: 15}} >
                  {infotitles.map((t,i)=> 
                <Text key={i} >{t} :</Text>
                  
                  )}

                </View>
                <View style={{gap: 15}} >
                {infoData.map((t,i)=> 
                <Text key={i} >{t.value}</Text>
                  
                  )}
                </View>
            </View>
          </Modal>
          <View style={styles.centeredView}>
            <View
              style={{
                height: windowHeight,
                width: windowWidth,
                alignItems: "center",
                justifyContent: "flex-start",
                backgroundColor: "#F9F5EB",
              }}
            >
              <Text style={styles.modalText}>Bill Of Materials</Text>
              
                             <DataTable>
      <DataTable.Header style={{width: windowWidth}} >
        {bomFields.map((f,i)=>
        <DataTable.Title style={{textAlign: 'center'}} key={i}>{f}</DataTable.Title>
        
        )}
      
      </DataTable.Header>
      <ScrollView>
          

      {bom.map((row, i) => (
     
                    <DataTable.Row onPress={() => {
                      setInfotitles(bomFields)
                      setInfoData(row)
                      setInfostate(!infostate)
                    }} style={{width: windowWidth, flex: 1}}  key={i}>
                      {row.map((item, j) => {
                        return (
                          <DataTable.Cell key={j} style={{display:'flex'}} >
                            {(j === 2 || j ===3) && <Checkbox
                                          key={j}
                                          value={item.value === 1 ? true : false}
                                          color={"#28675a"}
                                          style={{ borderRadius: 50 }}
                                        />}
                                        {(j === 0 || j ===1 || j===4) && item.value}
                            
                          </DataTable.Cell>
                        );
                      })}
                      </DataTable.Row>
                  ))}

      </ScrollView>

     
    </DataTable>

              

              <Pressable
                style={[styles.button, styles.buttonClose]}
                onPress={() =>
                  setModalVisible({
                    ...modalVisible,
                    state: !modalVisible.state,
                  })
                }
              >
                <Text style={styles.textStyle}>X</Text>
              </Pressable>
            </View>
          </View>
        </Modal>

        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible.index === 4 && modalVisible.state === true}
          onRequestClose={() => {
            setModalVisible({ ...modalVisible, state: !modalVisible.state });
          }}
        >
          <Modal
            animationType="slide"
            transparent={true}
            visible={infostate}
            onRequestClose={() => {
              setInfostate(!infostate);
            }}
          >
            <View
              style={{
                width: windowWidth * 0.75,
                height: windowWidth * 0.75,
                backgroundColor: "#fefefe",
                borderRadius: 25,
                position: "relative",
                top: (windowHeight - windowWidth) / 2,
                bottom: (windowHeight - windowWidth) / 2,
                right: windowWidth * 0.125,
                left: windowWidth * 0.125,
                justifyContent: "space-around",
                alignItems: "center",
                flexDirection: 'row',
                margin: "auto",
              }}
            >
                <Pressable
                  onPress={() => setInfostate(!infostate)}
                  style={{
                    marginRight: 10,
                    width: 25,
                    height: 25,
                    backgroundColor: "darkgray",
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: 50,
                    position: 'absolute',
                    top: 10,
                    right: 3,
                  }}
                >
                  <Text style={{ fontSize: 16, color: "white" }}>X</Text>
                </Pressable>
                <View style={{gap: 15}} >
                  {infotitles.map((t,i)=> 
                <Text key={i} >{t} :</Text>
                  
                  )}

                </View>
                <View style={{gap: 15}} >
                {infoData.map((t,i)=> 
                <Text key={i} >{t.value}</Text>
                  
                  )}
                </View>
            </View>
          </Modal>
          <View style={styles.centeredView}>
            <View
              style={{
                height: windowHeight,
                width: windowWidth,
                alignItems: "center",
                justifyContent: "flex-start",
                backgroundColor: "#F9F5EB",
              }}
            >
              <Text style={styles.modalText}>items</Text>
               <DataTable>
      <DataTable.Header style={{width: windowWidth}} >
        {itemFields.map((f,i)=>
        <DataTable.Title style={{textAlign: 'center'}} key={i}>{f}</DataTable.Title>
        
        )}
      
      </DataTable.Header>
      <ScrollView>

      {items.map((row, i) => (
     
                    <DataTable.Row onPress={() => {
                      setInfotitles(itemFields)
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

              <Pressable
                style={[styles.button, styles.buttonClose]}
                onPress={() =>
                  setModalVisible({
                    ...modalVisible,
                    state: !modalVisible.state,
                  })
                }
              >
                <Text style={styles.textStyle}>X</Text>
              </Pressable>
            </View>
          </View>
        </Modal>

        {/* Modal for move action */}

        {/* Modal for sell action */}

        {/* MODAL For Plus Button */}

        <Modal
          animationType="slide"
          transparent={true}
          visible={plusMenu}
          onRequestClose={() => {
            setPlusMenu(!plusMenu);
          }}
        >
          <Modal
            animationType="slide"
            transparent={true}
            visible={moveState}
            onRequestClose={() => {
              setPlusMenu(!moveState);
            }}
          >
            <View
              style={{
                width: windowWidth * 0.75,
                height: windowWidth * 0.75,
                backgroundColor: "white",
                borderRadius: 25,
                position: "absolute",
                top: (windowHeight - windowWidth) / 2,
                bottom: (windowHeight - windowWidth) / 2,
                right: windowWidth * 0.125,
                left: windowWidth * 0.125,
                justifyContent: "space-around",
                alignItems: "center",
                margin: "auto",
              }}
            >
              <View style={{ width: "100%", alignItems: "flex-end" }}>
                <Pressable
                  onPress={() => setMoveState(!moveState)}
                  style={{
                    marginRight: 10,
                    width: 25,
                    height: 25,
                    backgroundColor: "darkgray",
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: 50,
                  }}
                >
                  <Text style={{ fontSize: 16, color: "white" }}>X</Text>
                </Pressable>
              </View>
              <View>
                <Text style={{ marginBottom: 15, fontSize: 16 }}>
                  Target Warehouse
                </Text>
              </View>
              <View>
                <SelectDropdown
                  buttonStyle={{ width: windowWidth * 0.4 }}
                  data={Warehouses}
                  onSelect={(selectedItem, index) => {
                    setTarget(selectedItem);
                  }}
                  defaultValue={"select"}
                />
              </View>

              <View>
                <TextInput
                  style={{ width: windowWidth * 0.75 - 100 }}
                  label="Quantity"
                  value={qtyToTransfer}
                  onChangeText={(text) => setQtyToTransfer(text)}
                />
              </View>
              <View>
                <Button
                  compact={true}
                  style={{
                    width: 100,
                    backgroundColor: "#C33E1C",
                  }}
                  // icon="send"
                  mode="contained"
                  onPress={() => {
                    transferItem();
                    setMoveState(false);
                  }}
                >
                  Transfer
                </Button>
              </View>
            </View>
          </Modal>
          <ScrollView
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
          >
            <View
              style={{
                height: windowHeight,
                width: windowWidth,
                alignItems: "center",
                justifyContent: "flex-start",
                backgroundColor: "white",
              }}
            >
              <View>
                <Text style={styles.modalText}> Bar Code Scanner</Text>
              </View>

              <View
                style={{
                  width: windowWidth,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Camera
                  onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
                  type={type}
                  style={{
                    height: 100,
                    width: windowWidth * 0.95,
                    marginBottom: 25,
                  }}
                />
                <Button
                  icon="camera"
                  mode="contained"
                  onPress={() => setScanned(false)}
                >
                  Scan Again
                </Button>
              </View>

              <View
                style={{
                  height: 200,
                  width: windowWidth,
                  alignItems: "center",
                  justifyContent: "flex-start",
                }}
              >
                {Object.keys(itemData).length > 0 ? (
                  <View
                    style={{
                      width: windowWidth,
                      alignItems: "center",
                      justifyContent: "center",
                      flexDirection: "column",
                    }}
                  >
                    <View
                      style={{
                        marginTop: 50,
                        alignItems: "center",
                        justifyContent: "space-around",
                        flexDirection: "row",
                        width: windowWidth,
                      }}
                    >
                      <View>
                        <Text
                          style={{
                            fontSize: 18,
                            color: "#656565",
                            marginBottom: 10,
                          }}
                        >
                          {"Item Name : " + itemData.item_name}
                        </Text>
                        <Text
                          style={{
                            fontSize: 18,
                            color: "#656565",
                            marginBottom: 10,
                          }}
                        >
                          {"Price : " + itemData.prices.price_list_rate}
                        </Text>
                      </View>

                      <View>
                        <Image
                          source={{
                            uri: "https://" + currentDomain + itemData.image,
                          }}
                          style={{
                            width: 100,
                            height: 100,
                            resizeMode: "contain",
                            borderRadius: 35,
                          }}
                        />
                      </View>
                    </View>

                    <View style={{ width: "100%" }}>
                      <View style={{ marginTop: 20 }}>
                        <View
                          style={{
                            flexDirection: "row",
                            alignItems: "center",
                            justifyContent: "space-between",
                            backgroundColor: "#C33E1C",
                            height: 50,
                            marginBottom: 20,
                          }}
                        >
                          <View
                            style={{
                              width: windowWidth / 3,
                              alignItems: "flex-start",
                              justifyContent: "center",
                              marginLeft: 20,
                            }}
                          >
                            <Text style={{ fontSize: 17, color: "#fff" }}>
                              Warehouses
                            </Text>
                          </View>
                          <View
                            style={{
                              width: windowWidth / 3,
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            <Text style={{ fontSize: 17, color: "#fff" }}>
                              Quantity
                            </Text>
                          </View>
                          <View
                            style={{
                              width: windowWidth / 3,
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            <Text style={{ fontSize: 17, color: "#fff" }}>
                              Action
                            </Text>
                          </View>
                        </View>

                        {itemData.bins.map((bin, i) => (
                          <View
                            key={i}
                            style={{
                              width: windowWidth,
                              flexDirection: "row",
                              alignItems: "center",
                              justifyContent: "space-between",
                              height: 50,
                            }}
                          >
                            <View
                              style={{
                                width: windowWidth / 3,
                                alignItems: "flex-start",
                                justifyContent: "center",
                                marginLeft: 20,
                              }}
                            >
                              <Text>{bin.warehouse}</Text>
                            </View>
                            <View
                              style={{
                                width: windowWidth / 3,
                                alignItems: "center",
                                justifyContent: "center",
                              }}
                            >
                              <Text>{bin.actual_qty}</Text>
                            </View>

                            <View
                              style={{
                                width: windowWidth / 3,
                                alignItems: "center",
                                justifyContent: "center",
                              }}
                            >
                              <Button
                                compact={true}
                                style={{
                                  width: 60,
                                  backgroundColor: "#C33E1C",
                                }}
                                // icon="send"
                                mode="contained"
                                onPress={() => {
                                  setSource(bin.warehouse);
                                  setMoveState(true);
                                }}
                              >
                                Move
                              </Button>
                            </View>
                          </View>
                        ))}
                      </View>
                    </View>
                  </View>
                ) : (
                  <Text style={{ marginTop: 20, fontSize: 18 }}>
                    Waiting For Scan .
                  </Text>
                )}
              </View>

              <Pressable
                style={[styles.button, styles.buttonClose]}
                onPress={() => setPlusMenu(!plusMenu)}
              >
                <Text style={styles.textStyle}>X</Text>
              </Pressable>
            </View>
          </ScrollView>
        </Modal>

        {/* Modal for Selling */}

        <Modal
          animationType="slide"
          transparent={true}
          visible={sellMenu}
          onRequestClose={() => {
            setPlusMenu(!sellMenu);
          }}
        >
          <Modal
            animationType="slide"
            transparent={true}
            visible={sellState}
            onRequestClose={() => {
              setSellState(!sellState);
            }}
          >
            <View
              style={{
                width: windowWidth * 0.75,
                height: windowWidth * 0.75,
                backgroundColor: "#fefefe",
                borderRadius: 25,
                position: "absolute",
                top: (windowHeight - windowWidth) / 2,
                bottom: (windowHeight - windowWidth) / 2,
                right: windowWidth * 0.125,
                left: windowWidth * 0.125,
                justifyContent: "space-around",
                alignItems: "center",
                margin: "auto",
              }}
            >
              <View style={{ width: "100%", alignItems: "flex-end" }}>
                <Pressable
                  onPress={() => setSellState(!sellState)}
                  style={{
                    marginRight: 10,
                    width: 25,
                    height: 25,
                    backgroundColor: "darkgray",
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: 50,
                  }}
                >
                  <Text style={{ fontSize: 16, color: "white" }}>X</Text>
                </Pressable>
              </View>
              <View>
                <Text style={{ marginBottom: 15, fontSize: 16 }}>
                  Select Customer
                </Text>
              </View>
              <View>
                <SelectDropdown
                  buttonStyle={{ width: windowWidth * 0.4 }}
                  data={customers}
                  onSelect={(selectedItem, index) => {
                    setSellTarget(selectedItem);
                  }}
                  defaultValue={"select"}
                />
              </View>

              <View>
                <Button
                  compact={true}
                  style={{
                    width: 100,
                    backgroundColor: "#C33E1C",
                  }}
                  // icon="send"
                  mode="contained"
                  onPress={() => {
                    SellItems();
                    setSellState(false);
                  }}
                >
                  Sell
                </Button>
              </View>
            </View>
          </Modal>
          <ScrollView
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
          >
            <View
              style={{
                height: windowHeight,
                width: windowWidth,
                alignItems: "center",
                justifyContent: "flex-start",
                backgroundColor: "white",
              }}
            >
              <View
                style={{
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 5,
                  marginTop: 30,
                  marginBottom: 30,
                }}
              >
                <Text style={{ fontSize: 18 }}> Keep Scanning Items </Text>
                <Text style={{ fontSize: 18 }}>For Multiple Sell</Text>
              </View>

              <View
                style={{
                  width: windowWidth,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Camera
                  onBarCodeScanned={scannedForSell ? undefined : handleScanForSell}
                    type={type}
                  style={{
                    height: 100,
                    width: windowWidth * 0.95,
                    marginBottom: 25,
                  }}
                />
                {/* <Button
                  icon="camera"
                  mode="contained"
                  onPress={() => setScanned(false)}
                >
                  Scan Again
                </Button> */}
              </View>

              <ScrollView
                style={{
                  height: '100%',
                  width: windowWidth,
                 
                  paddingBottom: 20,
                  marginTop: 15
                }}
                contentContainerStyle={{alignItems: "center",
                justifyContent: "flex-start"}}
              >
                {itemsForSell.length > 0 ? (
                  <View
                    style={{
                      width: windowWidth * 0.75,
                      alignItems: "center",
                      justifyContent: "center",
                      flexDirection: "column",
                    }}
                  >
                    <View style={{ width: "100%" }}>
                      <View style={{ marginTop: 20 }}>
                        <View
                          style={{
                            flexDirection: "row",
                            alignItems: "center",
                            justifyContent: "space-between",
                            backgroundColor: "#C33E1C",
                            width: windowWidth*0.75,
                            height: 50,
                            marginBottom: 20,
                          }}
                        >
                          <View
                            style={{
                              width: (windowWidth * 0.75) / 3,
                              alignItems: "center",
                              justifyContent: "center",
                              // marginLeft: 20,
                            }}
                          >
                            <Text style={{ fontSize: 17, color: "#fff" }}>
                              Name
                            </Text>
                          </View>
                          <View
                            style={{
                              width: (windowWidth * 0.75) / 3,
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            <Text style={{ fontSize: 17, color: "#fff" }}>
                              Price
                            </Text>
                          </View>
                          <View
                            style={{
                              width: (windowWidth * 0.75) / 3,
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            <Text style={{ fontSize: 17, color: "#fff" }}>
                              Quantity
                            </Text>
                          </View>
                        </View>
                        {itemsForSell.map((item, i) => (
                          <View
                            key={i}
                            style={{
                              width: windowWidth * 0.75,
                              flexDirection: "row",
                              alignItems: "center",
                              justifyContent: "space-between",
                              
                              height: 50,
                              marginBottom: 15,
                            }}
                          >
                            <View
                              style={{
                                width: (windowWidth * 0.75) / 3,
                                alignItems: "center",
                                justifyContent: "center",
                                // marginLeft: 20,
                              }}
                            >
                              <Text>{item.item_code}</Text>
                            </View>
                            <View
                              style={{
                                width: (windowWidth * 0.75) / 3,
                                alignItems: "center",
                                justifyContent: "center",
                                // marginLeft: 20,
                              }}
                            >
                              <Text>{item.price}</Text>
                            </View>
                            <View
                              style={{
                                width: (windowWidth * 0.75) / 3,
                                alignItems: "center",
                                justifyContent: "center",
                              }}
                            >
                              <TextInput
                                style={{ width: "75%" }}
                                label="Quantity"
                                value={item.qty.toString()}
                                onChangeText={(text) => {
                                  objIndex = itemsForSell.findIndex(
                                    (obj) => obj.item_code == item.item_code
                                  );
                                  let newArr = [...itemsForSell];
                                  newArr[objIndex].qty = text;
                                  setItemsForSell(newArr);
                                }}
                              />
                            </View>
                          </View>
                        ))}
                      </View>
                    </View>
                    <Button
                      compact={true}
                      style={{
                        width: 120,
                        marginBottom: 20,
                        backgroundColor: "#C33E1C",
                      }}
                      icon="send"
                      mode="contained"
                      onPress={() => {
                        setSellState(true);
                      }}
                    >
                      Sell Items
                    </Button>
                  </View>
                ) : (
                  <Text style={{ marginTop: 20, fontSize: 18 }}>
                    Waiting For Scan .
                  </Text>
                )}
              </ScrollView>

              <Pressable
                style={[styles.button, styles.buttonClose]}
                onPress={() => setSellMenu(!sellMenu)}
              >
                <Text style={styles.textStyle}>X</Text>
              </Pressable>
            </View>
          </ScrollView>
        </Modal>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ManufacturingScreen;

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    overflow: "hidden",
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  modalView: {
    margin: 20,
    height: 500,
    width: 250,
    backgroundColor: "gray",
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: "#F194FF",
  },
  buttonClose: {
    backgroundColor: "darkgray",
    borderRadius: 50,
    height: 40,
    width: 40,
    position: "absolute",
    top: 25,
    right: 5,
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 16,
  },
  modalText: {
    marginBottom: 35,
    marginTop: 35,
    textAlign: "center",
    fontSize: 22,
    color: "#505050",
  },
});
