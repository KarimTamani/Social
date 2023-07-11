import { useContext } from "react";
import { View, Text, StyleSheet, Dimensions, TouchableOpacity } from "react-native";
import QRCode from 'react-native-qrcode-svg';
import ThemeContext from "../../../providers/ThemeContext";
import darkTheme from "../../../design-system/darkTheme";
const width = Dimensions.get("window").width;

export default function QrCode({  onClose , user }) {


    const themeContext = useContext(ThemeContext);
    const styles = themeContext.getTheme() == "light" ? lightStyles : darkStyles;

    return (
        <TouchableOpacity style={styles.container} activeOpacity={1} onPress={onClose}>
            <View style={styles.content}>
                <QRCode
                    backgroundColor={themeContext.getTheme() == "light" ? "white" : darkTheme.backgroudColor}
                    value={user?.id}
                    enableLinearGradient = {true }
                    size = {width / 2 }
                    linearGradient={ ['#FE0000', '#4348D2'] }
                />
                <Text style={styles.username}>
                    @{user.username}
                </Text>
            </View>
        </TouchableOpacity>
    )

};


const lightStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,.5)" , 
        alignItems : "center" , 
        justifyContent :  "center"
    },
    content: {
        width: width * 0.75,
        height: width * 0.75,
        backgroundColor: "white",
      
   
        borderRadius: 8,
        elevation: 8 , 
        alignItems : "center" , 
        justifyContent : "center"
    } , 
    
    username : {
        marginTop : 16 , 
        color : "#FE0000" , 
        fontWeight : "bold"
    }
    
}) ; 

const darkStyles = { 
    ...lightStyles , 
    content : { 
        ...lightStyles.content , 
        backgroundColor : darkTheme.backgroudColor
    }
}