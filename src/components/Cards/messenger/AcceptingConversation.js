import { useCallback, useContext, useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import PrimaryButton from "../../Buttons/PrimaryButton";
import { textFonts } from "../../../design-system/font";
import { ApolloContext } from "../../../providers/ApolloContext";
import { gql } from "@apollo/client";
import ThemeContext from "../../../providers/ThemeContext";
import darkTheme from "../../../design-system/darkTheme";

export default function AcceptingConversation({ conversation, members, onAccept, onRefuse, onBlock }) {


    const [fullname, setFullname] = useState(null);
    const [isGroup, setIsGroup] = useState(false);


    const [isAccepting, setIsAccepting] = useState(false);
    const [isBlocking, setIsBlocking] = useState(false);
    const [isRefusing, setIsRefusing] = useState(false);
    
    const client = useContext(ApolloContext) ; 
    const themeContext = useContext(ThemeContext);
    const styles = themeContext.getTheme() == "light" ? lightStyles : darkStyles;



    useEffect(() => {
        setIsAccepting(false);
        setIsBlocking(false);
        setIsRefusing(false);
    }, [])

    useEffect(() => {
        if (conversation && members) {
            setIsGroup(conversation.type == "group");
            if (conversation.type != "group" && members.length == 1) {
                setFullname(members[0].user.name + " " + members[0].user.lastname);
            }
        }
    }, [conversation, members])


    const accept = useCallback(() => {
 
        setIsAccepting(true);
        
        client.mutate({
            mutation : gql`
            
            mutation Mutation($conversationId: ID!) {
                acceptConversationInvite(conversationId: $conversationId) {
                    id 
                }
            }`, 
            variables : { 
                conversationId : conversation.id
            }
        }).then(response => {
            setIsAccepting(false) ; 
            if (response)   { 
                onAccept && onAccept() ; 
            }   
        }).catch(error => {
            setIsAccepting(false) ;  
        })
    }, [conversation, members, isGroup]);

    const refuse = useCallback(() => {
        if (conversation ) {
            setIsRefusing(true) ; 
            client.mutate({
                mutation: gql`
                mutation DeleteConversation($conversationId: ID!) {
                    deleteConversation(conversationId: $conversationId) {
                      id 
                      type 
                     
                    }
                  }
                ` ,
                variables: {
                    conversationId: conversation.id
                }
            }).then(response => {
                setIsRefusing(false) ; 
                if (response) {
                    onRefuse && onRefuse() ;  
                }
            }).catch(error => {  
                setIsRefusing(false) ; 
            })
        }
    }, [conversation]);

    const block = useCallback(() => {
        onBlock && onBlock();
    }, [conversation, members, isGroup])

    return (
        <View style={styles.container}>
            {
                !isGroup && fullname &&

                <Text style={styles.headerText}>
                    {fullname} يريد مراسلتك
                </Text>
            }
            {
                isGroup &&
                <Text style={styles.headerText}>
                    هل تريد الانضمام لهذه المجموعة
                </Text>
            }
            {
                !isGroup &&
                <View style={styles.buttons}>
                    <PrimaryButton
                        title={"قبول"}
                        style={styles.button}
                        textStyle={styles.buttonText}
                        loading={isAccepting}
                        onPress={accept}

                    />
                    <PrimaryButton
                        title={"حذف"}
                        style={styles.button}
                        textStyle={styles.buttonText}
                        loading={isRefusing}
                        onPress={refuse}
                    />
                    <PrimaryButton

                        title={"حظر"}
                        style={styles.button}
                        textStyle={styles.buttonText}
                        loading={isBlocking}
                        onPress={block}
                    />
                </View>
            }

            {

                isGroup &&
                <View style={styles.buttons}>
                    <PrimaryButton
                        title={"قبول"}
                        style={styles.button}
                        loading={isAccepting}
                        textStyle={styles.buttonText}
                        onPress={accept}
                    />

                    <PrimaryButton

                        title={"خروج"}
                        style={styles.button}
                        textStyle={styles.buttonText}
                        loading={isRefusing}
                        onPress={refuse}
                    />
                </View>

            }
        </View>
    )

}


const lightStyles = StyleSheet.create({
    container: {
        alignItems: "center",
        padding: 16
    },
    buttons: {
        flexDirection: "row-reverse",
        borderRadius: 48,
        overflow: "hidden"
    },

    button: {
        flex: 1,
        borderRadius: 0,
        backgroundColor: "#aaa"
    },
    buttonText: {
        color: "#212121"
    },
    headerText: {
        fontFamily: textFonts.regular,
        fontSize: 16,
        marginBottom: 16
    }
}) ; 


const darkStyles = { 
    ...lightStyles , 
    headerText: {
        fontFamily: textFonts.regular,
        fontSize: 16,
        marginBottom: 16 , 
        color : darkTheme.textColor 
    }
    
}