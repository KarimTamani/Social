import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Feather } from '@expo/vector-icons';
import { textFonts } from "../../design-system/font";


export default function ServiceButton({openConversation , openServiceAsk , style , text = "اطلب الخدمة"}) {

    return (
        <View style={[styles.container , style]}>
            <TouchableOpacity onPress={openConversation}>
                <Feather name="message-circle" style={styles.messageIcon} />
            </TouchableOpacity>
            <TouchableOpacity onPress={openServiceAsk} style = { { flex : 1 }}>
                <Text style={styles.buttonText}>
                    {text}
                </Text>
            </TouchableOpacity>
        </View>
    )
};

const styles = StyleSheet.create({
    container: {
        backgroundColor : "#1A6ED8" , 
        flexDirection : "row" , 
        justifyContent :"space-between" , 
        borderRadius: 8  , 
        width : 112 
    } , 
    buttonText : { 
        fontFamily : textFonts.regular , 
        fontSize : 12  , 
        paddingHorizontal: 8 , 
        paddingRight : 12 , 
        fontSize : 10  , 
        color : "white"  , 
        textAlign : "center" , 
        textAlignVertical : "center" ,
        flex : 1 
    } , 
    messageIcon : { 
        color :"white" , 
        borderRightColor : "transparent" , 
        borderRightWidth : 1 , 
        height : 32 , 
        width : 32 , 
        textAlign : "center" , 
        textAlignVertical : "center" , 
        fontSize : 18 , 
         
        
    
    }
})