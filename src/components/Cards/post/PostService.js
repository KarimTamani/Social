import { useCallback, useContext } from "react";
import { View, Text, StyleSheet, Image, Dimensions, TouchableOpacity } from "react-native";
import darkTheme from "../../../design-system/darkTheme";
import { textFonts } from "../../../design-system/font";
import ThemeContext from "../../../providers/ThemeContext";

const WIDTH = Dimensions.get("screen").width ; 

export default function PostService({ post , navigation }) {

    const themeContext = useContext(ThemeContext) ; 
    const styles = themeContext.getTheme() == "light" ? lightStyles : darkStyles ;  

    const openDetails = useCallback(() => { 
        navigation.navigate("ServiceDetails" , { 
            service : post 
        })
    } , [ navigation ])  

    return (
        <TouchableOpacity style={styles.container} onPress={openDetails }>
            {
                post.content.title &&
                <Text style={styles.description}>
                    {post.content.title}
                </Text>
            }
             
            <Image source={{ uri: post.content.image }} style={styles.image} />
        </TouchableOpacity>
    )
};


const lightStyles = StyleSheet.create({
    container: {
        paddingVertical: 16
    },
    image: {
        width: "100%",
        height: WIDTH,
        resizeMode: "cover"
    },
    description: {
        paddingHorizontal: 16, 
        fontFamily : textFonts.regular , 
        marginBottom : 16 
    }
}) ; 

const darkStyles = { 
    ...lightStyles , 
    description: {
        paddingHorizontal: 16, 
        fontFamily : textFonts.regular , 
        marginBottom : 16  , 
        color : darkTheme.textColor 
    }
}