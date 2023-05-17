import { useCallback, useContext, useEffect, useState } from "react";
import { View, Text, StyleSheet, FlatList, Dimensions } from "react-native";
import darkTheme from "../../../design-system/darkTheme";
import { textFonts } from "../../../design-system/font";
import ThemeContext from "../../../providers/ThemeContext";
import Post from "../post/Post";
import { ApolloContext } from "../../../providers/ApolloContext";
import { gql } from "@apollo/client";
import LoadingActivity from "../post/loadingActivity";
import { useEvent } from "../../../providers/EventProvider";
import { useFocusEffect } from "@react-navigation/native";

const LIMIT = 3;

const WIDTH = Dimensions.get("screen").width;
const HEIGHT = Dimensions.get("screen").height;
export default function ProfileNotes({ route }) {
    const keyExtractor = useCallback((item, index) => {
        return index;
    }, []);

    const { userId } = route.params

    const [notes, setNotes] = useState([]);
    const [loading, setLoading] = useState(false);
    const [end, setEnd] = useState(false);

    const themeContext = useContext(ThemeContext);
    const styles = themeContext.getTheme() == "light" ? lightStyles : darkStyles;
    const client = useContext(ApolloContext);

    const [firstFetch, setFirstFetch] = useState(true);
    const event = useEvent();


    const load_data = async () => {

        return client.query({
            query: gql`

            query GET_NOTES($userId : ID! , $offset : Int! , $limit : Int! ){
                getUserPosts(userId: $userId, postType: "note", offset: $offset , limit: $limit) {
                  createdAt
                  id
                  liked
                  likes
                  numComments
                  title
                  isFavorite
                  type
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
              }` ,
            variables: {
                userId,
                offset: notes.filter(note => note.type != "loading").length,
                limit: LIMIT
            }
        })
    }


    // this effect will be excuted only at the first time we load this component
    useEffect(() => {
        load_data().then(response => {

            var newPosts = response.data.getUserPosts;
            setNotes([...notes, ...newPosts]);

            if (newPosts.length < LIMIT)
                setEnd(true);

            setFirstFetch(false)

        })

    }, [])

    // this effect will be executed only whene we reach the bottom of the list 
    // so we load more reels and we add them to the bottom of the list 
    useEffect(() => {
        if (loading) {
            console.log("load new note");

            load_data().then(response => {
                var newPosts = response.data.getUserPosts;
                setNotes([...(notes.filter(note => note.type != "loading")), ...newPosts]);

                if (newPosts.length < LIMIT)
                    setEnd(true);

                setLoading(false);
            }).catch(error => {
                console.log(error);
            });
        }
    }, [loading])



    // set an event to whenever we add new reel we update it here 
    useEffect(() => {
        const addNewPost = (newPost) => {
            if (newPost.type == "note") {
                setNotes([newPost, ...notes]);
            }
        }

        const updatePostLikes = (postId, value, numLikes) => {

            const index = notes.findIndex(post => post.type != "loading" && post.id == postId);

            if (index >= 0) {


                var newPostsState = [...notes];
                newPostsState[index] = {
                    ...notes[index],
                    liked: value,
                    likes: numLikes
                };


                setNotes(newPostsState);

            }

        }
        const updatePostFavorite = (postId, value) => {
            const index = notes.findIndex(post => post.type != "loading" && post.id == postId);

            if (index >= 0) {
                var newPostsState = [...notes];
                newPostsState[index] = {
                    ...notes[index],
                    isFavorite: value,
                };
                setNotes(newPostsState);
            }

        }
        const updatePostComments = (postId, value) => {
            const index = notes.findIndex(post => post.type != "loading" && post.id == postId);

            if (index >= 0) {
                var newPostsState = [...notes];
                newPostsState[index] = {
                    ...notes[index],
                    numComments: value,
                };
                setNotes(newPostsState);
            }

        };


        const updateProfile = (profile) => {
        

            var newNotesState = notes.map(note => {
                note.user = profile ; 
                return note ; 
            })  ; 


            setNotes([...newNotesState]) ; 

        };

        event.addListener("update-post-likes", updatePostLikes);
        event.addListener("update-post-comments", updatePostComments);
        event.addListener("update-post-favorite", updatePostFavorite);
        event.addListener("update-profile", updateProfile);
        event.addListener("new-post", addNewPost);
        return () => {
            event.removeListener("new-post", addNewPost);
            event.removeListener("update-profile", updateProfile);
            event.removeListener("update-post-likes", updatePostLikes);
            event.removeListener("update-post-comments", updatePostComments);
            event.removeListener("update-post-favorite", updatePostFavorite);
        }
    }, [notes]);





    // whenever we reach the end of the list 
    // set the state to be loading and increase the offset 
    const reachEnd = useCallback(() => {
        if (!loading && !end) {
            setNotes([...notes, { id: 0, type: "loading" }]);
            setLoading(true);
        }
    }, [loading, notes, end]);

    // update the content height whenever we fcus on this page 
    useFocusEffect(useCallback(() => {
        event.emit("update-height", notes.length * (HEIGHT * 0.28 + 2));
    }, [notes]))


    const renderItem = useCallback(({ item, index }) => {
        if (item.type == "loading")
            return <LoadingActivity size={26} style={[styles.loadingNode, { alignSelf: "center" }]} color='#aaaa' />
        return (
            <Post post={item} />
        )
    }, [])

    return (
        <View style={styles.container}>
            {
                !firstFetch &&
                <FlatList
                    renderItem={renderItem}
                    nestedScrollEnabled
                    keyExtractor={keyExtractor}
                    data={notes}
                    style={styles.list}
                    onEndReached={reachEnd}
                />
            }
            {
                firstFetch &&

                <LoadingActivity size={26} style={[styles.loadingNode, { alignSelf: "center" }]} color='#aaaa' />
            }
        </View>
    )
}

const lightStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#eee",
    },
})

const darkStyles = {
    ...lightStyles,
    container: {
        flex: 1,
        backgroundColor: darkTheme.secondaryBackgroundColor,
    },
    loadingNode: {
        width: "100%",
        height: HEIGHT * 0.28
    }
}