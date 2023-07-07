import { View, Text, StyleSheet, Image, TouchableOpacity, Touchable, Dimensions, Modal } from "react-native";
import { Entypo } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons';
import { Feather } from '@expo/vector-icons';
import PostNote from "./PostNote";
import PostImage from "./PostImage";
import { Octicons } from '@expo/vector-icons';
import { useCallback, useEffect, useState } from "react";
import { textFonts } from "../../../design-system/font";
import Slider from "../Slider";
import Comments from "../comments/Comments";
import Sender from "../Sender";
import PostService from "./PostService";
import ServiceButton from "../../Buttons/ServiceButton";
import PostPyaedContent from "./PostPayedContent";
import * as React from "react";
import ThemeContext from "../../../providers/ThemeContext";
import darkTheme from "../../../design-system/darkTheme";
import { getMediaUri } from "../../../api";
import { ApolloContext } from "../../../providers/ApolloContext";
import { gql } from "@apollo/client";
import AuthButton from "../../Buttons/AuthButton";
import { AuthContext } from "../../../providers/AuthContext";
import { useEvent } from "../../../providers/EventProvider";
import LikeHeart from "./LikeHeart";
import Reel from "../Reel";
import PostVideo from "./PostVideo";
import Confirmation from "../Confirmation";
import { NOW, useTiming } from "../../../providers/TimeProvider";


const WIDTH = Dimensions.get("screen").width;
const HASHTAG_REGEX = /#+([ا-يa-zA-Z0-9_]+)/ig;

const DELETE_MESSAGE = {
    title: "حذف المنشور",
    message: "هل انت متأكد من حذف المنشور نهائيا ؟"
}

