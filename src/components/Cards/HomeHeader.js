import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Feather } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';
import { useCallback, useContext } from "react";
import ThemeContext from "../../providers/ThemeContext";
import darkTheme from "../../design-system/darkTheme";
import AuthButton from "../Buttons/AuthButton";
export default function HomeHeader({ navigation }) {


    const themeContext = useContext(ThemeContext) ; 
    const styles = themeContext.getTheme() == "light" ? lightStyles : darkStyles ;  


    const onMessenger = useCallback(() => {
        navigation.navigate("Messenger")
    } , [navigation]) ; 

    const openExplore = useCallback(() => { 
        navigation.navigate("ExploreRoute") ; 
    } , [ navigation])

    return (
        <View style={styles.container}>
            <View style={styles.section}>

                <AuthButton onPress={onMessenger} navigation={  navigation }>
                    <Feather name="message-circle" style={styles.headerIcon} />

                </AuthButton>
                <Text style={styles.appName}>
                
                </Text>
            </View>
            <View style={styles.section}>
                <AuthButton onPress={openExplore}  navigation={  navigation }>
                    <AntDesign name="search1" style={styles.headerIcon} />
                </AuthButton>
            </View>
        </View>
    )
}

const lightStyles = StyleSheet.create({
    container: {
        flexDirection: "row",
        padding: 16,
        paddingVertical : 10 , 
        paddingTop: 36,
        justifyContent: "space-between" , 
        backgroundColor: "white",
        elevation : 12 , 
        position :"relative" , 
        zIndex : 99  
        
 
    },
    appName: {
        color: "#666",
        marginLeft: 16 , 
        textAlignVertical : "center"
        
    },
    section: {
        flexDirection: "row",
    },
    headerIcon: {
        fontSize: 24 , 
        backgroundColor : "#eee" ,   
        padding : 8  , 
        borderRadius : 24 
    }
}) ; 
const darkStyles = { 
    ...lightStyles , 
    container: {
        flexDirection: "row",
        padding: 16,
        paddingVertical : 10 , 
        paddingTop: 36,
        justifyContent: "space-between" , 
        backgroundColor: darkTheme.backgroudColor,
        elevation : 12 , 
        position :"relative" , 
        zIndex : 99  
        
 
    },
    
    headerIcon: {
        fontSize: 24 , 
        backgroundColor : darkTheme.secondaryBackgroundColor ,   
        padding : 8  , 
        borderRadius : 24  , 
        color : "white"
    }
}