import { View, Text, StyleSheet, Image, TouchableOpacity, FlatList, TextInput, ActivityIndicator } from "react-native";
import { textFonts } from "../../../design-system/font";
import PrimaryInput from "../../Inputs/PrimaryInput";
import { FontAwesome, Ionicons } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';
import Comment from "./Comment";
import { Feather } from '@expo/vector-icons';
import { useCallback, useContext, useEffect, useState } from "react";
import { Audio } from 'expo-av';
import RecordPlayer from "../RecordPlayer";
import ThemeContext from "../../../providers/ThemeContext";
import darkTheme from "../../../design-system/darkTheme";
import { AuthContext } from "../../../providers/AuthContext";
import { getMediaUri } from "../../../api";
import { ApolloContext } from "../../../providers/ApolloContext";
import { gql } from "@apollo/client";
import { ReactNativeFile } from "apollo-upload-client";
import { useEvent } from "../../../providers/EventProvider";
import LoadingActivity from "../post/loadingActivity";
import LoadingComment from "../loadings/LoadingComment";


const NO_PERMISSION_ERROR = "يرجى السماح بالميكروفون";
const LIMIT = 4;

const LOADING_COMPONENTS = [{ id: 0, type: "loading" }, { id: 1, type: "loading" }, { id: 2, type: "loading" }, { id: 3, type: "loading" }]

