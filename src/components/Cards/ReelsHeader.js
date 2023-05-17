import { useCallback } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { AntDesign } from '@expo/vector-icons';
import { textFonts } from "../../design-system/font";

export default function ReelsHeader({ navigation , activePage }) {

    const onBack = useCallback(() => {
        navigation && navigation.canGoBack() && navigation.goBack();
    }, [navigation]);

    return (

        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>
                    ريلز
                </Text>
                <TouchableOpacity onPress={onBack}>
                    <AntDesign name="arrowright" style={styles.icon} />
                </TouchableOpacity>
            </View>
            <View style={styles.tabBar}>
                <TouchableOpacity style={[styles.tabButton ]} onPress = { () => navigation.navigate("GeneralReels")} >
                    <Text style={[styles.tabText , activePage == "GeneralReels" && styles.activeTab]}>
                    العامة
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.tabButton} onPress = { () => navigation.navigate("PrivateReels")} >
                    <Text style={[styles.tabText , activePage == "PrivateReels" && styles.activeTab]}>
                    المتابعين

                    </Text>
                </TouchableOpacity>
           
            </View>
        </View>
    )

}


const styles = StyleSheet.create({

    container : { 
        position: "absolute",
        width: "100%",

        zIndex: 99
    } , 
    header: {
        flexDirection: "row",
        padding: 16,
        paddingTop: 46,
        justifyContent: "space-between",
        alignItems: "center",


    },
    icon: {
        fontSize: 24,
        color: "white"
    },
    title: {
        fontFamily: textFonts.bold,

        color: "white"
    } , 
    tabBar : { 
        flexDirection : "row-reverse" , 
        justifyContent : "center" , 
        alignItems : "center"
    } , 
    tabButton : { 
        marginHorizontal : 16
    } , 
    tabText : { 
        color : "rgba(255,255,255,0.5)" , 
        fontSize : 14 , 
        fontFamily : textFonts.regular  
    } , 
    activeTab : { 
        color : "white"
    }

})