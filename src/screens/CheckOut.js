
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import Header from "../components/Cards/Header";
import { textFonts } from "../design-system/font";
import { useCallback, useContext, useEffect } from "react";
import ThemeContext from "../providers/ThemeContext";
import darkTheme from "../design-system/darkTheme";


export default function CheckOut({ route , navigation  }) {

    var price = 16
    if (route.params && route.params.price)
        price = route.parasm.price;


    const pay = useCallback(() => {
        navigation.navigate("DealsRoute")
    }, []) ; 



    const themeContext = useContext(ThemeContext) ; 
    const styles = themeContext.getTheme() == "light" ? lightStyles : darkStyles

    return (
        <View style={styles.container}>
            <Header 
                navigation={ navigation }
            />
            <View style={styles.content}>

                <View style={styles.bill}>
                    <View style={styles.section}>
                        <Text style={styles.billText}>
                            السعر
                        </Text>
                        <Text style={styles.amount}>{price} $</Text>
                    </View>

                    <View style={styles.section}>
                        <Text style={styles.billText}>
                            الضرائب
                        </Text>
                        <Text style={styles.amount}>{4} $ </Text>
                    </View>

                    <View style={styles.section}>
                        <Text style={styles.billText}>
                            السعر الكلي
                        </Text>
                        <Text style={styles.amount}>{price + 4} $</Text>
                    </View>
                </View>
            </View>


            <TouchableOpacity style={styles.button} onPress={pay}>
                <Text style={styles.buttonText}>
                    يدفع
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
    content: {
        padding: 16
    },
    billText: {
        fontFamily: textFonts.medium,
        color: "#212121",
    },
    amount: {
        paddingRight: 8,
        color: "#1A6ED8",
        fontWeight: "bold"
    },
    section: {
        flexDirection: "row-reverse",
        justifyContent: "space-between",
        marginBottom: 4
    },
    bill: {
        padding: 16,
        borderWidth: 1,
        borderColor: "#eee",
        borderRadius: 12
    },
    button: {
        padding: 8,
        alignSelf: "center",
        width: 128,
        backgroundColor: "#1A6ED8",
        alignItems: "center",
        borderRadius: 26,
        marginVertical: 56
    },
    buttonText: {
        color: "white",
        fontFamily: textFonts.semiBold
    },
})

const darkStyles = { 
    ...lightStyles , 
    container: {
        flex: 1,
        backgroundColor: darkTheme.backgroudColor 
    },
    
    bill: {
        padding: 16,
        borderWidth: 1,
        borderColor: darkTheme.borderColor ,
        borderRadius: 12 , 
        
        backgroundColor: darkTheme.secondaryBackgroundColor 
    },
    billText: {
        fontFamily: textFonts.medium,
        color : darkTheme.textColor 
    },


}