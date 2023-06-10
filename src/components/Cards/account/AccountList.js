import { View, Text, StyleSheet, Image , Switch } from "react-native";
import { textFonts } from "../../../design-system/font";
import AccountListItem from "./AccountListItem";
import { useCallback, useContext, useEffect, useState } from "react";
import ThemeContext from "../../../providers/ThemeContext";
import darkTheme from "../../../design-system/darkTheme";

export default function AccountList({ navigation }) {

    const themeContext = useContext(ThemeContext) ; 

    const [isEnabled, setIsEnabled] = useState(false);

    useEffect(() => { 
        setIsEnabled(themeContext.getTheme() == "dark")
    } , [])
    const toggleSwitch = () => { 
        setIsEnabled(previousState => !previousState)
        themeContext.toggleTheme() ; 
    }
    const openDeals = useCallback(() => {
        navigation.navigate("DealsRoute");
    }, [navigation]);

    const openFavorites = useCallback(() => { 
        navigation.navigate ("Favorites") ; 
    } , [navigation ])

    const styles = themeContext.getTheme() == "light" ? lightStyles : darkStyles;


    return (
        <View style={styles.container}>
            <Text style={styles.title}>
                قائمتك

            </Text>
            <View style={styles.row}>
                <View style={styles.section}>
                    <AccountListItem
                        onPress={openDeals}
                        icon={
//                            <AntDesign name="shoppingcart" style={styles.cardIcon} />

                            <Image source={require("../../../assets/icons/cart.png")} style={styles.cardIcon} />

                        }
                        title="يبيع والطلبات القادمة"
                    />
                </View>

                <View style={styles.section}>
                    <AccountListItem icon={
                        //                        <MaterialIcons name="storefront" style={styles.cardIcon} />
                        <Image source={require("../../../assets/icons/store.png")} style={styles.cardIcon} />

                    }
                        title="الخدمات الإبداعية" />
                </View>

            </View>


            <View style={styles.row}>

                <View style={styles.section}>
                    <AccountListItem icon={
                        <Switch
                            trackColor={{ false: '#767577', true: '#FE0000' }}
                            thumbColor={isEnabled ? '#4348D2' : '#f4f3f4'}
                            ios_backgroundColor="#3e3e3e"
                            onValueChange={toggleSwitch}
                            value={isEnabled}
                        />

                    }
                        title="الوضع المظلم"
                    />
                </View>

                <View style={styles.section}>
                    <AccountListItem 
                    
                        onPress={ openFavorites}
                    icon={

                        <Image source={require("../../../assets/icons/saved.png")} style={styles.cardIcon} />


                    }
                        title="المحفوضات" />
                </View>

            </View>

        </View>
    )
};

const lightStyles = StyleSheet.create({
    container: {
        marginBottom: 56
    },
    title: {
        fontFamily: textFonts.bold,
        marginTop: 16
    },
    row: {
        flexDirection: "row",
        marginHorizontal: -12,
    },
    section: {
        flex: 1,
        padding: 8
    },
    cardIcon: {
        fontSize: 28,
        width: 32 ,
        height: 32 ,
        textAlign: "center",
        textAlignVertical: "center",   
        color : "#FE0000"   
    }
})

const darkStyles  = {
    ...lightStyles , 
    title: {
        fontFamily: textFonts.bold,
        marginTop: 16 , 
        color : darkTheme.textColor
    },
}