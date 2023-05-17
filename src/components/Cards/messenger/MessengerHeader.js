import { View, Text, StyleSheet, TouchableOpacity, Image, Modal } from "react-native";
import { Feather } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';
import { textFonts } from "../../../design-system/font";
import { useCallback, useContext, useState } from "react";
import MessengerDrawer from "./MessengerDrawer";
import ThemeContext from "../../../providers/ThemeContext";
import darkTheme from "../../../design-system/darkTheme";

export default function MessengerHeader({ navigation }) {

    const onBack = useCallback(() => {
        navigation && navigation.canGoBack() && navigation.goBack();
    }, [navigation]);

    const [showDrawer, setShowDrawer] = useState(false);
    const toggleDrawer = useCallback(() => {
        setShowDrawer(!showDrawer);
    }, [showDrawer]) 



    const themeContext = useContext(ThemeContext) ; 
    const styles = themeContext.getTheme() == "light" ? lightStyles : darkStyles ;  

    return (
        <View style={styles.container}>

            <TouchableOpacity onPress={toggleDrawer}>
                <Image source={require("../../../assets/icons/menu-line.png")} />
            </TouchableOpacity>
            <Text style={styles.title}>
                رسائل
            </Text>
            <TouchableOpacity onPress={onBack}>
                <AntDesign name="arrowright" style={styles.icon} />
            </TouchableOpacity>
            {
                showDrawer && 
                <Modal
                    transparent
                    onRequestClose={toggleDrawer}
                >
                    <MessengerDrawer
                        toggleDrawer={toggleDrawer}
                        navigation = { navigation }
                    />


                </Modal>
            }
        </View>
    )
};


const lightStyles = StyleSheet.create({
    container: {
        backgroundColor: "white",
        padding: 16,
        flexDirection: "row",
        paddingTop: 42,
        justifyContent: "space-between"
    },
    icon: {
        fontSize: 28,

    },
    title: {
        fontFamily: textFonts.semiBold,
    }
})

const darkStyles = { 
    ...lightStyles , 
    container: {
        backgroundColor: darkTheme.backgroudColor,
        padding: 16,
        flexDirection: "row",
        paddingTop: 42,
        justifyContent: "space-between"
    },
    
    icon: {
        fontSize: 28,
        color : darkTheme.textColor 
    
    },
    title: {
        fontFamily: textFonts.semiBold,
        color : darkTheme.textColor 
    }
}