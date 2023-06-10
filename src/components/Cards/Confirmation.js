import { View , Text , StyleSheet , Modal, TouchableOpacity} from "react-native" ; 
import PrimaryButton from "../Buttons/PrimaryButton" ; 
import { textFonts } from "../../design-system/font";
import { useCallback } from "react";

export default function Confirmation({title = "تأكيد" , message = "رسالة للتأكيد" , buttonText = "موافق" , loading = false , onClose , onConfirm}) {


    const blur = useCallback(() => { 
        onClose && onClose() 
    } , [ onClose])

    const confirm = useCallback(() => { 
        onConfirm && onConfirm() ; 
    } , [onConfirm])

    return (
        <TouchableOpacity style={styles.container} activeOpacity={ 1 } onPress={blur }>
            <View style={styles.content}>
                <Text style={styles.header}>
                    {title} 
                </Text>
                <Text style={styles.message}>
                    {message}
                </Text> 
                <PrimaryButton
                    style={styles.button}
                    title={ buttonText }
                    textStyle={ styles.buttonText}
                    loading={loading}
                    onPress={ confirm }
                />
            </View>
        </TouchableOpacity>
    )
}


const styles = StyleSheet.create({
    container : { 
        flex : 1 , 
        backgroundColor : "rgba(0,0,0,.5)" , 
        alignItems : "center" , 
        justifyContent : "center"
    } , 
    content : { 
        backgroundColor : "white" , 
        borderRadius : 8 , 
        padding : 16  , 
        width : "80%" 
    } , 
    header : { 
        fontFamily : textFonts.bold  , 
        fontSize : 16 , 
        borderBottomColor : "#eee" , 
        borderBottomWidth : 1 , 
        paddingBottom : 8 , 
        marginBottom : 8  
        
    } , 
    message : { 
        fontFamily : textFonts.regular , 
        color : "#666" , 
        fontSize : 12  ,  
        paddingVertical : 8 , 
        paddingBottom : 16   
    } ,  
    buttonText : { 
        fontSize: 12 
    }
})