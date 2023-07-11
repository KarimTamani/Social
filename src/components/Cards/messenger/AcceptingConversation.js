import { useCallback, useContext, useEffect, useState } from "react";
import { View, Text, StyleSheet, Modal } from "react-native";
import PrimaryButton from "../../Buttons/PrimaryButton";
import { textFonts } from "../../../design-system/font";
import { ApolloContext } from "../../../providers/ApolloContext";
import { gql } from "@apollo/client";
import ThemeContext from "../../../providers/ThemeContext";
import darkTheme from "../../../design-system/darkTheme";
import Confirmation from "../Confirmation";
import { useEvent } from "../../../providers/EventProvider";

const DELETE_CONVERSATION_TITLE = "حذف المحادثة";
const DELETE_CONVERSATION_MESSAGE = "هل انت متأكد من حذف هذه المحادثة ؟";

const BLOCK_TITLE = "حظر المستخدم";
const BLOCK_MESSAGE = "هل انت متأكد من حضر";

export default function AcceptingConversation({ conversation, members, onAccept, onRefuse, onBlock }) {


    const [fullname, setFullname] = useState(null);
    const [isGroup, setIsGroup] = useState(false);


    const [isAccepting, setIsAccepting] = useState(false);
    const [isBlocking, setIsBlocking] = useState(false);
    const [isRefusing, setIsRefusing] = useState(false);


    const [showDelteingConfirmation, setShowDeletingConfirmation] = useState(false);
    const [showBlockingConfirmation, setShowBlockingConfirmation] = useState(false);
    
    const [message, setMessage] = useState(BLOCK_MESSAGE);

    const client = useContext(ApolloContext);
    const themeContext = useContext(ThemeContext);
    const styles = themeContext.getTheme() == "light" ? lightStyles : darkStyles;

    const event = useEvent();

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


    const closeConfirmation = useCallback(() => {
        setShowDeletingConfirmation(false);
        setShowBlockingConfirmation(false);
    }, [])

    const accept = useCallback(() => {

        setIsAccepting(true);

        client.mutate({
            mutation: gql`
            
            mutation Mutation($conversationId: ID!) {
                acceptConversationInvite(conversationId: $conversationId) {
                    id 
                }
            }`,
            variables: {
                conversationId: conversation.id
            }
        }).then(response => {
            setIsAccepting(false);
            if (response) {
                onAccept && onAccept();
            }
        }).catch(error => {
            setIsAccepting(false);
        })
    }, [conversation, members, isGroup]);

    const refuse = useCallback(() => {
        setShowDeletingConfirmation(false);
        if (conversation) {
            setIsRefusing(true);
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
                setIsRefusing(false);
                if (response) {
                    onRefuse && onRefuse();
                }
            }).catch(error => {
                setIsRefusing(false);
            })
        }
    }, [conversation]);

    const block = useCallback(() => {

        setShowBlockingConfirmation( false ) ; 
        
        if (conversation && conversation.members.length >= 1) {
            var user = conversation.members[0].user;


            setIsBlocking(true);


            client.mutate({
                mutation: gql`
                       mutation Mutation($userId: ID!) {
                           toggleBlock(userId: $userId)
                       }`,
                variables: {
                    userId: user.id
                }
            }).then(response => {
                if (response) {
                    event.emit("blocked-user", user);
                    onBlock && onBlock();
                }
                setIsBlocking(false);
            }).catch(error => {

                setIsBlocking(false);
            });

        }

    }, [conversation, members, isGroup]);


    const openBlockConfirmation = useCallback(() => {
        if (conversation && conversation.members.length >= 1) {
            var user = conversation.members[0].user;

            setMessage(BLOCK_MESSAGE + " " + user.name + " " + user.lastname + " ؟ ");

            setShowBlockingConfirmation(true);
        }
    }, [])

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
                        onPress={() => setShowDeletingConfirmation(true)}
                    />
                    <PrimaryButton

                        title={"حظر"}
                        style={styles.button}
                        textStyle={styles.buttonText}
                        loading={isBlocking}
                        onPress={openBlockConfirmation}
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
                        onPress={() => setShowDeletingConfirmation(true)}
                    />
                </View>

            }

            {
                showDelteingConfirmation &&

                <Modal
                    transparent
                    onRequestClose={closeConfirmation}
                >
                    <Confirmation
                        title={DELETE_CONVERSATION_TITLE}
                        message={DELETE_CONVERSATION_MESSAGE}

                        onConfirm={refuse}
                        onClose={closeConfirmation}

                    />
                </Modal>
            }
            {
                showBlockingConfirmation &&

                <Modal
                    transparent
                    onRequestClose={closeConfirmation}
                >
                    <Confirmation
                        title={BLOCK_TITLE}
                        message={message}

                        onConfirm={block}
                        onClose={closeConfirmation}

                    />
                </Modal>
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
});


const darkStyles = {
    ...lightStyles,
    headerText: {
        fontFamily: textFonts.regular,
        fontSize: 16,
        marginBottom: 16,
        color: darkTheme.textColor
    }

}