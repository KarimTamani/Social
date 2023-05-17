import { View, Text, StyleSheet } from "react-native";

import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Header from "../components/Cards/Header";
import DealsTabBar from "../components/Cards/deals/DealsTabBar";
import PurshasesRoute from "./PurchasesRoute";
import OrdersRoute from "./OrdersRoute";
import { useContext, useState } from "react"; 

const Tab = createBottomTabNavigator();


export default function DealsRoute({ navigation }) {


    const [activePage, setActivePage] = useState("PurshasesRoute");
   

    return (
        <View style={styles.container}>
            <Header
                navigation={navigation}
            />
            <DealsTabBar
                navigation={navigation}
                activePage={activePage}
            />

            <Tab.Navigator
                screenOptions={{
                    headerShown: false,
                    tabBarStyle: {
                        display: "none"
                    }
                }}

            >
                <Tab.Screen name="PurshasesRoute" component={PurshasesRoute}
                    listeners={{
                        focus: (e) => {
                            setActivePage("PurshasesRoute")
                        }
                    }}

                />
                <Tab.Screen name="OrdersRoute" component={OrdersRoute}
                    listeners={{
                        focus: (e) => {
                            setActivePage("OrdersRoute")
                        }
                    }}

                />

            </Tab.Navigator>
        </View>
    )

};


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "white"
    }
})