export default function Comments({ post, fetchingQuery, notificationUser, openPost }) {

    const [recording, setRecording] = useState(false);
    const [message, setMessage] = useState(null);

    const [comments, setComments] = useState([...LOADING_COMPONENTS]);
    const [commentForReplay, setCommentForReplay] = useState(null);

    const [user, setUser] = useState();

    const [record, setRecord] = useState(null);
    const [text, setText] = useState();

    const themeContext = useContext(ThemeContext);
    const styles = themeContext.getTheme() == "light" ? lightStyles : darkStyles

    const client = useContext(ApolloContext);
    const auth = useContext(AuthContext);

    const [end, setEnd] = useState(false);
    const [loading, setLoading] = useState(true);
    const [firstFetch, setFirstFetch] = useState(true);

    const [isSubmitting, setIsSubmitting] = useState(false);

    const events = useEvent();

    useEffect(() => {

        (async () => {
            const userAuth = await auth.getUserAuth();

            if (userAuth && userAuth.user) {
                setUser(userAuth.user);
            }
        })();
    }, [loading]);


    useEffect(() => {
        if (fetchingQuery)
            (async () => {
                setLoading(true);
                var fetchedComments = await fetchingQuery.loader();
                setComments(fetchedComments);
                setLoading(false);
            })();
    }, [fetchingQuery])


    useEffect(() => {


        if (loading && post) {

            var currentOffset = comments.filter(comment => comment.type != "loading").length;

            client.query({
                query: gql`
        
                query GetPostComments($postId: ID!, $offset: Int!, $limit: Int!) {
                    getPostComments(postId: $postId, offset: $offset, limit: $limit) {
                        comment
                        createdAt
                        id
                        liked
                        media {
                            id
                            path
                        }
                        user {
                            id 
                            name 
                            lastname 
                            profilePicture { 
                                id path 
                            }
                        }
                        numReplays
                        updatedAt
                    }
                }`,
                variables: {
                    offset: currentOffset,
                    limit: LIMIT,
                    postId: post.id
                }
            }).then(response => {


                console.log(response);
                if (response) {
                    setComments([...comments.filter(comment => comment.type != "loading"), ...response.data.getPostComments]);

                    if (response.data.getPostComments.length < LIMIT) {
                        setEnd(true);
                    }
                    if (firstFetch)
                        setFirstFetch(false)
                }
                setLoading(false);
            }).catch(error => {
                setLoading(false);
            })
        }


    }, [loading]);


    const startRecording = async () => {
        try {
            const permission = await Audio.requestPermissionsAsync();

            if (permission.status == "granted") {
                await Audio.setAudioModeAsync({
                    allowsRecordingIOS: true,
                    playsInSilentModeIOS: true
                });

                const { recording } = await Audio.Recording.createAsync(
                    Audio.RecordingOptionsPresets.HIGH_QUALITY
                );
                setRecording(recording);
            } else {
                showError(NO_PERMISSION_ERROR);
            }
        } catch (error) {
            console.log(error);
        }
    }

    const stopRecording = async () => {
        await recording.stopAndUnloadAsync();
        setRecord(recording.getURI());
        setRecording(null);
    }

    const showError = (message) => {
        setMessage(message);
        setTimeout(() => {
            setMessage(null)
        }, 1000)
    }


    const deleteRecord = () => {
        setRecord(null);
    }

    const onSubmit = useCallback(() => {
        setIsSubmitting(true);
        var media = null;
        if (record) {
            media = new ReactNativeFile({
                type: "	audio/mp4",
                name: "record",
                uri: record
            });
        }

        client.mutate({
            mutation: gql`
                mutation Mutation($commentInput: CommentInput!) {
                    comment(commentInput: $commentInput) {
                        comment
                        id
                        media {
                            id
                            path
                        }
                    }
                }`  ,
            variables: {
                commentInput: {
                    comment: (text && text.trim().length > 0) ? (text.trim()) : (null),
                    media: media,
                    postId: post.id
                }
            }

        }).then(response => {


            var comment = response.data.comment;
            comment.user = user;
            comment.liked = false;
            comment.numReplays = 0;
            comment.replays = [];
            setComments([comment, ...comments]);

            events.emit("new-comment");

            setText(null);
            setRecord(null);
            setIsSubmitting(false);


        }).catch(error => {
            console.log(error);

            setIsSubmitting(false);

        })

    }, [text, record, user, comments]);

    const loadComment = useCallback((comment) => {

        setCommentForReplay(comment);
    }, []);


    const detechCommmentForReplay = useCallback(() => {
        setCommentForReplay(null);

    }, [])

    const renderItem = useCallback(({ item }) => {
        if (item.type == "loading") {
            return <LoadingComment />
        }
        return <Comment comment={item} loadComment={loadComment} defaultShowReplays={fetchingQuery != null} />
    }, []);

    const keyExtractor = useCallback((item, index) => {
        if (item.type == "loading") {
            return "loading-" + index;
        } else
            return item.id;
    }, []);


    const onReplay = useCallback(() => {
        var media = null;

        setIsSubmitting(true);
        if (record) {
            media = new ReactNativeFile({
                type: "	audio/mp4",
                name: "record",
                uri: record
            });
        }
        client.mutate({
            mutation: gql`
                mutation Mutation($replayInput: ReplayInput!) {
                    
                    replay(replayInput: $replayInput) {
                        replay
                        id
                        
                        media {
                            id
                            path
                        }
                    }
                }`  ,
            variables: {
                replayInput: {
                    replay: (text && text.trim().length > 0) ? (text.trim()) : (null),
                    media: media,
                    commentId: commentForReplay.id
                }
            }

        }).then(response => {

            var replay = response.data.replay;
            replay.user = user;
            replay.commentId = commentForReplay.id;
            replay.liked = false;

            events.emit("new-replay", replay)
            setText(null);
            setRecord(null);
            setCommentForReplay(null);
            setIsSubmitting(false);


        }).catch(error => {
            console.log(error);
            setIsSubmitting(false);

        })


    }, [text, record, user, comments, commentForReplay]);


    const reachEnd = useCallback(() => {


        if (!loading && !end && !firstFetch) {


            setComments([...comments, { id: 0, type: "loading" }])
            setLoading(true);


        }


    }, [loading, comments, end, firstFetch])

    return (
        <View style={styles.container}>
            {
                commentForReplay &&
                <TouchableOpacity style={styles.background} activeOpacity={1} onPress={detechCommmentForReplay}>
                </TouchableOpacity>
            }

            <Text style={styles.header}>
                تعليقات
            </Text>
            {
                notificationUser &&
                <TouchableOpacity style={styles.postOpener} onPress={openPost}>
                    <Text style={styles.postOpenerText}>
                        هذه تعليقات وردود من <Text style={styles.bold}>{notificationUser.name} {notificationUser.lastname}</Text> <Text style={styles.blue}>انقر لرؤية المنشور كاملا</Text>
                    </Text>
                </TouchableOpacity>

            }
            <FlatList
                data={comments}
                renderItem={renderItem}
                keyExtractor={keyExtractor}
                style={styles.comments}
                onEndReached={reachEnd}

            />


            <View style={styles.commentInputContainer}>
                {
                    record &&
                    <View style={{ marginTop: 12 }}>
                        <RecordPlayer uri={record} />
                    </View>
                }
                {
                    commentForReplay &&
                    <View style={styles.commentForReplay}>
                        <Comment comment={commentForReplay} replayMode={true} detechCommmentForReplay={detechCommmentForReplay} />
                    </View>
                }
                <Text style={styles.errorMessage}>
                    {message}
                </Text>
                {
                    (!fetchingQuery || commentForReplay) &&
                    <View style={styles.commentInput}>


                        <TouchableOpacity style={styles.commentButton}>
                            <Feather name="gift" style={styles.buttonIcon} />
                        </TouchableOpacity>

                        {
                            !record &&
                            <TouchableOpacity style={styles.commentButton} onPress={!recording ? startRecording : stopRecording}>
                                <FontAwesome name="microphone" style={[styles.buttonIcon, recording && { color: "red" }]} />
                            </TouchableOpacity>
                        }
                        {
                            record &&
                            <TouchableOpacity style={styles.commentButton} onPress={deleteRecord}>
                                <FontAwesome name="trash-o" style={[styles.buttonIcon, { color: "red" }]} />
                            </TouchableOpacity>

                        }

                        {

                            <PrimaryInput
                                placeholder={"اكتب تعليق ..."}
                                onChange={setText}
                                value={text}
                                rightContent={
                                    !(text && text.trim().length > 0 || record) ?
                                        <Image style={styles.commentInputImage} source={(user && user.profilePicture) ? { uri: getMediaUri(user.profilePicture.path) } : require("../../../assets/illustrations/gravater-icon.png")} />
                                        :
                                        (!isSubmitting ?
                                            <TouchableOpacity style={styles.commentInputImage} onPress={!commentForReplay ? onSubmit : onReplay}>
                                                <Ionicons name="send" style={styles.send} />
                                            </TouchableOpacity>
                                            :
                                            <ActivityIndicator style={styles.commentInputImage} />
                                        )
                                }
                                style={{ flex: 1, height: 42 }}
                            />

                        }

                    </View>
                }

            </View>
        </View>
    )
};

