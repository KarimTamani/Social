import { useContext } from "react";
import { View , Text , StyleSheet} from "react-native" ; 
import darkTheme from "../../../design-system/darkTheme";
import { textFonts } from "../../../design-system/font";
import ThemeContext from "../../../providers/ThemeContext";


export default function PostNote({post }) { 

    const themeContext = useContext(ThemeContext) ; 
    const styles = themeContext.getTheme() == "light" ? lightStyles : darkStyles ;  
    return(
        <View style={styles.container}>
            <Text style={styles.content}>
                { post.title }
            </Text>
        </View>

    )

}


const lightStyles = StyleSheet.create({
    container : { 
        
    } , 
    content : { 
        padding : 16 , 
        fontSize : 14 , 
        fontFamily : textFonts.regular , 
        lineHeight : 22
    } , 
    
}) ; 

const darkStyles = {
    ...lightStyles , 
    content : { 
        padding : 16 , 
        fontSize : 14 , 
        fontFamily : textFonts.regular , 
        lineHeight : 22 , 
        color : darkTheme.textColor
    } , 
    
}