import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { View, Text, StyleSheet, ScrollView, FlatList } from "react-native";
import Story from "./Story";
import { AuthContext } from "../../../providers/AuthContext";

import * as ImagePicker from 'expo-image-picker';
import { ApolloContext } from "../../../providers/ApolloContext";
import { gql } from "@apollo/client";
import { useEvent } from "../../../providers/EventProvider";
import LoadingStories from "../loadings/LoadingStories";
import { Modal } from "react-native";
import StoriesViewOrAdd from "./storiesViewOrAdd";
import LoadingActivity from "../post/loadingActivity";

const LIMIT = 10;
const MYSTORY = { id: 0, type: "myStories" }  ;

export default function Stories({ navigation }) {


    const auth = useContext(AuthContext);
    const [user, setUser] = useState(null);

    const client = useContext(ApolloContext);
    const [myStories, setMyStories] = useState([]);
    const [followers, setFollowers] = useState([]);

    const event = useEvent();
    const [loading, setLoading] = useState(true);

    const [refrechStoriesHandler, setRefrechStoriesHandler] = useState(null);
    const [showStoriesViewOrAdd, setShowStoriesViewOrAdd] = useState(false);


    const [loadMore, setLoadMore] = useState(false);
    const [end, setEnd] = useState(false);



    useEffect(() => {
        (async () => {
            const authUser = await auth.getUserAuth();
            if (authUser && !user)
                setUser(authUser.user)
        })();

        setLoadMore( false ) ; 
        setLoading ( true ) ; 
        setEnd( false )
        const updateProfile = (profile) => {
            setUser(profile);
        };
        event.addListener("update-profile", updateProfile);
        return () => {
            event.removeListener("update-profile", updateProfile);
        }
    }, []);


    useEffect(() => {
        event.on("new-story", (story) => {
            setMyStories([story, ...myStories]);
        });
        return () => {
            event.off("new-story");
        }
    }, [myStories]);



    useEffect(() => {

        const seeStory = (story) => {
            const followerIndex = followers.findIndex(follower => follower.type != "loading" && follower.type != "myStories" &&  follower.id == story.user.id);
            if (followerIndex >= 0) {
                const storyIndex = followers[followerIndex].stories.findIndex(s => s.id == story.id);
                if (storyIndex >= 0) {
                    followers[followerIndex].stories[storyIndex].seen = true;
                    setFollowers(  [MYSTORY , ...reorderFollowersStories([...followers.filter( follower => follower.type != "loading" && follower.type != "myStories" )])] );
               
                }

            }
        }

        const likeStory = (value, story) => {
            const followerIndex = followers.findIndex(follower => follower.type != "loading" && follower.type != "myStories" &&  follower.id == story.user.id);
            if (followerIndex >= 0) {
                const storyIndex = followers[followerIndex].stories.findIndex(s => s.id == story.id);
                if (storyIndex >= 0) {
                    followers[followerIndex].stories[storyIndex].liked = value;
                    setFollowers(  [MYSTORY , ...reorderFollowersStories([...followers.filter( follower => follower.type != "loading" && follower.type != "myStories" )])] );
                }
            }
        }

        const handleFollowingStateChanged = ({ userId, state }) => {
            if (refrechStoriesHandler)
                clearTimeout(refrechStoriesHandler);

            setRefrechStoriesHandler(setTimeout(() => {
                setLoading(true);
                load_more_stories([]);

            }, 5000))
        }

        event.addListener("new-following", handleFollowingStateChanged);
        event.addListener("see-story", seeStory);
        event.addListener("like-story", likeStory)

        return () => {

            event.removeListener("see-story", seeStory);
            event.removeListener("like-story", likeStory);
            event.removeListener("new-following", handleFollowingStateChanged)

        }

    }, [followers, refrechStoriesHandler]);

    useEffect(() => {

        const likeStory = (value, story) => {
            const index = myStories.findIndex(s => s.id == story.id);
            if (index >= 0) {

                myStories[index].liked = value;
                setMyStories(myStories);
            }
        }
        event.addListener("like-story", likeStory)

        return () => {


            event.removeListener("like-story", likeStory);


        }
    }, [myStories])


    const load_more_stories = async (prviousStories) => {

        const offset = prviousStories.length;

        client.query({
            query: gql`
            query Query($offset: Int!, $limit: Int! ) {
                getStories(offset: $offset, limit: $limit) {
              
                  following {
                  id 
                  name lastname profilePicture {
                     id path 
                  } 
                  
                  stories {
                    id 
                    liked
                    createdAt
                    seen 
                    media {
                       id path 
                    }

                  }
                   
                  }
                }
                
              }
            ` , variables: {

                offset: offset,
                limit: LIMIT
            }
        }).then(response => {

            if (response && response.data.getStories) {
                var followersStories = response.data.getStories;

                if (followersStories.length < LIMIT) 
                    setEnd(true) ; 

                followersStories = followersStories.map(follower => follower.following);
                setFollowers([MYSTORY ,  ...prviousStories, ...reorderFollowersStories(followersStories)]);
                setLoading(false);
                
            }

            setLoadMore( false ) ; 
        }).catch( error => { 
            setLoadMore( false ) ; 
            setLoading(false);

        })
    }

    useEffect(() => { 
        if ( loadMore) { 
            load_more_stories(followers.filter ( s => s.type != "loading" && s.type != "myStories"))
        }
    } , [loadMore])
    useEffect(() => {

        if (user) {
            client.query({
                query: gql`
                query Query($offset: Int!, $limit: Int! , $userId : ID!) {
                    getStories(offset: $offset, limit: $limit) {
                  
                      following {
                      id 
                      name lastname profilePicture {
                         id path 
                      } 
                      
                      stories {
                        id 
                        liked
                        createdAt
                        seen 
                        media {
                           id path 
                        }
    
                      }
                       
                      }
                    }
                    getUserStories(userId: $userId) {
                        id 
                        createdAt 
                        expiredAt 
                        liked 
                        seen 
                        media {
                           id path 
                        } 
                    }
                  }
                ` , variables: {
                    userId: user.id,
                    offset: 0,
                    limit: LIMIT
                }
            }).then(response => {



                if (response && response.data.getUserStories) {
                    // sorting stories based on the date of creation 
                    var stories = response.data.getUserStories;
                    stories = stories.sort((a, b) => a.createdAt < b.createdAt);
                    setMyStories(response.data.getUserStories);

                };

                if (response && response.data.getStories) {

                    var followersStories = response.data.getStories;
                    followersStories = followersStories.map(follower => follower.following);

                    if ( followersStories.length < LIMIT) 
                        setEnd( true ) ; 

                    setFollowers([MYSTORY, ...reorderFollowersStories(followersStories)]);
                }
                setLoading(false);

            }).catch(error => {
                setLoading(false);

            })
        }
    }, [user]);


    const reorderFollowersStories = (followersStories) => {

        for (let index = 0; index < followersStories.length; index++) {
 
            followersStories[index].stories = followersStories[index].stories.sort((a, b) => a.createdAt < b.createdAt);

            var unseenStories = followersStories[index].stories.filter(story => !story.seen);
            var seenStories = followersStories[index].stories.filter(story => story.seen);

            followersStories[index].stories = [...unseenStories, ...seenStories];


        }
        followersStories = followersStories.sort((a, b) => a.stories[0].createdAt < b.stories[0].createdAt);

        var unseenStories = followersStories.filter(followerStories => !followerStories.stories[0].seen)
        var seenStories = followersStories.filter(followerStories => followerStories.stories[0].seen)

        followersStories = [...unseenStories, ...seenStories];


        return followersStories;
    }

    const openStory = useCallback((followerId) => {
        navigation.navigate("StoriesList", {
            followers : followers.filter ( f => f.type != "loading" && f.type != "myStories"),
            followerId: followerId
        })
    }, [followers]);


    const openImagePicker = async () => {
        setShowStoriesViewOrAdd(false);
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsMultipleSelection: false,
            quality: 0.2
        });

        if (!result.canceled) {
            navigation.navigate("AddStory", {
                media: result.assets[0]
            });
        }
    }

    const addStory = useCallback(() => {

        if (myStories.length == 0) {
            openImagePicker();
        }
        else
            setShowStoriesViewOrAdd(true);


    }, [myStories])

    const onView = useCallback(() => {

        var cloneUser = { ...user };
        cloneUser.stories = myStories;


        navigation.navigate("StoriesList", {
            followers: [cloneUser],
            followerId: cloneUser.id
        })


        setShowStoriesViewOrAdd(false);

    }, [navigation, myStories, user]);


    const keyExtractor = useCallback((item, index) => {
        if (item.type == "loading")
            return item.type;
        return item.id
    }, [])

    const renderItem = useCallback(({ item, index }) => {

        if (item.type == "loading")
            return (
                <LoadingActivity style={styles.loadingAcitivty} />
            )


        if (item.type == "myStories" && user)
            return (
                <Story stories={myStories} user={user} mine={true} openAddStoryScreen={addStory} />
            )
        return (
            <Story user={item} stories={item.stories} onPress={() => openStory(item.id)} />
        )
    }, [user, myStories]);


    const endReached = useCallback(() => {
        if (!loading && !loadMore && !end) {


            setFollowers([...followers, { type: "loading" }])
            setLoadMore(true)
        }
    }, [followers, loading, loadMore, end])
    if (!loading)
        return (
            <View style={styles.container}>
                <FlatList
                    style={styles.list}
                    keyExtractor={keyExtractor}
                    renderItem={renderItem}
                    data={followers}
                    horizontal={true}
                    onEndReached={endReached}
                    onEndReachedThreshold={0.2}
                />
                {
                    showStoriesViewOrAdd &&
                    <Modal
                        transparent
                        onRequestClose={() => setShowStoriesViewOrAdd(false)}
                    >
                        <StoriesViewOrAdd
                            onView={onView}
                            onAdd={openImagePicker}
                            onClose={() => setShowStoriesViewOrAdd(false)}
                        />
                    </Modal>
                }
            </View>
        )
    else if (loading) {
        return (
            <View style={styles.container}>

                <LoadingStories />

            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        //      backgroundColor: "red",
        flexDirection: "row",
        paddingLeft: 8,
        transform: [{ scaleX: -1 }]
    },

    list: {
        width: "100%",
        flex: 1,
    } , 
    loadingAcitivty : { 
        height: 164,
        width: 96,
        
    }
})