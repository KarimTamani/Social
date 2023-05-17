import { useCallback, useContext, useEffect, useState } from "react";
import { View, Text, StyleSheet, Image, FlatList, TouchableOpacity, Dimensions } from "react-native";
import { AntDesign } from '@expo/vector-icons';

import darkTheme from "../../../design-system/darkTheme";
import ThemeContext from "../../../providers/ThemeContext";
import { ApolloContext } from "../../../providers/ApolloContext";
import { gql } from "@apollo/client";
import { getMediaUri } from "../../../api";
import LoadingActivity from "../post/loadingActivity";
import { useEvent } from "../../../providers/EventProvider";
import { useFocusEffect } from "@react-navigation/native";

const WIDTH = Dimensions.get("screen").width;
const LIMIT = 9;

export default function ProfileVideos({ navigation, route }) {

    const themeContext = useContext(ThemeContext);
    const styles = themeContext.getTheme() == "light" ? lightStyles : darkStyles;
    const { userId } = route.params;

    const [reels, setReels] = useState([]);
    const client = useContext(ApolloContext);

    const [end, setEnd] = useState(false);
    const [loading, setLoading] = useState(false);

    const [firstFetch, setFirstFetch] = useState(true);
    const event = useEvent();


    const load_data = async () => {

        return client.query({
            query: gql`

            query GET_REELS($userId : ID! , $offset : Int! , $limit : Int! ){
                getUserPosts(userId: $userId, postType: "reel", offset: $offset , limit: $limit) {
                  createdAt
                  id
                  liked
                  likes
                  title
                  numComments
                  isFavorite
                  media { 
                    id path 
                  }
                  reel { 
                    views 
                    thumbnail { 
                        id path 
                      }
                  }
                  
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
                userId: userId,
                offset: reels.filter(reel => reel.type != "loading").length,
                limit: LIMIT
            }
        })
    }


    const keyExtractor = useCallback((item) => {
        return item.id
    }, []);

    // a callback to open reels of this user 
    const openReels = useCallback((reelId) => {
        navigation.navigate("ReelsViewer", {

            focusPostId: reelId,
            getReels: () => reels , 
            fetchMore : false  

        })
    }, [navigation, reels])

    // this effect will be excuted only at the first time we load this component
    useEffect(() => {

        load_data().then(response => {

            var newPosts = response.data.getUserPosts;
            setReels([...reels, ...newPosts]);
            if (newPosts.length < LIMIT)
                setEnd(true);

            setFirstFetch(false)
        }).catch(error => {
            console.log(error);
        })

    }, []);

    // set an event to whenever we add new reel we update it here 
    useEffect(() => {
        const addNewPost = (newPost) => {
            if (newPost.type == "reel") {
                setReels([newPost, ...reels]);
            }
        }

        const updatePostLikes = (postId, value, numLikes) => {
            const index = reels.findIndex(post => post.type != "loading" && post.id == postId);
            if (index >= 0) {
                var newPostsState = [...reels];
                newPostsState[index] = {
                    ...reels[index],
                    liked: value,
                    likes: numLikes
                };

                setReels(newPostsState);

            }

        }
        const updatePostFavorite = (postId, value) => {
            const index = reels.findIndex(post => post.type != "loading" && post.id == postId);

            if (index >= 0) {
                var newPostsState = [...reels];
                newPostsState[index] = {
                    ...reels[index],
                    isFavorite: value,
                };
                setReels(newPostsState);
            }

        }
        const updatePostComments = (postId, value) => {
            const index = reels.findIndex(post => post.type != "loading" && post.id == postId);

            if (index >= 0) {
                var newPostsState = [...reels];
                newPostsState[index] = {
                    ...reels[index],
                    numComments: value,
                };
                setReels(newPostsState);
            }
        }


        const updateProfile = (profile) => {

            var newState = reels.map(reel => {
                reel.user = profile;
                return reel;
            });

            setReels([...newState]);

        };

        event.addListener("update-post-likes", updatePostLikes);
        event.addListener("update-post-comments", updatePostComments);
        event.addListener("update-post-favorite", updatePostFavorite);
        event.addListener("update-profile", updateProfile);
        event.addListener("new-post", addNewPost);
        return () => {
            event.removeListener("new-post", addNewPost);
            event.removeListener("update-post-likes", updatePostLikes);
            event.removeListener("update-post-comments", updatePostComments);
            event.removeListener("update-post-favorite", updatePostFavorite);
            event.removeListener("update-profile", updateProfile);
        }
    }, [reels]);

    // this effect will be executed only whene we reach the bottom of the list 
    // so we load more reels and we add them to the bottom of the list 
    useEffect(() => {
        if (loading) {


            load_data().then(response => {
                var newPosts = response.data.getUserPosts;
                setReels([...(reels.filter(reel => reel.type != "loading")), ...newPosts]);

                if (newPosts.length < LIMIT)
                    setEnd(true);

                setLoading(false);
            }).catch(error => {
                console.log(error);
            });
        }
    }, [loading])

    // update the content height whenever we fcus on this page 
    useFocusEffect(useCallback(() => {
        event.emit("update-height", Math.ceil(reels.length / 3) * (180 + 2));
    }, [reels]))



    // whenever we reach the end of the list 
    // set the state to be loading and increase the offset 
    const reachEnd = useCallback(() => {

        if (!loading && !end) {
            console.log("load more");

            var loadingComponents = [];
            const loadingLength = reels.length % 3 == 0 ? 3 : (reels.length % 3 + 3);

            for (var index = 0; index < loadingLength; index++) {
                loadingComponents.push({
                    id: 0,
                    type: "loading"
                })
            }
            setReels([...reels, ...loadingComponents]);
            setLoading(true);

        }

    }, [loading, reels, end]);




    const renderItem = useCallback(({ item }) => {
        if (item.type == "loading")
            return <LoadingActivity size={26} style={styles.video} color='#aaaa' />

        return (
            <TouchableOpacity style={styles.video} onPress={() => openReels(item.id)}>
                <Image source={{ uri: getMediaUri(item.reel.thumbnail.path) }} style={styles.thumbnail} />
                <View style={styles.videoInfo}>
                    <AntDesign name="play" style={styles.playIcon} />
                    <Text style={styles.views}>
                        {item.reel.views}
                    </Text>
                </View>
            </TouchableOpacity>
        )
    }, [reels]);

    return (
        <View style={styles.container}>
            {
                !firstFetch &&
                <FlatList
                    data={reels}
                    keyExtractor={keyExtractor}
                    renderItem={renderItem}
                    numColumns={3}
                    onEndReached={reachEnd}
                    nestedScrollEnabled
                />
            }
            {
                firstFetch &&

                <LoadingActivity size={26} style={[styles.video, { alignSelf: "center" }]} color='#aaaa' />
            }
        </View>
    )
}

const lightStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#eee",

    },
    video: {
        flex: 1,
        padding: 1,
        height: 180,
        position: "relative",
        alignItems: "center",
        justifyContent: "center",
    },
    thumbnail: {
        width: "100%",
        height: "100%",
        resizeMode: "cover"
    },
    videoInfo: {
        position: "absolute",
        alignItems: "center"
    },
    playIcon: {
        color: "white",
        fontSize: 24
    },
    views: {
        color: "white",
        fontSize: 14,
        marginTop: 4
    }
});



const darkStyles = {
    ...lightStyles,
    container: {
        flex: 1,
        backgroundColor: darkTheme.secondaryBackgroundColor,

    }
}