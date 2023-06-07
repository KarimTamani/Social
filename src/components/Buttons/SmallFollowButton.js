import { View , Text , StyleSheet, TouchableOpacity, ActivityIndicator } from "react-native";
import { textFonts } from "../../design-system/font";

export default function SmallFollowButton({text =  "متابعة" , style , textStyle , loading = false , onPress , disable = false }) { 

    return(
        <TouchableOpacity style={[styles.container , style ]} onPress={ onPress } disabled={disable}>
            {
                !loading &&
                <Text style={[styles.buttonText , textStyle]}>
                    {text}
                </Text> 
            }
            {
                loading && 
                <ActivityIndicator color = {"white"}>
                </ActivityIndicator>
            }
        </TouchableOpacity>
    )
} ; 

const styles = StyleSheet.create({ 
    container : { 
        backgroundColor : "#1A6ED8" , 
        padding: 4 , 
        paddingHorizontal : 8  , 
        borderRadius : 4 , 
        elevation : 3  , 
        minWidth : 64 , 
        alignItems : "center"  
    } , 
    buttonText : { 
        color : "white" , 
        fontSize : 10 , 
        fontFamily : textFonts.regular
    }
})