
import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { View, Text, StyleSheet, Image, TextInput, Keyboard, ScrollView, Dimensions } from "react-native";

import PrimaryButton from "../components/Buttons/PrimaryButton";

import Header from "../components/Cards/Header";
import FormUplaoder from "../components/Inputs/FormUploader";
import darkTheme from "../design-system/darkTheme";
import { textFonts } from "../design-system/font";
import ThemeContext from "../providers/ThemeContext";

const HEIGHT = Dimensions.get("screen").height;

export default function Contract({ navigation, route }) {

    const inputRef = useRef();
    const [focusedInput, setFocusedInput] = useState(false);
    
    const  readOnly  = route.params?.readOnly;



    useEffect(() => {
        const subscription = Keyboard.addListener("keyboardDidHide", () => {
            inputRef.current?.blur();
        });
        return subscription.remove;
    }, []);


    const toggleFocusInput = useCallback(() => {
        setFocusedInput(!focusedInput);

    }, [focusedInput]) ; 


    const submit = useCallback(() => { 
        navigation.navigate("DealsRoute")
    
    } , [ navigation ]) ; 



    const themeContext = useContext(ThemeContext);
    const styles = themeContext.getTheme() == "light" ? lightStyles : darkStyles;

    return (
        <View style={styles.container}>
            <Header
                navigation={navigation}
            />
            <ScrollView >
                <View style={styles.content}>

                    <View style={styles.contractHeder}>
                        <Image source={require("../assets/icons/contract.png")} style={styles.contractIcon} />
                        {
                            !readOnly &&

                            <Text style={[styles.text, { textAlign: "center" }]}> لضمان حقوقك يرجى كتابة عقد الاتفاق </Text>

                        }
                        {
                            readOnly &&
                            <Text style={[styles.text, { textAlign: "center" }]}> لضمان حقوقك ، يرجى قراءة عقد الاتفاقية بعناية</Text>

                        }
                    </View>

                    <Text style={[styles.text, { marginVertical: 8 }]}>
                        بنوذ عقد الاتفاق
                    </Text>
                    {
                        !readOnly &&

                        <TextInput
                            numberOfLines={14}
                            style={[styles.input, focusedInput && styles.focusInput]}
                            ref={inputRef}
                            multiline
                            placeholder="الاتفاق"
                            onFocus={toggleFocusInput}
                            onBlur={toggleFocusInput}
                            placeholderTextColor = {styles.placeholderColor}
                        />
                    }
                    {
                        readOnly &&
                        <Text style={[styles.input , styles.readOnly]}>

                            هنا عقد الاتفاق

                        </Text>
                    }
                    {
                        !focusedInput && !readOnly &&
                        <FormUplaoder />
                    }
                    {
                        !focusedInput && !readOnly &&
                        <View style={styles.footer}>
                            <PrimaryButton
                                title={"أرسل"}
                                style={styles.footerInput}
                                onPress = {submit}
                            />
                            <PrimaryButton
                                title={"تجاهل"}
                                style={styles.footerInput}
                                outline={true}
                                onPress = {submit}
                            />
                        </View>
                    }

                </View>
            </ScrollView>

        </View>
    )

};

const lightStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "white"
    },
    content: {

        padding: 16,
        minHeight: HEIGHT,


    },
    contractHeder: {
        alignItems: "center",
        elevation: 4,
        backgroundColor: "white",
        borderRadius: 8,
        padding: 16
    },
    text: {
        fontFamily: textFonts.regular,
        marginTop: 8
    },
    input: {
        borderColor: "#ddd",
        borderWidth: 1,
        padding: 4,
        textAlignVertical: "top",
        fontFamily: textFonts.regular,
    },
    focusInput: {
        position: "absolute",
        width: "100%",
        backgroundColor: "white",
        marginLeft: 16,

    },
    footer: {
        flexDirection: "row-reverse",
        alignItems: "flex-end",
        marginHorizontal: -16
    },
    footerInput: {
        width: 128,
        marginHorizontal: 16
    } , 
    readOnly : { 
        flex :  1
    }
}) ; 

const darkStyles = { 
    ...lightStyles , 
    placeholderColor : darkTheme.textColor , 
    container: {
        flex: 1,
        backgroundColor: darkTheme.backgroudColor
    }
    ,
    contractHeder: {
        alignItems: "center",
        elevation: 4,
        backgroundColor: darkTheme.secondaryBackgroundColor , 
        borderRadius: 8,
        padding: 16
    },
    text :  { 
        marginTop: 8 , 
        color :darkTheme.textColor 
    },
    input: {
        borderColor: darkTheme.borderColor,
        borderWidth: 1,
        padding: 4,
        textAlignVertical: "top",
        fontFamily: textFonts.regular,
        
        backgroundColor: darkTheme.secondaryBackgroundColor , 
        color : darkTheme.textColor , 
    },
    focusInput: {
        position: "absolute", 
        borderColor: darkTheme.borderColor,
        width: "100%",
        backgroundColor: darkTheme.secondaryBackgroundColor , 
    
        marginLeft: 16,

    },
}