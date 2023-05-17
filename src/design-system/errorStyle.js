import { StyleSheet } from "react-native";
import { textFonts } from "./font";

const errorStyle = StyleSheet.create({
    error: {
        fontSize: 12,
        color: "#FF3159",
        textAlign: "right",
        marginTop: -8
    } , 
    errorMessage :  { 
    
        borderWidth : 1 , 
        borderColor : "#FF3159" , 
        backgroundColor :"#FF315911" , 
        paddingVertical : 8 , 
        paddingHorizontal : 16 , 
        textAlign : "center" , 
        fontSize : 12 , 
        fontFamily : textFonts.regular , 
        color : "#FF3159" , 
        borderRadius : 4   
    } , 
    errorInput : { 
        borderWidth : 1 , 
        borderColor : "#FF3159" , 
        backgroundColor :"#FF315911"
    } , 
}) ; 


export { errorStyle }