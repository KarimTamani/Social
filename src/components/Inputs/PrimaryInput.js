import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { View, Text, StyleSheet, TextInput, Keyboard } from "react-native";
import darkTheme from "../../design-system/darkTheme";
import { textFonts } from "../../design-system/font";
import ThemeContext from "../../providers/ThemeContext";


export default function PrimaryInput({ placeholder  ,  secure = false,showKeyBoard = true, inputStyle, onChange, inputRef, onFocus, rightContent, style, leftContent, value, multiline = false , onBlur , error = false }) {

    var ref = inputRef;
    if (!ref) {
        ref = useRef();
    }
    const [text , setText] = useState() ; 


    const themeContext = useContext(ThemeContext) ; 
    const styles = themeContext.getTheme() == "light" ? lightStyles : darkStyles ;  


    useEffect(() => {
    
        const subscription = Keyboard.addListener("keyboardDidHide", () => {
            ref.current?.blur();
        });
        return subscription.remove;
        
    }, [ref]) ; 


    
    return (
        <View style={[styles.container, style , error&&  styles.errorContainer]}>
            <View style={styles.leftContent}>
                {leftContent}
            </View>
            <TextInput
                placeholder={placeholder}
                style={[styles.textInput, inputStyle  ]}
                onChangeText={onChange}
                multiline={multiline}
                numberOfLines={4}
                onFocus={onFocus}
                onBlur={onBlur}
                ref={ref}
                autoCapitalize={"none"}
                secureTextEntry={secure}
                placeholderTextColor = { styles.placeholderTextColor }
                showSoftInputOnFocus={showKeyBoard} 
   

 
             
            >
                <Text style={styles.text}>
                    {value}
                </Text>
            </TextInput>
            <View style={styles.rightContent}>
                {rightContent}
            </View>
        </View>
    )
}

const lightStyles = StyleSheet.create({
    container: {
        backgroundColor: "#eee",
        borderRadius: 38,
        flexDirection: "row",
        paddingVertical: 0,
        
    },
    errorContainer : { 
        borderWidth : 1 , 
        borderColor : "#FF3159" , 
        backgroundColor :"#FF315911"
    } , 
    textInput: {
        fontFamily: textFonts.regular,
        flex: 1,
        paddingHorizontal : 12 , 
        textAlignVertical : "center" , 

        lineHeight : -8  ,

    },
    rightContent: {
        alignItems: "center",
        height: "100%",
        justifyContent: "center"
    },
    leftContent: {
        alignItems: "center",
        height: "100%",
        justifyContent: "center",


    },
    text: {
        lineHeight: 24 , 
        textAlignVertical : "top"
    }
})
const darkStyles = { 
    ...lightStyles , 
    placeholderTextColor : darkTheme.secondaryTextColor , 
    container: {
        backgroundColor: darkTheme.secondaryBackgroundColor,
        borderRadius: 38,
        flexDirection: "row",
        paddingVertical: 0,
        alignItems: "center"

    },
     
    textInput: {
      
        color : darkTheme.textColor  , 
        fontFamily: textFonts.regular,
        flex: 1,
        paddingHorizontal : 12 , 
        textAlignVertical : "center" , 

        lineHeight : -8 
    },
    
}