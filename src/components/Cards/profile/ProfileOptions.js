import { useCallback, useContext } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import darkTheme from "../../../design-system/darkTheme";
import {textFonts} from "../../../design-system/font" ; 
import ThemeContext from "../../../providers/ThemeContext";

export default function ProfileOptions({ onClose , toggleProfileSender }) {

    const options = [
        {
            text: "حظر" , 
            onPress : useCallback(() => { 

            } , [])
        },
        {
            text: "ابلاغ" , 
            onPress : useCallback(() => { 

            } , [])
        
        },
        {
            text: "للملف الشخصي UR نسخ عنوان" , 
            onPress : useCallback(() => { 

            } , [])
        
        },
        {
            text: "مشاركة هذا الملف الشخصي" , 
            onPress : useCallback(() => { 
                toggleProfileSender() ; 
                onClose() ; 
            } , [])
        
        },
        {
            text: "رمز QR" , 
            onPress : useCallback(() => { 

            } , [])
        
        }, {
            text: "الغاء المتابعة" , 
            onPress : useCallback(() => { 

            } , [])
        
        },
    ] ; 



    const themeContext = useContext(ThemeContext);
    const styles = themeContext.getTheme() == "light" ? lightStyles : darkStyles;

    return (
        <TouchableOpacity style={styles.container} activeOpacity = { 1} onPress ={ onClose}>
            <View style={styles.options}>

                {
                    options.map(option => (
                        <TouchableOpacity style={styles.option} onPress=  { option.onPress}>
                            <Text style={styles.text}>
                                {option.text}
                            </Text>
                        </TouchableOpacity>
                    ))
                }
            </View>
        </TouchableOpacity>

    )

};


const lightStyles = StyleSheet.create({
    container: {
        flex: 1 , 
        backgroundColor : "rgba(0,0,0,0.1)" 
    } , 
    options : { 
        backgroundColor : "white" , 
        minWidth : "60%" , 
       
        maxWidth : "80%" , 
        marginTop : 64 , 
        marginLeft : 16  , 
        elevation : 12  
    } , 
    text : { 
        fontFamily : textFonts.regular , 
        paddingHorizontal : 16 , 
        paddingVertical : 8  
    }
})


const darkStyles=  { 
    ...lightStyles , 
    options : { 
        ...lightStyles.options , 
        backgroundColor : darkTheme.secondaryBackgroundColor
    }, 
    text : { 
        fontFamily : textFonts.regular , 
        paddingHorizontal : 16 , 
        paddingVertical : 8   , 
        color : darkTheme.textColor 
    }
} 

/*










*/


/*

*/

/*
حظر
ابلاغ
الوسائط
حذف المحادتة
تغيير السمة
زيارة الملف الشخصي
كتم الاشعارات

*/