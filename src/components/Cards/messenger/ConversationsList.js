import { useCallback, useContext, useEffect, useState } from "react";
import { Text, StyleSheet, View, FlatList, Image, TouchableOpacity, ActivityIndicator } from "react-native";
import { textFonts } from "../../../design-system/font";
import { FontAwesome5 } from '@expo/vector-icons';
import ThemeContext from "../../../providers/ThemeContext";
import { ApolloContext } from "../../../providers/ApolloContext";

import darkTheme from "../../../design-system/darkTheme";
import { gql } from "@apollo/client";
import { getMediaUri } from "../../../api";
import { useEvent } from "../../../providers/EventProvider";
import { AuthContext } from "../../../providers/AuthContext";
import { useRealTime } from "../../../providers/RealTimeContext";
import LoadingConversation from "../loadings/LoadingConversation";
import LoadingActivity from "../post/loadingActivity";


const LIMIT = 10;
export default function ConversationsList({ openConversation }) {


    const themeContext = useContext(ThemeContext);
    const styles = themeContext.getTheme() == "light" ? lightStyles : darkStyles;
    const [conversations, setConversations] = useState([]);
    const auth = useContext(AuthContext);

    const realTime = useRealTime();

    const event = useEvent();
    const client = useContext(ApolloContext);
    const [firstFetch, setFirstFetch] = useState(true);
    const [user, setUser] = useState(null);


    const [loading, setLoading] = useState(false);
    const [end, setEnd] = useState(false);



    const load_conversations = async () => {

        client.query({
            query: gql`
          query Query($offset: Int!, $limit: Int!) {
            getConversations(offset: $offset, limit: $limit) {
                id 
                type
                unseenMessages 
                members {
                    lastSeenAt 
                    user {
                        id name lastname
                        profilePicture {
                            id path 
                        }
                        isActive 
                        lastActiveAt 
                    }
                }
                    messages {
                        id
                        type 
                        sender {
                            id name lastname  
                        }
                        content
                        createdAt
                }
            }
        } 
            ` ,
            variables: {
                offset: conversations.filter(conversation => conversation.type != "loading").length,
                limit: LIMIT
            }
        }).then(async response => {
            var userAuth = await auth.getUserAuth();
            var newConversations = response.data.getConversations;


            if (userAuth && userAuth.user) {
                const sender = userAuth.user;

                for (var index = 0; index < newConversations.length; index++) {
                    // we basiclly check if the last message was went by this authenticated user  
                    if (!(newConversations[index].members &&
                        newConversations[index].messages &&
                        sender.id == newConversations[index].messages[0].sender.id))

                        continue;

                    // in case the authenticated user is the sender if the last message 
                    // then we check last message visibility 
                    const lastSeenAt = newConversations[index].members[0].lastSeenAt;
                    var message = newConversations[index].messages[0];
                    message.seen = lastSeenAt >= message.createdAt;

                }
            }


            if (newConversations.length < LIMIT)
                setEnd(true)


            setConversations([...conversations.filter(conversation => conversation.type != "loading"), ...newConversations]);


            setFirstFetch(false);
            setLoading(false);

        }).catch(error => {
            setLoading(false);
            setFirstFetch(false);
        })


    }

    useEffect(() => {
        setFirstFetch(true);
        load_conversations();
        (async () => {
            const userAuth = await auth.getUserAuth();
            if (userAuth) {
                setUser(userAuth.user);

            }
        })();
    }, []);


    useEffect(() => {
        if (loading) {
            load_conversations();
        }
    }, [loading])


    useEffect(() => {


        if (conversations && conversations.length > 0) {



            event.on("conversation-seen", (conversationId) => {
                var index = conversations.findIndex(conversation => conversation.id == conversationId);
                if (index >= 0) {
                    conversations[index].unseenMessages = 0;
                    setConversations([...conversations]);
                }
            });

            event.on("message-sent", (message) => {
                const conversationId = message.conversationId;
                const index = conversations.findIndex(conversation => conversation.id == conversationId);
                if (index >= 0) {
                    conversations[index].messages = [message];
                    var member = conversations[index].members && conversations[index].members[0]
                    message.seen = member.lastSeenAt >= message.createdAt
                    setConversations([...conversations]);
                }
            });

            realTime.on("NEW_MESSAGE", (message) => {

                const conversationId = message.conversationId;
                const index = conversations.findIndex(conversation => conversation.id == conversationId);
                if (index >= 0) {
                    conversations[index].messages = [message];
                    conversations[index].unseenMessages = conversations[index].unseenMessages + 1;
                    setConversations([...conversations]);
                }
            })

            realTime.on("CONVERSATION_SAW", (conversationMember) => {


                const conversationId = conversationMember.conversationId;
                const index = conversations.findIndex(conversation => conversation.id == conversationId);
                if (index >= 0) {
                    var conversation = conversations[index];
                    if (conversation.messages.length != 0 && conversation.messages[0].seen === false) {
                        conversation.messages[0].seen = true;


                        const membersIndex = conversation.members.findIndex(member => member.user.id == conversationMember.userId);
                        conversation.members[membersIndex].lastSeenAt = conversationMember.lastSeenAt;

                        setConversations([...conversations]);
                    }
                }
            })

            return () => {

                event.off("conversation-seen");
                event.off("message-sent");
                realTime.off("NEW_MESSAGE");
                realTime.off("CONVERSATION_SAW");
            }
        }

    }, [conversations])


    const renderItem = useCallback(({ item }) => {


        if (item.type == "loading") {

            return <LoadingActivity style={{ height: 42 }} size={26} color={"#aaa"} />

        }


        var myMessage = false;
        if (item.messages && item.messages.length > 0 && user) {
            myMessage = item.messages[0].sender.id == user.id;
        }
        var isActive = false;
        if (item.members && item.members.length > 0) {
            const index = item.members.findIndex((member) => member.user.isActive);
            isActive = index >= 0;
        }

        return (
            <TouchableOpacity style={styles.conversation} onPress={() => openConversation(item)}>
                <View>
                    {
                        isActive &&
                        <View style={styles.active}>
                        </View>
                    }
                    {
                        item.members[0].user.profilePicture &&
                        <Image source={{ uri: getMediaUri(item.members[0].user.profilePicture.path) }} style={styles.image} />
                    }
                    {
                        !item.members[0].user.profilePicture &&
                        <Image source={require("../../../assets/illustrations/gravater-icon.png")} style={styles.image} />

                    }
                </View>
                <View style={styles.body}>
                    <Text style={[styles.username, item.unseenMessages > 0 && styles.unseen]}>
                        {(item.members[0].user.name + " " + item.members[0].user.lastname)}
                    </Text>

                    <View style={styles.messageContainer}>
                        {
                            item.messages[0] && item.messages[0].seen !== undefined &&
                            <FontAwesome5 name="check-double" style={[styles.check, item.messages[0] && item.messages[0].seen && styles.seenMessage]} />
                        }

                        {
                            item.messages && item.messages.length > 0 && item.messages[0].type == "text" &&
                            <Text style={[styles.lastMessage, item.unseenMessages > 0 && styles.unseen.message]} numberOfLines={1} ellipsizeMode="tail">
                                {item.messages && item.messages.length > 0 && item.messages[0].content}
                            </Text>
                        }

                        {
                            item.messages && item.messages.length > 0 && item.messages[0].type == "image" && myMessage &&
                            <Text style={[styles.lastMessage, item.unseenMessages > 0 && styles.unseen.message]}>
                                قمت بإرسال صورة
                            </Text>
                        }

                        {
                            item.messages && item.messages.length > 0 && item.messages[0].type == "image" && !myMessage &&
                            <Text style={[styles.lastMessage, item.unseenMessages > 0 && styles.unseen.message]}>
                                قام بإرسال صورة
                            </Text>
                        }

                        {
                            item.messages && item.messages.length > 0 && item.messages[0].type == "video" && myMessage &&
                            <Text style={[styles.lastMessage, item.unseenMessages > 0 && styles.unseen.message]}>
                                قمت بإرسال فيديو
                            </Text>
                        }

                        {
                            item.messages && item.messages.length > 0 && item.messages[0].type == "video" && !myMessage &&
                            <Text style={[styles.lastMessage, item.unseenMessages > 0 && styles.unseen.message]}>
                                قام بإرسال فيديو
                            </Text>
                        }
                        {
                            item.messages && item.messages.length > 0 && item.messages[0].type == "record" && myMessage &&
                            <Text style={[styles.lastMessage, item.unseenMessages > 0 && styles.unseen.message]}>
                                قمت بإرسال تسجيل صوتي

                            </Text>
                        }

                        {
                            item.messages && item.messages.length > 0 && item.messages[0].type == "record" && !myMessage &&
                            <Text style={[styles.lastMessage, item.unseenMessages > 0 && styles.unseen.message]}>
                                قام بإرسال تسجيل صوتي

                            </Text>
                        }

                    </View>
                </View>
                <View style={styles.info}>
                    {
                        item.newMessages == 0 &&
                        <Text style={styles.time}>
                            قبل ساعة
                        </Text>
                    }
                    {
                        item.unseenMessages > 0 &&
                        <Text style={styles.newMessages} >
                            {item.unseenMessages}
                        </Text>
                    }
                </View>
            </TouchableOpacity >
        )
    }, [conversations, user]);

    const keyExtractor = useCallback((item, index) => {
        return index;
    }, []);


    const reachEnd = useCallback(() => {



        if (!loading && !end && !firstFetch) {


            setConversations([...conversations, { id: 0, type: "loading" }])
            setLoading(true);

        }


    }, [loading, conversations, end, firstFetch])

    return (
        <View style={styles.container}>
            {
                !firstFetch &&

                <FlatList
                    data={conversations}
                    renderItem={renderItem}
                    keyExtractor={keyExtractor}
                    onEndReached={reachEnd}
                    onEndReachedThreshold={0.2}
                />
            }
            {
                firstFetch &&
                <LoadingConversation />
            }
        </View>
    )
}

