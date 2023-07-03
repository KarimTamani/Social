import { View, Text, StyleSheet, TouchableOpacity, Image, FlatList } from "react-native";
import PrimaryInput from "../Inputs/PrimaryInput";
import { AntDesign } from '@expo/vector-icons';
import { useCallback, useContext, useEffect, useState } from "react";
import SmallFollowButton from "../Buttons/SmallFollowButton";
import { textFonts } from "../../design-system/font";
import ThemeContext from "../../providers/ThemeContext";
import darkTheme from "../../design-system/darkTheme";
import { gql } from "@apollo/client";
import { ApolloContext } from "../../providers/ApolloContext";
import LoadingActivity from "./post/loadingActivity";
import { getMediaUri } from "../../api";
import LoadingConversation from "./loadings/LoadingConversation";
import { AuthContext } from "../../providers/AuthContext";

const LOAD_CONVERSATIONS = gql`
query Query($query : String , $offset: Int!, $limit: Int!, $asParticipant: Boolean) {
  getConversations(  query : $query , offset: $offset, limit: $limit, asParticipant: $asParticipant) {
      id 
      type
     
      members {
       
          user {
              id name lastname username
              
              isActive 
              showState 
              profilePicture {
                  id path 
              }   
        }
    }
  }
} `;


const LIMIT = 10;

