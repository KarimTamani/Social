import React, { useCallback, useContext, useEffect, useRef, useState } from "react";
import { View, Text, StyleSheet, FlatList, Modal } from "react-native";
import HomeHeader from "../components/Cards/HomeHeader";
import Post from "../components/Cards/post/Post";
import Stories from "../components/Cards/story/Stories";
//import posts from "../assets/posts";
import ReelsSuggestion from "../components/Cards/post/ReelsSuggestion";
import ThemeContext from "../providers/ThemeContext";
import darkTheme from "../design-system/darkTheme";
import { ApolloContext } from "../providers/ApolloContext";
import { gql } from "@apollo/client";
import LoadingActivity from "../components/Cards/post/loadingActivity";
import { useEvent } from "../providers/EventProvider";
import { AuthContext } from "../providers/AuthContext";
import LoadingPost from "../components/Cards/loadings/LoadingPost";
import Confirmation from "../components/Cards/Confirmation";

const POST_LIMIT = 5;
const REEL_LIMIT = 4;

const LOADING_COMPONENTS = [{ id: 0, type: "loading" }, { id: 0, type: "loading" }, { id: 0, type: "loading" }]

export default function Home({ navigation }) {

    const [posts, setPosts] = useState([]);


    const event = useEvent();
    const auth = useContext(AuthContext);
    const [isAuth, setIsAuth] = useState(false);
    const [checkAuthentication, setCheckAuthentication] = useState(false);

    const [firstFetch, setFirstFetch] = useState(true);
    const [refresh, setRefresh] = useState(false);
    const [firstTime, setFirstTime] = useState(false);




    const [timeOffset, setTimeOffset] = useState({
        postTime: null,
        reelTime: null,
    });

    const [lastTimeOffset, setLastTimeOffset] = useState({
        lastPost: null,
        lastPost: null
    });


    const themeContext = useContext(ThemeContext);
    const styles = themeContext.getTheme() == "light" ? lightStyles : darkStyles;

    const [loading, setLoading] = useState(true);
    const [end, setEnd] = useState(false);


    // a callback to render the home page 
    // contains stories at the first section and list of posts 
    const renderItem = useCallback(({ item, index }) => {

        if (item.type == "loading") {
            return <LoadingPost />
        }
        else if (item.type == "stories")
            return (
                <View style={styles.stories}>
                    <Stories navigation={navigation} />
                </View>
            )
        else if (item.type == "reels")
            return (
                <ReelsSuggestion reels={item.reels} navigation={navigation} />
            )
        else {
            return (
                <Post navigation={navigation} post={item} />
            )
        }
    }, [posts, styles]);

    const keyExtractor = useCallback((item, index) => {

        if (item.type == "stories")
            return "stories-" + index;
        else if (item.type == "reels")
            return "reels-" + index;
        else if (item.type == "loading")
            return "loading-" + index;
        else

            return item.id;
    }, [posts]);

    const client = useContext(ApolloContext);

    useEffect(() => {

        setPosts([]);
        setCheckAuthentication(false);
        setFirstFetch(true);

        (async () => {
            var userAuth = await auth.getUserAuth();
            if (userAuth) {
                setPosts([{ id: 0, type: "stories" }, ...LOADING_COMPONENTS]);
                setIsAuth(true);
            } else {
                setIsAuth(false);
            }
            setCheckAuthentication(true);

        })();


        event.on("auth-changed", () => {

            setPosts([]);
            setTimeOffset({
                postTime: null,
                reelTime: null,
            });

            setLastTimeOffset({
                lastPost: null,
                lastPost: null
            })
        })
        return () => {
            event.off("new-post");
            event.off("auth-changed");
        }
    }, []);



    useEffect(() => {

        

        const addNewPost = (post) => {
            if (post.type == "note" || post.type == "image") {
                setPosts(previousPosts => {
                    setPosts([...previousPosts.filter(post => post.type == "stories"), post, ...previousPosts.filter(post => post.type != "stories")]);
                }) ; 


                setFirstTime(post.createdAt) ; 
            }
        }

        const updatePostLikes = (postId, value, numLikes) => {

            const index = posts.findIndex(post => post.type != "loading" && post.type != "stories" && post.type != "reels" && post.id == postId);
            if (index >= 0) {

                var newPostsState = [...posts];
                newPostsState[index] = {
                    ...posts[index],
                    liked: value,
                    likes: numLikes
                };
                setPosts(newPostsState);

            }

        }
        const updatePostFavorite = (postId, value) => {
            const index = posts.findIndex(post => post.type != "loading" && post.type != "stories" && post.type != "reels" && post.id == postId);

            if (index >= 0) {
                var newPostsState = [...posts];
                newPostsState[index] = {
                    ...posts[index],
                    isFavorite: value,
                };
                setPosts(newPostsState);
            }

        }
        const updatePostComments = (postId, value) => {
            const index = posts.findIndex(post => post.type != "loading" && post.type != "stories" && post.type != "reels" && post.id == postId);

            if (index >= 0) {
                var newPostsState = [...posts];
                newPostsState[index] = {
                    ...posts[index],
                    numComments: value,
                };
                setPosts(newPostsState);
            }
        }
        const updateProfile = (profile) => {
            var newState = posts.map(post => {
                if (post.type != "loading" && post.type != "reels" && post.type != "stories") {
                    if (post.user.id == profile.id)
                        post.user = profile;
                }
                return post;
            });
            setPosts([...newState]);
        };

        const deletePost = (deletedPost) => {
            const index = posts.findIndex(post => post.type != "loading" && post.type != "stories" && post.type != "reels" && post.id == deletedPost.id);
            if (index >= 0) {
                var newPostsState = [...posts];
                newPostsState.splice(index, 1);
                setPosts(newPostsState);
            }
        }

        const editPost = (editablePost) => {
            const index = posts.findIndex(post => post.type != "loading" && post.type != "stories" && post.type != "reels" && post.id == editablePost.id);
            if (index >= 0) {
                var newPostsState = [...posts];
                newPostsState[index] = {
                    ...editablePost
                }

                setPosts(newPostsState);
            }
        }


        const userBlocked = (user) => {
            setPosts(posts.filter(post => post.type == "loading" || post.type == "stories" || post.type == "reels" || post.user.id != user.id));
        }


        event.addListener("update-post-likes", updatePostLikes);
        event.addListener("update-post-comments", updatePostComments);
        event.addListener("update-post-favorite", updatePostFavorite);
        event.addListener("update-profile", updateProfile);
        event.addListener("new-post", addNewPost);
        event.addListener("delete-post", deletePost);
        event.addListener("edit-post", editPost);
        event.addListener("blocked-user", userBlocked);
        return () => {
            event.removeListener('new-post', addNewPost);
            event.removeListener("update-post-likes", updatePostLikes);
            event.removeListener("update-post-comments", updatePostComments);
            event.removeListener("update-post-favorite", updatePostFavorite);
            event.removeListener("update-profile", updateProfile);
            event.removeListener("delete-post", deletePost);
            event.removeListener("edit-post", editPost);
            event.removeListener("blocked-user", userBlocked);
        }
    }, [posts])


    useEffect(() => {
        if (!checkAuthentication)
            return;
        // whene ever screen loose focus set blur to true 
        // to stop all video posts from running 
        client.query({
            query: gql`

                query GET_POSTS($postTime : String, $reelTime : String , $postLimit : Int! , $reelLimit : Int!) { 
                    getPosts(time : $postTime , limit : $postLimit) { 
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
                    }
                    getReels(time : $reelTime , limit : $reelLimit) { 
                        id 
                        title 
                        type 
                        media { 
                            id path
                        }
                        createdAt 
                        liked
                        likes  
                        numComments 
                        reel { 
                            id
                            thumbnail { 
                                id  path 
                            } 
                            views
                        } 
                        user { 
                            id
                            name 
                            lastname 
                            profilePicture { 
                                id path 
                            } 
                            validated 
                        }
                    }
                }` ,
            variables: {
                postTime: timeOffset.postTime,
                reelTime: timeOffset.reelTime,

                postLimit: POST_LIMIT,
                reelLimit: REEL_LIMIT
            }
        }).then(response => {

            var reels = null;
            if (response.data.getReels.length >= 3)
                reels = {
                    type: "reels",
                    reels: response.data.getReels
                };

            const lastPost = response.data.getPosts.length > 0 && response.data.getPosts[response.data.getPosts.length - 1];
            const lastReel = response.data.getReels.length > 0 && response.data.getReels.length >= 3 && response.data.getReels[response.data.getReels.length - 1];

            const firstPost = response.data.getPosts.length > 0 && response.data.getPosts[0];
            setLastTimeOffset({
                lastPost: (lastPost) ? (lastPost.createdAt) : lastTimeOffset.lastPost,
                lastReel: (lastReel) ? (lastReel.createdAt) : lastTimeOffset.lastReel
            });


     

            if (firstPost && !firstTime)
                setFirstTime(firstPost.createdAt);

            const postsLength = response.data.getPosts.length;
            const randomIndex = Math.trunc(Math.random() * postsLength);
            var newContent = response.data.getPosts;

            if (reels)
                newContent.splice(randomIndex, 0, reels)

     
            setPosts([...posts.filter(post => post.type != "loading") , ...newContent]);

            if (response.data.getPosts.length < POST_LIMIT)
                setEnd(true);

            setLoading(false);
            if (firstFetch)
                setFirstFetch(false)
        }).catch(error => {
            setLoading(false);
        });



    }, [timeOffset, checkAuthentication]);

    const reachEnd = useCallback(() => {

        if (!loading && !end && !firstFetch) {

            setTimeOffset({
                postTime: lastTimeOffset.lastPost,
                reelTime: lastTimeOffset.lastReel
            });

            setPosts([...posts, { type: "loading" }])
            setLoading(true);

        }

    }, [loading, posts, end, lastTimeOffset, firstFetch])

    // handle loading changes 
    // whene we are in the loading mode add the loading component 
    // else remove the loading components 



    useEffect(() => {
        if (refresh) {

            client.query({
                query: gql`
                query Refresh($time: String!, $limit: Int!) {
                    refresh(time: $time, limit: $limit) {
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
                    }
                }`, variables: {
                    time: firstTime,
                    limit: POST_LIMIT
                }
            }).then(response => {


                console.log(response.data.refresh);

                const firstPost = response.data.refresh.length > 0 && response.data.refresh[0];
                if (firstPost) {
                    setFirstTime(firstPost.createdAt);
                }

                var clonePosts = [...posts.filter(post => post.type != "loading")];
                if (response.data.refresh && response.data.refresh.length > 0)
                    clonePosts.splice(1, 0, ...response.data.refresh);

                setPosts(clonePosts);
                setRefresh(false);

            }).catch(error => {
                setRefresh(false);
            })
        }

    }, [refresh])


    const handleScroll = useCallback((event) => {

 
        if (event.nativeEvent.contentOffset.y == 0 && event.nativeEvent.velocity.y >= 0.15 && !refresh && isAuth) {
            if (posts.length >= 1 && posts[0].type == "stories") {
                var clonePosts = [...posts];
                clonePosts.splice(1, 0, { id: 0, type: "loading" });
                setPosts(clonePosts);
                setRefresh(true);
            }

        }

    }, [posts, refresh, isAuth])

    return (
        <View style={styles.container}>

            <HomeHeader navigation={navigation} />

            <View style={styles.content}>
                <FlatList
                    onEndReached={reachEnd}
                    onEndReachedThreshold={0.2}
                    data={posts}
                    keyExtractor={keyExtractor}
                    renderItem={renderItem}
                    maxToRenderPerBatch={2}
                    initialNumToRender={2}
                    onScrollEndDrag={handleScroll}

                />
            </View>

        </View>
    )



};


const lightStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#eee",
        paddingBottom: 138
    },

    stories: {
        backgroundColor: "white",
        paddingVertical: 16,
        marginTop: 16,

    },

});

const darkStyles = {

    container: {
        flex: 1,
        backgroundColor: darkTheme.secondaryBackgroundColor,
        paddingBottom: 138
    },
    stories: {
        backgroundColor: darkTheme.backgroudColor,
        paddingVertical: 16,
        marginTop: 16
    }

}