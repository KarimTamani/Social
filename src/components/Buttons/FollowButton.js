import { View, Text, StyleSheet, TouchableOpacity, ImageBackground } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useCallback, useState } from "react";
import { textFonts } from "../../design-system/font";

export default function FollowButton({ text = "متابعة", style , textStyle , follow = false , onPress}) {

    

    return (
        <TouchableOpacity onPress={onPress} style={[styles.followButton , style]}>

            {

                !follow &&
                <LinearGradient
                    // Button Linear Gradient
                    colors={['#FE0000', '#4348D2']}
                    start={{ x: 0, y: 0.5 }}
                    end={{ x: 1, y: 0.5 }}
                    style={[styles.button, style]}>
                    <Text style={[styles.buttonText , textStyle]}>
                        {text}
                    </Text>
                </LinearGradient>

            }
            {
                follow && 
                <Text style={[styles.buttonText , textStyle, styles.followText]}>
                    {"تتبعه"}
                </Text>

            }

        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    button: {
        height: 42,
        paddingHorizontal: 4,
        width: 218,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 8 , 
        
    },
    followButton : { 
        height: 42,
        paddingHorizontal: 4,
        width: 218,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 8 , 
        backgroundColor : "#eee"
        
    } ,     
    followText : { 
        color : "#212121" ,
    
    } , 
    buttonText: {
        color: "white",
        fontSize: 14,
        
        fontFamily  : textFonts.bold
    }
})