const lightStyles = StyleSheet.create({
    container: {
        flex: 1,

        paddingTop: 0,

    },
    background: {
        backgroundColor: "rgba(0,0,0,0.2)",
        position: "absolute",
        height: "100%",
        width: "100%",
        zIndex: 9
    },
    header: {
        fontFamily: textFonts.bold,
        fontWeight : "bold" , 
        fontSize: 16,
        paddingHorizontal: 16
    },
    commentInput: {
        flexDirection: "row",

        height: 42,
        alignItems: "center"


    },
    commentInputContainer: {
        position: "absolute",
        bottom: 0,

        width: "100%",

        paddingHorizontal: 16,
        paddingBottom: 12,
        backgroundColor: "white",

        elevation: 36,
        zIndex: 10
    },
    commentInputImage: {
        height: 36,
        width: 36,
        borderRadius: 42,
        marginRight: 8,
    },
    commentButton: {
        width: 42,

        height: "100%",
        alignItems: "center",
        justifyContent: "center"
    },
    buttonIcon: {
        fontSize: 20,
        color: "#666"
    },

    errorMessage: {
        color: "red",

        textAlign: "center",
        fontSize: 12,
        fontFamily: textFonts.regular
    },
    send: {
        fontSize: 24,
        color: "#00D0CD",
        transform: [
            {
                rotateZ: "-90deg"
            }
        ]
    },
    commentForReplay: {

        width: "100%",
        left: 0,
        marginTop: 16,
        marginBottom: -16
    },
    comments: {
        paddingHorizontal: 16,
        marginTop: 16,
        marginBottom: 72,
        paddingBottom: 16
    },
    postOpenerText: {
        fontFamily: textFonts.regular,
        fontSize: 10,

    },
    postOpener: {
        marginTop: 8,
        backgroundColor: "#eee",
        marginHorizontal: 16,
        padding: 8,
        borderRadius: 4

    },
    bold: {
        fontFamily: textFonts.bold,
        fontWeight : "bold" , 
    },
    blue: {
        color: "#1A6ED8"
    }
})

const darkStyles = {
    ...lightStyles,

    header: {
        fontFamily: textFonts.bold,
        fontWeight : "bold" , 
        fontSize: 16,
        paddingHorizontal: 16,
        color: darkTheme.textColor

    },
    buttonIcon: {
        fontSize: 20,
        color: darkTheme.secondaryTextColor
    },
    postOpener: {
        marginTop: 8,
        backgroundColor: darkTheme.secondaryBackgroundColor,
        marginHorizontal: 16,
        padding: 8,
        borderRadius: 4

    },
    postOpenerText: {
        fontFamily: textFonts.regular,
        fontSize: 10,
        color: darkTheme.secondaryTextColor

    },
    bold: {
        fontFamily: textFonts.bold,
        fontWeight : "bold" , 
        color: darkTheme.textColor
    },
    commentInputContainer: {
        position: "absolute",
        bottom: 0,

        width: "100%",

        paddingHorizontal: 16,
        paddingBottom: 12,
        backgroundColor: darkTheme.backgroudColor,

        elevation: 36,
        zIndex: 10
    },

}