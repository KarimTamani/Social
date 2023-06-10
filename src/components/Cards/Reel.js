import React, { useCallback, useContext, useEffect, useRef, useState } from "react";
import { View, StyleSheet, Text, TouchableOpacity, Image, Modal, Dimensions, ActivityIndicator } from "react-native";
import { Video } from 'expo-av';
import { Octicons } from '@expo/vector-icons';
import { Entypo } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons';
import { Feather } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from "expo-linear-gradient";
import { textFonts } from "../../design-system/font";
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from "react-native-reanimated";
import Slider from "./Slider";
import Comments from "./comments/Comments";
import Sender from "./Sender";
import { getMediaUri } from "../../api";
import { ApolloContext } from "../../providers/ApolloContext";
import { gql } from "@apollo/client";
import { useEvent } from "../../providers/EventProvider";
import LikeHeart from "./post/LikeHeart";
import { AuthContext } from "../../providers/AuthContext";
import Confirmation from "./Confirmation";



const DELETE_MESSAGE = {
    title: "حذف الريل",
    message: "هل انت متأكد من حذف الريل الخاصة بك تهائيا ؟"
}


const WIDTH = Dimensions.get("screen").width;
const HEIGHT = Dimensions.get("screen").height;
const HASHTAG_REGEX = /#+([ا-يa-zA-Z0-9_]+)/ig;

