import { useContext } from "react";
import { View, Text, StyleSheet, Image, ScrollView } from "react-native";
import Header from "../../../components/Cards/Header";
import darkTheme from "../../../design-system/darkTheme";
import { textFonts } from "../../../design-system/font";
import ThemeContext from "../../../providers/ThemeContext";

export default function RevenueValidation({ navigation, route }) {

    const themeContext = useContext(ThemeContext) ; 
    const styles = themeContext.getTheme() == "light" ? lightStyles : darkStyles

    return (
        <View style={styles.container}>
            <Header
                title={"شروط تحقيق الارباح"}
                navigation={navigation}
            />
            <ScrollView>
                <Image source={require("../../../assets/illustrations/gifts.png")} style={styles.gift} />
                <Text style={styles.intro}>
                    يجب ان تكون الحسابات المؤهلة في وضع

                    جيد وان تتبع إرشادات المجتمع الخاصة بنا وتوافق على شروط الخدمة و سياسة الخصوصية وتفي بمعايير الاهلية المعنية والتي تشمل

                </Text>
                <View style={styles.condition}>

                    <Image source={require("../../../assets/icons/check-mark.png")} style={styles.icon} />
                    <Text style={styles.text}>
                        أن تمتك 5000 من المتابعين على الاقل

                    </Text>

                </View>
                <View style={styles.condition}>

                    <Image source={require("../../../assets/icons/check-mark.png")} style={styles.icon} />
                    <Text style={styles.text}>
                        أن يكون المحتوى حقيقي غير مقلد

                    </Text>

                </View>
                <View style={styles.condition}>

                    <Image source={require("../../../assets/icons/check-mark.png")} style={styles.icon} />
                    <Text style={styles.text}>
                        أن تمتلك حساب حقيقي مر على إنشاؤه 30 يوم

                    </Text>

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
    gift: {
        marginVertical: 16,
        alignSelf: "center"
    },
    intro: {
        fontFamily: textFonts.regular,
        color: "#706D6D",
        paddingHorizontal: 16,
        lineHeight: 24
    },
    condition : { 
        flexDirection : "row-reverse" , 
        paddingHorizontal : 16  , 
        alignItems : "center" , 
        marginTop  : 16 
    } , 
    text : { 
        fontFamily : textFonts.regular , 
        marginRight : 16  ,
        flex : 1 
    }

})

const darkStyles = { 
    ...lightStyles , 
    container: {
        flex: 1,
        backgroundColor: darkTheme.backgroudColor 
    },
    intro: {
        fontFamily: textFonts.regular,
        color: darkTheme.secondaryTextColor,
        paddingHorizontal: 16,
        lineHeight: 24
    }, 
    text : { 
        fontFamily : textFonts.regular , 
        marginRight : 16  ,
        flex : 1  , 
        color: darkTheme.textColor,
    }
}