import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { textFonts } from "../../../design-system/font";
import { useContext } from "react";
import ThemeContext from "../../../providers/ThemeContext";
import darkTheme from "../../../design-system/darkTheme";

export default function AccountListItem({ title, icon , onPress }) {

    const themeContext = useContext(ThemeContext) ; 
    const styles = themeContext.getTheme() == "light" ? lightStyles : darkStyles ;  

    return (
        <TouchableOpacity style={styles.card} onPress = { onPress }>
                {icon}
            <Text style={styles.cardTitle}>
                {title}
            </Text>
        </TouchableOpacity>
    )

};


const lightStyles = StyleSheet.create({
    card: {
        flex: 1,
        alignItems: "flex-end",
        backgroundColor : "white" , 
       
        padding : 12  , 
        elevation : 6 , 
        borderRadius  : 8 
        
    
    },

    iconContainer : { 
        borderRadius : 8  , 
        width : 46 , 
        height : 46 , 
        alignItems : "center" , 
        justifyContent : "center"  , 
        borderRadius: 42,

    } , 
    cardTitle : { 
        fontFamily : textFonts.semiBold , 
        marginTop : 16 , 
        fontSize : 12 
    }
}) ; 
const darkStyles = { 
    ...lightStyles , 
    card: {
        flex: 1,
        alignItems: "flex-end",
       
        backgroundColor : darkTheme.backgroudColor , 
        padding : 12  , 
        elevation : 6 , 
        borderRadius  : 8 
        
    
    },
     
    cardTitle : { 
        fontFamily : textFonts.semiBold , 
        marginTop : 16 , 
        fontSize : 12 , 
        color : darkTheme.textColor  
    }
}