export default function Sender({ postId, userId }) {

    const themeContext = useContext(ThemeContext);
    const styles = themeContext.getTheme() == "light" ? lightStyles : darkStyles;
    const [searchHandler, setSearchHandler] = useState(null);
    const [query, setQuery] = useState("");


    const [firstFetch, setFirstFetch] = useState(true);
    const [loading, setLoading] = useState(false);
    const [end, setEnd] = useState(false);


    const client = useContext(ApolloContext);
    const [conversations, setConversations] = useState([]);
    const auth = useContext(AuthContext);
    const [sharedConversations, setSharedConversations] = useState([]);



    const load_conversations = async (query, previousConversations) => {




        client.query({
            query: LOAD_CONVERSATIONS,
            variables: {
                offset: previousConversations.filter(conversation => conversation.type != "loading").length,
                limit: LIMIT,
                query: query,
                asParticipant: true,
            }
        }).then(async response => {

            var newConversations = response.data.getConversations;

            const userAuth = await auth.getUserAuth();
            if (userAuth && userAuth.user) {
                for (var index = 0; index < newConversations.length; index++) {

                    const findIndex = sharedConversations.findIndex(c => c === newConversations[index].id);
                    newConversations[index].isDone = findIndex >= 0;

                    if (newConversations[index].type == "group")
                        newConversations[index].members.push({
                            user: userAuth.user
                        })
                }
            }
            if (newConversations.length < LIMIT)
                setEnd(true)
            setConversations([...previousConversations.filter(conversation => conversation.type != "loading"), ...newConversations]);
            setFirstFetch(false);
            setLoading(false);
        }).catch(error => {
            setLoading(false);
            setFirstFetch(false);
        })
    }


    useEffect(() => {
        setFirstFetch(true);
        setFirstFetch(true);
        setEnd(false);
        setLoading(false);
        if (query)
            load_conversations(query, []);
        else
            load_conversations("", []);
    }, [query])


    useEffect(() => {
        if (loading) {
            load_conversations(query, conversations);
        }
    }, [loading])



    const setConversationAsSending = (conversation) => {
        const index = conversations.findIndex(c => c.id == conversation.id);
        if (index >= 0) {
            var cloneConversations = [...conversations];
            cloneConversations[index] = {
                ...conversations[index],
                isSending: true
            }


            setConversations(cloneConversations);
        }

    }

    const setConversationAdDone = (conversation, isDone = true) => {
        const index = conversations.findIndex(c => c.id == conversation.id);
        if (index >= 0) {
            var cloneConversations = [...conversations];
            cloneConversations[index] = {
                ...conversations[index],
                isSending: false,
                isDone: isDone
            }

            setSharedConversations([...sharedConversations, conversations[index].id])

            setConversations(cloneConversations);
        }
    }


    const sendToConversation = useCallback((conversation) => {
        setConversationAsSending(conversation)

        if (postId) {
            client.mutate({
                mutation: gql`
            mutation Mutation($postId: ID!, $conversationId: ID!) {
                sharePost(postId: $postId, conversationId: $conversationId) {
                  id 
                }
            }` ,
                variables: {
                    postId: postId,
                    conversationId: conversation.id
                }
            }).then(response => {
                console.log(response)
                if (response && response.data.sharePost)
                    setConversationAdDone(conversation)
            }).catch(error => {
                console.log(error);
                setConversationAdDone(conversation, false)
            })
        }else if (userId) { 
            client.mutate({
                mutation: gql`
                mutation Mutation($userId: ID!, $conversationId: ID!) {
                    shareAccount(userId: $userId, conversationId: $conversationId) {
                      id 
                      type
                      account {
                        id name 
                        lastname
                        lastActiveAt
                      }
                    }
                } ` ,
                variables: {
                    userId: userId,
                    conversationId: conversation.id
                }
            }).then(response => {
                console.log(response)
                if (response && response.data.shareAccount)
                    setConversationAdDone(conversation)
            }).catch(error => {
                console.log(error);
                setConversationAdDone(conversation, false)
            })
        }

    }, [conversations, postId , userId])


    const renderItem = useCallback(({ item }) => {
        if (item.type == "loading") {

            return <LoadingActivity style={{ height: 42 }} size={26} color={"#aaa"} />

        }

        var groupName = null;
        if (item.type == "group") {

            groupName = item.members.slice(0, 3).map(member => member.user.name + " " + member.user.lastname).join(",")

        }
        var isActive = false;
        if (item.members && item.members.length > 0) {
            const index = item.members.findIndex((member) => member.user.isActive && member.user.showState);
            isActive = index >= 0;
        }
        return (

            <View style={styles.conversation} >

                <View>
                    {
                        isActive && 
                        <View style={styles.active}>
                        </View>
                    }
                    {
                        item.type != "group" && item.members[0].user.profilePicture &&
                        <Image source={{ uri: getMediaUri(item.members[0].user.profilePicture.path) }} style={styles.image} />
                    }
                    {
                        item.type != "group" && !item.members[0].user.profilePicture &&
                        <Image source={require("../../assets/illustrations/gravater-icon.png")} style={styles.image} />

                    }
                    {
                        item.type == "group" && item.members.length > 0 &&
                        <View style={[styles.groupMembers, item.members.length == 2 && { width: 64 }]}>
                            {
                                item.members.slice(0, 3).map(({ user }, index) => (
                                    user.profilePicture ?
                                        <Image key={user.id} source={{ uri: getMediaUri(user.profilePicture.path) }} style={[styles.image, index == 1 && styles.floatOne, index == 2 && styles.floatTwo]} />
                                        :
                                        <Image key={user.id} source={require("../../assets/illustrations/gravater-icon.png")} style={[styles.image, index == 1 && styles.floatOne, index == 2 && styles.floatTwo]} />

                                ))
                            }
                        </View>
                    }
                </View>
                <View style={styles.body}>
                    {
                        !groupName &&
                        <Text style={[styles.fullname, item.unseenMessages > 0 && styles.unseen]} numberOfLines={1}>
                            {(item.members[0].user.name + " " + item.members[0].user.lastname)}
                        </Text>

                    }
                    {
                        !groupName &&
                        <Text style={styles.username}>
                            @{item.members[0].user.username}
                        </Text>
                    }
                    {
                        groupName &&
                        <Text style={[styles.fullname, item.unseenMessages > 0 && styles.unseen]} numberOfLines={1}>
                            {groupName}
                        </Text>
                    }


                </View>
                <View style={styles.info}>
                    <SmallFollowButton
                        text={!item.isDone ? "ارسال" : "تم"}
                        style={[styles.sendButton, item.isDone && styles.sentStyles]}
                        textStyle={[item.isDone && styles.sentText]}
                        onPress={() => sendToConversation(item)}
                        loading={item.isSending}
                        disable={item.isDone}
                    />
                </View>
            </View>
        )
    }, [conversations]);

    const keyExtractor = useCallback((item) => {
        return item.id
    }, [])


    const onSearchQueryChange = useCallback((text) => {
        if (searchHandler) {
            clearTimeout(searchHandler)
        };

        setSearchHandler(setTimeout(() => {

            setQuery(text);


        }, 500))
    }, [searchHandler]);



    const reachEnd = useCallback(() => {
        if (!loading && !end && !firstFetch) {
            setConversations([...conversations, { id: 0, type: "loading" }])
            setLoading(true);
        }
    }, [loading, conversations, end, firstFetch])


    return (
        <View style={styles.container}>
            <View style={{ height: 56 }}>
                <PrimaryInput
                    leftContent={<AntDesign name="search1" style={styles.searchIcon} />}
                    placeholder={"بحث"}
                    style={styles.input}
                    onChange={onSearchQueryChange}
                />
            </View>
            {

                !firstFetch &&
                <FlatList
                    renderItem={renderItem}
                    keyExtractor={keyExtractor}
                    data={conversations}
                    style={styles.list}
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
        padding: 16
    },
    list: {

        marginTop: 12
    },
    searchIcon: {
        color: "#666",
        fontSize: 24,
        paddingLeft: 16
    },


    sendButton: {
        height: 28,

        alignItems: "center",
        justifyContent: "center"
    },
    input: {
        height: 48,

    }

    , active: {
        backgroundColor: "#00FF00",
        width: 16,
        height: 16,
        position: "absolute",
        borderRadius: 16,
        bottom: 0,
        zIndex: 9
    },
    image: {
        width: 42,
        height: 42,
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
    fullname: {
        fontFamily: textFonts.regular,
        textAlign: "right"
    },
    username: {
        fontFamily: textFonts.regular,
        textAlign: "right",
        fontSize: 12,
        color: "#555"
    },

    time: {
        color: "#888",
        fontSize: 10,
        fontFamily: textFonts.regular,
        textAlignVertical: "top",


        flex: 1
    },
    info: {

        justifyContent: "center",

        paddingRight: 8
    },
    newMessages: {
        backgroundColor: '#1A6ED8',
        width: 32,
        height: 32,
        textAlign: "center",
        textAlignVertical: "center",
        fontFamily: textFonts.bold,
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
        textAlign: "right",
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
        fontFamily: textFonts.bold,
        message: {
            color: "#212121"
        }
    },
    floatOne: {

        transform: [{
            translateX: -32
        }]
    }
    ,
    floatTwo: {

        transform: [{
            translateX: -64
        }]
    },
    groupMembers: {

        flexDirection: "row",
        justifyContent: "flex-start",
        width: 62,

        overflow: "hidden"

    },


    sentStyles: {
        backgroundColor: "#ccc"
    },

    sentText: {
        color: "#555"
    }
})

const darkStyles = {
    ...lightStyles,

    fullname: {
        fontFamily: textFonts.regular,
        color: darkTheme.textColor,
        textAlign: "right"
    },

    time: {
        color: "#888",
        fontSize: 10,
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
        textAlign: "right",
        color: darkTheme.secondaryTextColor
    },

    unseen: {
        fontFamily: textFonts.bold,
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

    username: {
        fontFamily: textFonts.regular,
        textAlign: "right",
        fontSize: 12,
        color: darkTheme.secondaryTextColor
    },


}