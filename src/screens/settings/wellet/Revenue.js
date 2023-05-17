import { useContext } from "react";
import { View, Text, StyleSheet } from "react-native";
import PrimaryButton from "../../../components/Buttons/PrimaryButton";
import Header from "../../../components/Cards/Header";
import darkTheme from "../../../design-system/darkTheme";
import { textFonts } from "../../../design-system/font";
import ThemeContext from "../../../providers/ThemeContext";

export default function Revenue({ navigation, route }) {
    const { title } = route.params;


    const themeContext = useContext(ThemeContext) ; 
    const styles = themeContext.getTheme() == "light" ? lightStyles : darkStyles

    return (
        <View style={styles.container}>
            <Header
                title={title}
                navigation={navigation}
            />
            <View style={styles.content}>

                <View style={styles.card}>
                    <Text style={styles.title}>
                        اجمالي الرصيد

                    </Text>
                    <Text style={styles.title}>
                        200$
                    </Text>
                    <Text style={styles.text}>
                        مجموع الماس : 48.258

                    </Text>
                    <PrimaryButton
                        title={"سحب"}
                        style = { styles.button}
                    />
                </View>
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
        
        flex: 1,
        alignItems: "center",
        justifyContent: "center"
    } , 
    title : {
        textAlign : "center" , 
        fontFamily : textFonts.bold, 
        fontSize : 16 , 
        marginBottom : 12 
    } , 
    text : { 
        color : "#666" , 
        fontFamily : textFonts.regular , 
        marginBottom : 12 , 
        textAlign : "center" 
    } , 
    button : { 
        width : 256 , 
        backgroundColor : "#ff0000" , 
        borderRadius : 0
    } , 
    card : { 
        backgroundColor : "#eee" , 
        padding : 16 , 
        paddingVertical : 32 
    }

})
const darkStyles = { 
    ...lightStyles , 
    container: {
        flex: 1,
        backgroundColor: darkTheme.backgroudColor 
    }, 
    card : { 
        backgroundColor : darkTheme.secondaryBackgroundColor  , 
        padding : 16 , 
        paddingVertical : 32 
    } , 
    title : {
        textAlign : "center" , 
        fontFamily : textFonts.bold, 
        fontSize : 16 , 
        marginBottom : 12 , 
        color : darkTheme.textColor ,  
    } , 
    text : { 
        color : "#666" , 
        fontFamily : textFonts.regular , 
        marginBottom : 12 , 
        textAlign : "center"  , 
        color : darkTheme.secondaryTextColor , 
    } , 


}