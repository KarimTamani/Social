import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import Story from "./Story";
import { AuthContext } from "../../../providers/AuthContext";

import * as ImagePicker from 'expo-image-picker';
import { ApolloContext } from "../../../providers/ApolloContext";
import { gql } from "@apollo/client";
import { useEvent } from "../../../providers/EventProvider";
import LoadingStories from "../loadings/LoadingStories";

const LIMIT = 10;

export default function Stories({ navigation }) {

    const list = useRef();
    const auth = useContext(AuthContext);
    const [user, setUser] = useState(null);


    const client = useContext(ApolloContext);
    const [myStories, setMyStories] = useState([]);
    const [followers, setFollowers] = useState([]);

    const event = useEvent();
    const [loading, setLoading] = useState(true);

    const [refrechStoriesHandler, setRefrechStoriesHandler] = useState(null);

    useEffect(() => {
        (async () => {
            const authUser = await auth.getUserAuth();
            if (authUser && !user)
                setUser(authUser.user)
        })();


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
            const followerIndex = followers.findIndex(follower => follower.id == story.user.id);
            if (followerIndex >= 0) {
                const storyIndex = followers[followerIndex].stories.findIndex(s => s.id == story.id);
                if (storyIndex >= 0) {
                    followers[followerIndex].stories[storyIndex].seen = true;
                    setFollowers(reorderFollowersStories([...followers]));
                }

            }
        }

        const likeStory = (value , story) => {
            const followerIndex = followers.findIndex(follower => follower.id == story.user.id);
            if (followerIndex >= 0) {
                const storyIndex = followers[followerIndex].stories.findIndex(s => s.id == story.id);
                if (storyIndex >= 0) {
                    followers[followerIndex].stories[storyIndex].liked = value;
                    setFollowers(reorderFollowersStories([...followers]));
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
                followersStories = followersStories.map(follower => follower.following);
                setFollowers([...prviousStories, ...reorderFollowersStories(followersStories)]);
                setLoading(false);
            }
        })
    }


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
                    setFollowers(reorderFollowersStories(followersStories));
                    setLoading(false);
                }

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
            followers,
            followerId: followerId
        })
    }, [followers]);


    const addStory = useCallback(() => {

        (async () => {

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
        })();

    }, [])
    if (!loading)
        return (
            <View style={styles.container}>

                <ScrollView horizontal
                    ref={list}
                    style={styles.list}
                    inverted={true}
                >
                    {
                        user &&
                        <Story key={0} stories={myStories} user={user} mine={true} openAddStoryScreen={addStory} />
                    }
                    {

                        followers && followers.map((follower) => (
                            <Story key={follower.id} user={follower} stories={follower.stories} onPress={() => openStory(follower.id)} />
                        ))

                    }

                </ScrollView>

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
 
    list: {
        paddingLeft: 8,
        
        transform: [{ scaleX: -1 }]
    }
})