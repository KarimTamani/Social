import { View, Text, StyleSheet } from "react-native";
import Header from "../Header";
import ConversationsList from "./ConversationsList";
import { useCallback } from "react";


export default function ArchivedConversations({ navigation }) {

    const openConversation = useCallback((conversation) => { 
        navigation.navigate("Conversation" , {
            conversation , 
            archived : true 
        })
    } , [navigation]) ; 
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


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "white"
    } , 
    content : { 
        flex: 1  , 
        padding : 16 
    }
})