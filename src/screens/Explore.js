import { useCallback, useContext, useEffect, useState } from "react";
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image } from "react-native";
 
import { textFonts } from "../design-system/font"
import { AntDesign } from '@expo/vector-icons';
import ThemeContext from "../providers/ThemeContext";
import darkTheme from "../design-system/darkTheme";
import ExploreHeader from "../components/Cards/explore/ExploreHeader";
import { ApolloContext } from "../providers/ApolloContext";
import { gql } from "@apollo/client";
import { getMediaUri } from "../api";
import LoadingActivity from "../components/Cards/post/loadingActivity";
import { useEvent } from "../providers/EventProvider";

const LIMIT = 10;

export default function Explore({ navigation }) {


    const themeContext = useContext(ThemeContext);
    const styles = themeContext.getTheme() == "light" ? lightStyles : darkStyles;

    const [posts, setPosts] = useState();
    const client = useContext(ApolloContext);
    const event = useEvent();


    const [timeOffset, setTimeOffset] = useState(null);
    const [lastTimeOffset, setLastTimeOffset] = useState(null);


    const [loading, setLoading] = useState(true);
    const [end, setEnd] = useState(false);
    const [firstFetch, setFirstFetch] = useState(true);


    const load_posts = async (previousPosts) => {


        const offset = previousPosts.length;

        client.query({
            query: gql`
            
            query GET_POSTS($time : String , $limit : Int! ) { 

                getPosts(time : $time , limit : $limit , includeReels : true) { 
                    id 
                    title 
                    type 
                    media { 
                        id path
                    }
                    createdAt 
                    numComments 
                    liked
                    likes  
                    isFavorite 
                  
                    user { 
                        id
                        name 
                        lastname 
                        profilePicture { 
                            id path 
                        } 
                        validated 
                    }
                    reel { 
                        id
                        thumbnail { 
                            id  path 
                        } 
                        views
                    }
                  
                }
            }
            ` ,
            variables: {
                time: timeOffset,
                limit: LIMIT
            }
        }).then(response => {


            var newPosts = response.data.getPosts;

            const lastPost = newPosts.length > 0 && newPosts[newPosts.length - 1];
            if (lastPost)
                setLastTimeOffset(lastPost.createdAt);


            if (newPosts.length < LIMIT)
                setEnd(true);


            newPosts = newPosts.sort((a, b) => 0.5 - Math.random());

            setPosts([...previousPosts, ...newPosts])

            setFirstFetch(false);
            setLoading(false);

        }).catch(error => {
            setFirstFetch(false);
            setLoading(false);
        })
    }


    useEffect(() => {
        load_posts([]);
    }, []);

    useEffect(() => {
        if (timeOffset) {
            load_posts(posts.filter(post => post.type != "loading"));
        }
    }, [timeOffset])


    const reachEnd = useCallback(() => {
        if (!loading && !end && !firstFetch) {
            setTimeOffset(lastTimeOffset);
            setPosts([...posts, { type: "loading" }])
            setLoading(true);
        }
    }, [loading, posts, end, lastTimeOffset, firstFetch])



    const openPost = useCallback((post) => {
        if (post.type != "reel")
            navigation.navigate("ViewPosts", {
                getPosts: () => posts.filter(post => post.type != "reel"),
                focusPostId: post.id,
                title: "اكسبلور",

            });
        else if (post.type == "reel") {
            navigation.navigate("ReelsViewer", {
                getReels: () => posts.filter(post => post.type == "reel"),
                focusPostId: post.id,


            });
        }
    }, [navigation, posts])

    useEffect(() => {


        const deletePost = (deletedPost) => {
            const index = posts.findIndex(post => post.type != "loading"  && post.id == deletedPost.id);
            if (index >= 0) {
                var newPostsState = [...posts];
                newPostsState.splice(index, 1);
                setPosts(newPostsState);
            }
        }

        const editPost = (editablePost) => {
            const index = posts.findIndex(post => post.type != "loading"  && post.id == editablePost.id);
            if (index >= 0) {
                var newPostsState = [...posts];
                newPostsState[index] = {
                    ...editablePost
                }

                setPosts(newPostsState);
            }
        }


        const userBlocked = (user) => {
            setPosts( posts.filter(post => post.type == "loading" || post.type == "stories" || post.type == "reels" || post.user.id != user.id) );
        }
        event.addListener("delete-post", deletePost);
        event.addListener("edit-post", editPost);
        event.addListener("blocked-user", userBlocked);

        return () => {
            event.removeListener("delete-post", deletePost);
            event.removeListener("edit-post", editPost);
            event.removeListener("blocked-user", userBlocked);
        }

    }, [posts])

    const renderItem = useCallback(({ item }) => {
        if (item.type == "loading") {
            return (
                <LoadingActivity />
            )
        }

        if (item.type == "reel") {
            return (
                <TouchableOpacity style={[styles.item]} onPress={() => openPost(item)} >
                    <AntDesign name="play" style={styles.playIcon} />
                    <Image source={{ uri: getMediaUri(item.reel.thumbnail.path) }} style={styles.image} />
                </TouchableOpacity>
            )
        } else if (item.type == "note") {
            return (
                <TouchableOpacity style={[styles.item]} onPress={() => openPost(item)} >
                    <Text style={styles.note} numberOfLines={4} ellipsizeMode={"tail"}>
                        {item.title}
                    </Text>
                </TouchableOpacity>
            )
        }
        else if (item.type == "image") {

            return (

                <TouchableOpacity style={styles.item} onPress={() => openPost(item)} >
                    <Image source={{ uri: getMediaUri(item.media[0].path) }} style={styles.image} />
                </TouchableOpacity>
            )
        }

    }, [navigation, posts])

    const keyExtractor = useCallback((item, index) => {
        return item.id;
    }, []);




    return (
        <View style={styles.container}>

            <ExploreHeader navigation={navigation} activePage={"Explore"} />
            {
                !firstFetch &&
                <FlatList
                    data={posts}
                    keyExtractor={keyExtractor}
                    renderItem={renderItem}
                    numColumns={3}
                    onEndReached={reachEnd}
                />
            }
            {
                firstFetch &&
                <LoadingActivity />
            }
        </View>
    )
};

const lightStyles = StyleSheet.create({
    container: {
        flex: 1,
        margin: -2
    },
    item: {
        height: 128,
        width: "33.333%",
        padding: 0.5,
        alignItems: "center",
        justifyContent: "center"
    },
    image: {
        width: "100%",
        height: "100%",

    },
    note: {
        fontFamily: textFonts.regular,

        height: "100%",
        textAlignVertical: "center",
        paddingHorizontal: 12,
        fontSize: 12,

        color: "#212121",
        lineHeight: 18

    },
    playIcon: {
        color: "white",
        position: "absolute",
        zIndex: 9,
        fontSize: 24
    }

})

const darkStyles = {
    ...lightStyles,
    container: {
        flex: 1,
        margin: -2,
        backgroundColor: darkTheme.secondaryBackgroundColor,
    },
    note: {
        fontFamily: textFonts.regular,

        height: "100%",
        textAlignVertical: "center",
        paddingHorizontal: 12,
        fontSize: 12,

        color: darkTheme.textColor,
        lineHeight: 18

    },
}