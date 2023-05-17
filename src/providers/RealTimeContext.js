import { execute, gql, useSubscription } from "@apollo/client";
import { createContext, useContext, useEffect } from "react";
import { ApolloContext } from "./ApolloContext";
import { EventEmitter } from "eventemitter3";

export const event = new EventEmitter();
const RealTimeContext = createContext(event);

const RealTimeProvider = ({ children, userAuth }) => {

    const client = useContext(ApolloContext);

    useEffect(() => {
        if (userAuth) {

            var subscriptions = [];



            subscriptions.push(
                client.subscribe({
                    query: gql`
            subscription Subscription {
                conversationSaw {
                  conversationId
                  id
                  lastSeenAt
                  userId
                  conversation {
                    members {
                      userId
                    }
                  }
                  
                }
            }` ,

                }).subscribe((response) => {

                    const { conversationSaw } = response.data;
                    const { conversationId } = conversationSaw;
                    event.emit("CONVERSATION_SAW_" + conversationId, conversationSaw);
                    event.emit("CONVERSATION_SAW", conversationSaw);

                })
            );


            subscriptions.push(
                client.subscribe({
                    query: gql`
                    subscription  {
                        newMessage {
                            content
                            createdAt
                            conversationId 
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
                    `
                }).subscribe(response => {
                    const { newMessage } = response.data ;
                    const { conversationId } = newMessage;
                    event.emit("NEW_MESSAGE_CONVERSATION_" + conversationId, newMessage);
                    event.emit("NEW_MESSAGE", newMessage);
                })
            )

            subscriptions.push(
                client.subscribe({
                    query : gql`
                    subscription Subscription {
                        newFollow {
                            id
                            userId
                            createdAt
                            user {
                              id name lastname username 
                              isFollowed 
                              profilePicture {
                                id 
                                path
                              }
                            }
                        }
                    }`
                }).subscribe(response => {
                    const {newFollow} = response.data ; 
                    event.emit("NEW_FOLLOW" , newFollow) ; 

                })
            ) ; 
            
            subscriptions.push(
                client.subscribe({
                    query : gql`
                    subscription Subscription {
                        newLike {
                            createdAt
                            id
                            user {
                              id name lastname 
                              profilePicture {
                                id path 
                              }
                            }
                            post {
                              createdAt
                              id
                              likes
                              userId 
                              media {
                                id
                                path
                              }
                              reel {
                                thumbnail {
                                  id
                                  path
                                }
                              }
                              type
                              title
                            }
                        }
                    }`
                }).subscribe(response => {
                    const {newLike} = response.data ; 
                    event.emit("NEW_LIKE" , newLike) ; 
                })
            ) ; 
         
            subscriptions.push(
                client.subscribe({
                    query : gql`
                    subscription Subscription {
                        newComment {
                            comment
                            createdAt
                            id
                            media {
                              id
                              path
                            }
                            
                            user {
                              id
                              lastname
                              name
                              profilePicture {
                                id
                                path
                              }
                            }
                            post {
                              id
                              media {
                                id
                                path
                              }
                              reel {
                                thumbnail {
                                  id
                                  path
                                }
                              }
                              type
                            }                        
                        }
                    }
                    `
                }).subscribe(response => {
                    const {newComment} = response.data ; 
                    event.emit("NEW_COMMENT" , newComment) ; 
                })
            ) ; 
            
            subscriptions.push(
                client.subscribe({
                    query : gql`
                    subscription Subscription {
                        newReplay {
                            comment {
                                id 
                                comment
                               
                                post {
                                  id 
                                  media {
                                    id path
                                  }
                                  type 
                                  reel {
                                      thumbnail { 
                                          id path 
                                      }
                                  }
                                }
                              }
                              id
                              createdAt
                              media {
                                path
                                id
                              }
                              replay
                              user {
                                id
                                name
                                lastname
                                profilePicture {
                                  id
                                  path
                                }
                              }                      
                        }
                    }
                    
                    `
                }).subscribe(response => {
                    const {newReplay} = response.data ; 
                    event.emit("NEW_REPLAY" , newReplay) ; 
                })
            ) ; 
            
            subscriptions.push(
                client.subscribe({
                    query : gql`
                    subscription Subscription {
                        newStoryComment {
                            comment
                            createdAt
                            id
                            story {
                              id 
                              liked 
                              userId
                              media {
                                id
                                path
                              }
                            }
                            user {
                              id
                              lastname
                              name
                              profilePicture {
                                id
                                path
                              }
                            }
                        }
                    }
                    
                    `
                }).subscribe(response => {
                    const {newStoryComment} = response.data ; 
                    event.emit("NEW_STORY_COMMENT" , newStoryComment) ; 
                })
            ) ; 
       
            return () => {
                subscriptions.forEach(subscription => subscription.unsubscribe());
            }
        }
    }, [userAuth]);


    return (
        <RealTimeContext.Provider value={event}>
            {children}
        </RealTimeContext.Provider>
    )

}

export default RealTimeProvider;

export const useRealTime = () => {
    return useContext(RealTimeContext);
};