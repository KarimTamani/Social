import { useContext, useEffect, useRef } from "react";
import { View, Text, StyleSheet, Keyboard } from "react-native";
import { TextInput } from "react-native-gesture-handler";
import darkTheme from "../../design-system/darkTheme";
import { textFonts } from "../../design-system/font";
import ThemeContext from "../../providers/ThemeContext";
import { errorStyle } from "../../design-system/errorStyle";

export default function FormInput({
    value,
    handleBlur,
    handleChange,
    label,
    placeholder = '',
    multiline = false,
    numberOfLines = 1, 
    style , 
    error , 
    autoCapitalize = true 
}) {
    const inputRef = useRef();

    useEffect(() => {
        const subscription = Keyboard.addListener("keyboardDidHide", () => {
            inputRef.current?.blur();
        });
        return subscription.remove;
    }, []) ; 


    const themeContext = useContext(ThemeContext) ; 
    const styles = themeContext.getTheme() == "light" ? lightStyles : darkStyles ;   

    return (
        <View style={[styles.inputRow , style]}>
            <Text style={styles.label}>
                {label}
            </Text>
            <TextInput
                placeholder={placeholder}
                style={[styles.input , error && errorStyle.errorInput ]}
                value={value}
                onChangeText={handleChange}
                onBlur={handleBlur}
                ref={inputRef}
                multiline={multiline}
                numberOfLines={numberOfLines}
                placeholderTextColor = { styles.placeholderColor }
                autoCapitalize={(autoCapitalize === false) ? "none" : null}
            />
        </View>
    )

};


const lightStyles = StyleSheet.create({

    inputRow: {
        marginBottom: 16,
    },
    label: {
        fontFamily: textFonts.medium,
        marginBottom: 16,
        fontSize: 14
    },
    input: {
        borderColor: "#ccc",
        padding: 8,
        padding: 12,
        fontFamily: textFonts.regular,
        borderWidth: 1,
        borderRadius: 8 , 
        textAlignVertical : "top" , 
        backgroundColor : "rgba(0,0,0,0.02)"
    }
}) ; 

const darkStyles = { 
    ...lightStyles , 
    placeholderColor : darkTheme.secondaryTextColor , 
  
    label: {
        fontFamily: textFonts.medium,
        marginBottom: 16,
        fontSize: 14 ,
        color : darkTheme.textColor 
    },
    
    input: {
        borderColor: darkTheme.borderColor,
        padding: 8,
        padding: 12,
        fontFamily: textFonts.regular,
        borderWidth: 1,
        borderRadius: 8 , 
        textAlignVertical : "top" , 
        backgroundColor : darkTheme.secondaryBackgroundColor
    }

}