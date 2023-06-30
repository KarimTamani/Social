import { useCallback, useContext, useEffect, useState } from "react";
import { View, Text, StyleSheet, Dimensions, FlatList, Image } from "react-native";
import { ApolloContext } from "../../../providers/ApolloContext";
import { gql } from "@apollo/client";
import { getMediaUri } from "../../../api";
import { textFonts } from "../../../design-system/font";
import { useEvent } from "../../../providers/EventProvider";
import LoadingActivity from "../../Cards/post/loadingActivity"
const { width, height } = Dimensions.get("window");
const LIMIT = 5;


export default function StoryComments({ story, currentStory }) {

    const [comments, setComments] = useState([]);
    const client = useContext(ApolloContext);
    const event = useEvent();
    const [loading, setLoading] = useState(false);
    const [firstFetch, setFirstFetch] = useState(true);
    const [end , setEnd] = useState( false ) ; 
    const load_comments = (previousComments) => {
        var offset = previousComments.length;

        client.query({
            query: gql`
        query GetStoryComments($storyId: ID!, $offset: Int!, $limit: Int!, $mine: Boolean) {
            getStoryComments(storyId: $storyId, offset: $offset, limit: $limit, mine: $mine) {
              createdAt
              id
              comment
              user {
                id
                name 
                lastname
                profilePicture {
                  id path 
                }
              }
            }
          }
        
        ` , variables: {
                offset: offset,
                limit: LIMIT,
                storyId: story.id,
                mine: false
            }
        }).then(response => {
            var newComments = response.data.getStoryComments ;  
            console.log( newComments ) ; 
            setComments([...previousComments ,  ...newComments]);
            if ( newComments.length < LIMIT) 
                setEnd(true) ; 
        
            setFirstFetch(false) ; 
            setLoading( false ) ; 
        }).catch(error => {
            setFirstFetch(false) ; 
            setLoading(false) ;
        })
    }

    useEffect(() => {
        if (currentStory && story.id == currentStory && comments.length == 0) {
            setFirstFetch( true ) ; 
            load_comments([]) ; 
        }
    }, [story, currentStory]);

    useEffect(() => {
        if (loading) {             
            load_comments(comments.filter(c => c.type != "loading")) ; 
        }
    } , [loading ])


    useEffect(() => {
        if (currentStory && story.id == currentStory) {
            event.on("story-comment", (comment) => {
                setComments([comment, ...comments]);
            });
        }
        return () => {
            event.off("story-comment");
        }
    }, [story, currentStory, comments]) ; 


    
    // whenever we reach the end of the list 
    // set the state to be loading and increase the offset 
    const reachEnd = useCallback(() => {

        if (!loading && !end && !firstFetch) {
            setComments([ ...comments ,  { id : 0 ,  type : "loading"} ])
            setLoading(true) ; 
        }

    }, [loading, comments, end , firstFetch]);


    const renderitem = useCallback(({ item, index }) => {

        if (item.type == "loading")
            return(
                <LoadingActivity style={styles.loadComment}/>
            )

        return (
            <View style={styles.commentContainer}>
                <View style={styles.commentSection}>
                    <Text style={styles.username}>
                        {item.user.lastname} {item.user.name}
                    </Text>
                    <Text style={styles.comment}>
                        {item.comment}
                    </Text>
                </View>
                {
                    item.user.profilePicture &&
                    <Image source={{ uri: getMediaUri(item.user.profilePicture.path) }} style={styles.userImage} />
                }
                {
                    !item.user.profilePicture &&
                    <Image source={require("../../../assets/illustrations/gravater-icon.png")} style={styles.userImage} />
                }
            </View>
        )
    }, []);

    const keyExtractor = useCallback((item) => {
        return item.id
    }, [])

    if (!firstFetch)
        return (

            <View style={styles.container}>

                <FlatList
                    data={comments}
                    keyExtractor={keyExtractor}
                    renderItem={renderitem}
                    onEndReachedThreshold={0.2}
                    onEndReached={reachEnd}
                />



            </View>

        )
    else if (firstFetch) {
        return (
            <View style={[styles.container, { backgroundColor: "transparent" }]}>

                <LoadingActivity />
            </View>
        )

    }
}


const styles = StyleSheet.create({
    container: {
        maxHeight: 70 * width / 100,
        backgroundColor: "rgba(255,255,255,0.5)",
        width: 80 * width / 100,
        position: "absolute",
        zIndex: 9,
        bottom: 86,
        left: 16,
        borderRadius: 12
    },

    commentContainer: {
        flexDirection: "row",
        padding: 12
    },
    commentSection: {
        flex: 1,
        paddingHorizontal: 8
    },
    username: {
        fontFamily: textFonts.bold,
        fontWeight: "bold",
        fontSize: 12
    },
    comment: {
        fontFamily: textFonts.regular,
        fontSize: 12,

    },
    userImage: {
        width: 32,
        height: 32,
        resizeMode: "cover",
        borderRadius: 32
    } , 
    loadComment : { 
        height : 56 
    }
})