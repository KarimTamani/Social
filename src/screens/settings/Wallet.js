import { useContext } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import Header from "../../components/Cards/Header";
import darkTheme from "../../design-system/darkTheme";
import { textFonts } from "../../design-system/font";
import ThemeContext from "../../providers/ThemeContext";

export default function Wallet({ navigation }) {



    const themeContext = useContext(ThemeContext) ; 
    const styles = themeContext.getTheme() == "light" ? lightStyles : darkStyles
    

    return (
        <View style={styles.container}>
            <Header
                navigation={navigation}
            />
            <TouchableOpacity style={styles.route} onPress={() => navigation.navigate("Revenue", { title: "إيرادات الهدايا" })}>
                <Image source={require("../../assets/icons/voucher.png")} style={styles.icon} />
                <Text style={styles.routeText}>
                    إيرادات الهدايا
                </Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.route} onPress={() => navigation.navigate("Revenue", { title: "إيرادات الخدمات" })}>
                <Image source={require("../../assets/icons/financial-profi.png")} style={styles.icon} />
                <Text style={styles.routeText}>
                    إيرادات الخدمات
                </Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.route} onPress={() => navigation.navigate("Deposite")}>
                <Image source={require("../../assets/icons/payment.png")} style={styles.icon} />
                <Text style={styles.routeText}>
                    إعادة الشحن
                </Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.route} onPress={() =>  navigation.navigate("RevenueValidation")}>
                <Image source={require("../../assets/icons/money.png")} style={styles.icon} />
                <Text style={styles.routeText}>
                    طلب تحقيق الدخل
                </Text>
            </TouchableOpacity>
        </View>
    )
};

const lightStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "white"
    },
    route: {
        flexDirection: "row-reverse",
        justifyContent: "space-between",
        borderBottomColor: "#eee",
        borderBottomWidth: 1,
        marginBottom: 8,
        paddingBottom: 8,
        alignItems: "center",
        paddingHorizontal: 8
    },
    routeText: {
        flex: 1,
        fontFamily: textFonts.regular,
        textAlignVertical: "center",
        color: "#666"
    },
    icon: {
        width: 48,
        resizeMode: "contain"
    }
})



const darkStyles = {
    ...lightStyles , 
    container: {
       flex: 1,
       backgroundColor : darkTheme.backgroudColor
   },
   routeText: {

       flex: 1,
       fontFamily: textFonts.regular,
       textAlignVertical: "center",
       color: darkTheme.textColor 

   }
   ,
   route: {
       flexDirection: "row-reverse",
       justifyContent: "space-between",
       borderBottomColor: darkTheme.borderColor ,
       borderBottomWidth: 1,
       marginBottom: 8,
       paddingBottom: 8,
       alignItems: "center",
       paddingHorizontal: 8

   },
}

/*






*/