const lightStyles = StyleSheet.create({
    container: {
        flex: 1,

    }, active: {
        backgroundColor: "#00FF00",
        width: 16,
        height: 16,
        position: "absolute",
        borderRadius: 16,
        bottom: 0,
        zIndex: 9
    },
    image: {
        width: 48,
        height: 48,
        borderRadius: 48
    },
    conversation: {
        flexDirection: "row-reverse",
        marginBottom: 16,
        alignItems: "center",
        borderBottomColor: "#eee",
        borderBottomWidth: 1,
        paddingBottom: 16
    },
    body: {
        flex: 1,
        paddingRight: 16,
    },
    username: {
        fontFamily: textFonts.regular,
    },

    time: {
        color: "#888",
        fontSize: 12,
        fontFamily: textFonts.regular,
        textAlignVertical: "top",

        flex: 1
    },
    info: {

        justifyContent: "center"

    },
    newMessages: {
        backgroundColor: '#1A6ED8',
        width: 32,
        height: 32,
        textAlign: "center",
        textAlignVertical: "center",
        fontFamily: textFonts.semiBold,
        color: "white",
        borderRadius: 32
    },
    messageContainer: {
        flexDirection: "row-reverse",

        alignItems: "center"
    },
    lastMessage: {
        color: "#888",
        fontSize: 12,
        fontFamily: textFonts.regular,
        flex: 1,
    },

    check: {
        marginLeft: 8,
        fontSize: 12,
        color: "#5555"
    },
    seenMessage: {
        color: "#FFD700"
    },
    unseen: {
        fontFamily: textFonts.semiBold,
        message: {
            color: "#212121"
        }
    }
})

const darkStyles = {
    ...lightStyles,

    username: {
        fontFamily: textFonts.regular,
        color: darkTheme.textColor
    },

    time: {
        color: "#888",
        fontSize: 12,
        fontFamily: textFonts.regular,
        textAlignVertical: "top",

        flex: 1,
        color: darkTheme.secondaryTextColor
    },

    lastMessage: {
        color: "#888",
        fontSize: 12,
        fontFamily: textFonts.regular,
        flex: 1,

        color: darkTheme.secondaryTextColor
    },

    unseen: {
        fontFamily: textFonts.semiBold,
        message: {
            color: darkTheme.textColor
        }
    },
    conversation: {
        flexDirection: "row-reverse",
        marginBottom: 16,
        alignItems: "center",
        borderBottomColor: darkTheme.borderColor,
        borderBottomWidth: 1,
        paddingBottom: 16
    },
}