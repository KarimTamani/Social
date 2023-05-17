import { useCallback, useContext, useEffect, useState } from "react";
import { View, Text, StyleSheet, Image, FlatList, TouchableOpacity } from "react-native";
import SmallFollowButton from "../../Buttons/SmallFollowButton";
import { textFonts } from "../../../design-system/font"
import ThemeContext from "../../../providers/ThemeContext";
import darkTheme from "../../../design-system/darkTheme";
import { ApolloContext } from "../../../providers/ApolloContext";
import { gql } from "@apollo/client";
import { getMediaUri } from "../../../api";
import LoadingActivity from "../post/loadingActivity";
import { useEvent } from "../../../providers/EventProvider";
import { useRealTime } from "../../../providers/RealTimeContext";

const LIMIT = 10;


export default function FollowsList({ navigation , route  }) {


    const client = useContext(ApolloContext);
    const event = useEvent() ; 


    const themeContext = useContext(ThemeContext);
    const styles = themeContext.getTheme() == "light" ? lightStyles : darkStyles;

    const [followers, setFollowers] = useState([]);


    const [firstFetch, setFirstFetch] = useState(true);
    const [loading, setLoading] = useState(false);
    const [end, setEnd] = useState(false);
    const realTime = useRealTime() ; 
    
    useEffect(() => {
        
        if (!route || !route.params || !route.params.notificationData) 
            return ; 
        
        const notificationData = route.params.notificationData ; 

        if ( notificationData && notificationData.user) {
            openProfile(notificationData.user.id) ; 
        }
        
    } , [route])


    const loadNotfications = async (offset) => {
        client.query({
            query: gql`
            query GetFollowersNotifications($offset: Int!, $limit: Int!) {
                getFollowersNotifications(offset: $offset, limit: $limit) {
                  
                  follow {
                    id
                    userId
                    createdAt
                    user {
                      id name lastname username 
                      isFollowed 
                      profilePicture {
                        id 
                        path
                      }
                    }
                  }
                }
            }` ,
            variables: {
                offset: offset,
                limit: LIMIT
            }
        }).then(response => {
            if (response && response.data) {
                var newFollowers = response.data.getFollowersNotifications;
                if (newFollowers.length < LIMIT ) 
                    setEnd(true) ; 
 
                setFollowers([...(followers.filter(follower => follower.type != "loading")), ...newFollowers]);
                
            }


            
            setFirstFetch(false);
            setLoading(false);
        }).catch(error => {

            setFirstFetch(false);
            setLoading(false);
        })

    }

    useEffect(() => {
        setFollowers([]) ; 
        setFirstFetch(true);
        loadNotfications(followers.filter(follower => follower.type != "loading").length);
 
    }, []);


    useEffect(() => {   
        const updateFollwingState = ({ userId, state }) => { 
            const index = followers.findIndex(follower => follower.follow.user.id == userId) ; 
            if ( index >= 0 ) { 

                followers[index].follow.user.isFollowed = state ;
                setFollowers([...followers]) ; 
            } 
        }

        const onNewFollow = ( newFollow) => { 
            const index = followers.findIndex(follower => follower.follow.user.id == newFollow.user.id) ; 
            if (index < 0) { 
                setFollowers([{ follow : newFollow} , ...followers]) ; 
            }else {
                followers.splice(index, 1 ) ;  
                setFollowers([{ follow : newFollow} , ...followers]) ; 
            }
        }

        event.addListener("new-following" , updateFollwingState) ; 
        realTime.addListener("NEW_FOLLOW" , onNewFollow) ; 

        return () => { 
            event.removeListener("new-following" , updateFollwingState) ; 
            realTime.removeListener("NEW_FOLLOW"  , onNewFollow) ; 
        }
    } , [followers])

    useEffect(() => {
        if (loading)
            loadNotfications(followers.filter(follower => follower.type != "loading").length);

    }, [loading])

    const toggleFollow = useCallback((follower) => {

        const index = followers.findIndex(f => f.follow.user.id == follower.follow.user.id);
        if (index >= 0) {
            followers[index].follow.user.isFollowed = !followers[index].follow.user.isFollowed;

            client.mutate({
                mutation: gql`
                    mutation ToggleFollow($userId: ID!) {
                        toggleFollow(userId: $userId)
                    }
                ` ,
                variables: {
                    userId: follower.follow.user.id
                }
            }).then((response) => {

                if (response && response.data) {

                    setFollowers([...followers]);
                    event.emit("new-following" , {
                        userId  : follower.follow.user.id  , 
                        state : response.data.toggleFollow 
                    })
                }
            });
        }

    }, [followers]);


    const reachEnd = useCallback(() => {


        if (!loading && !end && !firstFetch) {
            setFollowers([...followers, { id: 0, type: "loading" }])
            setLoading(true);
        }


    }, [loading, followers, end, firstFetch]) ; 


    const openProfile = useCallback((userId) => { 
        navigation.navigate("Profile", { userId: userId });
    } , [])

    const renderItem = useCallback(({ item }) => {
        if (item.type == "loading") {
            return <LoadingActivity style={{ height: 56 }} />
        }
        return (
            <TouchableOpacity style={styles.notification} onPress={() => openProfile(item.follow.userId)}>
                {
                    item.follow.user.profilePicture &&
                    <Image source={{ uri: getMediaUri(item.follow.user.profilePicture.path) }} style={styles.userImage} />
                }
                {
                    !item.follow.user.profilePicture &&
                    <Image source={require("../../../assets/illustrations/gravater-icon.png")} style={styles.userImage} />

                }
                <Text style={styles.text}>
                    بدأ <Text style={styles.bold}>{item.follow.user.name} {item.follow.user.lastname}</Text> بمتابعتك
                </Text>
                <SmallFollowButton
                    style={!item.follow.user.isFollowed ? styles.button : styles.unfollowButton}
                    textStyle={!item.follow.user.isFollowed ? styles.buttonText : styles.unfollowText}
                    text={!item.follow.user.isFollowed ? "متابعة" : "تمت المتابعة"}
                    onPress={() => toggleFollow(item)}
                />

            </TouchableOpacity>
        )
    }, [followers , styles]);


    
    const keyExtractor = useCallback((item, index) => {
        return index;
    }, [followers])

  
    return (
        <View style={styles.container}>
            {
                !firstFetch &&
                <FlatList
                    data={followers}
                    keyExtractor={keyExtractor}
                    renderItem={renderItem}
                    style={styles.list}
                    onEndReached={reachEnd}
                    onEndReachedThreshold={0.2}
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
        flex: 1
    },
    notification: {
        flexDirection: "row-reverse",
        alignItems: "center",
        justifyContent: "space-between",
        padding: 16,
        paddingVertical: 0,
        marginTop: 16 ,  
    },
    userImage: {
        width: 38,
        height: 38,
        borderRadius: 48
    },

    button: {
        width: 86,
        borderRadius: 26,
        padding: 0,
        height: 32,
        justifyContent: "center"
    },
    text: {
        color: "#666",
        textAlign: "right",
        flex: 1,
        paddingRight: 12,
        fontSize: 12,
        fontFamily: textFonts.regular
    },
    bold: {
        fontFamily: textFonts.semiBold,
        color: "#212121"
    },
    unfollowText: {
        fontSize: 10,
        color: "#212121"

    },
    unfollowButton: {
        width: 86,
        borderRadius: 26,
        padding: 0,
        height: 32,
        justifyContent: "center",
        backgroundColor: "#ccc"

    },
    list: {

        flex: 1,
        marginBottom: 64
    }
})

const darkStyles = {
    ...lightStyles,
    text: {
        color: darkTheme.secondaryTextColor,
        textAlign: "right",
        flex: 1,
        paddingRight: 12,
        fontFamily: textFonts.regular , 
        fontSize: 12,
    } , 
    bold: {
        fontFamily: textFonts.semiBold,
        color: darkTheme.textColor
    },

}