function Post(props) {

    const { navigation } = props
    const [post, setPost] = useState(props.post);




    const [like, setLike] = useState(props.post.liked);
    const [numLikes, setNumLikes] = useState(props.post.likes);
    const [favorite, setFavorite] = useState(props.post.isFavorite);
    const [numComments, setNumComments] = useState(props.post.numComments);
    const [myPost, setMyPost] = useState(false);
    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);

    const [isDeleting, setIsDeleting] = useState(false);
    const [showOptions, setShowOptions] = useState(false);
    const [showComments, setShowComments] = useState(false);
    const [showSender, setShowSender] = useState(false);
    const themeContext = React.useContext(ThemeContext);
    const styles = themeContext.getTheme() == "light" ? lightStyles : darkStyles;
    const client = React.useContext(ApolloContext);
    const auth = React.useContext(AuthContext);
    const event = useEvent();
    const timing = useTiming();
    const [publishTime, setPublishTime] = useState("");

    useEffect(() => {

        setPost(props.post);
        setLike(props.post.liked);
        setNumLikes(props.post.likes);
        setFavorite(props.post.isFavorite);
        setNumComments(props.post.numComments);



        var period = timing.getPeriod(props.post.createdAt);
        if (period != NOW && !timing.isPeriodRequireCasting(props.post.createdAt)) {
            period = "قبل " + period
        }


        setPublishTime(period);

        (async () => {
            var userAuth = await auth.getUserAuth();
            if (userAuth) {
                const user = userAuth.user;

                setMyPost(user.id == props.post.user.id);

            }
        })();
    }, [props, auth]);





    const toggleComments = useCallback(() => {

        if (!showComments) {
            const onNewComment = () => {
                var newNumOfComments = null;

                setNumComments(previousNum => {
                    setNumComments(previousNum + 1);
                    newNumOfComments = previousNum + 1;
                });

                event.emit("update-post-comments", post.id, newNumOfComments);

            }
            event.addListener("new-comment", onNewComment);
        } else {
            event.removeAllListeners("new-comment");
        }
        setShowComments(!showComments);
    }, [showComments, numComments, post]);


    const toggleLike = () => {
        setLike(!like);
        if (!like) {
            setNumLikes(numLikes + 1);
            event.emit("update-post-likes", post.id, true, numLikes + 1);
        } else {
            setNumLikes(numLikes - 1);
            event.emit("update-post-likes", post.id, false, numLikes - 1);
        }
    }

    const likePost = useCallback(() => {
        toggleLike();
        client.mutate({
            mutation: gql`
                mutation Like($postId: ID!) {
                    like(postId: $postId)
                }
            ` ,
            variables: {
                postId: post.id
            }
        }).then(response => {
    

        }).catch(error => {

        })

    }, [like, numLikes]);



    const toggleFavorite = useCallback(() => {
        var previousValue = favorite;
        setFavorite(!previousValue);

        client.mutate({
            mutation: gql`
                mutation Like($postId: ID!) {
                favorite(postId: $postId)
              }
            ` , variables: {
                postId: post.id
            }
        }).then(response => {
            if (response) {
                setFavorite(response.data.favorite);

                event.emit("update-post-favorite", post.id, response.data.favorite);
            }
        }).catch(error => {
            setFavorite(previousValue);
        })


    }, [favorite]);

    const toggleOptions = useCallback(() => {
        setShowOptions(!showOptions);
    }, [showOptions]);

    const openProfile = useCallback(() => {
        (async () => {

            const userAuth = await auth.getUserAuth();
            if (userAuth && userAuth.user?.id) {
                var id = userAuth.user?.id;
                if (id == post.user.id) {
                    navigation.navigate("AccountStack", { screen: "MyProfile" })
                    return;
                }
                navigation.navigate("Profile", { userId: post.user.id });
            }

        })();


    }, [navigation, post])



    const toggleSender = useCallback(() => {
        setShowSender(!showSender);
    }, [showSender]);


    const openConversation = useCallback(() => {
        navigation.navigate("Conversation")
    }, []);

    const openServiceAsk = useCallback(() => {
        navigation.navigate("Contract");
    }, []);
    const openPayedContentDetails = useCallback(() => {
        navigation.navigate("PayedContentDetails", {
            course: post
        })
    }, []);



    const confirmToDelete = useCallback(() => {
        setShowOptions(false);
        setShowDeleteConfirmation(true);

    }, [post])

    const deletePost = useCallback(() => {

        setIsDeleting(true);
        closeConfirmation();


        client.mutate({
            mutation: gql`
            mutation Mutation($postId: ID!) {
                deletePost(postId: $postId)
            }` ,
            variables: {
                postId: post.id
            }
        }).then(response => {
            if (response) {
                event.emit("delete-post", post);
            }
            setIsDeleting(false);
        }).catch(error => {
            setIsDeleting(false);
        })
    }, [post]);


    const closeConfirmation = useCallback(() => {
        setShowDeleteConfirmation(false);
    }, [])
    const editPost = useCallback(() => {
        setShowOptions(false);
        navigation && navigation.navigate('EditPost', {
            post: post
        })
    }, [navigation, post]) ; 


    const openReport = useCallback(() => { 

        navigation.navigate("Report" , { 
            postId : post.id 
        })

    } , [navigation ,  post])

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
                        <Comments post={post} />
                    </Slider>
                </Modal>
            }
            {
                showOptions && <TouchableOpacity style={styles.touchableBackground} onPressIn={toggleOptions}></TouchableOpacity>
            }
            {
                showSender &&
                <Modal
                    transparent
                    onRequestClose={toggleSender}
                >
                    <Slider onClose={toggleSender} percentage={0.3}>
                        <Sender postId={post.id} />
                    </Slider>
                </Modal>
            }

            <View style={styles.row}>

                <View style={styles.shareSection}>
                    {
                        post.type != "service" &&
                        <TouchableOpacity onPress={toggleOptions}>
                            <Entypo name="dots-three-horizontal" style={styles.interactionIcon} />
                        </TouchableOpacity>
                    }
                    {
                        post.type == "service" &&
                        <ServiceButton openConversation={openConversation} openServiceAsk={openServiceAsk} />
                    }
                    {
                        showOptions && post.type != "payed-content" &&
                        <View style={styles.shareContainer}>
                            {
                                !myPost &&
                                <TouchableOpacity style={styles.shareOption} onPress={openReport}> 
                                    <Octicons name="stop" style={styles.shareIcon} />
                                    <Text style={styles.shareText}>أبلغ</Text>
                                </TouchableOpacity>
                            }
                            {
                                post.type == "note" &&
                                <TouchableOpacity style={styles.shareOption}>
                                    <Feather name="copy" style={styles.shareIcon} />
                                    <Text style={styles.shareText}>نسخ</Text>
                                </TouchableOpacity>
                            }
                            {
                                post.type != "note" &&
                                <TouchableOpacity style={styles.shareOption}>
                                    <AntDesign name="download" style={styles.shareIcon} />
                                    <Text style={styles.shareText}>تحميل</Text>
                                </TouchableOpacity>
                            }
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
                    {

                        showOptions && post.type == "payed-content" &&
                        <View style={[styles.shareContainer, { width: 128 }]}>
                            <TouchableOpacity style={styles.shareOption} onPress={openPayedContentDetails}>
                                <Text style={styles.shareText}>تفاصيل</Text>
                            </TouchableOpacity>

                        </View>
                    }
                </View>
                <TouchableOpacity style={styles.user} onPress={openProfile}>
                    <View style={{ marginRight: 8 }}>
                        <Text style={styles.username}>
                            <Text>
                                {post.user.name} {post.user.lastname}

                            </Text>
                            {
                                post.user.validated && <AntDesign name="checkcircle" style={styles.blueIcon} />

                            }
                        </Text>
                        <Text style={styles.time}>

                            {publishTime}
                        </Text>
                    </View>
                    <View>
                        {
                            post.user.profilePicture &&
                            <Image style={styles.userImage} source={{ uri: getMediaUri(post.user.profilePicture.path) }} />
                        }
                        {
                            !post.user.profilePicture &&
                            <Image style={styles.userImage} source={require("../../../assets/illustrations/gravater-icon.png")} />
                        }
                    </View>
                </TouchableOpacity>
            </View>


            <View style={styles.content}>
                {
                    (post.type == "note" || post.title) && <PostNote post={post} navigation={navigation} />
                }
                {
                    post.type == "image" && <PostImage post={post} navigation={navigation} />
                }
                {
                    post.type == "service" && <PostService post={post} navigation={navigation} />
                }
                {
                    post.type == "payed-content" && <PostPyaedContent post={post} openConversation={openConversation} navigation={navigation} />
                }
                {
                    post.type == "reel" && <PostVideo post={post} navigation={navigation} />
                }

            </View>
            {
                post.type != "payed-content" &&
                <View style={styles.row}>
                    <View style={styles.giftSection}>
                        <TouchableOpacity>
                            <Feather name="gift" style={styles.interactionIcon} />
                        </TouchableOpacity>
                        {
                            post.type == "service"
                            &&
                            <Text style={styles.rating}>
                                <AntDesign name="star" size={16} color="#FFD700" /> {post.content.rating}
                            </Text>

                        }
                    </View>
                    <View style={styles.interactions}>

                        <TouchableOpacity style={styles.interaction} onPress={toggleFavorite}>
                            {
                                !favorite && <FontAwesome name="bookmark-o" style={styles.interactionIcon} />

                            }
                            {
                                favorite && <FontAwesome name="bookmark" style={[styles.interactionIcon, { color: "#FFD700" }]} />

                            }
                        </TouchableOpacity>

                        <AuthButton style={styles.interaction} onPress={toggleSender} navigation={navigation} >
                            <Feather name="send" style={styles.interactionIcon} />

                        </AuthButton>
                        <AuthButton style={styles.interaction} onPress={toggleComments} navigation={navigation} >
                            <Text style={styles.interactionValue}>
                                {numComments} تعليق
                            </Text>
                            <FontAwesome name="comment-o" style={styles.interactionIcon} />
                        </AuthButton>



                        <AuthButton style={styles.interaction} onPress={likePost} navigation={navigation}>
                            <Text style={[styles.interactionValue, like && styles.like]}>
                                {numLikes} سهم
                            </Text>
                            <LikeHeart
                                style={styles.interactionIcon}
                                color={themeContext.getTheme() == "light" ? "#666" : darkTheme.textColor}
                                like={like}
                            />
                        </AuthButton>
                    </View>
                </View>
            }
        </View>
    )
};

