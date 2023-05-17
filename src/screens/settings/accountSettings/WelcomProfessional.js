import { useContext } from "react";
import { View, Text, StyleSheet } from "react-native";
import PrimaryButton from "../../../components/Buttons/PrimaryButton";
import darkTheme from "../../../design-system/darkTheme";
import { textFonts } from "../../../design-system/font";
import ThemeContext from "../../../providers/ThemeContext";

export default function WelcomProfessional({ }) {


    const themeContext = useContext(ThemeContext);
    const styles = themeContext.getTheme() == "light" ? lightStyles : darkStyles

    return (
        <View style={styles.container}>
            <Text style={styles.title}>
                مرحبا بك في الوضع الاحترافي

            </Text>
            <Text style={styles.text}>
                يمكنك استخدام الأدوات الاحترافية لزيادة عدد جمهورك وتحقيق الأرباح اذا كنت مؤهلا لذلك ,فم باختيار فئة ملفك الشخصي

            </Text>
            <PrimaryButton
                title={"اختيار فئة الملف الشخصي"}
                style={styles.button}

            />
            <PrimaryButton
                title={"عرض ملفك الشخصي"}
                outline={true}
                style={styles.button}
            />
        </View>
    )
};
const lightStyles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16
    },
    title: {
        fontFamily: textFonts.semiBold,
        color: "#212121",
        fontSize: 16,
        textAlign: "center",
        marginBottom: 16
    },
    text: {
        color: "#706D6D",
        fontFamily: textFonts.regular,
        fontSize: 14,
        marginTop: 8,
        marginBottom: 16
    },
    button: {
        marginTop: 16
    }
});


const darkStyles = {
    ...lightStyles,
    container: {
        flex: 1,
        padding: 16
    },


    title: {
        fontFamily: textFonts.semiBold,
        color: darkTheme.textColor,

        fontSize: 16,
        textAlign: "center",
        marginBottom: 16
    }   
    ,
    text: {
        color: darkTheme.secondaryTextColor,
        fontFamily: textFonts.regular,
        fontSize: 14,
        marginTop: 8,
        marginBottom: 16
    },
    
    
}