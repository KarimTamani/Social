import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { View, Text, StyleSheet, FlatList, ImageBackground, ScrollView } from "react-native";
import ConversationHeader from "../components/Cards/messenger/ConversationHeader";
import Message from "../components/Cards/messenger/Message";
import ConversartionInput from "../components/Inputs/ConversationInput";
import darkTheme from "../design-system/darkTheme";
import ThemeContext from "../providers/ThemeContext";
import { ApolloContext } from "../providers/ApolloContext";
import { gql, useSubscription } from "@apollo/client";
import { createRNUploadableFile, getFileType, IMAGE, VIDEO } from "../providers/MediaProvider";
import { AuthContext } from "../providers/AuthContext";
import { getMediaUri } from "../api";
import LoadingActivity from "../components/Cards/post/loadingActivity";

import { useRealTime } from "../providers/RealTimeContext";
import { useEvent } from "../providers/EventProvider";
import ConversationMembers from "../components/Cards/messenger/conversationMembers";


const LIMIT = 10;

export default function Conversation({ navigation, route }) {


    var [messages, setMessages] = useState([]);
    const realTime = useRealTime();
    const [sima, setSima] = useState();
    const [members, setMembers] = useState(route.params?.members);
    const [conversation, setConversation] = useState(route.params?.conversation);
    const isGroup = route.params?.conversation?.type == "group"; 
    

    const [sender, setSender] = useState(null);
    const auth = useContext(AuthContext);
    const client = useContext(ApolloContext);
    const [fetchingConversation, setFetchingConversation] = useState(route.params?.conversation == null);
    const [firstFtech, setFirstFetch] = useState(true);

    const [loading, setLoading] = useState(false);
    const [end, setEnd] = useState(false);

    const list = useRef();

    const event = useEvent();
    const [memberLastSeen, setMemberLastSeen] = useState(route.params?.conversation?.members[0]?.lastSeenAt);
    
    const themeContext = useContext(ThemeContext);
    const styles = themeContext.getTheme() == "light" ? lightStyles : darkStyles;


    const loadMessages = async (conversationId, sender, members) => {

        client.query({
            query: gql`
            query GetMessages($conversationId: ID!, $offset: Int!, $limit: Int!) {
                getMessages(conversationId: $conversationId, offset: $offset, limit: $limit) {
                  content
                  createdAt
                  id
                  media {
                    id
                    path
                  }
                  sender {
                    id
                  }
                  type
                }
              }
            
            ` ,
            variables: {
                offset: messages.length,
                limit: LIMIT,
                conversationId: conversationId
            }
        }).then(response => {

            var newMessages = response.data.getMessages;
            newMessages = newMessages.map(message => {
                if (message.media) {
                    message.media.uri = getMediaUri(message.media.path);
                }
                if (message.sender.id == sender.id) {
                    message.sender = sender;
                    message.myMessage = true
                } else {
                    const index = members.findIndex(member => member.user.id == message.sender.id);
                    message.sender = members[index].user;
                }
                return message;
            });

            setMessages([...messages, ...newMessages]);
            setLoading(false);

            if (newMessages.length < LIMIT)
                setEnd(true);
            setFirstFetch(false);

        }).catch(error => {
            console.log(error);

        });
    }




    useEffect(() => {

        const onNewMessage = ( newMessage ) => { 
            if (newMessage.media) {
                newMessage.media.uri = getMediaUri(newMessage.media.path);
            }
            const index = members.findIndex(member => member.user.id == newMessage.sender.id);
            newMessage.sender = members[index].user

            setMessages([newMessage, ...messages]);
            seeConversation(conversation.id) ; 
        } 


        const onConversationSaw = (conversationMember) => { 
            setMemberLastSeen(conversationMember.lastSeenAt);
        }


        if (conversation) {
            realTime.addListener("NEW_MESSAGE_CONVERSATION_" + conversation.id,onNewMessage) ; 
            realTime.addListener("CONVERSATION_SAW_" + conversation.id , onConversationSaw) ; 


            

            return () => {
                realTime.removeListener("NEW_MESSAGE_CONVERSATION_" + conversation.id , onNewMessage);
                realTime.removeListener("CONVERSATION_SAW_" + conversation.id , onConversationSaw);
            }
        }
    }, [conversation, messages])


    useEffect(() => {


        (async () => {
            var authUser = await auth.getUserAuth();
            setSender(authUser.user);
            if (!conversation) {

           
                client.query({
                    query: gql`
                query GetConversation($userId: ID!) {
                    getConversation(userId: $userId) {
                        id
                        type
                        members {
                            lastSeenAt 
                            user {
                                id name lastname
                                isActive 
                                lastActiveAt 
                            }
                        }

                    }   
                }

            ` , variables: {
                        userId: members[0].user.id
                    }
                }).then(async response => {
                    setConversation({ ...response.data.getConversation, members });

                    if (response.data.getConversation) {
                        setMemberLastSeen(
                            response.data.getConversation.members[0] && response.data.getConversation.members[0].lastSeenAt
                        );
                        var conversationId = response.data.getConversation.id;
                        loadMessages(conversationId, authUser.user, members);
                        seeConversation(conversationId);


                    } else
                        setFirstFetch(false);
                    setFetchingConversation(false);
                })
            } else {
                setMembers(conversation.members);

                loadMessages(conversation.id, authUser.user, conversation.members);
                seeConversation(conversation.id);

            }
        })()
    }, []);


    const seeConversation = (conversationId) => {

        client.mutate({
            mutation: gql`
            mutation Mutation($conversationId: ID!) {
                seeConversation(conversationId: $conversationId)
            }` ,
            variables: {
                conversationId: conversationId
            }
        }).then(response => {
            if (response && response.data.seeConversation) {
                event.emit("conversation-seen", conversationId)
            }
        })
    }

    const renderItem = useCallback(({ item, index }) => {
        if (item.type == "loading") {
            return <LoadingActivity size={26} color='#aaaa' />
        }

        var showSender = true;
        if (index != 0) {
            var nextMessage = messages[index - 1];
            showSender = (nextMessage.sender.id != item.sender.id);
        }

        return (
            <Message
                message={item}
                sending={item.sending}
                openImage={openImage}
                openVideo={openVideo}
                showSender={showSender}
                lastSeenAt={memberLastSeen}
            />
        )
    }, [messages, sender, memberLastSeen]);


    const keyExtractor = useCallback((item, index) => {
        return index;
    }, []);


    const openImage = useCallback((url) => {
        navigation.navigate("ImageViewer", {
            images: [{ uri: url }]
        })
    }, []);

    const openVideo = useCallback((url) => {
        navigation.navigate("VideoPlayer", {
            uri: url
        })
    }, [])
    const createConversation = async () => {

        var response = await client.mutate({
            mutation: gql`
                mutation Mutation($members: [ID!]!) {
                    createConversation(members: $members) {
                        id
                        type
                    }
                }
            ` , variables: {
                members: members.map(member => member.user.id)
            }
        });

    
        if (response) {
            return response.data.createConversation;
        }
        return null;
    }
    const onSend = useCallback((text, record, media) => {
        (async () => {

            // get the conversation id 
            var conversationId = null;
            if (!conversation || !conversation.id) {

                var newConversation = await createConversation()
                if (!newConversation)
                    return;

                setConversation(newConversation);
                conversationId = newConversation.id;

            } else {

                conversationId = conversation.id;
            }


         
            var newMessages = [];

            if (text) {
                // if there is a text make it the first message 
                // check if this text is combined with Voice record 
                var firstMessage = {};
                firstMessage.content = text;
                firstMessage.type = "text";
                firstMessage.sender = sender;
                firstMessage.sending = true;
                firstMessage.myMessage = true


                if (record) {
                    firstMessage.type = "record";
                    firstMessage.media = await createRNUploadableFile(record)
                }
                newMessages.push(firstMessage);

            } else if (!text && record) {
                // in case there is no text but there is a record then make it in the top 
                newMessages.push({
                    content: null,
                    type: "record",
                    media: await createRNUploadableFile(record),
                    sender: sender,
                    sending: true,
                    myMessage: true


                })
            }
            // handle all sorts of media 
            // images and videos and maby more in the future 
            // loop over the media check the type and create RNUploadableFile with an empty content 
            if (media && media.length > 0) {
                for (let index = 0; index < media.length; index++) {

                    var type = null;
                    switch (getFileType(media[index].uri)) {
                        case IMAGE:
                            type = "image";
                            break;
                        case VIDEO:
                            type = "video";
                            break;

                    }

                    if (type == null)
                        continue;

                    newMessages.push({
                        content: null,
                        media: await createRNUploadableFile(media[index].uri),
                        type,
                        sender: sender,
                        sending: true,
                        myMessage: true
                    })
                }
            };
            setMessages([...newMessages, ...messages]);
            // apply sender and sinding state 

            for (let index = 0; index < newMessages.length; index++) {

                console.log(
                    {
                        content: newMessages[index].content,
                        conversationId: conversationId,
                        type: newMessages[index].type,
                        media: newMessages[index].media
                    }
                )
                //list.current?.scrollToTop() ;  
                client.mutate({
                    mutation: gql`
                    
                    mutation SendMessage($messageInput: MessageInput!) {
                        sendMessage(messageInput: $messageInput) {
                          content
                          conversationId
                          id
                          media {
                            id
                            path
                          }
                          type
                          createdAt 
                        }
                      }
                    
                    
                    ` ,
                    variables: {
                        messageInput: {
                            content: newMessages[index].content,
                            conversationId: conversationId,
                            type: newMessages[index].type,
                            media: newMessages[index].media
                        }
                    }
                }).then(response => {


                    newMessages[index].conversationId = conversationId;
                    newMessages[index].sending = false;
                    newMessages[index].id = response.data.sendMessage.id;
                    newMessages[index].createdAt = response.data.sendMessage.createdAt;

                    event.emit("message-sent", newMessages[index]);

                    setMessages([...newMessages, ...messages]);


                }).catch(error => {
                    console.log(error);
                })

            };

        })();

    }, [event  , client , messages, conversation, sender]);


    const onPickSima = useCallback((image) => {
        setSima(image);
    }, [])

    const reachEnd = useCallback(() => {

        if (!loading && !end && conversation && sender) {

            setMessages([...messages, { type: "loading" }])
            setLoading(true);
            if (conversation.members)
                loadMessages(conversation.id, sender, conversation.members);

        }
    }, [loading, messages, end, conversation, sender, members])




    return (
        <ImageBackground style={styles.container} source={sima}>
            {
                !isGroup &&  members && 
                <ConversationHeader lightContent={sima != null} user={members[0].user} onPickSima={onPickSima} />
            }
            { 
                isGroup && members && 
                <ConversationHeader lightContent={sima != null} members={members} onPickSima={onPickSima} />
                
            }
            <View style={styles.body}>
                {
                    !firstFtech && messages.length == 0 &&
                    <ConversationMembers members={members} />
                }
                {
                    !firstFtech &&
                    <FlatList
                        ref={list}
                        onEndReached={reachEnd}
                        data={messages}
                        keyExtractor={keyExtractor}
                        renderItem={renderItem}
                        initialNumToRender={LIMIT}
                        inverted={true}
                        onEndReachedThreshold={0.5}
                        style={styles.list}
                    />
                }
                {
                    firstFtech &&
                    <LoadingActivity size={26} color='#aaaa' />

                }
            </View>
            {
                !fetchingConversation &&
                <View style={styles.input}>
                    <ConversartionInput onSend={onSend} />
                </View>
            }
            {
                fetchingConversation &&
                <LoadingActivity size={26} color='#aaaa' />
            }
        </ImageBackground>
    )
}

const lightStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "white" , 
        position : "relative"
    },
    body: {
        flex: 2, 
    },
    input: { 
        
    
    },



})

const darkStyles = {
    ...lightStyles,
    container: {
        flex: 1,
        backgroundColor: darkTheme.backgroudColor
    },
}