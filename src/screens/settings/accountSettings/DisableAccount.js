import { View, StyleSheet, Text, TouchableOpacity } from "react-native";
import Header from "../../../components/Cards/Header";
import { textFonts } from "../../../design-system/font";
import { Entypo } from '@expo/vector-icons';
import { useCallback, useContext } from "react";
import ThemeContext from "../../../providers/ThemeContext";
import darkTheme from "../../../design-system/darkTheme";

export default function DisableAccount({ navigation }) {

    const openDeactivateAccount = useCallback(() => { 
        navigation.navigate("DeactivateAccount") ; 
    } , [ navigation ]) ; 

    const openRemoveAccount = useCallback(() => { 
        navigation.navigate("RemoveAccount") ; 
    } , [ navigation ])

    const themeContext = useContext(ThemeContext) ; 
    const styles = themeContext.getTheme() == "light" ? lightStyles : darkStyles

    return (
        <View style={styles.container}>
            <Header
                title={
                    <Text>تعطيل الحساب أو إزالته</Text>
                }
                navigation = { navigation }
            />
            <View style={styles.content}>

                <Text style={styles.title}>
                    هل تريد تعطيل حسابك بشكل مؤقت أو حذفه

                </Text>
                <Text style={styles.text}>
                    إذا كنت تريد مغادرة ... مؤقتًا، فما عليك سوى تعطيل حسابك. إذا اخترت حذف حسابك بدلاً من ذلك، فلن تتمكن من استعادته بعد 30 يومًا.

                </Text>
                <TouchableOpacity style={[styles.option, styles.firstOption]} onPress = { openDeactivateAccount} >
                    <View style={styles.optionHeader}>
                        <Entypo name="chevron-left" size={24} color="#666" />

                        <Text style={[styles.title, { flex: 1} , styles.darkTitle]}>
                            تعطيل الحساب

                        </Text>
                    </View>

                    <Text style={[styles.text , styles.darkText]}>
                        لا يمكن لأي شخص رؤية حسابك، بما في ذلك جميع المحتويات المخزنة فيه. أعد تنشيط حسابك واسترد كل المحتوى في أي وقت

                    </Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.option} onPress = { openRemoveAccount} >
                    <View style={styles.optionHeader}>
                        <Entypo name="chevron-left" size={24} color="#666" />


                        <Text style={[styles.title, { flex: 1 }, styles.darkTitle]}>

                            حذف الحساب

                        </Text>
                    </View>
                    <Text style={[styles.text , styles.darkText]}>
                        سيتم حذف حسابك والمحتوى الخاص بك بشكل دائم. يمكنك إلغاء طلب الحذف عن طريق إعادة تنشيط حسابك خلال 30 يومًا.

                    </Text>
                </TouchableOpacity>

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
        fontSize: 14,


    },
    text: {
        color: "#706D6D",
        fontFamily: textFonts.regular,
        fontSize: 14,
        marginTop: 8,
    },

    option: {
        backgroundColor: "#EBF3FF",
        padding: 16,

    },
    firstOption: {
        marginTop: 16,
        borderBottomColor: "#ccc",
        borderBottomWidth: 1
    },
    optionHeader: {
        flexDirection: "row"
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
        color: darkTheme.textColor,
        

    },
    text: {
        color :  darkTheme.secondaryTextColor , 
        fontFamily: textFonts.regular,
        fontSize: 12,
        marginTop: 8
    },
    darkText : { 

        color: "#706D6D",
        fontFamily: textFonts.regular,
        fontSize: 14,
        marginTop: 8,
    } , 

    darkTitle : { 
       
        fontFamily: textFonts.semiBold,
        color: "#212121",
        fontSize: 14, 
    }
}