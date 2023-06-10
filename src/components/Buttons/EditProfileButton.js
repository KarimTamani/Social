import { View , Text , StyleSheet , TouchableOpacity} from "react-native" ; 
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { textFonts } from "../../design-system/font";
import { useContext } from "react";
import ThemeContext from "../../providers/ThemeContext";

export default function EditProfileButton ({onPress}) { 

    const themeContext = useContext(ThemeContext);
    const styles = themeContext.getTheme() == "light" ? lightStyles : darkStyles;
    return(
        <TouchableOpacity style = { styles.button } onPress={onPress}>
            <Text style={styles.text}>
            تعديل الحساب
            </Text> 
            <MaterialCommunityIcons name="account-edit-outline" style = { styles.icon } />
        </TouchableOpacity>
    )
} ; 

const lightStyles = StyleSheet.create({
    button : { 
        flexDirection : "row" , 
        alignItems : "center" , 
        justifyContent : "center" , 
        height : 42 , 
        backgroundColor : "#eee" , 
        borderRadius : 8 ,  
        width : 218 , 
    } , 
    text : {  
        fontFamily : textFonts.bold , 
        fontWeight : "bold"
    } , 
    icon : { 
        fontSize : 24  , 
        marginLeft : 8
    }
}) ; 

const darkStyles = { 
    ...lightStyles , 
    button : { 
        ...lightStyles.button  , 
        backgroundColor  : "#818181"
    }
}