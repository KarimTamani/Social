import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { AntDesign } from '@expo/vector-icons';
import { useCallback } from "react";
import NotificationsRoute from "../routes/NotificationsRoute";
import { textFonts } from "../design-system/font";
import Header from "../components/Cards/Header" ; 

export default function Notifications({ navigation , route  }) {



    var notificationsState = route.params?.notificationsState ; 
    
   
    return (
        <View style={styles.container}> 
            <Header
                title = { "إشعارات"}
                navigation = { navigation }
            />
            <View style={styles.content}>
                <NotificationsRoute navigation = { navigation } notificationsState = { notificationsState } />
            </View>
        </View>
    )
};


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "white",

    },
    header: {
        padding: 16,
        flexDirection: "row",
        justifyContent: "flex-end",
        alignItems : "center" , 
        paddingTop: 32
    } , 
    headerTitle : { 
        marginRight : 8  , 
        
        fontSize : 16 , 
        fontFamily : textFonts.bold
    } , 
    content : { 
        flex :  1 , 
        padding : 16 
    }
})