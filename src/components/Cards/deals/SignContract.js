import { View, Text, StyleSheet, TouchableOpacity, Image, TextInput, Keyboard } from "react-native";
import { textFonts } from "../../../design-system/font";
import { Feather, AntDesign } from '@expo/vector-icons';
import { useCallback, useContext, useEffect, useRef, useState } from "react";
import PrimaryButton from "../../Buttons/PrimaryButton";
import ThemeContext from "../../../providers/ThemeContext";
import darkTheme from "../../../design-system/darkTheme";
export default function SignContract({ navigation }) {

    const [agree, setAgree] = useState(false);
    const toggleAgree = useCallback(() => {
        setAgree(!agree);
    }, [agree]);

    const openContract = useCallback(() => {
        navigation.navigate("Contract", {
            readOnly: true
        })
    }, [navigation]);


    const inputRef = useRef();

    useEffect(() => {
        const subscription = Keyboard.addListener("keyboardDidHide", () => {
            inputRef.current?.blur();
        });
        return subscription.remove;
    }, []);



    const themeContext = useContext(ThemeContext) ; 
    const styles = themeContext.getTheme() == "light" ? lightStyles : darkStyles


    return (
        <View style={styles.container}>
            <Text style={styles.title}>
                انقر لرؤية عرض الاتفاق للموافقة عليه
            </Text>
            <TouchableOpacity style={styles.contractButton} onPress={openContract}>
                <Image source={require("../../../assets/icons/agreement.png")} />
                <Text style={styles.contractText}>
                    اقرأ العقد وانقر هنا لقبوله

                </Text>
                <TouchableOpacity style={styles.agreeButton} onPress={toggleAgree}>
                    {
                        !agree &&
                        <Feather name="circle" style={styles.icon} />
                    }
                    {
                        agree &&
                        <AntDesign name="checkcircle" style={[styles.icon, styles.blueIcon]} />
                    }
                </TouchableOpacity>
            </TouchableOpacity>
            <Text style={styles.label}>
                كتابة التعليمات
            </Text>
            <TextInput
                numberOfLines={6}
                style={[styles.input]}
                ref={inputRef}
                multiline
                placeholder="التعليمات"
                placeholderTextColor={styles.placeholderTextColor }

            />
            <PrimaryButton
                title={"أرسل"}
                style={{ 
                    width : 128 , 
                    alignSelf : "flex-end" 
                }}
            />

        </View>
    )

};


const lightStyles = StyleSheet.create({
    container: {
        marginVertical: 16
    },
    title: {
        color: "#1A6ED8",
        fontFamily: textFonts.semiBold
    },
    contractButton: {
        backgroundColor: "#eee",
        flexDirection: "row-reverse",
        justifyContent: "space-between",
        padding: 8,
        alignItems: "center",
        borderRadius: 8,
        marginVertical: 16,
        height: 76
    },
    contractText: {

        flex: 1,
        height: "100%",
        textAlignVertical: "center",
        fontFamily: textFonts.regular,
        color: "#888"
    },


    agreeButton: {

        height: "100%",
        alignItems: "center",
        justifyContent: "center",
        width: 48
    },
    icon: {
        fontSize: 24,
        color: "#666"
    },
    blueIcon: {
        color: "#1A6ED8"
    },
    input: {
        borderColor: "#ddd",
        borderWidth: 1,
        padding: 4,
        textAlignVertical: "top",
        fontFamily: textFonts.regular,
        marginVertical: 16
    },
    
    label : { 
        fontFamily : textFonts.regular 
    }
})


const darkStyles = { 
    ...lightStyles , 
    placeholderTextColor : darkTheme.secondaryTextColor , 
    contractButton: {
        backgroundColor: darkTheme.secondaryBackgroundColor,
        flexDirection: "row-reverse",
        justifyContent: "space-between",
        padding: 8,
        alignItems: "center",
        borderRadius: 8,
        marginVertical: 16,
        height: 76
    },
    
    label : { 
        fontFamily : textFonts.regular , 
        color : darkTheme.textColor  
        
    },
    input: {
        borderColor: darkTheme.borderColor ,
        borderWidth: 1,
        padding: 4,
        textAlignVertical: "top",
        fontFamily: textFonts.regular,
        marginVertical: 16 , 

        backgroundColor: darkTheme.secondaryBackgroundColor,
        color : darkTheme.textColor 
    },
}