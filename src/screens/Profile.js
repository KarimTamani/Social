import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, Dimensions } from "react-native";
import ProfileHeader from "../components/Cards/ProfileHeader";
import { AntDesign } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';
import FollowButton from "../components/Buttons/FollowButton";
import { Feather } from '@expo/vector-icons';
import ProfilePostsRoute from "../routes/ProfilePostsRoute";
import { useCallback, useContext, useEffect, useState } from "react";
import { textFonts } from "../design-system/font";
import EditProfileButton from "../components/Buttons/EditProfileButton";
import SocialMedia from "../components/Cards/profile/SocialMedia";
import ThemeContext from "../providers/ThemeContext";
import darkTheme from "../design-system/darkTheme";
import { AuthContext } from "../providers/AuthContext";
import { ApolloContext } from "../providers/ApolloContext";
import { gql } from "@apollo/client";
import { getMediaUri } from "../api";
import { useEvent } from "../providers/EventProvider";
import { Entypo } from '@expo/vector-icons';
import LoadingProfile from "../components/Cards/loadings/LoadingProfile";
import ProfileNotFound from "../components/Cards/profile/ProfileNotFound";
import PrivateContentMessage from "../components/Cards/profile/PrivateContentMessage";




export default function Profile({ route, navigation }) {

    var userId = null;
    if (route && route.params)
        userId = route.params.userId;

    const event = useEvent();

    const [user, setUser] = useState(null);
    const [openSocialMedia, setOpenSocialMedia] = useState(false);
    const auth = useContext(AuthContext);
    const client = useContext(ApolloContext);

    const themeContext = useContext(ThemeContext);
    const styles = themeContext.getTheme() == "light" ? lightStyles : darkStyles;
    const [toggleBio, setToggleBio] = useState(false);
    const [follow, setFollow] = useState(false);
    const [numFollowers, setNumFollowers] = useState(0);
    const [notFound, setNotFound] = useState(false);



    const openCoversation = useCallback(() => {
        navigation.navigate("Conversation", { members: [{ user }] });
    }, [navigation, user])

    const getUser = async (userId) => {
        return client.query({
            query: gql`
            query GetUserById($userId: ID!) {
                getUserById(userId: $userId) {
                  id
                  name
                  lastname
                  username
                  gender
                  phone
                  isFollowed 
                  mute 
                  allowMessaging 
                  showState
                  pictureId 
                  lastActiveAt
                  isActive 
                  profilePicture { 
                    id path 
                  }
                  country {
                    id
                    name
                  }
                  bio
                  private
                  disabled
                  numFollowers
                  numPosts
                  numFollowing
                  numVisits
                  validated
                  socialMedia {
                    facebook
                    twitter
                    snapshot
                    instagram
                  }
                }
              }
            ` , variables: {
                userId: userId
            }
        });
    }

    useEffect(() => {
        (async () => {
            if (!userId) {
                var userAuth = await auth.getUserAuth();
                if (userAuth) {
                    userId = userAuth.user.id;
                    event.on("edit-profile", () => {
                        getUser(userAuth.user.id).then(async response => {
                            setUser(response.data.getUserById)
                            await auth.updateUser(response.data.getUserById);
                            event.emit("update-profile", response.data.getUserById);
                        });
                    })
                }
            }
            if (userId)
                // at this level we have an id
                getUser(userId).then(response => {
                    if (response && response.data.getUserById) {



                        setUser(response.data.getUserById);
                        setFollow(response.data.getUserById.isFollowed);
                        setNumFollowers(response.data.getUserById.numFollowers);
                    }
                    else {
                        setNotFound(true);
                    }
                });
        })();
        return () => {
            event.off("edit-profile")
        }
    }, []);

    useEffect(() => {
        if (user) {
            const updateUserPostNumber = () => {
                setUser({
                    ...user,
                    numPosts: user.numPosts + 1
                })
            }
            const decreaseUserPostNumber = (post) => {
                setUser({
                    ...user,
                    numPosts: user.numPosts - 1
                })
            }
            const userBlocked = (userId) => {
                setUser(null);
                setNotFound(true);
            }
            event.addListener("delete-post", decreaseUserPostNumber);
            event.addListener("new-post", updateUserPostNumber);
            event.addListener("blocked-user", userBlocked);
            return () => {
                event.removeListener("new-post", updateUserPostNumber);
                event.removeListener("delete-post", decreaseUserPostNumber);
                event.removeListener("blocked-user", userBlocked);
            }
        }

    }, [user])

    const back = useCallback(() => {
        navigation.canGoBack() && navigation.goBack();
    }, [navigation]);

    const toggleSocialMedia = useCallback(() => {
        setOpenSocialMedia(!openSocialMedia);
    }, [openSocialMedia]);


    const openEditProfile = useCallback(() => {
        navigation.navigate("EditProfile", {
            user
        })
    }, [user]);



    const toggleFollow = useCallback(() => {
        const previousValue = follow;
        setFollow(!follow);
        client.mutate({
            mutation: gql`
                mutation ToggleFollow($userId: ID!) {
                    toggleFollow(userId: $userId)
                }
            ` ,
            variables: {
                userId
            }
        }).then(response => {
            if (!response) {
                setFollow(!previousValue)


            } else {
                if (response.data.toggleFollow) {
                    setNumFollowers(numFollowers + 1)
                } else {
                    setNumFollowers(numFollowers - 1)
                }
                event.emit("new-following", {
                    userId: userId,
                    state: response.data.toggleFollow
                });


                setUser({
                    ...user,
                    isFollowed: response.data.toggleFollow
                })
            }

        }).catch(error => {
            setFollow(!previousValue)
        })
    }, [follow, numFollowers, user]);



    const onUnFollow = useCallback(() => {

        setNumFollowers(numFollowers - 1)
        setFollow(false);
        setUser({
            ...user,
            isFollowed: false
        })

    }, [numFollowers, user]);


    if (!user && !notFound) {
        return (<LoadingProfile />)
    }
    else if (notFound) {
        return (<ProfileNotFound />)
    }


    return (
        <View style={styles.container}>
            <ScrollView style={{ zIndex: 1 }}>
                <ProfileHeader onUnFollow={onUnFollow} myProfile={!userId} user={user} onBack={back} navigation={navigation} />
                {
                    openSocialMedia &&
                    <TouchableOpacity style={styles.background} activeOpacity={1} onPressIn={toggleSocialMedia}>
                    </TouchableOpacity>
                }
                <View style={styles.content}>
                    {
                        user.profilePicture &&
                        <Image style={styles.profileImage} source={{ uri: getMediaUri(user.profilePicture.path) }} />
                    }
                    {
                        !user.profilePicture &&
                        <Image style={styles.profileImage} source={require("../assets/illustrations/gravater-icon.png")} />
                    }
                    <Text style={styles.fullname}>
                        {
                            user.validated &&
                            <AntDesign name="checkcircle" style={styles.blueIcon} />
                        }
                        <Text>
                            {user.name} {user.lastname}
                        </Text>
                    </Text>
                    <Text style={styles.username}>
                        @{user.username}
                    </Text>
                    {
                        user.country &&
                        <Text style={styles.label}>
                            <Ionicons name="home-outline" style={styles.home} /> {user.country?.name}
                        </Text>
                    }
                    {
                        user.bio &&
                        <Text style={styles.bio} numberOfLines={!toggleBio ? 1 : null} ellipsizeMode="tail" onPress={() => setToggleBio(!toggleBio)}>
                            {
                                !toggleBio &&
                                <Entypo name="chevron-down" size={12} color={themeContext.getTheme() == "light" ? "#212121" : darkTheme.textColor} />
                            }
                            {user.bio}
                        </Text>
                    }
                    {
                        userId &&
                        <View style={styles.contant}>
                            {
                                openSocialMedia &&
                                <View style={styles.socialMediaContainer}>
                                    <SocialMedia socialMedia={user.socialMedia} />
                                </View>
                            }
                            {
                                user.socialMedia &&
                                <TouchableOpacity style={styles.messageButton} onPress={toggleSocialMedia}>
                                    <AntDesign name="earth" style={styles.messageIcon} />
                                </TouchableOpacity>
                            }
                            <FollowButton onPress={toggleFollow} follow={follow} />
                            {
                                user && user.allowMessaging &&

                                <TouchableOpacity style={styles.messageButton} onPress={openCoversation}>
                                    <Feather name="message-circle" style={styles.messageIcon} />
                                </TouchableOpacity>
                            }
                        </View>
                    }
                    {
                        !userId &&
                        <View style={styles.contant}>
                            {
                                openSocialMedia &&
                                <View style={styles.socialMediaContainer}>
                                    <SocialMedia socialMedia={user.socialMedia} />
                                </View>
                            }
                            {
                                user.socialMedia &&
                                <TouchableOpacity style={styles.messageButton} onPress={toggleSocialMedia}>
                                    <AntDesign name="earth" style={styles.messageIcon} />
                                </TouchableOpacity>
                            }
                            <EditProfileButton onPress={openEditProfile} />
                        </View>
                    }
                    <View style={styles.profileInfo}>
                        <View style={styles.info}>
                            <Text style={styles.infoTitle}>
                                المنشورات
                            </Text>
                            <Text style={styles.infoValue}>
                                {user.numPosts}
                            </Text>
                        </View>
                        <View style={styles.info}>
                            <Text style={styles.infoTitle}>
                                متابعون
                            </Text>
                            <Text style={styles.infoValue}>
                                {numFollowers}
                            </Text>
                        </View>
                        <View style={styles.info}>
                            <Text style={styles.infoTitle}>
                                يتبع
                            </Text>
                            <Text style={styles.infoValue}>
                                {user.numFollowing}
                            </Text>
                        </View>
                    </View>
                    {
                        user && (!userId || follow || !user.private) &&
                        <View style={[styles.posts]}>
                            <ProfilePostsRoute userId={user.id} navigation={navigation} />
                        </View>
                    }
                    {
                        user && userId && !follow && user.private &&
                        <PrivateContentMessage />
                    }
                </View>


            </ScrollView>


        </View>
    )
}


const lightStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#eee",


    },
    content: {
        alignItems: "center",
        backgroundColor: "white"

    },
    posts: {
        width: "100%",
        flex: 1
    },

    profileImage: {
        width: 112,
        height: 112,
        resizeMode: "cover",
        borderRadius: 112,


    },
    fullname: {
        fontSize: 16,
        marginTop: 8,
        fontFamily: textFonts.bold,
        fontWeight: "bold",

    },
    username: {
        color: "#888",
        fontFamily: textFonts.bold,
        fontWeight: "bold",
        fontSize: 12,

    },
    label: {
        color: "#666",
        fontSize: 12,
        textAlign: "center",
        fontFamily: textFonts.regular
    },
    home: {
        fontSize: 16
    },
    blueIcon: {
        color: "blue",
        fontSize: 18
    },
    contant: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        marginTop: 12,

    },
    messageButton: {

        borderRadius: 8,
        height: "100%",
        alignItems: "center",
        justifyContent: "center",
        width: 48,
        marginHorizontal: 8,
        height: 48,
    },
    messageIcon: {
        color: "#666",
        fontSize: 24
    },
    profileInfo: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        width: "90%",
        marginTop: 12
    },
    info: {
        paddingVertical: 8,
        borderRadius: 8,
        backgroundColor: "white",
        elevation: 3,
        alignItems: "center",
        justifyContent: "center",
        flex: 1,
        marginHorizontal: 8,

    },
    infoTitle: {
        color: "#212121",
        fontSize: 12,
        fontFamily: textFonts.bold,
        fontWeight: "bold",
    },
    infoValue: {
        fontFamily: textFonts.bold,
        color: "#666",
        fontSize: 12
    },


    socialMediaContainer: {

        position: "absolute",
        zIndex: 99,
        left: 8,
        bottom: 56,

    },
    background: {
        position: "absolute",
        top: 0,
        marginTop: -128,
        left: 0,
        backgroundColor: "rgba(0,0,0,0.1)",
        width: "100%",
        height: "100%",
        zIndex: 1
    },
    bio: {
        color: "#212121",
        fontFamily: textFonts.regular,
        textAlign: "center",
        lineHeight: 22,
        fontSize: 12
    },

});


const darkStyles = {
    ...lightStyles,
    container: {
        flex: 1,
        backgroundColor: darkTheme.secondaryBackgroundColor,

    },
    content: {
        alignItems: "center",
        backgroundColor: darkTheme.backgroudColor,


    },
    fullname: {
        ...lightStyles.fullname,
        color: darkTheme.textColor,
    },
    username: {
        ...lightStyles.username,

        color: darkTheme.secondaryTextColor,

    },
    label: {
        ...lightStyles.label,
        color: darkTheme.secondaryTextColor,
    },
    info: {
        ...lightStyles.info,
        backgroundColor: darkTheme.secondaryBackgroundColor,
    },
    infoTitle: {

        ...lightStyles.infoTitle,
        color: darkTheme.textColor,
    },
    infoValue: {
        ...lightStyles.infoTitle,
        color: darkTheme.secondaryTextColor,

    },
    messageIcon: {
        color: darkTheme.textColor,
        fontSize: 24
    },
    bio: {
        color: darkTheme.textColor,
        fontFamily: textFonts.regular,
        textAlign: "center",
        lineHeight: 22,
        fontSize: 12
    }
}