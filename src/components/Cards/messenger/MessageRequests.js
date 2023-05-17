import { useContext } from "react";
import { View, Text, StyleSheet } from "react-native";
import darkTheme from "../../../design-system/darkTheme";
import ThemeContext from "../../../providers/ThemeContext";
import Header from "../Header";
import ConversationsList from "./ConversationsList";

export default function MessageRequests({ navigation }) {

    const themeContext = useContext(ThemeContext) ; 
    const styles = themeContext.getTheme() == "light" ? lightStyles : darkStyles ;  


    return (
        <View style={styles.container}>
            <Header
                title={"طلبات الرسائل"}
                navigation={navigation}
            />
            <View style={styles.content}>
                <ConversationsList />
            </View>
        </View>
    )

};
const lightStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "white"
    },
    content: {
        padding: 16 , 
        flex : 1 
    }
})

const darkStyles  = { 
    ...lightStyles , 
    container: {
        flex: 1,
        backgroundColor: darkTheme.backgroudColor 
    },
    
}