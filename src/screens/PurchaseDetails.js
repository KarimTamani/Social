import { View, Text, StyleSheet, ScrollView } from "react-native";
import { BorderlessButton } from "react-native-gesture-handler";
import PrimaryButton from "../components/Buttons/PrimaryButton";
import PurchaseItem from "../components/Cards/deals/PurchaseItem";
import { textFonts } from "../design-system/font";
import ServiceButton from "../components/Buttons/ServiceButton";
import { useCallback, useContext } from "react";

import SignContract from "../components/Cards/deals/SignContract";
import ThemeContext from "../providers/ThemeContext";
import darkTheme from "../design-system/darkTheme";

const description = `
تم تصميم العمل باستخدام برنامج الاليستريتور
شكرا لزيارتك :)
تص  وستر / تصاميم انستغرام / تصاميم فوتوشوب / تصاميم اليستريتور / موكب / تصميم منيو مطاعم / تصميم لوغو / تصميم شعار / تصميم لوجو / تصميم / جرافيك ديزاين / تصميم واجهات المستخدم / تصميم تجربة المستخدم / تصميم بروشور / تصميم فلايرات / تصميم uiux / تصميم .

`

export default function PurchaseDetails({ route, navigation }) {
    const { item, sellerMode } = route.params;


    const openConversation = useCallback(() => {
        navigation.navigate("Conversation", {

        });
    }, [item])



    const themeContext = useContext(ThemeContext) ; 
    const styles = themeContext.getTheme() == "light" ? lightStyles : darkStyles


    return (
        <ScrollView style={styles.container}>
            <PurchaseItem
                item={item}
                sellerMode={sellerMode}
            />
            <Text style={styles.description} numberOfLines={5} ellipsizeMode={"tail"}>
                {description}
            </Text>
            <View style={{ padding: 16 }}>
                {

                    item.status == "pending" && sellerMode &&
                    <SignContract navigation={navigation} />
                }

                <Text style={styles.title}>
                    إدارة الطلب
                </Text>

                {
                    item.status == "executing" &&
                    <ServiceButton
                        style={styles.message}
                        text="مراسلة"
                        openConversation={openConversation}
                        openServiceAsk={openConversation}
                    />

                }
                <View style={styles.row}>
                    <Text style={styles.label}>
                        حالة الطلب

                    </Text>
                    <Text style={[styles.activeValue]}>
                        {item.statusText}
                    </Text>
                </View>

                {
                    item.status == "executing" &&
                    <View style={styles.row}>
                        <Text style={[styles.label, { color: "#888" }]}>
                            تاريخ الإستلام
                        </Text>
                        <Text style={[styles.activeValue, { color: "#888" }]}>
                            08/08/2023
                        </Text>
                    </View>
                }

                <View style={styles.footer}>
                    <PrimaryButton
                        title={"رفض"}
                        style={[styles.footerInput]}
                    />
                    <PrimaryButton
                        title={"الإبلاغ عن مشكلة"}
                        style={styles.redOutline}
                        outline={true}
                        textStyle={{ color: "#ff0000" }}

                    />
                </View>
            </View>


        </ScrollView>
    )
};



const lightStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "white"
    },
    description: {
        fontFamily: textFonts.regular,
        fontSize: 12,
        paddingHorizontal: 16,
        borderBottomColor: "#eee",
        borderBottomWidth: 1,
        paddingBottom: 16,
        marginTop: -16
    },
    row: {
        flexDirection: "row-reverse",
        marginTop: 8
    },
    title: {
        fontFamily: textFonts.bold,
    },

    label: {
        flex: 1,
        textAlign: "right",
        fontFamily: textFonts.regular,
    },

    activeValue: {
        color: "#1A6ED8",
        fontFamily: textFonts.bold,
        fontSize: 12,
        flex: 2,
        textAlign: "right",
    },
    footer: {
        flexDirection: "row-reverse",
        alignItems: "flex-end",
        marginHorizontal: -16,
        marginTop: 16
    },
    footerInput: {
        width: 128,
        marginHorizontal: 16,
        backgroundColor: "#FF0000",
    },
    redOutline: {
        borderColor: "#FF0000"
    },
    message: {
        width: 112,
        alignSelf: "flex-end",
        marginVertical: 16
    }
})

const darkStyles = { 
    ...lightStyles , 
    container: {
        flex: 1,
        backgroundColor: darkTheme.backgroudColor 
    },
    description: {
        fontFamily: textFonts.regular,
        fontSize: 12,
        paddingHorizontal: 16,
        borderBottomColor: darkTheme.borderColor,
        borderBottomWidth: 1,
        paddingBottom: 16,
        marginTop: -16 , 
        color : darkTheme.textColor 
    },

    label: {
        flex: 1,
        textAlign: "right",
        fontFamily: textFonts.regular,
        color : darkTheme.textColor 
    
    },

    title: {
        fontFamily: textFonts.bold,
        color : darkTheme.textColor 
   
    },
}