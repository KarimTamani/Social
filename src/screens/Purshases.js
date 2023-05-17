import { useCallback, useContext } from "react";
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from "react-native";
import PurchaseItem from "../components/Cards/deals/PurchaseItem";
import darkTheme from "../design-system/darkTheme";
import { textFonts } from "../design-system/font";
import ThemeContext from "../providers/ThemeContext";

const purshases = [{
    id: 1,
    
    statusText: "في انتظار التعليمات",
    status : "pending" , 

    price: 5,
    date: "05/12/2023",
    seller: "خير الله غازي"
},
{
    id: 2,
    statusText: "قيد التنفيذ حاليا",
    status : "executing" , 

    price: 15,
    date: "05/12/2023",
    seller: "تماني كريم"
}
]



export default function Purshases({ navigation }) {

    const openPurchaseDetails = useCallback((item) => {
        navigation.navigate("PurchaseDetails" , { 
            item : item , 
            sellerMode : false 
        })

    }, [])

    const renderItem = useCallback(({ item, index }) => {

        return (
            <PurchaseItem
                item={item}
                onPress={openPurchaseDetails}
            />
        )
    }, [])

    const keyExtractor = useCallback((item) => {
        return item.id;
    }, []) ; 

    const themeContext = useContext(ThemeContext) ; 
    const styles = themeContext.getTheme() == "light" ? lightStyles : darkStyles

    return (
        <View style={styles.container}>
            <FlatList
                data={purshases}
                keyExtractor={keyExtractor}
                renderItem={renderItem}

            />
        </View>
    )
};

const lightStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.01)",
    },

})

const darkStyles = { 
    ...lightStyles , 
    container: {
        flex: 1,
        backgroundColor: darkTheme.secondaryBackgroundColor ,
    },
}