const postCoparator = (prevProps, nextProps) => {
    var previousPost = prevProps.post;
    var nextPost = nextProps.post;


    if (previousPost.title != nextPost.title) {


        return false;
    }
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
export default React.memo(Post, postCoparator);

const lightStyles = StyleSheet.create({
    container: {
        backgroundColor: "white",
        paddingVertical: 16,
        borderColor: "#ddd",
        marginTop: 12
    },
    hashtag: {
        color: "#1A6ED8"
    },
    row: {
        flexDirection: "row",
        justifyContent: "space-between",
        paddingHorizontal: 16,
    },
    userImage: {
        borderRadius: 50,
        width: 38,
        height: 38
    },
    user: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center"
    },
    username: {

        textAlignVertical: "center",
        fontSize: 12,
        fontFamily: textFonts.bold , 
        fontWeight : "bold" , 

    },

    time: {
        fontFamily: textFonts.regular,
        color: "#666",
        fontSize: 10
    },
    interactions: {
        flexDirection: "row",
        justifyContent: "flex-end",
        flex: 1,

    },
    giftSection: {
        flex: 1,
        flexDirection: "row"
    },
    interaction: {

        flexDirection: "row",
        paddingHorizontal: 6,

        justifyContent: "center",
        alignItems: "center",



    },
    interactionIcon: {
        fontSize: 18,
        color: "#666",

    },
    interactionValue: {
        paddingRight: 6,
        fontFamily: textFonts.regular,
        color: "#666",
        fontSize: 12

    },
    like: {
        color: "#FF3159"
    },
    shareSection: {
        position: "relative",
    },
    shareContainer: {
        position: "absolute",
        width: 260,
        elevation: 6,
        backgroundColor: "white",
        zIndex: 999,
        borderRadius: 32,
        flexDirection: "row",
        top: 32,
        paddingHorizontal: 8
    },
    shareOption: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: 8,
    },
    shareIcon: {
        fontSize: 18,
        color: "#666",
    },
    touchableBackground: {
        position: "absolute",
        width: WIDTH,
        height: "100%",
        zIndex: 999,
        top: 0,
        left: 0
    },
    blueIcon: {
        color: "blue",
        fontSize: 12
    },
    shareText: {

        fontFamily: textFonts.bold,
        color: "#666",
        fontSize: 12
    },
    rating: {
        color: "#666",
        paddingLeft: 8
    },
    title: {
        color: "#212121",
        fontFamily: textFonts.regular,
        padding: 16,
        fontSize: 12,
        paddingBottom: 0,
        paddingTop: 8
    }
});

