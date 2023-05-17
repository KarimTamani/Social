import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { useState } from "react";
import { View , StyleSheet } from "react-native";
import ReelsHeader from "../components/Cards/ReelsHeader";
import Reels from "../screens/Reels";


const Tab = createBottomTabNavigator();


export default function ReelsRoute({ navigation }) {

    const [activePage, setActivePage] = useState("GeneralReels");
   

    return (
        <View style={StyleSheet.absoluteFill}>
            <ReelsHeader navigation={ navigation } activePage = { activePage } />
            <Tab.Navigator

                screenOptions={{
                    headerShown: false,
                    tabBarStyle: {
                        display: "none"
                    }
                }}
                initialRouteName={"GeneralReels"}
            >

                <Tab.Screen name="GeneralReels" component={Reels}  listeners={{ 
                    focus : (e) => { 
                        setActivePage("GeneralReels")
                    }
                }} />

                <Tab.Screen name="PrivateReels" component={Reels}  listeners={{ 
                    focus : (e) => { 
                        setActivePage("PrivateReels")
                    }
                }}  />

            </Tab.Navigator>
        </View>
    )
}