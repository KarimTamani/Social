import { useCallback, useContext } from "react";
import { View, Text, StyleSheet } from "react-native";
import darkTheme from "../../../design-system/darkTheme";
import ThemeContext from "../../../providers/ThemeContext";
import Header from "../Header";
import ConversationsList from "./ConversationsList";
import { ApolloContext } from "../../../providers/ApolloContext";


const LIMIT = 10;

export default function MessageRequests({ navigation }) {

    const themeContext = useContext(ThemeContext) ; 
    const styles = themeContext.getTheme() == "light" ? lightStyles : darkStyles ;  
 
 
    const openConversation = useCallback((conversation) => { 
        navigation.navigate("Conversation" , {
            conversation 
        })
    } , [navigation]) ; 

    return (
        <View style={styles.container}>
            <Header
                title={"طلبات الرسائل"}
                navigation={navigation}
            />
            <View style={styles.content}>
                <ConversationsList asParticipant = {false} openConversation = { openConversation } />
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