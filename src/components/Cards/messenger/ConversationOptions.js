import { useCallback, useContext, useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Modal } from "react-native";
import darkTheme from "../../../design-system/darkTheme";
import { textFonts } from "../../../design-system/font";
import ThemeContext from "../../../providers/ThemeContext";
import LoadingModal from "../loadings/LoadingModal";
import { ApolloContext } from "../../../providers/ApolloContext";
import { gql } from "@apollo/client";
import Confirmation from "../Confirmation";
import { useEvent } from "../../../providers/EventProvider";


const EXIT_GROUP_TITLE = "خروج من المجموعة";
const EXIT_GROUP_MESSAGE = "هل فعلا تريد الخروج من هذه المجموعة ؟";


const DELETE_CONVERSATION_TITLE = "حذف المحادثة";
const DELETE_CONVERSATION_MESSAGE = "هل انت متأكد من حذف هذه المحادثة ؟";


const BLOCK_TITLE = "حظر المستخدم";
const BLOCK_MESSAGE = "هل انت متأكد من حضر";


export default function ConversationOptions({ navigation, onClose, toggleSimas, conversation, isArchived = false }) {


    const themeContext = useContext(ThemeContext);
    const styles = themeContext.getTheme() == "light" ? lightStyles : darkStyles;
    const [loading, setLoading] = useState(false);
    const [loadingMessage, setLoadingMessage] = useState(null);
    const client = useContext(ApolloContext);


    const [title, setTitle] = useState("");
    const [message, setMessage] = useState("");
  
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [operation, setOperation] = useState();

    const event = useEvent();






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


    }, [conversation]);


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
    }, [conversation]);


    const deleteConversation = useCallback(() => {

        if (conversation && navigation) {

            setLoading(true);
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

                setLoading(false);
                toggleConfirmation(false);

                if (response) {
                    event.emit("delete-conversation", conversation.id);
                    navigation.navigate('Messenger')
                }
            }).catch(error => {
                setLoading(false);
            })
        }
    }, [conversation, navigation]);

    const toggleConfirmation = useCallback(() => {
        setShowConfirmation(!showConfirmation);
    }, [showConfirmation])


    const openBlockConfirmation = useCallback(() => {
        if (conversation && conversation.members.length >= 1) {
            var user = conversation.members[0].user;
            setTitle(BLOCK_TITLE);
            setMessage(BLOCK_MESSAGE + " " + user.name + " " + user.lastname + " ؟ ");
            setOperation("BLOCK");
            toggleConfirmation();
        }
    }, [])

    const openDeletionConfirmation = useCallback(() => {

        if (conversation) {
            if (conversation.type == "group") {
                setTitle(EXIT_GROUP_TITLE);
                setMessage(EXIT_GROUP_MESSAGE)
            } else {
                setTitle(DELETE_CONVERSATION_TITLE);
                setMessage(DELETE_CONVERSATION_MESSAGE)
            }
        }
        setOperation("DELETE");
        toggleConfirmation();
    }, [conversation, navigation, showConfirmation])


    const openProfile = useCallback(() => {
        if (conversation && conversation.members.length >= 1) {
            var user = conversation.members[0].user;
            navigation.navigate("Profile", { userId: user.id });
        }
    }, [conversation, navigation]);


    const blockUser = useCallback(() => {


        if (conversation && conversation.members.length >= 1) {
            var user = conversation.members[0].user;


            setIsLoading(true);
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
                    toggleConfirmation();
                    onClose && onClose();
                    setIsLoading(false);
                }
            }).catch(error => {
                console.log(error);
                setIsLoading(false);
            });

        }

    }, [conversation, navigation]);


    const handleConfirmation = useCallback(() => {

        if (operation === "DELETE") {
            deleteConversation();
        }
        if (operation === "BLOCK") {
            blockUser();

        }

    }, [operation, conversation, navigation])



    const options = [
        {
            text: "حظر",
            onPress: openBlockConfirmation
        },
        {
            text: "ابلاغ"
        },


        (!isArchived) ? {
            text: "حفظ المحادثة",
            onPress: archiveConversation
        } : {
            text: "ازالة المحادثة من المحفوظات",
            onPress: unArchiveConversation
        },
        {
            text: "حذف المحادتة",
            onPress: openDeletionConfirmation
        },
        {
            text: "تغيير السمة",
            onPress: useCallback(() => {
                toggleSimas();
                onClose();
            }, [])
        },
        {
            text: "زيارة الملف الشخصي",
            onPress: openProfile
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
            {
                showConfirmation &&

                <Modal
                    transparent
                    onRequestClose={toggleConfirmation}
                >
                    <Confirmation
                        title={title}
                        message={message}
                        loading={loading}
                        onConfirm={handleConfirmation}
                        onClose={toggleConfirmation}

                    />
                </Modal>
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