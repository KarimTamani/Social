
import { useCallback, useContext, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, TextInput } from "react-native";
import { textFonts } from "../../../design-system/font";
import { FontAwesome5, FontAwesome, Entypo } from '@expo/vector-icons';
import PrimaryInput from "../../Inputs/PrimaryInput";
import ThemeContext from "../../../providers/ThemeContext";
import darkTheme from "../../../design-system/darkTheme";

export default function InfoInput({ label, value, onPress, onChangeText, social, onBlur, multiline = false, errorText, customInput, socialhandlers, socialMediaValues, socialMediaErrors }) {

    
    const [toggleInput, setToggleInput] = useState(false);
    const themeContext = useContext(ThemeContext);
    const styles = themeContext.getTheme() == "light" ? lightStyles : darkStyles
 

    const handlePress = onPress || useCallback(() => {
        setToggleInput(!toggleInput);
        if (toggleInput) {
            onBlur && onBlur()
        }
        
    }, [toggleInput]);


    return (
        <TouchableOpacity style={styles.infoInput} onPress={handlePress}>
            <Text style={styles.label}>
                {label}
            </Text>
            {
                !social && !toggleInput &&

                <Text style={styles.value}>
                    {value}
                </Text>
            }
            {
                !social && toggleInput && !customInput &&
                <PrimaryInput
                    style={styles.input}
                    value={value}
                    placeholder={label}
                    onBlur={handlePress}
                    error={errorText}
                    multiline={multiline}
                    onChange={onChangeText}
                    placeholderTextColor={styles.placeholderTextColor}
                />

            }
            {
                !social && toggleInput && customInput

            }
            {
                social &&
                <View style={styles.socialMediaContainer}>

                    <PrimaryInput
                        placeholder={"https://"}
                        style={styles.socialMediaInput}
                        onChange={socialhandlers.facebook.onChange}
                        onBlur={socialhandlers.facebook.onBlur}
                       
                        value={socialMediaValues.facebook}
                        error={socialMediaErrors?.facebook} 
                        rightContent={
                            <View style={styles.button}>
                                <Entypo name="facebook-with-circle" style={[styles.icon, { color: "#4267B2" }]} />
                                <Entypo name="link" style={styles.link} />
                            </View>

                        }
                    />
                    {
                        socialMediaErrors?.facebook && socialMediaErrors.facebook
                    }

                    <PrimaryInput
                        placeholder={"https://"}
                        style={styles.socialMediaInput}
                        onChange={socialhandlers.twitter.onChange}
                        onBlur={socialhandlers.twitter.onBlur}

                        error={socialMediaErrors?.twitter} 
                        value={socialMediaValues.twitter}
                        rightContent={
                            <View style={styles.button}>
                                <FontAwesome5 name="twitter" style={[styles.icon, { color: "#00f2ea" }]} />
                                <Entypo name="link" style={styles.link} />

                            </View>

                        }
                    />
                    {
                        socialMediaErrors?.twitter && socialMediaErrors.twitter
                    }

                    <PrimaryInput
                        placeholder={"https://"}
                        style={styles.socialMediaInput}
                        onChange={socialhandlers.snapshot.onChange}

                        onBlur={socialhandlers.snapshot.onBlur}
                        error={socialMediaErrors?.snapshot} 
                        value={socialMediaValues.snapshot}
                        rightContent={
                            <View style={styles.button}>
                                <FontAwesome name="snapchat-ghost" style={[styles.icon, { color: "#FFFC00" }]} />
                                <Entypo name="link" style={styles.link} />

                            </View>

                        }
                    />
                    {
                        socialMediaErrors?.snapshot && socialMediaErrors.snapshot
                    }


                    <PrimaryInput
                        placeholder={"https://"}
                        style={styles.socialMediaInput}
                        onChange={socialhandlers.instagram.onChange}
                        value={socialMediaValues.instagram}
                        onBlur={socialhandlers.instagram.onBlur}
                        error={socialMediaErrors?.instagram} 
                        
                        rightContent={
                            <View style={styles.button}>
                                <Entypo name="instagram" style={[styles.icon, { color: "#C13584" }]} />
                                <Entypo name="link" style={styles.link} />
                            </View>

                        }
                    />

                    {
                        socialMediaErrors?.instagram && socialMediaErrors.instagram
                    }



                </View>

            }
            {
                errorText &&
                errorText
            }


        </TouchableOpacity>
    )

};


const lightStyles = StyleSheet.create({

    label: {
        color: "#1A6ED8",
        fontFamily: textFonts.regular,
        fontSize: 16,
        textAlign: "right"

    },
    value: {
        fontSize: 14,
        fontFamily: textFonts.regular,
        color: "#666",
        textAlign: "right"
    },
    infoInput: {
        borderBottomColor: "#eee",
        borderBottomWidth: 1,
        paddingBottom: 8,
        marginBottom: 16
    },
    input: {

        backgroundColor: "rgba(0,0,0,0.05)",
        borderWidth: 1,
        borderColor: "#ddd",
        borderRadius: 8,
        marginTop: 8,
        paddingHorizontal: 16,
        fontFamily: textFonts.regular,
        fontSize: 12,
        height: 48,
        alignItems: "center"
    },

    icon: {
        fontSize: 32,
    },
    button: {
        height: 48,
        alignItems: "center",
        justifyContent: "center",
        width: 48,
        position: "relative",
        marginHorizontal: 8
    },
    socialMediaInput: {
        height: 56,
        marginTop: 12,
        borderColor: "#eeeeee",
        borderWidth: 1,
        backgroundColor: "white"
    },
    link: {
        position: "absolute",
        bottom: 0,
        fontSize: 18,

        borderRadius: 18,

        right: 0,
        color: "#aaa",
        backgroundColor: "white"
    }
})


const darkStyles = {
    ...lightStyles,
    value: {
        fontSize: 14,
        fontFamily: textFonts.regular,
        color: darkTheme.secondaryTextColor,
        textAlign: "right"
    },
    infoInput: {
        borderBottomColor: darkTheme.borderColor,
        borderBottomWidth: 1,
        paddingBottom: 8,
        marginBottom: 16
    },
    input: {
       
        color: darkTheme.textColor , 
        
        backgroundColor: darkTheme.secondaryBackgroundColor,
        borderWidth: 1,
        borderColor: darkTheme.borderColor,
        borderRadius: 8,
        marginTop: 8,
        paddingHorizontal: 16,
        fontFamily: textFonts.regular,
        fontSize: 12,
        height: 48,
        alignItems: "center" , 
        overflow : "hidden"
    },

    placeholderTextColor: darkTheme.secondaryTextColor,
    socialMediaInput: {
        height: 56,
        marginTop: 12,
        borderColor: darkTheme.borderColor,
        borderWidth: 1,
        backgroundColor: darkTheme.secondaryBackgroundColor
    },
    link: {
        position: "absolute",
        bottom: 0,
        fontSize: 18,

        borderRadius: 18,

        right: 0,
        color: "#aaa",
        backgroundColor: darkTheme.secondaryBackgroundColor
    }
}