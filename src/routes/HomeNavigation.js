import { View, StyleSheet  } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs" ; 
import Home from "../screens/Home";
import Notifications from "../screens/Notifications";
import HomeTabBar from "../components/Cards/HomeTabBar";
import {  useState } from "react";

import AccountStack from "./AccountStack";
import ReelsRoute from "./ReelsRoute";
const Tab = createBottomTabNavigator();

export default function HomeNavigation({ navigation , notificationsState }) {

    
    const [activePage, setActivePage] = useState("Home");
   

    return (
        <View style={StyleSheet.absoluteFill}>
            <Tab.Navigator
                screenOptions={{
                    headerShown: false,
                    tabBarStyle: {
                        display: "none"
                    }
                }}
                initialRouteName={"Home"}
            >
                <Tab.Screen name="Home" component={Home} listeners={{
                    focus: (e) => {
                        setActivePage("Home")
                    }
                }} />
                <Tab.Screen name="Reels" component={ReelsRoute} listeners={{
                    focus: (e) => {
                        setActivePage("Reels")
                    }
                }} />
                <Tab.Screen name="Notifications" component={Notifications} listeners={{
                    focus: (e) => {
                        setActivePage("Notifications")
                    }
                }} />
                <Tab.Screen name="AccountStack" component={AccountStack} listeners={{
                    focus: (e) => {
                        setActivePage("AccountStack")
                    }
                }} />

            </Tab.Navigator>
            
            <HomeTabBar navigation={navigation} activePage={activePage}  />
            
           
        </View>
    )

}

