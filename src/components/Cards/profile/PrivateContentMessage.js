import { View, Text, StyleSheet } from "react-native";
import { Feather } from '@expo/vector-icons';
import { textFonts } from "../../../design-system/font";

export default function PrivateContentMessage({ }) {

    return (
        <View style={styles.container}>
            <Feather name="eye-off" size={48} color="#555" />
            <Text style={styles.title}>
            هاذ الحساب خاص
            </Text>
            <Text style={styles.message}>
            قم بمتابعة هاذ المستخدم لرؤية منشورات هاذ الحساب و التفاعل معها
            </Text>
        </View>
    )


};



const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center" , 
        justifyContent : "center" , 
        paddingVertical : 24 
    } , 
    title : { 
        fontFamily : textFonts.bold , 
        color : "#212121" , 
        fontSize : 16  , 
        fontWeight : "bold"
        
    } , 
    message: { 
        fontFamily  : textFonts.regular , 
        color : "#555" , 
        textAlign : "center"
    }
})