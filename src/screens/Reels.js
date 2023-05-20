import { LinearGradient } from "expo-linear-gradient";
import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { View, Text, StyleSheet, FlatList, Dimensions, StatusBar, SafeAreaView } from "react-native";
import Reel from "../components/Cards/Reel";

import { useFocusEffect } from "@react-navigation/native";
import { ApolloContext } from "../providers/ApolloContext";
import { gql } from "@apollo/client";
import LoadingReel from "../components/Cards/post/loadingReel";
import { useEvent } from "../providers/EventProvider";
import { AuthContext } from "../providers/AuthContext";

const WIDTH = Dimensions.get("screen").width;
const HEIGHT = Dimensions.get("screen").height;

const LIMIT = 5;


export default function Reels({ navigation, route }) {


    const pageName = route.name;


    const [reels, setReels] = useState([{ type: "loading" }]);

    const [viewableList, setViewableList] = useState([0]);
    const [blur, setBlur] = useState(false);
    const listRef = useRef();

    const client = useContext(ApolloContext);
    const event = useEvent();
    const auth = useContext(AuthContext)

    const [user, setUser] = useState(null);
    const [time, setTime] = useState(null);
    const [lastReelTime, setLastReelTime] = useState(null);
    const [loading, setLoading] = useState(false);
    const [end, setEnd] = useState(false);


    useEffect(() => {
        const addReel = (post) => {
            setReels(
                [post, ...reels]
            );
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
                if (reel.user.id == profile.id)
                    reel.user = profile;
                return reel;
            });

            setReels([...newState]);

        };
        event.addListener("update-post-likes", updatePostLikes);
        event.addListener("update-post-comments", updatePostComments);
        event.addListener("update-post-favorite", updatePostFavorite);
        event.addListener("update-profile", updateProfile);
        event.addListener("new-post", addReel);
        return () => {
            event.removeListener("new-post", addReel);
            event.removeListener("update-post-likes", updatePostLikes);
            event.removeListener("update-post-comments", updatePostComments);
            event.removeListener("update-post-favorite", updatePostFavorite);
            event.removeListener("update-profile", updateProfile);
        }
    }, [reels]);


    useEffect(() => {
        var prefix = "";
        if (pageName == "PrivateReels") {
            prefix = "Followers";
        }

        client.query({
            query: gql`
            query GET_POSTS($time : String , $limit : Int!) { 
                get${prefix}Reels(time : $time , limit : $limit) { 
                    id 
                    title 
                    type 
                    media { 
                        id path
                    }
                    createdAt 
                    liked
                    numComments
                    likes  
                    isFavorite
                    reel { 
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
            }` , variables: {
                time: time,
                limit: LIMIT
            }

        }).then(response => {


         
            if (response) {
                var reelsResponse;
                if (!prefix)
                    reelsResponse = response.data.getReels;
                else
                    reelsResponse = response.data.getFollowersReels

                const lastPost = reelsResponse.length > 0 && reelsResponse[reelsResponse.length - 1];
                if (lastPost) {
                    setLastReelTime(lastPost.createdAt);
                }



                setReels(previousReels => {
                    const index = previousReels.findIndex(reel => reel.type == "loading");
                    previousReels.splice(index, 1);
                    if (reelsResponse.length >= LIMIT)
                        return [...previousReels, ...reelsResponse, { type: "loading" }];
                    else
                        return [...previousReels, ...reelsResponse];

                })

                if (reelsResponse.length < LIMIT)
                    setEnd(true);
                setLoading(false);
            }
        }).catch(error => {
            setLoading(false);
            console.log(error);
        })

    }, [time]);

    const renderItem = useCallback(({ item, index }) => {

        if (item.type == "loading")
            return (
                <View style={styles.reel}>
                    <LoadingReel />
                </View>

            )

        const focus = viewableList.findIndex((itemIndex) => itemIndex == index) >= 0 && !blur;


        return (
            <View style={styles.reel}>
                <Reel reel={item} focus={focus} openProfile={openProfile} navigation = {navigation} />
            </View>
        )

    }, [viewableList, blur]);

    const keyExtractor = useCallback((item, index) => {
        return index;
    }, []);

    // always keep track of the viewable item in list 
    // so we can play or stop video posts from running whene they arn't visible  
    const onViewableItemsChanged = ({ viewableItems }) => {
        setViewableList(viewableItems.map((item => item.index)))
    };
    const viewabilityConfigCallbackPairs = useRef([
        { onViewableItemsChanged },
    ]);

    useEffect(() => {
        // whene ever screen loose focus set blur to true 
        // to stop all video posts from running 
        const blurUnsubscribe = navigation.addListener('blur', () => {
            setBlur(true);
        });
        const focusUnsubscribe = navigation.addListener("focus", () => {
            setBlur(false);
        });


        (async () => {
            const userAuth = await auth.getUserAuth();
            if (userAuth && userAuth.user) {
                setUser(userAuth.user);
            }
        })();


        return () => {
            blurUnsubscribe();
            focusUnsubscribe();

        };
    }, []);


    useFocusEffect(useCallback(() => {

        var focusPostId = null; var reelsData
        if (route.params)
            focusPostId = route.params.focusPostId;

        if (route.params && route.params.getReels) {
            reelsData = route.params.getReels();
        }

        if (focusPostId && reelsData) {
            setReels([]);

            const findIndex = reelsData.findIndex((post) => post.id == focusPostId);
            const focusPost = reelsData[findIndex];

            reelsData.splice(findIndex, 1);
            reelsData.splice(0, 0, focusPost)

            setReels(reelsData);
            listRef.current?.scrollToOffset({ animated: true, y: 0 });

        }

    }, [route.params]))




    const endReach = useCallback(() => {

        if (!loading && !end) {

            setTime(lastReelTime);
            setLoading(true);

        }

    }, [lastReelTime, loading, end])



    const openProfile = useCallback((userId) => {

        if (user) {


            if (user.id == userId) {
                navigation.navigate("AccountStack", { screen: "MyProfile" })
                return;
            }
            navigation.navigate("Profile", { userId: userId });

        }

    }, [navigation, user])

    return (
        <SafeAreaView style={styles.container}>


            <StatusBar backgroundColor={"transparent"} style="light" />
            <View style={styles.content}>

                <FlatList
                    viewabilityConfig={{
                        itemVisiblePercentThreshold: 100
                    }}
                    ref={listRef}
                    viewabilityConfigCallbackPairs={
                        viewabilityConfigCallbackPairs.current

                    }
                    data={reels}
                    keyExtractor={keyExtractor}
                    renderItem={renderItem}
                    snapToInterval={HEIGHT}
                    snapToAlignment="end"
                    decelerationRate={"fast"}
                    initialNumToRender={1}
                    maxToRenderPerBatch={1}
                    onEndReached={endReach}
                />






            </View>
        </SafeAreaView>
    )
};


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#333"
    },
    content: {
        flex: 1
    },
    reel: {
        height: HEIGHT,
        width: WIDTH,
    }
})