function Reel(props) {

    var { focus, openProfile, navigation } = props




    if (!focus)
        focus = false;

    const videoRef = useRef();

    const [reel, setReel] = useState(props.reel);
    const [like, setLike] = useState(props.reel.liked);
    const [numLikes, setNumLikes] = useState(props.reel.likes);
    const [favorite, setFavorite] = useState(props.reel.isFavorite);
    const [numComments, setNumComments] = useState(props.reel.numComments);
    const [showOptions, setShowOptions] = useState(false);
    const [pause, setPause] = useState(false);
    const [showPauseIcon, setShowPauseIcon] = useState(false);
    const [showComments, setShowComments] = useState(false);
    const [showSender, setShowSender] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [processedTitle, setProcessedTitle] = useState(props.reel.title);

    const [myPost, setMyPost] = useState(false);
    const auth = React.useContext(AuthContext);

    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const event = useEvent();

    var progress = useSharedValue(0)

    const client = useContext(ApolloContext);


    useEffect(() => {

        setReel(props.reel);
        setLike(props.reel.liked);
        setNumLikes(props.reel.likes);
        setNumComments(props.reel.numComments);
        setFavorite(props.reel.isFavorite);


        (async () => {
            var userAuth = await auth.getUserAuth();
            if (userAuth) {
                const user = userAuth.user;
                setMyPost(user.id == props.reel.user.id);
            }
        })();


        const title = props.reel.title;
        if (title) {
            var hashtags = title.match(HASHTAG_REGEX);

            if (hashtags && hashtags.length > 0) {
                var processedText = processHashTag(title, hashtags);
                setProcessedTitle(processedText);
            }
        }
    }, [props])


   


    const processHashTag = (text, hashtags) => {

        if (hashtags.length == 0)
            return [text]

        var sequences = text.split(hashtags[0]);

        if (hashtags.length == 1)
            return [sequences[0], <Text onPress={() => openHashtag(hashtags[0])} style={styles.hashtag}>{hashtags[0]}</Text>, sequences[1]];
        else if (hashtags.length > 1)
            return [sequences[0], <Text onPress={() => openHashtag(hashtags[0])} style={styles.hashtag}>{hashtags[0]}</Text>, ...processHashTag(sequences[1], hashtags.slice(1))];
    }

    const openHashtag = useCallback((hashtag) => {
        navigation.navigate("HashTag", {
            hashtagName: hashtag
        })
    }, [navigation])



    const toggleLike = () => {
        if (!like) {
            setNumLikes(numLikes + 1)
            event.emit("update-post-likes", reel.id, true, numLikes + 1);
        } else {
            setNumLikes(numLikes - 1)
            event.emit("update-post-likes", reel.id, false, numLikes - 1);
        }
        setLike(!like);

    }
    const likeReel = useCallback(() => {
        toggleLike();
        client.mutate({
            mutation: gql`
                mutation Like($postId: ID!) {
                    like(postId: $postId)
                }
            ` ,
            variables: {
                postId: reel.id
            }
        }).then(response => {

        }).catch(error => {
            toggleLike();
        })


    }, [like]);
    const toggleFavorite = useCallback(() => {
        var previousValue = favorite;
        setFavorite(!previousValue);

        client.mutate({
            mutation: gql`
                mutation Like($postId: ID!) {
                favorite(postId: $postId)
              }
            ` , variables: {
                postId: reel.id
            }
        }).then(response => {

            setFavorite(response.data.favorite);
            event.emit("update-post-favorite", reel.id, response.data.favorite);
        }).catch(error => {
            setFavorite(previousValue);
        })

    }, [favorite]);

    const toggleComments = useCallback(() => {
        if (!showComments) {
            const onNewComment = () => {
                var newNumOfComments = null;
                setNumComments(previousNum => {
                    setNumComments(previousNum + 1);
                    newNumOfComments = previousNum + 1;
                });
                event.emit("update-post-comments", reel.id, newNumOfComments);
            }
            event.addListener("new-comment", onNewComment);
        } else {
            event.removeAllListeners("new-comment");
        }


        setShowComments(!showComments);
    }, [showComments, numComments, reel]);

    const toggleOptions = useCallback(() => {
        setShowOptions(!showOptions);
    }, [showOptions]);


    const toggleSender = useCallback(() => {
        setShowSender(!showSender);
    }, [showSender]);


    const togglePause = useCallback(() => {
        if (pause) {
            videoRef.current.playAsync();
        } else {
            videoRef.current.pauseAsync();
        }

        setShowPauseIcon(true)
        setPause(!pause);
        setTimeout(() => {
            setShowPauseIcon(false)
        }, 1000)
    }, [pause]);


    useEffect(() => {
        if (focus) {
            setPause(false);
        }
    }, [focus]);

    const handleVideoStatus = (status) => {
        progress.value = withTiming(Math.trunc(status.positionMillis / status.durationMillis * 100));
    }
    const progressStyle = useAnimatedStyle(() => {
        return {
            width: progress.value + "%"
        }
    })

    const loadState = useCallback(() => {
        setIsLoading(true);
    })
    const loadingDone = useCallback(() => {
        setIsLoading(false);
    }, [])

    const profilePressed = useCallback(() => {

        openProfile && openProfile(reel.user.id);
    }, [reel, openProfile]);


    const confirmToDelete = useCallback(() => {
        setShowOptions(false);
        setShowDeleteConfirmation(true);

    }, [reel])

    const deletePost = useCallback(() => {

        setIsDeleting(true);
        closeConfirmation();


        client.mutate({
            mutation: gql`
            mutation Mutation($postId: ID!) {
                deletePost(postId: $postId)
            }` ,
            variables: {
                postId: reel.id
            }
        }).then(response => {
            if (response) {
                event.emit("delete-post", reel);
            }
            setIsDeleting(false);

        }).catch(error => {
            setIsDeleting(false);
        })


    }, [reel]);
    const closeConfirmation = useCallback(() => {
        setShowDeleteConfirmation(false);
    }, []) ; 


    
    const editPost = useCallback(() => {
        setShowOptions(false);
        navigation && navigation.navigate('EditPost', {
            post: reel
        })
    }, [navigation, reel])


    return (
        <View style={styles.container}>


            {

                showDeleteConfirmation &&
                <Modal
                    transparent
                    onRequestClose={closeConfirmation}
                >
                    <Confirmation loading={isDeleting} title={DELETE_MESSAGE.title} message={DELETE_MESSAGE.message} onClose={closeConfirmation} onConfirm={deletePost} />
                </Modal>
            }

            {
                showComments &&
                <Modal
                    transparent
                    onRequestClose={toggleComments}
                >
                    <Slider onClose={toggleComments} percentage={0.1}>
                        <Comments post={reel} />
                    </Slider>
                </Modal>
            }
            {
                showSender &&
                <Modal
                    transparent
                    onRequestClose={toggleSender}
                >
                    <Slider onClose={toggleSender} percentage={0.3}>
                        <Sender />
                    </Slider>
                </Modal>
            }

            {
                <TouchableOpacity style={styles.touchableBackground} onPress={togglePause} onLongPress={likeReel}>

                    {
                        showPauseIcon && pause && <AntDesign name="pausecircleo" style={styles.pausePlayIcon} />
                    }
                    {
                        showPauseIcon && !pause && <AntDesign name="playcircleo" style={styles.pausePlayIcon} />
                    }
                </TouchableOpacity>
            }
            {
                showOptions && <TouchableOpacity style={styles.touchableBackground} onPressIn={toggleOptions}></TouchableOpacity>
            }

            <View style={styles.reelInteraction}>
                <TouchableOpacity style={styles.interaction} onPress={likeReel}>

                    <LikeHeart
                        style={styles.interactionIcon}
                        like={like}
                        size={36}
                        color={"#ffffff"}
                    />
                    <Text style={[styles.interactionValue, like && styles.like]}>
                        {numLikes}
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.interaction} onPress={toggleComments}>
                    <FontAwesome name="comment-o" style={styles.interactionIcon} />
                    <Text style={styles.interactionValue}>
                        {numComments}
                    </Text>

                </TouchableOpacity>

                <TouchableOpacity style={styles.interaction} onPress={toggleSender}>
                    <Feather name="send" style={styles.interactionIcon} />
                </TouchableOpacity>

                <TouchableOpacity style={styles.interaction}>
                    <Feather name="gift" style={styles.interactionIcon} />
                </TouchableOpacity>

                <TouchableOpacity style={styles.interaction} onPress={toggleOptions}>
                    <MaterialCommunityIcons name="dots-vertical" style={styles.interactionIcon} />
                </TouchableOpacity>
                {

                    showOptions &&
                    <View style={styles.shareContainer}>
                        {

                            !myPost &&
                            <TouchableOpacity style={styles.shareOption}>
                                <Octicons name="stop" style={styles.shareIcon} />
                                <Text style={styles.shareText}>أبلغ</Text>
                            </TouchableOpacity>
                        }
                        <TouchableOpacity style={styles.shareOption} onPress={toggleFavorite}>
                            {
                                !favorite && <FontAwesome name="bookmark-o" style={styles.shareIcon} />
                            }
                            {
                                favorite && <FontAwesome name="bookmark" style={[styles.shareIcon, { color: "#FFD700" }]} />
                            }
                            {
                                !favorite && <Text style={styles.shareText}>حفظ</Text>
                            }
                            {
                                favorite && <Text style={[styles.shareText, { color: "#FFD700" }]}>تم حفظها</Text>
                            }
                        </TouchableOpacity>
                        {
                            !myPost &&
                            <TouchableOpacity style={styles.shareOption}>
                                <Feather name="eye-off" style={styles.shareIcon} />
                                <Text style={styles.shareText}>غير مهم</Text>
                            </TouchableOpacity>
                        }

                        <TouchableOpacity style={styles.shareOption}>
                            <Entypo name="share" style={styles.shareIcon} />
                            <Text style={styles.shareText}>شارك</Text>
                        </TouchableOpacity>


                        {
                            myPost &&
                            <TouchableOpacity style={styles.shareOption} onPress={confirmToDelete}>
                                <Feather name="trash-2" style={styles.shareIcon} />
                                <Text style={styles.shareText}>حذف</Text>
                            </TouchableOpacity>
                        }

                        {
                            myPost &&
                            <TouchableOpacity style={styles.shareOption} onPress={editPost}>
                                <Feather name="edit" style={styles.shareIcon} />
                                <Text style={styles.shareText}>تعديل</Text>
                            </TouchableOpacity>
                        }

                    </View>
                }
            </View>
            <LinearGradient
                colors={["#00000000", "#000000"]}
                locations={[0, 0.8]}

                style={styles.reelInfo}

            >
                <View style={styles.footer}>

                    <TouchableOpacity style={styles.userInfo} onPress={profilePressed}>
                        <View style={styles.user}>

                            <Text style={styles.username}>
                                <Text>
                                    {reel.user.name} {reel.user.lastname}
                                </Text>  {reel.user.validated && <AntDesign name="checkcircle" style={styles.blueIcon} />}
                            </Text>


                            <Text style={styles.time}>
                                قبل دقيقة واحدة
                            </Text>
                        </View>
                        {
                            reel.user.profilePicture &&

                            <Image source={{ uri: getMediaUri(reel.user.profilePicture.path) }} style={styles.userImage} />
                        }
                        {
                            !reel.user.profilePicture &&

                            <Image source={require("../../assets/illustrations/gravater-icon.png")} style={styles.userImage} />

                        }
                    </TouchableOpacity>

                    <Text style={styles.reelTitle} numberOfLines={2} ellipsizeMode="tail">
                        {processedTitle}
                    </Text>

                </View>
                <Animated.View style={[styles.progess, progressStyle]}></Animated.View>
            </LinearGradient>

            {
                focus &&
                <Video

                    style={styles.videoContainer}
                    resizeMode="cover"
                    ref={videoRef}
                    onError={(error) => {
                        console.log(error)
                    }}

                    isLooping
                    source={{ uri: getMediaUri(reel.media[0]?.path) }}
                    shouldPlay
                    onPlaybackStatusUpdate={handleVideoStatus}
                    onLoadStart={loadState}
                    onReadyForDisplay={loadingDone} />
            }
            {
                reel.reel.thumbnail && isLoading &&

                <View style={styles.loadingVideo}>


                    <Image source={{ uri: getMediaUri(reel.reel.thumbnail.path) }} style={styles.thumbnail} />

                    <ActivityIndicator size={58} color={"#ffffff"} style={styles.loadingActivity} />
                </View>

            }
        </View>
    )



};