const darkStyles = {
    ...lightStyles,
    container: {
        backgroundColor: darkTheme.backgroudColor,
        paddingVertical: 16,
        borderColor: "#ddd",
        marginTop: 12
    },
    time: {
        fontFamily: textFonts.regular,
        color: darkTheme.secondaryTextColor,
        fontSize: 10
    },
    username: {

        textAlignVertical: "center",
        fontSize: 12,
        fontFamily: textFonts.bold,
        fontWeight : "bold" , 
        color: darkTheme.textColor,

    },
    interactionIcon: {
        fontSize: 18,
        color: darkTheme.textColor,


    },
    shareText: {

        fontFamily: textFonts.bold,
        color: darkTheme.textColor,

        fontSize: 12
    },
    rating: {
        color: darkTheme.textColor,

        paddingLeft: 8
    },
    shareContainer: {
        position: "absolute",
        width: 260,
        elevation: 6,
        backgroundColor: darkTheme.backgroudColor,
        zIndex: 999,
        borderRadius: 32,
        flexDirection: "row",
        top: 32,
        paddingHorizontal: 8
    },
    shareIcon: {
        fontSize: 18,
        color: darkTheme.textColor,

    },
    interactionValue: {
        paddingRight: 6,
        fontFamily: textFonts.bold,
        color: darkTheme.textColor,
        fontSize: 12

    },
    title: {
        color: darkTheme.textColor,
        fontFamily: textFonts.regular,
        padding: 16,
        fontSize: 12,
        paddingBottom: 0,
        paddingTop: 8
    }


}