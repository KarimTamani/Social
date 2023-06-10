import { useCallback, useContext } from "react";
import { View, Text, StyleSheet, Image, ScrollView } from "react-native";
import PrimaryButton from "../../../components/Buttons/PrimaryButton";
import Header from "../../../components/Cards/Header";
import darkTheme from "../../../design-system/darkTheme";
import { textFonts } from "../../../design-system/font";
import ThemeContext from "../../../providers/ThemeContext";

export default function DeactivateAccount({ navigation  }) {
    const openConfirmation = useCallback(() => { 
        navigation.navigate("ConfirmDisable" , { 
            remove : false
        }) ; 
    } , [ navigation ])  ; 



    const themeContext = useContext(ThemeContext) ; 
    const styles = themeContext.getTheme() == "light" ? lightStyles : darkStyles
    return (
        <View style={styles.container}>
            <Header 
                navigation = { navigation }
            />
            <ScrollView>

                <Image source={require("../../../assets/icons/ban-user.png")} style={styles.banUser} />
                <View style={styles.content}>

                    <View style={styles.option}>
                        <Text style={styles.title}>
                            هل تريد تعطيل هذا الحساب ؟ khairallahghazi

                        </Text>
                        <Text style={styles.text}>
                            إذا قمت بتعطيل حسابك

                        </Text>

                        <Text style={styles.text}>
                            <Image source={require("../../../assets/icons/flower.png")} /> لن يرى أحد حسابك والمحتوى الخاص بك
                        </Text>

                        <Text style={styles.text}>

                            <Image source={require("../../../assets/icons/flower.png")} /> قد تظل المعلومات غير المخزنة في حسابك، مثل الرسائل الخاصة ، مرئية للآخرين.

                        </Text>

                        <Text style={styles.text}>

                            <Image source={require("../../../assets/icons/flower.png")} /> سيستمر ... في الاحتفاظ ببياناتك حتى يتمكن من استعادتها عند إعادة تنشيط حسابك.

                        </Text>

                        <Text style={styles.text}>

                            <Image source={require("../../../assets/icons/flower.png")} /> يمكنك إعادة تنشيط حسابك واستعادة كل المحتوى في أي وقت باستخدام نفس تفاصيل تسجيل الدخول.

                        </Text>
                    </View>

                    <PrimaryButton
                        title={"تعطيل"}
                        style={styles.button}
                        onPress = { openConfirmation }
                    />
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
    // 
    banUser: {
        alignSelf: "center",
        marginVertical: 16
    },
    option: {
        backgroundColor: "#EBF3FF",
        padding: 16
    },
    content: {
        padding: 16
    },
    title: {
        fontFamily: textFonts.bold,
        color: "#212121",
        fontSize: 14,


    },
    text: {
        color: "#706D6D",
        fontFamily: textFonts.regular,
        fontSize: 14,
        marginTop: 8,
    },
    button: {
        marginVertical: 52 , 
        marginBottom: 32 
        
    }
})

const darkStyles = { 
    ...lightStyles , 
    container: {
        flex: 1,
        backgroundColor: darkTheme.backgroudColor
    }, 
    
}