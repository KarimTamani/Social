import { useContext } from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import PrimaryButton from "../../components/Buttons/PrimaryButton";
import darkTheme from "../../design-system/darkTheme";
import { textFonts } from "../../design-system/font";
import ThemeContext from "../../providers/ThemeContext";
export default function PrivateAccount({ navigation }) {

    const themeContext = useContext(ThemeContext) ; 
    const styles = themeContext.getTheme() == "light" ? lightStyles : darkStyles

    return (
        <View style={styles.container}>
            <Text style={styles.title}>
                هل تريد التبديل الى حساب خاص ؟
            </Text>
            <View style={styles.content}>

                <View style={styles.row}>
                    <Text style={styles.text}>لا يمكن لاي شخص مشاهدة الصور ومقاطع الفيديو الخاصة بك الا متابعوك فقط</Text>
                    <Image source={require("../../assets/icons/images.png")} style={styles.icon} />
                </View>

                <View style={styles.row}>
                    <Text style={styles.text}>لن يؤدي هذا الاجراء الى تغيير من يمكنه ارسال رسالة اليك</Text>
                    <Image source={require("../../assets/icons/messaging.png")} style={styles.icon} />
                </View>

                <PrimaryButton
                    title={"تبديل الى حساب خاص"}
                    
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
    title: {
        fontFamily: textFonts.semiBold,
        textAlign: "center",
        fontSize: 16,
        marginVertical: 16
    },
    content: {
        padding: 16
    },
    text: {
        color: "#706D6D",
        fontFamily: textFonts.regular , 
        flex : 1  , 
        paddingRight : 12 , 
        lineHeight : 24 
    },
    icon: {

        resizeMode: "contain", 
    },
    row: {
        flexDirection: "row",
        justifyContent : "space-between" , 
        alignItems : "center" , 
        marginBottom : 16 
    }
})


const darkStyles = {
    ...lightStyles , 
    container: {
        flex: 1,
        backgroundColor: darkTheme.backgroudColor 
    },
    title: {
        fontFamily: textFonts.semiBold,
        textAlign: "center",
        fontSize: 16,
        marginVertical: 16 , 
        color :darkTheme.textColor 
    },
    content: {
        padding: 16
    },
    text: {
        color: "#706D6D",
        fontFamily: textFonts.regular , 
        flex : 1  , 
        paddingRight : 12 , 
        lineHeight : 24  , 
        color :darkTheme.secondaryTextColor 
    },
}