import { View, Text, StyleSheet } from "react-native";
import Header from "../Header";
import ConversationsList from "./ConversationsList";
import { useCallback, useContext } from "react";
import ThemeContext from "../../../providers/ThemeContext";
import darkTheme from "../../../design-system/darkTheme";


export default function ArchivedConversations({ navigation }) {

    const openConversation = useCallback((conversation) => { 
        navigation.navigate("Conversation" , {
            conversation , 
            archived : true 
        })
    } , [navigation]) ; 
    const themeContext = useContext(ThemeContext);
    const styles = themeContext.getTheme() == "light" ? lightStyles : darkStyles;

    return (
        <View style={styles.container}>
            <Header
                title={"الدردشات المؤرشفة"}
                navigation={navigation}
            />


            <View style={styles.content}>
                <ConversationsList archived={true}  openConversation={openConversation} />
            </View>
        </View>
    )

}


const lightStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "white"
    } , 
    content : { 
        flex: 1  , 
        padding : 16 
    }
}) ; 

const darkStyles = { 
    ...lightStyles , 
    container: {
        flex: 1,
        backgroundColor:  darkTheme.backgroudColor 
    } ,
}