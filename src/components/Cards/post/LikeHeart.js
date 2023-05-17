import { View, Text, StyleSheet, Image } from "react-native";
import { AntDesign } from '@expo/vector-icons';
import { useEffect, useState } from "react";

export default function LikeHeart({ style, like , size , color  }) {

    if ( !size ) 
        size = 26  ; 

    if ( !color) 
        color = "#666"  ; 


    const [animate, setAnimate] = useState(false);

    useEffect(() => {
        if (like) { 
            setAnimate(true) ; 
        }
        setTimeout(() => {
            setAnimate(false)
        } , 1900)
         
    }, [like]) ; 


    
    return (
        <View style={[style, styles.container , {
            width : size , 
            height : size 
        }]}>
            {
                !like &&
                <AntDesign name="hearto" style={[styles.arrowHeart, styles.interactionIcon]} size={size - 8 } color={color}/>
            }
            {

                !animate && like &&
                <Image source={require("../../../assets/icons/heart-with-arrow.png")} style={[styles.arrowHeart , {
                    width: size - 4  ,
                    height: size -  4 ,
                     
                    marginTop : size / 13  , 
                    marginLeft : -1   
                }]} />

            }
            {
                animate && like && 
                <Image source={require("../../../assets/icons/heart-arrow.gif")} style={styles.arrowHeart} />
                
            }
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
    
         
        alignItems : "center"  , 
        justifyContent : "center"
    },
    arrowHeart: {
        width: "100%",
        resizeMode: "cover",
        height: "100%"

    },
    interactionIcon: {
 
      
         
        textAlign : "center" , 
        textAlignVertical : "center"

    },
    like: {
        color: "#FF3159"
    },
 
})