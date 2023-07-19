import { View, Text, StyleSheet } from "react-native";
import { Feather } from '@expo/vector-icons';
import { textFonts } from "../../../design-system/font";
import ThemeContext from "../../../providers/ThemeContext";
import { useContext } from "react";
import darkTheme from "../../../design-system/darkTheme";

export default function PrivateContentMessage({ }) {


    const themeContext = useContext(ThemeContext);
    const styles = themeContext.getTheme() == "light" ? lightStyles : darkStyles;

    return (
        <View style={styles.container}>
            <Feather name="eye-off" size={48} color={themeContext.getTheme() == "light" ? "#555" : darkTheme.textColor} />
            <Text style={styles.title}>
            هاذ الحساب خاص
            </Text>
            <Text style={styles.message}>
            قم بمتابعة هاذ المستخدم لرؤية منشورات هاذ الحساب و التفاعل معها
            </Text>
        </View>
    )


};



const lightStyles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center" , 
        justifyContent : "center" , 
        paddingVertical : 24 , 
        
     
        marginTop : 16 
    } , 
    title : { 
        fontFamily : textFonts.bold , 
        color : "#212121" , 
        fontSize : 16  , 
        fontWeight : "bold"
        
    } , 
    message: { 
        fontFamily  : textFonts.regular , 
        color : "#555" , 
        textAlign : "center"
    }
}) ; 


const darkStyles = { 
    ...lightStyles , 
    title : { 
        ...lightStyles.text ,
        color : darkTheme.textColor
    } , 
    message: { 
        fontFamily  : textFonts.regular , 
        color : darkTheme.secondaryTextColor , 
        textAlign : "center"
    }
}