import { isEmergencyLaunch } from "expo-updates";
import { useCallback, useContext } from "react";
import { View, Text, StyleSheet, Image, FlatList, TouchableOpacity } from "react-native";
import { AntDesign } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons';
import { textFonts } from "../../../design-system/font";
import ThemeContext from "../../../providers/ThemeContext";
import darkTheme from "../../../design-system/darkTheme";
const orders = [
    {

        id: 5,

        user: {
            name: "تماني كريم",
            image: require("../../../assets/illustrations/user.png")
        },

        statusText: "في انتظار التعليمات",
        status: "pending",
        type: "service",
        content: {
            title: "تطوير الويب باستخدام جافا سكريبت",
        },
        date: "12/03/2023",
        price: 200,
        seller: "تماني كريم"
    },
    {
        id: 6,

        statusText: "في انتظار التعليمات",
        status: "pending",
        user: {
            name: "خير الله غازي",
            image: require("../../../assets/illustrations/mainUser.jpeg")
        },
        type: "service",

        content: {
            title: "The latest social media design",
        },
        date: "08/02/2023",
        price: 75,
        seller: "خير الله غازي"

    }
]


export default function OrdersList({ navigation }) {


  
    const openPurchaseDetails = useCallback((item) => {
        navigation.navigate("OrderDetails", {
            item: item , 
            sellerMode : true 
        })

    }, [navigation])
    const renderItem = useCallback(({ item }) => {
        return (
            <TouchableOpacity style={styles.item} onPress={() => openPurchaseDetails(item)}>
                <Image source={item.user.image} style={styles.userImage} />
                <View style={styles.infoSection}>
                    <Text style={styles.serviceTitle} numberOfLines={1} ellipsizeMode="tail">
                        {item.content.title}
                    </Text>
                    <View style={styles.dealInfo}>
                        <View style={styles.info}>

                            <Text style={styles.info}>
                                {item.user.name}
                            </Text>
                            <AntDesign name="user" style={styles.infoIcon} />
                        </View>
                        <View style={styles.info}>

                            <Text style={styles.info}>
                                {item.price}

                            </Text>
                            <FontAwesome name="dollar" style={styles.infoIcon} />

                        </View>

                        <View style={styles.info}>
                            <Text style={styles.info}>
                                {item.date}
                                
                            </Text>
                            <AntDesign name="clockcircleo" style={styles.infoIcon} />

                        </View>

                    </View>
                </View>

            </TouchableOpacity>
        )
    }, []);
    const keyExtractor = useCallback((item) => {
        return item.id;
    }, [])

    const themeContext = useContext(ThemeContext) ; 
    const styles = themeContext.getTheme() == "light" ? lightStyles : darkStyles


    return (
        <View style={styles.container}>
            <FlatList
                data={orders}
                keyExtractor={keyExtractor}
                renderItem={renderItem}
            />
        </View>
    )

};

const lightStyles = StyleSheet.create({
    container: {
        flex: 1,
        
        
    },
    userImage: {
        width: 48,
        height: 48,
        borderRadius: 48
    },
    item: {
        flexDirection: "row-reverse",
        padding: 16,
        alignItems: "center",
        borderWidth: 1,
        borderColor: "#ddd",
        marginTop: 8,
        borderRadius: 8 , 
        


    },
    infoSection: {
        flex: 1,
        paddingRight: 12,
    },
    serviceTitle: {
        fontFamily: textFonts.semiBold,
        color: "#333",
        fontSize: 14
    },
    dealInfo: {

        flexDirection: "row-reverse",
        justifyContent: "space-between",
        marginTop: 8
    },
    info: {
        fontFamily: textFonts.regular,
        color: "#666",
        fontSize: 12,
        flexDirection: "row",
        alignItems: "center",
    },
    infoIcon: {
        color: "#666",
        marginLeft: 4,
        fontSize: 14
    }

})


const darkStyles = { 
    ...lightStyles , 
   
   
    item: {
        flexDirection: "row-reverse",
        padding: 16,
        alignItems: "center",
        borderWidth: 1,
        borderColor: "#ddd",
        marginTop: 8,
        borderRadius: 8 , 
        backgroundColor : darkTheme.backgroudColor , 
        borderColor : darkTheme.borderColor 

    },
    serviceTitle  :  { 
        
        fontFamily: textFonts.semiBold,
        color: "#333",
        fontSize: 14 , 
        color : darkTheme.textColor 
    } ,
    info: {
        fontFamily: textFonts.regular,
        color: darkTheme.secondaryTextColor,
        fontSize: 12,
        flexDirection: "row",
        alignItems: "center",
    },
    infoIcon: {
        
        color: darkTheme.secondaryTextColor,
        marginLeft: 4,
        fontSize: 14
    }

}