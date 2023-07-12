import { View, Text, StyleSheet, Dimensions } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import ProfileNotes from "../components/Cards/profile/ProfileNotes";
import ProfileImages from "../components/Cards/profile/ProfileImages";
import ProfileVideos from "../components/Cards/profile/ProfileVideos";
import ProfileServices from "../components/Cards/profile/ProfileServices";
import { useCallback, useEffect, useRef, useState } from "react";
import ProfileTabNav from "../components/Cards/profile/ProfileTabNav";
import ProfileCourses from "../components/Cards/profile/ProfileCourses";
import WorkAndServices from "../components/Cards/profile/WorksAndServices";
import { useEvent } from "../providers/EventProvider";


const Tab = createBottomTabNavigator();
const HEIGHT = Dimensions.get("window").height;
export default function ProfilePostsRoute({ navigation, userId }) {

    const [selectedPage, setSelectedPage] = useState("ProfileImages");
    const [height, setHeight] = useState(HEIGHT * 0.25)

    const event = useEvent();

    const updateHeight = (value) => {
        console.log("update height : ", value);
        if (value == 0)
            setHeight(HEIGHT * 0.25);
        else if (value < HEIGHT * 0.75) {
            setHeight(value)
        } else
            setHeight(HEIGHT * 0.75)

    }

    useEffect(() => {

        event.addListener("update-height", updateHeight);
        return () => {
            event.removeListener("update-height", updateHeight)
        }
    }, [])


    return (
        <View style={{ flex: 1  }}>
            <ProfileTabNav activePage={selectedPage} navigation={navigation} />
            <View style={[styles.screensContainer, { height: height }]}>
                <Tab.Navigator
                    screenOptions={{
                        headerShown: false,
                        tabBarStyle: {
                            display: "none"        
                        } , 

                        
                    }}
                    
                    initialRouteName={"ProfileImages"}
                >


                    <Tab.Screen component={ProfileImages} initialParams={{ userId: userId }} name="ProfileImages" listeners={{
                        focus: (e) => {
                            setSelectedPage("ProfileImages")
                        }
                    }} />
                    <Tab.Screen component={ProfileNotes} initialParams={{ userId: userId }} name="ProfileNotes" listeners={{
                        focus: (e) => {
                            setSelectedPage("ProfileNotes")
                        }
                    }} />
                    <Tab.Screen component={ProfileVideos} initialParams={{ userId: userId }} name="ProfileVideos" listeners={{
                        focus: (e) => {
                            setSelectedPage("ProfileVideos")
                        }
                    }} />
                    {
                        /*
                    <Tab.Screen component={WorkAndServices} initialParams={{ userId: userId }} name="WorkAndServices" listeners={{
                        focus: (e) => {
                            setSelectedPage("WorkAndServices")
                        }
                    }} />
                    <Tab.Screen component={ProfileCourses} initialParams={{ userId: userId }} name='ProfileCourses' listeners={{
                        focus: (e) => {
                            setSelectedPage("ProfileCourses")
                        }
                    }} />
                    */
                    }

                </Tab.Navigator>
            </View>

        </View>
    )
}


const styles = StyleSheet.create({

    screensContainer  : { 
     
    }
})
