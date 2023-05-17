import { useCallback, useContext, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { textFonts } from "../../../design-system/font";
import { AntDesign } from '@expo/vector-icons';
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import ProfileServices from "./ProfileServices";
import ProfileWorks from "./ProfileWorks";
import ThemeContext from "../../../providers/ThemeContext";
import darkTheme from "../../../design-system/darkTheme";
const Tab = createBottomTabNavigator();


export default function WorkAndServices({ navigation }) {
    const [activePage, setActivePage] = useState("ProfileServices");

    const create = useCallback(() => {
        if (activePage == "ProfileServices")
            navigation.navigate("ServiceEditor");
        else
            navigation.navigate("WorkEditor");
    }, [navigation, activePage]);


    const themeContext = useContext(ThemeContext);
    const styles = themeContext.getTheme() == "light" ? lightStyles : darkStyles;

    return (
        <View style={styles.container}>
            <View style={styles.navigation}>
                <View style={styles.section}>
                    <TouchableOpacity style={styles.createButton} onPress={create}>
                        <AntDesign name="pluscircle" style={styles.createIcon}  />
                        <Text style={styles.createText}>
                            إنشاء
                        </Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.section}>

                    <TouchableOpacity style={styles.tab} onPress={() => navigation.navigate("ProfileWorks")}>
                        <Text style={[styles.tabText, activePage == "ProfileWorks" && styles.activeText]}>
                            ورشة عمل


                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.tab} onPress={() => navigation.navigate("ProfileServices")}>
                        <Text style={[styles.tabText, activePage == "ProfileServices" && styles.activeText]}>
                            خدمات
                        </Text>
                    </TouchableOpacity>




                </View>
            </View>
            <Tab.Navigator
                screenOptions={{
                    headerShown: false,
                    tabBarStyle: {
                        display: "none"
                    },
                    
                    

                }}
                

            >
                <Tab.Screen name="ProfileServices" component={ProfileServices} listeners={{
                    focus: (e) => {
                        setActivePage("ProfileServices")
                    }
                }} />
                <Tab.Screen name="ProfileWorks" component={ProfileWorks} listeners={{
                    focus: (e) => {
                        setActivePage("ProfileWorks")
                    }
                }} />
            </Tab.Navigator>
        </View>
    )
};

const lightStyles = StyleSheet.create({
    container: {
        flex: 1,

    },
    navigation: {
        flexDirection: "row",
        backgroundColor: "white",
        paddingBottom: 8
    },
    section: {
        flex: 1,
        flexDirection: "row"
    },
    tab: {
        flex: 1,
        alignItems: "center"
    },
    tabText: {

        textAlign: "center",
        fontSize: 14,
        color: "#666",
        paddingVertical: 8,
        fontFamily: textFonts.medium
    },
    activeText: {
        color: "#1A6ED8",
        borderBottomColor: "#1A6ED8",
        borderBottomWidth: 4,


    },
    createButton: {
        flexDirection: "row",
        marginLeft: 16,
        borderColor: "#eee",
        borderWidth: 1,
        alignItems: "center",
        paddingHorizontal: 8,
        borderRadius: 26
    },
    createText: {
        fontFamily: textFonts.semiBold,
        paddingHorizontal: 8
    } , 
    createIcon : { 
        color : "black"  ,
        fontSize : 24 
    }
});


const darkStyles = {
    ...lightStyles,
    navigation: {
        ...lightStyles.navigation,
        backgroundColor: darkTheme.backgroudColor,

    } , 
    createButton: {
        ...lightStyles.createButton,
        borderColor : darkTheme.borderColor 
    }, 
    createText: {
        fontFamily: textFonts.semiBold,
        paddingHorizontal: 8 , 
        color  : darkTheme.textColor , 
    }, 
    createIcon : { 
        color : "white"  ,
        fontSize : 24 
    }  
}