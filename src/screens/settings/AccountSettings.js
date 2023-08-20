import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import Header from "../../components/Cards/Header";
import { Entypo } from '@expo/vector-icons';
import { textFonts } from "../../design-system/font";
import { useCallback, useContext } from "react";
import ThemeContext from "../../providers/ThemeContext";
import darkTheme from "../../design-system/darkTheme";


const routes = [
    {
        name: "الحسابات المحظورة",
        onPress : (navigation) => { 
            navigation.navigate("BlockedUsers") ; 
        }
    },
 
    {
        name: "تفعيل الوضع الاحترافي",
        onPress : (navigation) => { 
            navigation.navigate("ProfessionalMode") ; 
        }
    },
   
    {
        name: "تعطيل الحساب أو إزالته",
        onPress : (navigation) => { 
            navigation.navigate("DisableAccount") ; 
        }
    },
]



export default function AccountSettings({ navigation }) {


    const themeContext = useContext(ThemeContext) ; 
    const styles = themeContext.getTheme() == "light" ? lightStyles : darkStyles

    return (
        <View style={styles.container}>
            <Header
                navigation = { navigation }
            />
            <ScrollView style={styles.routes}>
                {
                    routes.map((route) => (
                        <TouchableOpacity style={styles.route} onPress = { useCallback(() => route.onPress(navigation) , [ navigation ])}>
                        
                            <Text style={styles.routeText}>
                                {route.name}
                            </Text>
                            <Entypo name="chevron-left" size={24} color="#666" />
                        </TouchableOpacity>
                    ))
                }
            </ScrollView>
        </View>
    )
};

const lightStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "white"
    } , 
    route: {
        flexDirection: "row-reverse",
        justifyContent: "space-between",
        borderBottomColor: "#eee",
        borderBottomWidth: 1,
        marginBottom: 8,
        paddingBottom: 8,
        alignItems: "center",
        paddingHorizontal: 8

    },
    routeText: {

        flex: 1,
        fontFamily: textFonts.regular,
        textAlignVertical: "center",
        color: "#666"

    },
})

const darkStyles = {
    ...lightStyles , 
    container: {
       flex: 1,
       backgroundColor : darkTheme.backgroudColor
   },
   routeText: {

       flex: 1,
       fontFamily: textFonts.regular,
       textAlignVertical: "center",
       color: darkTheme.textColor 

   }
   ,
   route: {
       flexDirection: "row-reverse",
       justifyContent: "space-between",
       borderBottomColor: darkTheme.borderColor ,
       borderBottomWidth: 1,
       marginBottom: 8,
       paddingBottom: 8,
       alignItems: "center",
       paddingHorizontal: 8

   },
}