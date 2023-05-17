import { useContext } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import darkTheme from "../../../design-system/darkTheme";
import { textFonts } from "../../../design-system/font";
import ThemeContext from "../../../providers/ThemeContext";
export default function PurchaseItem({ item, onPress , sellerMode}) {



    const themeContext = useContext(ThemeContext) ; 
    const styles = themeContext.getTheme() == "light" ? lightStyles : darkStyles

    return (

        <TouchableOpacity style={styles.item} onPress={() => onPress && onPress(item)} activeOpacity={(onPress) ? 0.5 : (1)}>
            <View style={styles.row}>
                <Text style={styles.label}>
                    حالة الطلب

                </Text>
                <Text style={[styles.value, styles.activeValue]}>
                    {item.statusText}
                </Text>
            </View>

            <View style={styles.row}>
                <Text style={styles.label}>
                    تكلفة الطلب

                </Text>
                <Text style={styles.value}>
                    {item.price} $
                </Text>
            </View>

            <View style={styles.row}>
                <Text style={styles.label}>
                    تاريخ الشراء

                </Text>
                <Text style={styles.value}>
                    {item.date}
                </Text>
            </View>

            <View style={styles.row}>
                <Text style={styles.label}>
                    {
                        (sellerMode) ? ("المشتري") : ("بائع")
                    }
                    
                </Text>
                <Text style={[styles.value, styles.activeValue]}>
                    {item.seller}
                </Text>
            </View>
        </TouchableOpacity>

    )

};

const lightStyles = StyleSheet.create({
    row: {
        flexDirection: "row-reverse",
        marginTop: 8
    },

    label: {
        flex: 1,
        textAlign: "right",
        fontFamily: textFonts.regular,
    },
    value: {
        flex: 2,
        fontFamily: textFonts.regular,

        textAlign: "right"
    },
    activeValue: {
        color: "#1A6ED8",
        fontFamily: textFonts.semiBold,
        fontSize: 12
    },
    item: {
        borderBottomColor: "#eee",
        borderBottomWidth: 1,
        paddingBottom: 16,
        marginTop: 12,
        backgroundColor: "white",
        padding: 16,
        paddingTop: 8
    }

})

const darkStyles = { 
    ...lightStyles , 
  
    item: {

        borderBottomWidth: 1,
        paddingBottom: 16,
        marginTop: 12,
        backgroundColor: darkTheme.backgroudColor ,
        padding: 16,
        paddingTop: 8 , 
        borderBottomColor: darkTheme.borderColor ,
    } , 

    label: {
        flex: 1,
        textAlign: "right",
        fontFamily: textFonts.regular,
        color : darkTheme.textColor , 
    },
    value: {
        flex: 2,
        fontFamily: textFonts.regular,

        textAlign: "right" , 

        color : darkTheme.textColor , 
    },


}