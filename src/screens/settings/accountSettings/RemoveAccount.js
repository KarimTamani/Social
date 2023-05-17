
import { useCallback, useContext, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import Header from "../../../components/Cards/Header";
import { textFonts } from "../../../design-system/font";

import { Feather, AntDesign } from '@expo/vector-icons';
import PrimaryButton from "../../../components/Buttons/PrimaryButton";
import ThemeContext from "../../../providers/ThemeContext";
import darkTheme from "../../../design-system/darkTheme";

export default function RemoveAccount({ navigation }) {


    const [reason, setReason] = useState(0);

    const openConfirmation = useCallback(() => { 
        navigation.navigate("ConfirmDisable" , {
            remove : true 
        }) ; 
    } , [ navigation ]) 


    const themeContext = useContext(ThemeContext) ; 
    const styles = themeContext.getTheme() == "light" ? lightStyles : darkStyles

    return (
        <View style={styles.container}>
            <Header
                navigation={navigation}
            />
            <View style={styles.content}>

                <Text style={styles.title}>
                    لماذا ستغادر ... ؟

                </Text>
                <Text style={styles.text}>
                    نأسف لرؤيتك تغادر نود أن نعرف سبب رغبتك في حذف حسابك حتى نتمكن من تحسي التطبيق ودعم مجتمعنا
                </Text>

                <TouchableOpacity style={styles.reason} onPress = { () => setReason(0)} >
                    {
                        reason != 0 &&
                        <Feather name="circle" style={styles.icon} />
                    }
                    {
                        reason == 0 &&
                        <AntDesign name="checkcircle" style={[styles.icon, styles.blueIcon]} />
                    }
                    <Text style={styles.reasonText}>
                        انشاء حساب اخر

                    </Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.reason} onPress = { () => setReason(1)} >
                    {
                        reason != 1 &&
                        <Feather name="circle" style={styles.icon} />
                    }
                    {
                        reason == 1 &&
                        <AntDesign name="checkcircle" style={[styles.icon, styles.blueIcon]} />
                    }
                    <Text style={styles.reasonText}>
                        بسبب كثرة الاعلانات

                    </Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.reason} onPress = { () => setReason(2)} >
                    {
                        reason != 2 &&
                        <Feather name="circle" style={styles.icon} />
                    }
                    {
                        reason == 2 &&
                        <AntDesign name="checkcircle" style={[styles.icon, styles.blueIcon]} />
                    }
                    <Text style={styles.reasonText}>
                        لا يمكن العثور على اشخاص للمتابعة

                    </Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.reason} onPress = { () => setReason(3)} >
                    {
                        reason != 3 &&
                        <Feather name="circle" style={styles.icon} />
                    }
                    {
                        reason == 3 &&
                        <AntDesign name="checkcircle" style={[styles.icon, styles.blueIcon]} />
                    }
                    <Text style={styles.reasonText}>
                        قلق بسبب بياناتي

                    </Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.reason} onPress = { () => setReason(4)} >
                    {
                        reason != 4 &&
                        <Feather name="circle" style={styles.icon} />
                    }
                    {
                        reason == 4 &&
                        <AntDesign name="checkcircle" style={[styles.icon, styles.blueIcon]} />
                    }
                    <Text style={styles.reasonText}>
                        مخاوف الخصوصية

                    </Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.reason} onPress = { () => setReason(5)} >
                    {
                        reason != 5 &&
                        <Feather name="circle" style={styles.icon} />
                    }
                    {
                        reason == 5 &&
                        <AntDesign name="checkcircle" style={[styles.icon, styles.blueIcon]} />
                    }
                    <Text style={styles.reasonText}>
                        سبب اخر
                    </Text>
                </TouchableOpacity>
                <PrimaryButton
                    title = {"متابعة"}
                    style = { styles.button}
                    onPress = { openConfirmation }
                />

            </View>
        </View>
    )
};

const lightStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "white"
    },
    content: {
        padding: 16
    },
    title: {
        fontFamily: textFonts.semiBold,
        color: "#212121",
        fontSize: 16,


    },
    text: {
        color: "#706D6D",
        fontFamily: textFonts.regular,
        fontSize: 14,
        marginTop: 8,
    },
    button: {
        marginVertical: 52,
        marginBottom: 32

    },
    reasonText: {
        fontFamily: textFonts.regular,
        color: "#212121",
        fontSize: 14,
        flex: 1,
       
    },
    reason: {
        marginTop: 16,
        flexDirection: "row",
    },
    icon: {
        fontSize: 24,
        color: "#666"
    },
    blueIcon: {
        color: "#1A6ED8"
    },
 
})

const darkStyles = { 
    ...lightStyles , 
    container: {
        flex: 1,
        backgroundColor: darkTheme.backgroudColor
    },
    title: {
        fontFamily: textFonts.semiBold,
        color: darkTheme.textColor,
        

    },
    text: {
        color :  darkTheme.secondaryTextColor , 
        fontFamily: textFonts.regular,
        fontSize: 12,
        marginTop: 8
    },
  
    reasonText: {
        fontFamily: textFonts.regular,
        color: darkTheme.textColor ,
        fontSize: 14,
        flex: 1,
       
    },
}