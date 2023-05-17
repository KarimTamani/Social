import { View, Text, StyleSheet } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import FollowsList from "../components/Cards/notifications/FollowsList";
import LikesList from "../components/Cards/notifications/LikesList";
import ServicesList from "../components/Cards/notifications/ServicesList";
import CommentsList from "../components/Cards/notifications/CommentsList";
import NotificationsNavBar from "../components/Cards/notifications/NotificationsNavBar";
import { useContext, useState } from "react";
import darkTheme from "../design-system/darkTheme";
import ThemeContext from "../providers/ThemeContext";

const Tab = createBottomTabNavigator();

export default function NotificationsRoute({ navigation  , notificationsState }) {

    const [activePage, setActivePage] = useState("FollowsList");
    const themeContext = useContext(ThemeContext);


    
    return (
        <View style={StyleSheet.absoluteFillObject}>
            <NotificationsNavBar navigation={navigation} activePage={activePage} notificationsState = {notificationsState} />

            <Tab.Navigator
                screenOptions={{
                    headerShown: false,
                    tabBarStyle: {
                        display: "none"
                    },

                }}
                sceneContainerStyle={{
                    backgroundColor: themeContext.getTheme() == "light" ? "white" : darkTheme.backgroudColor
                }}

            >
                <Tab.Screen name="FollowsList" component={FollowsList} listeners={{
                    focus: (e) => {
                        setActivePage("FollowsList")
                    }
                }} />
                <Tab.Screen name="LikesList" component={LikesList} listeners={{
                    focus: (e) => {
                        setActivePage("LikesList")
                    }
                }} />
                <Tab.Screen name="CommentsList" component={CommentsList} listeners={{
                    focus: (e) => {
                        setActivePage("CommentsList")
                    }
                }} />
                <Tab.Screen name="ServicesList" component={ServicesList} listeners={{
                    focus: (e) => {
                        setActivePage("ServicesList")
                    }
                }} />

            </Tab.Navigator>
        </View>
    )
}