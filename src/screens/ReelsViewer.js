import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { View, Text, StyleSheet, StatusBar, FlatList, Dimensions } from "react-native";
import LoadingReel from "../components/Cards/post/loadingReel";
import Reel from "../components/Cards/Reel";
import { ApolloContext } from "../providers/ApolloContext";
import { gql } from "@apollo/client";
import { AuthContext } from "../providers/AuthContext";
import { useEvent } from "../providers/EventProvider";

const WIDTH = Dimensions.get("screen").width;
const HEIGHT = Dimensions.get("screen").height;

const LIMIT = 5;
export default function ReelsViewer({ navigation, route }) {
    const [reels, setReels] = useState([{ type: "loading" }]);
    const [viewableList, setViewableList] = useState([0]);
    const [blur, setBlur] = useState(false);
    const listRef = useRef();

    const fetchMore = route.params.fetchMore;

    const [loading, setLoading] = useState(false);
    const [end, setEnd] = useState(false);

    const [time, setTime] = useState(null);
    const [lastReelTime, setLastReelTime] = useState(null);

    const client = useContext(ApolloContext);
    const [user, setUser] = useState(null);
    const auth = useContext(AuthContext);

    const event = useEvent() ; 

    useEffect(() => {
        if (time != null && fetchMore)
            client.query({
                query: gql`
            query GET_POSTS($time : String , $limit : Int!) { 
                getReels(time : $time , limit : $limit) { 
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
                    var reelsResponse = response.data.getReels

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

            })

    }, [time]);

    useEffect(() => {
        (async () => {
            var focusPostId = null; var reelsData;
            var fetchMore = route.params.fetchMore;

            if (route.params)
                focusPostId = route.params.focusPostId;


            if (route.params && route.params.getReels) {
                reelsData = await route.params.getReels();

                reelsData = [...reelsData];

                if (fetchMore) {
                    var lastPost = reelsData[reelsData.length - 1];
                    setLastReelTime(lastPost.createdAt);
                }


                if (focusPostId) {

                    const findIndex = reelsData.findIndex((post) => post.id == focusPostId);
                    const focusPost = reelsData[findIndex];

                    reelsData.splice(findIndex, 1);
                    reelsData.splice(0, 0, focusPost);
                }

                if (fetchMore)
                    reelsData.push({ type: "loading" })



                setReels(reelsData);
                listRef.current?.scrollToOffset({ animated: true, y: 0 });
            }
        })()
    }, [route]);

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
                <Reel reel={item} focus={focus} openProfile={openProfile} navigation={navigation } />
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
    const endReach = useCallback(() => {
        if (!loading && !end) {
            setTime(lastReelTime);
            setLoading(true);
        }
    }, [lastReelTime, loading, end]);


    const openProfile = useCallback((userId) => {

        if (user) {
            if (user.id == userId) {
                navigation.navigate("AccountStack", { screen: "MyProfile" })
                return;
            }
            navigation.navigate("Profile", { userId: userId });

        }

    }, [navigation, user]) ; 


    useEffect(() => {
        const deletePost = (deletedPost) => {

            if (deletedPost.type == "reel") {
                const index = reels.findIndex(post => post.type != "loading" && post.id == deletedPost.id);
                if (index >= 0) {
                    var newPostsState = [...reels];
                    newPostsState.splice(index, 1);
                    setReels(newPostsState);

                }
            }

        }


        const editPost = (editablePost) => {
            if (editablePost.type == "reel") {
                const index = reels.findIndex(post => post.type != "loading"  && post.id == editablePost.id);
                if (index >= 0) {
                    var newPostsState = [...reels];
                    newPostsState[index] = {
                        ...editablePost
                    }

                    setReels(newPostsState);
                }
            }
        }
        
        const userBlocked = (user) => {
            setReels(reels.filter(post => post.type == "loading" || post.user.id != user.id));
        }
        
        event.addListener("delete-post", deletePost);
        event.addListener("edit-post" ,editPost ) ; 
        event.addListener("blocked-user", userBlocked);
        

        return() => {
            event.removeListener("delete-post", deletePost);
            event.removeListener("edit-post", editPost);
            event.removeListener("blocked-user", userBlocked);
        }
    } , [reels])

    return (
        <View style={styles.container}>

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
                    decelerationRate={"fast"}
                    snapToAlignment="end"
                    initialNumToRender={1}
                    maxToRenderPerBatch={1}
                    onEndReached={endReach}
                />

            </View>
        </View>
    )
}



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