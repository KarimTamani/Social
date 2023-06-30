import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { View, Text, StyleSheet, FlatList, StatusBar, Dimensions, ScrollView, TextInput, TouchableOpacity, Keyboard } from "react-native";
import StoryView from "../components/Cards/story/StoryView";
import { Feather, AntDesign } from '@expo/vector-icons';
import { textFonts } from "../design-system/font";
import { useEvent } from "../providers/EventProvider";
import { ApolloContext } from "../providers/ApolloContext";
import { gql } from "@apollo/client";
import { AuthContext } from "../providers/AuthContext";



const WIDTH = Dimensions.get("screen").width;
const HEIGHT = Dimensions.get("screen").height;


export default function StoriesList({ route }) {

    var followers = [...route.params.followers];
    var followerId = route.params.followerId;

    const event = useEvent();
    const client = useContext(ApolloContext);
    const auth = useContext(AuthContext);

    const [stories, setStories] = useState([]);
    const [like, setLike] = useState(false);
    const [openInput, setOpenInput] = useState(false);
    const inputRef = useRef();
    const [currentStory, setCurrentStory] = useState(null);
    const [layoutHeight , setLayoutHeight] = useState(0) ; 


    const [comment, setComment] = useState("");


    useEffect(() => {
        const subs = Keyboard.addListener("keyboardDidHide", () => {
            inputRef.current?.blur();



            if (comment && comment.trim().length == 0)
                setComment("");
        })
        // order the followers list to make the follower with the given id at the top

        const findIndex = followers.findIndex((follower) => follower.id == followerId);
        const saveFollower = followers[findIndex];
        followers.splice(findIndex, 1);
        followers.splice(0, 0, saveFollower);


        var storiesList = [];

        followers.forEach(follower => {

            follower.stories = follower.stories.map(story => {
                story.user = follower;
                return story;
            });

            storiesList.push(...follower.stories)
        })

        setStories(storiesList);
        return subs.remove;
    }, []);



    const renderItem = useCallback(({ item }) => {
        var focusStory = null;
        if (stories && currentStory !== null)
            focusStory = stories[currentStory]
        var focusStoryId = null;
        if (focusStory)
            focusStoryId = focusStory.id;
        return (
            <View style={[styles.storyContainer , {height : layoutHeight}]} >
                <StoryView story={item} currentStory={focusStoryId} />
            </View>
        )
    }, [currentStory, stories , layoutHeight]);

    const keyExtractor = useCallback((item) => {
        return item.id
    }, []);



    const onViewableItemsChanged = ({ viewableItems }) => {

        if (viewableItems && viewableItems.length > 0)
            setCurrentStory(viewableItems[0].index);
    };


    const viewabilityConfigCallbackPairs = useRef([
        { onViewableItemsChanged },
    ]);




    useEffect(() => {

        if (currentStory !== null) {

            var story = stories[currentStory];
            setLike(story.liked);
            if (story && !story.seen) {
                client.mutate({
                    mutation: gql`
                    mutation SeeStory($storyId: ID!) {
                        seeStory(storyId: $storyId)
                    }` ,
                    variables: {
                        storyId: story.id
                    }
                }).then(response => {

                    if (response && response.data.seeStory) {
                        event.emit("see-story", story);

                    }
                })

            }
        }
    }, [currentStory])

    const toggleLike = useCallback(() => {


        if (currentStory !== null) {
            var previousValue = like;
            setLike(!like);

            var story = stories[currentStory];

            client.mutate({
                mutation: gql`
            mutation Mutation($storyId: ID!) {
                toggleLikeStory(storyId: $storyId)
            }

            ` , variables: {
                    storyId: story.id
                }
            }).then(response => {
                console.log (response)
                if (response)
                    event.emit("like-story", response.data.toggleLikeStory, story)
             
                if (!response)
                    setLike(previousValue);

            }).catch(error => {
                console.log (error)  ;
                setLike(previousValue);

            })
        }

    }, [currentStory, like, stories]);



    const postComment = useCallback(() => {

        if (currentStory !== null && comment && comment.trim().length != 0) {
            const story = stories[currentStory];

            client.mutate({
                mutation: gql`
                mutation CommentStory($storyCommentInput: StoryCommentInput!) {
                    commentStory(storyCommentInput: $storyCommentInput) {
                      comment
                      id
                      createdAt 
                    }
                }
                ` ,
                variables: {
                    storyCommentInput: {
                        storyId: story.id,
                        comment: comment
                    }
                }
            }).then(response => {

                if (response && response.data.commentStory) {
                    (async () => {
                        var userAuth = await auth.getUserAuth();
                        if (userAuth) {

                            event.emit("story-comment", {
                                comment: comment,
                                id: response.data.commentStory.id,
                                user: userAuth.user
                            })
                        }

                    })()

                    setComment("");
                }
            })


        }

    }, [currentStory, comment, stories]);


    const onLayout = useCallback((event) => {

        setLayoutHeight(event.nativeEvent.layout.height)
      
    } , []) 

    return (
        <View style={styles.container} onLayout={onLayout}>
            <StatusBar backgroundColor={"transparent"} />
            <FlatList
                data={stories}
                renderItem={renderItem}
                horizontal
                keyExtractor={keyExtractor}
                style={{ flex: 1 }}
                snapToInterval={WIDTH}
                decelerationRate={"fast"}
                viewabilityConfig={{
                    itemVisiblePercentThreshold: 100
                }}
                viewabilityConfigCallbackPairs={
                    viewabilityConfigCallbackPairs.current
                }
                maxToRenderPerBatch={1}
            />
            {

                <View style={styles.storyInteraction} horizontal>
                    <View style={styles.interactionContainer}>
                        <TextInput
                            placeholder="تعليقك"
                            style={[styles.input, openInput && styles.openInput]}
                            placeholderTextColor="#aaa"
                            onFocus={() => setOpenInput(true)}
                            onBlur={() => setOpenInput(false)}
                            blurOnSubmit={true}
                            ref={inputRef}
                            value={comment}

                            onChangeText={setComment}
                            onSubmitEditing={() => {
                                if (comment && comment.trim().length == 0)
                                    setComment("");

                            }}

                        />
                        <TouchableOpacity onPress={postComment}>
                            <Feather name="send" style={[styles.interactionIcon, (comment && comment.trim().length > 0) && styles.blueSend]} />

                        </TouchableOpacity>
                        {
                            (!comment || comment.trim().length == 0) &&

                            <TouchableOpacity onPress={toggleLike}>
                                {

                                    !like &&
                                    <AntDesign name="hearto" style={[styles.interactionIcon]} />

                                }
                                {
                                    like &&
                                    <AntDesign name="heart" style={[styles.interactionIcon, like && styles.like]} />
                                }
                            </TouchableOpacity>
                        }

                        {
                            (!comment || comment.trim().length == 0) &&
                            <TouchableOpacity >
                                <Feather name="gift" style={styles.interactionIcon} />

                            </TouchableOpacity>
                        }
                    </View>

                </View>

            }

        </View>

    )


};


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "white"
    },
    storyContainer: {
        height: HEIGHT ,
        width: WIDTH
    },

    storyInteraction: {
        position: "absolute",

        bottom: 0,
        width: "100%",


        zIndex: 99
    },
    interactionContainer: {
        flexDirection: "row",
        alignItems: "center",
        width: WIDTH,
        padding: 16
    },
    input: {
        flex: 1,
        color: "white",
        backgroundColor: "red",
        fontFamily: textFonts.regular,
        backgroundColor: "#333",
        borderRadius: 26,
        padding: 8,
        paddingHorizontal: 16,

    },



    openInput: {
        minWidth: WIDTH - 32
    },
    interactionIcon: {
        color: "white",
        fontSize: 22,
        backgroundColor: "#333",
        width: 42,
        height: 42,
        textAlignVertical: "center",
        textAlign: "center",
        borderRadius: 42,
        marginLeft: 16
    },
    like: {
        backgroundColor: "red"
    },
    blueSend: {
        backgroundColor: "#1A6ED8"
    }
})