const postCoparator = (prevProps, nextProps) => {



    var previousPost = prevProps.reel;
    var nextPost = nextProps.reel;



    if (previousPost.title != nextPost.title) 
        return false; 
    if (prevProps.focus != nextProps.focus)
        return false;


    if (previousPost.liked != nextPost.liked)
        return false;

    if (previousPost.likes != nextPost.likes)
        return false;

    if (previousPost.isFavorite != nextPost.isFavorite)
        return false;

    if (previousPost.numComments != nextPost.numComments)
        return false;

    var previousUser = previousPost.user;
    var nextUser = nextPost.user;

    if (previousUser.name != nextUser.name)
        return false;


    if (previousUser.lastname != nextUser.lastanem)
        return false;


    if (previousUser.profilePicture != nextUser.profilePicture)
        return false;


    if (previousUser.profilePicture && nextUser.profilePicture && previousUser.profilePicture.id != nextUser.profilePicture.id)
        return false;

    if (previousUser.username != nextUser.username)
        return false;

    return true;
};

export default React.memo(Reel, postCoparator);
const styles = StyleSheet.create({
    container: {
        flex: 1,
        position: "relative",

    },
    videoContainer: {
        flex: 1
    },
    reelInfo: {
        position: "absolute",
        minWidth: "100%",

        zIndex: 99,
        bottom: 0,
        right: 0,


        padding: 16,
        alignItems: "flex-start",
        height: "25%",
        zIndex: 99

    },
    hashtag: {
        color: "#1A6ED8"
    },
    user: {

        flex: 1,
        marginRight: 16


    },
    reelInteraction: {
        position: "absolute",
        height: "50%",
        width: 56,
        left: 16,
        zIndex: 999,
        bottom: "15%"

    },
    interaction: {
        width: "100%",

        alignItems: "center",
        justifyContent: "center",
        height: 56,


    },
    interactionIcon: {
        fontSize: 28,
        color: "white"
    },
    interactionValue: {
        color: "white",
        fontWeight: "bold",
        fontSize: 12,
        marginTop: 4
    },
    userImage: {
        width: 42,
        height: 42,
        borderRadius: 48
    },
    username: {


        color: "white",
        fontFamily: textFonts.bold,
        fontWeight : "bold" , 
        fontSize: 12
    },

    like: {
        color: "#FF3159"
    },
    blueIcon: {
        color: "blue",
        fontSize: 16
    },

    time: {
        fontFamily: textFonts.regular,
        color: "#eee",
        fontSize: 10
    },
    shareContainer: {
        position: "absolute",
        backgroundColor: "rgba(0,0,0,0.5)",
        height: 56,
        width: 260,
        top: 56 * 4,
        left: 56,
        zIndex: 999,
        borderRadius: 56,
        flexDirection: "row",
        paddingHorizontal: 16
    },
    shareOption: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: 8,
    },
    shareIcon: {
        fontSize: 18,
        color: "white",
    },
    shareText: {

        fontFamily: textFonts.bold,
        color: "white",
        fontSize: 12
    },
    touchableBackground: {
        position: "absolute",
        width: "100%",

        height: "100%",
        zIndex: 98,
        top: 0,
        left: 0,
        alignItems: "center",
        justifyContent: "center",

    },
    pausePlayIcon: {
        color: "white",
        fontSize: 56,
        opacity: 0.8
    },

    progess: {
        height: 2,
        backgroundColor: "white",
        marginTop: 16,
        borderRadius: 2,
        opacity: 0.5
    },
    loadingVideo: {
        width: "100%",
        height: "100%",
        position: "absolute",
        zIndex: 1,
        alignItems: "center",
        justifyContent: "center",

    },
    thumbnail: {
        flex: 1,
        width: "100%",
        resizeMode: "cover",
        position: "absolute",
        height: "100%",
    },
    userInfo: {
        flexDirection: "row",
        flex: 1,

    },


    footer: {
        flexDirection: "row-reverse"

    },
    reelTitle: {
        fontFamily: textFonts.regular,
        color: "white",
        flex: 1,
        lineHeight: 22,
        fontSize: 12
    },
})