import { createStackNavigator } from "@react-navigation/stack";
import Explore from "../screens/Explore";
import Search from "../screens/Search";
import { View, Text, StyleSheet } from "react-native";
import ExploreHeader from "../components/Cards/explore/ExploreHeader";
import React, { useState } from "react";

const Stack = createStackNavigator();


export default function ExploreRoute({ navigation }) {

    const [activePage, setActivePage] = useState("Explore");

    return (
        <View style={styles.container}>


            <Stack.Navigator
                screenOptions={{
                    headerShown: false,
                    cardStyle: {
                        backgroundColor: "white"
                    }
                }}
            >
                <Stack.Screen name="Explore" component={Explore} listeners={{
                    focus: (e) => {           
                        setActivePage("Explore")
                    }
                }} />
                <Stack.Screen name="Search" component={Search} listeners={{
                    focus: (e) => {
                        setActivePage("Search")
                    }
                }}
                />

            </Stack.Navigator>
        </View>
    )
};

const styles = StyleSheet.create({
    container: {
        flex: 1
    }
})