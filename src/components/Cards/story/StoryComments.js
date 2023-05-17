import { useCallback, useContext, useEffect, useState } from "react";
import { View, Text, StyleSheet, Dimensions, FlatList, Image } from "react-native";
import { ApolloContext } from "../../../providers/ApolloContext";
import { gql } from "@apollo/client";
import { getMediaUri } from "../../../api";
import { textFonts } from "../../../design-system/font";
import { useEvent } from "../../../providers/EventProvider";

const { width  , height } = Dimensions.get("window");
const LIMIT = 5;


export default function StoryComments({ story, currentStory }) {

    const [comments, setComments] = useState([]);
    const client = useContext(ApolloContext);
    const event = useEvent()
    useEffect(() => {



        if (currentStory && story.id == currentStory && comments.length == 0) {




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
                    offset: comments.length,
                    limit: LIMIT,
                    storyId: story.id,
                    mine: false
                }
            }).then(response => {

                setComments(response.data.getStoryComments);

            })
        }

    }, [story, currentStory]);


    useEffect(() => {

        if (currentStory && story.id == currentStory) {
            event.on("story-comment", (comment) => {
                setComments([comment, ...comments]);
            });

        }

        return () => {
            event.off("story-comment");
        }


    }, [story, currentStory, comments])


    const renderitem = useCallback(({ item, index }) => {

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

    return (

        <View style={styles.container}>
            <FlatList
                data={comments}
                keyExtractor={keyExtractor}
                renderItem={renderitem}
            />
        </View>

    )
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
    }
})