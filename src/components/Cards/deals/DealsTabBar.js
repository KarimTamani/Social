import { useContext } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import darkTheme from "../../../design-system/darkTheme";
import { textFonts } from "../../../design-system/font";
import ThemeContext from "../../../providers/ThemeContext";

export default function DealsTabBar({ navigation, activePage }) {



    const themeContext = useContext(ThemeContext) ; 
    const styles = themeContext.getTheme() == "light" ? lightStyles : darkStyles
   
    return (
        <View style={styles.container}>

            <TouchableOpacity style={styles.tab} onPress={() => navigation.navigate("PurshasesRoute")}>
                <Text style={[styles.tabText, activePage == "PurshasesRoute" && styles.activeText]}>
                    المشتريات
                </Text>
            </TouchableOpacity>


            <TouchableOpacity style={styles.tab} onPress={() => navigation.navigate("OrdersRoute")}>
                <Text style={[styles.tabText, activePage == "OrdersRoute" && styles.activeText]}>
                    الطلبات الواردة


                </Text>
            </TouchableOpacity>



        </View>
    )

};

const lightStyles = StyleSheet.create({
    container: {
        flexDirection: "row-reverse"
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
    
        
    }
})

const darkStyles = { 
    ...lightStyles , 

    tabText: {

        textAlign: "center",
        fontSize: 14,
        color: darkTheme.secondaryTextColor,
        paddingVertical: 8,
        fontFamily: textFonts.medium
    },
    container: {
        flexDirection: "row-reverse" , 
        backgroundColor : darkTheme.backgroudColor 
    },

}