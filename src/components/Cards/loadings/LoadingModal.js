import { View, Text, StyleSheet, Modal } from "react-native";
import LoadingActivity from "../post/loadingActivity";
import { textFonts } from "../../../design-system/font";



export default function LoadingModal({ loadingMessage = "يرجى الإنتظار"}) {
    


        return(
            <Modal
                transparent
            >
                <View style={styles.container}>
                    <LoadingActivity
                        size = { 64 } 
                        color =  { "#1A6ED8"}
                    />
                    <Text style={styles.loadingText}>
                        {loadingMessage}
                    </Text>
                </View>
            </Modal>
        )
}


const styles = StyleSheet.create({
    container : { 
        flex : 1 , 
        backgroundColor : "rgba(0,0,0,.5)"  , 
        alignItems : "center" , 
        justifyContent : "center"
    } , 
    loadingText : {
        fontFamily : textFonts.regular , 
        color : "white" 
    }
})
