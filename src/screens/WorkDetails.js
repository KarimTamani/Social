import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, Dimensions, Linking, Modal } from "react-native";
import { textFonts } from "../design-system/font";
import { AntDesign } from '@expo/vector-icons';
import { useCallback, useContext, useEffect, useState } from "react";
import { Feather } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons';
import Header from "../components/Cards/Header";
import ThemeContext from "../providers/ThemeContext";
import darkTheme from "../design-system/darkTheme";
import { ApolloContext } from "../providers/ApolloContext";
import LoadingActivity from "../components/Cards/post/loadingActivity";
import { gql } from "@apollo/client";
import PostImage from "../components/Cards/post/PostImage";
import { getMediaUri } from "../api";
import { AuthContext } from "../providers/AuthContext";
import AuthButton from "../components/Buttons/AuthButton";
import LikeHeart from "../components/Cards/post/LikeHeart";
import Slider from "../components/Cards/Slider";
import Sender from "../components/Cards/Sender";
import { useEvent } from "../providers/EventProvider";
import Comments from "../components/Cards/comments/Comments";



const WIDTH = Dimensions.get("screen").width;

export default function WorkDetails({ route, navigation }) {

    const [like, setLike] = useState(false);
    const [favorite, setFavorite] = useState(false);

    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(false);
    const [enableEdit, setEnableEdit] = useState(false);

    const { postId } = route.params;
    const [showComments, setShowComments] = useState(false);
    const [numComments, setNumComments] = useState(0);

    const [numLikes, setNumLikes] = useState(0);

    const client = useContext(ApolloContext);
    const auth = useContext(AuthContext);
    const event = useEvent();


    useEffect(() => {

        setLoading(true);

        client.query({
            query: gql`
            query GetPostById($postId: ID!) {
                getPostById(postId: $postId) {
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
                    userId
                    work {
                        id
                        date
                        description
                        link
                        categoryId
                        category {
                            id
                            name
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
                postId: postId
            }
        }).then(async response => {

            if (response && response.data.getPostById) {
                const post = response.data.getPostById;

                const userAuth = await auth.getUserAuth();
                if (userAuth) {
                    setEnableEdit(post.user.id == userAuth.user.id);
                }
                setPost(post);
                setNumComments(post.numComments);
                setLike(post.liked);
                setNumLikes(post.likes);
                setFavorite(post.isFavorite)


            }
            setLoading(false);
        }).catch(error => {

            setLoading(false);
        })

    }, [postId])


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


    }, [favorite, post]);



    const openLink = useCallback(() => {

        Linking.openURL(post.work.link);
    }, [post]);


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
        }).then(response => { }).catch(error => { })

    }, [like, numLikes, post]);

    const themeContext = useContext(ThemeContext);
    const styles = themeContext.getTheme() == "light" ? lightStyles : darkStyles;


    const commentDeleted = useCallback(() => {
        setNumComments(numComments - 1);
        event.emit("update-post-comments", post.id, numComments - 1);
    }, [numComments, post]);


    const edit = useCallback(() => {
        navigation.navigate("WorkEditor", {
            postId: post.id
        })
    }, [navigation, post])


    return (
        <View style={styles.container}>

            <Header
                title={"تفاصيل العمل"}
                navigation={navigation}
            />
            {
                loading &&
                <LoadingActivity />
            }
            {
                !loading && post &&
                <View style={{ flex: 1  }}>

                    <ScrollView style={{ padding: 16  }}>
                        <View style={styles.workHeader}>
                            {
                                enableEdit &&

                                <View style={styles.section}>
                                    <TouchableOpacity style={[styles.outlineButton, { width: 86, paddingVertical: 6 }]} onPress={edit}>
                                        <Text style={styles.outlineText}>
                                            تعديل
                                        </Text>
                                        <Feather name="edit-2" size={14} color="white" />
                                    </TouchableOpacity>
                                </View>
                            }
                            <View style={styles.section}>
                                <View style={styles.user}>


                                    <Image source={{ uri: getMediaUri(post.user.profilePicture.path) }} style={styles.userImage} />
                                    <View style={styles.userInfo}>
                                        <Text style={styles.name}>
                                            <AntDesign name="checkcircle" style={styles.blueIcon} /> {post.user.name} {post.user.lastname}

                                        </Text>
                                        <Text style={styles.category}>
                                            {post.work.category.name}
                                        </Text>
                                    </View>
                                </View>
                            </View>


                        </View>
                        <Text style={styles.title}>
                            {post.title}
                        </Text>
                        <Text style={styles.description}>
                            {post.work.description}
                        </Text>
                        <Text style={styles.keywords}>
                            {post.work.category.name}
                        </Text>
                        <PostImage
                            post={post}
                            navigation={navigation}
                        />

                        <View style={styles.interactions}>

                            <View style={styles.views}>
                                <AntDesign name="eyeo" style={styles.viewsIcon} />
                                <Text style={styles.viewsValue}> {post.work.views}</Text>
                            </View>


                            <TouchableOpacity style={styles.interaction} onPress={toggleFavorite}>
                                {
                                    !favorite && <FontAwesome name="bookmark-o" style={styles.interactionIcon} />

                                }
                                {
                                    favorite && <FontAwesome name="bookmark" style={[styles.interactionIcon, { color: "#FFD700" }]} />

                                }
                            </TouchableOpacity>
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

                        {
                            post.work.link &&

                            <TouchableOpacity style={[styles.outlineButton, styles.linkButton, { paddingVertical: 8 }]} onPress={openLink}>
                                <Text style={styles.outlineText}>
                                    رابط العمل
                                </Text>
                                <AntDesign name="link" size={14} color="white" />
                            </TouchableOpacity>

                        }
                    </ScrollView>
                </View>
            }

            {
                showComments &&
                <Modal
                    transparent
                    onRequestClose={toggleComments}
                >
                    <Slider onClose={toggleComments} percentage={0.1}>
                        <Comments post={post} commentDeleted={commentDeleted} />
                    </Slider>
                </Modal>
            }

        </View>
    )
};

const lightStyles = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: "white"
    },
    blueIcon: {
        color: "blue",
        fontSize: 12
    },
    section: {
        flex: 1,
        justifyContent: "center"
    },
    workHeader: {
        flexDirection: "row"
    },
    userImage: {
        width: 48,
        height: 48,
        borderRadius: 42
    },
    user: {
        flexDirection: "row-reverse"
    },
    userInfo: {

        marginRight: 16,


    },
    name: {
        fontFamily: textFonts.bold,

    },
    category: {
        fontFamily: textFonts.regular,
        color: "#666",
        fontSize: 12
    },

    screenTitle: {
        fontFamily: textFonts.bold,
        paddingRight: 8
    },
    outlineButton: {
        width: 128,
        backgroundColor: "#1A6ED8",

        borderRadius: 26,
        flexDirection: "row",
        justifyContent: "center",
        paddingVertical: 4,
        alignItems: "center"
    },
    outlineText: {
        fontFamily: textFonts.regular,
        color: "white",
        marginRight: 8
    },
    description: {
        color: "#666",
        fontFamily: textFonts.regular,
        lineHeight: 22,
        fontSize: 14
    },
    keywords: {
        fontFamily: textFonts.bold,
        color: "#1A6ED8"
    },
    image: {
        height: WIDTH,
        width: WIDTH,
        marginVertical: 16
    },

    interactions: {
        flexDirection: "row",
        justifyContent: "flex-end",
 
        paddingBottom : 56 
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
    views: {

        flex: 1,
        flexDirection: "row",
        alignItems: "center"
    },
    linkButton: {
        marginVertical: 56,
        marginTop: 26,
        alignSelf: "center"
    },
    title: {
        fontFamily: textFonts.bold,
        marginTop: 16,
        fontSize: 16
    },
    viewsIcon: {
        color: "black",
        fontSize: 24
    }
});

const darkStyles = {
    ...lightStyles,
    title: {
        fontFamily: textFonts.bold,
        marginTop: 16,
        fontSize: 16,
        color: darkTheme.textColor
    },
    container: {
        flex: 1,
        backgroundColor: darkTheme.secondaryBackgroundColor
    },

    description: {
        color: darkTheme.secondaryTextColor,
        fontFamily: textFonts.regular,
        lineHeight: 22,
        fontSize: 14
    },
    name: {
        fontFamily: textFonts.bold,
        color: darkTheme.textColor

    },
    category: {
        fontFamily: textFonts.regular,
        color: darkTheme.secondaryTextColor,
        fontSize: 12
    },
    views: {

        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        color: darkTheme.textColor

    },

    interactions: {
        flexDirection: "row",
        justifyContent: "flex-end",
        flex: 1,
        marginBottom: 16

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
    viewsIcon: {
        color: darkTheme.textColor,
        fontSize: 24
    },
    viewsValue: {

        color: darkTheme.textColor,
    },


}