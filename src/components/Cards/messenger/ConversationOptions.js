import { useCallback, useContext, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import darkTheme from "../../../design-system/darkTheme";
import { textFonts } from "../../../design-system/font";
import ThemeContext from "../../../providers/ThemeContext";
import LoadingModal from "../loadings/LoadingModal";
import {ApolloContext} from "../../../providers/ApolloContext";
import { gql } from "@apollo/client";

export default function ConversationOptions({ onClose, toggleSimas, conversation , isArchived = false }) {


    const themeContext = useContext(ThemeContext);
    const styles = themeContext.getTheme() == "light" ? lightStyles : darkStyles;
    const [loading, setLoading] = useState(false);
    const [loadingMessage, setLoadingMessage] = useState(null);
    const client = useContext(ApolloContext)

    const archiveConversation = useCallback(() => {
        if (conversation) {
            setLoading(true);
            setLoadingMessage("حفظ المحادثة ...")
            client.mutate({
                mutation: gql`
                mutation ArchiveConversation($conversationId: ID!) {
                    archiveConversation(conversationId: $conversationId) {
                      id 
                    }
                }` ,
                variables: {
                    conversationId: conversation.id
                }
            }).then(response => {
                
                setLoading(false);
            }).catch(error => {
                setLoading(false);
            })
        }


    }, [conversation]) ; 


    const unArchiveConversation = useCallback(() => { 
        if (conversation) { 
            setLoading(true);
            setLoadingMessage("ازالة المحادثة من المحفوظات ...")
            client.mutate({
                mutation: gql`
                mutation ArchiveConversation($conversationId: ID!) {
                    unArchiveConversation(conversationId: $conversationId) {
                      id 
                    }
                }` ,
                variables: {
                    conversationId: conversation.id
                }
            }).then(response => {
                
                setLoading(false);
            }).catch(error => {
                setLoading(false);
            })
        }
    } , [ conversation])

    const options = [
        {
            text: "حظر"
        },
        {
            text: "ابلاغ"
        },
        
        
        (!isArchived) ? {
            text: "حفظ المحادثة",
            onPress: archiveConversation
        } :  {
            text: "ازالة المحادثة من المحفوظات",
            onPress: unArchiveConversation
        } ,
        {
            text: "حذف المحادتة"
        },
        {
            text: "تغيير السمة",
            onPress: useCallback(() => {
                toggleSimas();
                onClose();
            }, [])
        },
        {
            text: "زيارة الملف الشخصي"
        }
        , {
            text: "كتم الاشعارات"
        }
    ]

    return (
        <TouchableOpacity style={styles.container} activeOpacity={1} onPress={onClose}>

            <View style={styles.options}>

                {
                    options.map(option => (
                        <TouchableOpacity style={styles.option} onPress={option.onPress}>
                            <Text style={styles.text}>
                                {option.text}
                            </Text>
                        </TouchableOpacity>
                    ))
                }
            </View>
            {

                loading &&
                <LoadingModal

                    loadingMessage={loadingMessage}
                />
            }
        </TouchableOpacity>

    )

};


const lightStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.1)"
    },
    options: {
        backgroundColor: "white",
        minWidth: "60%",

        maxWidth: "80%",
        marginTop: 64,
        marginLeft: 16,
        elevation: 12
    },
    text: {
        fontFamily: textFonts.regular,
        paddingHorizontal: 16,
        paddingVertical: 8
    }
})


const darkStyles = {
    ...lightStyles,
    options: {
        backgroundColor: darkTheme.secondaryBackgroundColor,
        minWidth: "60%",

        maxWidth: "80%",
        marginTop: 64,
        marginLeft: 16,
        elevation: 12
    },
    text: {
        fontFamily: textFonts.regular,
        paddingHorizontal: 16,
        paddingVertical: 8,
        color: darkTheme.textColor
    }


}
/*










*/


/*

*/

/*
حظر
ابلاغ


*/