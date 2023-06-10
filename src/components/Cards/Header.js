import { View, Text, StyleSheet, TouchableOpacity } from "react-native"
import { AntDesign } from '@expo/vector-icons';
import { useCallback, useContext } from "react";
import { textFonts } from "../../design-system/font";
import ThemeContext from "../../providers/ThemeContext";
import darkTheme from "../../design-system/darkTheme";


export default function Header({ title, navigation }) {


    const onBack = useCallback(() => { 
        navigation && navigation.canGoBack() && navigation.goBack() ; 
    } , [ navigation ]) ; 


    const themeContext = useContext(ThemeContext);
    const styles = themeContext.getTheme() == "light" ? lightStyles : darkStyles;

    return (
        <View style={styles.container}>
            <Text style={styles.title}>
                {title}
            </Text>
            <TouchableOpacity onPress={onBack}>
                <AntDesign name="arrowright" style={styles.icon} />
            </TouchableOpacity>
        </View>
    )
};

const lightStyles = StyleSheet.create({
    container: {
        backgroundColor: "white",
        flexDirection: "row" , 
        padding : 16 , 
        paddingTop : 46 , 
        justifyContent : "flex-end" 
        
    } , 
    icon : { 
        fontSize :  24 
    } , 
    title : { 
        fontFamily : textFonts.bold , 
        fontWeight : "bold" , 
        marginRight : 16 
    }

}) ; 


const darkStyles = { 
    ...lightStyles , 
    container : { 
        ...lightStyles.container , 
        backgroundColor : darkTheme.backgroudColor 
    } , 
    icon : { 
        fontSize :  24 , 
        color : darkTheme.textColor 
    } , 
    title : { 
        fontFamily : textFonts.bold , 
        fontWeight : "bold" , 
        marginRight : 16 , 
        color : darkTheme.textColor 
    }
} 