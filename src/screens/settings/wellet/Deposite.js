import { View, Text, StyleSheet, ScrollView, Image } from "react-native";
import Header from "../../../components/Cards/Header";
import { textFonts } from "../../../design-system/font";
import PrimaryButton from "../../../components/Buttons/PrimaryButton";
import { useContext } from "react";
import ThemeContext from "../../../providers/ThemeContext";
import darkTheme from "../../../design-system/darkTheme";


var coins = [25, 50, 60, 80, 90, 120, 250, 360, 500];

const RATE = 1/ 2.5;


export default function Deposite({ navigation, route }) {


    const themeContext = useContext(ThemeContext) ; 
    const styles = themeContext.getTheme() == "light" ? lightStyles : darkStyles

    return (
        <View style={styles.container}>
            <Header
                title="إعادة الشحن"
                navigation={navigation}
            />
            <ScrollView>
                <View style={styles.header}>
                    <Text style={styles.title}>
                        رصيد العملة

                    </Text>
                    <Text style={styles.amount}>

                        <Text> 25 </Text>
                        <Image source={require("../../../assets/icons/diamond.png")} />

                    </Text>
                </View>
                <View style={styles.coins}>
                    {
                        coins.map(coin => (
                            <View style={styles.coin}>
                                <Text style={styles.coinAmount}>
                                    <Image source={require("../../../assets/icons/diamond.png")} />

                                    <Text> عملة {coin} </Text>
                                </Text>
                                <PrimaryButton
                                    title={"$" + coin * RATE}
                                    style = { styles.buyButton}
                                    textStyle = { styles.buttonText}
                                />

                            </View>
                        ))
                    }
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
    amount: {

    },
    header: {
        alignItems: "center",

    },
    title: {
        fontFamily: textFonts.regular,
        fontSize: 16,
        marginVertical: 16
    },

    amount: {

        padding : 8 , 
        paddingBottom : 12  , 
        borderRadius: 8,
        elevation: 2,
        marginBottom: 8,
        textAlign: "center",
    },
    coin: {
        flexDirection: "row-reverse",
        padding: 16,
        justifyContent: "space-between" , 
        alignItems : "center"
    } , 
    coinAmount : { 
        fontFamily : textFonts.regular , 
    } , 
    buyButton : {
        width : 86 
    } , 
    buttonText : { 
        fontFamily : textFonts.regular , 
        fontSize : 12
    }
 
})

const darkStyles = { 
    ...lightStyles , 
    container: {
        flex: 1,
        backgroundColor: darkTheme.backgroudColor 
    },
    title: {
        fontFamily: textFonts.regular,
        fontSize: 16,
        marginVertical: 16 , 
        color : darkTheme.textColor , 
    },

    amount: {

        padding : 8 , 
        paddingBottom : 12  , 
        borderRadius: 8,
        elevation: 2,
        marginBottom: 8,
        textAlign: "center",

        color : darkTheme.textColor , 
    } , 
    coinAmount : { 
        fontFamily : textFonts.regular , 
        color : darkTheme.textColor , 
    }
}