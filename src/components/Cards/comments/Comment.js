import { View, Text, StyleSheet, Image, TouchableOpacity, FlatList, ActivityIndicator, Modal } from "react-native";
import { AntDesign, FontAwesome } from '@expo/vector-icons';
import React, { useCallback, useContext, useEffect, useState } from "react";
import { textFonts } from "../../../design-system/font";
import ThemeContext from "../../../providers/ThemeContext";
import darkTheme from "../../../design-system/darkTheme";
import { getMediaUri } from "../../../api";
import { Audio } from "expo-av"
import RecordPlayer from "../RecordPlayer";
import { ApolloContext } from "../../../providers/ApolloContext";
import { gql } from "@apollo/client";
import { useEvent } from "../../../providers/EventProvider";
import LikeHeart from "../post/LikeHeart";
import { useTiming } from "../../../providers/TimeProvider";
import { AuthContext } from "../../../providers/AuthContext";
import { Feather } from '@expo/vector-icons';
import Confirmation from "../Confirmation";
const LIMIT = 5;

const DELETE_MESSAGE = {
    title: "حذف الرد",
    message: "هل انت متأكد من حذف هاذ الرد ؟"
}

function Comment({ comment, loadComment, replayMode = false, detechCommmentForReplay, isReplay = false, defaultShowReplays = false, owner = false, currentUser, onDeleteComment, onDeleteReplay }) {

    const [like, setLike] = useState(comment.liked);
    const [record, setRecord] = useState(null);
    const [replays, setReplays] = useState(comment.replays ? comment.replays : []);
    const [showReplays, setShowReplays] = useState(defaultShowReplays);
    const [numReplays, setNumReplays] = useState(comment.numReplays);

    const [firstFetch, setFirstFetch] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);

    const client = useContext(ApolloContext);
    const events = useEvent();

    const timing = useTiming();
    const [isDeleting, setIsDeleting] = useState(false);
    const [replayToDelete, setReplayToDelete] = useState(null);



    const likeComment = useCallback(() => {
        // like a comment or a replay 
        var previousValue = like;
        setLike(!like);

        if (!isReplay) {

            client.query({
                query: gql`
                mutation LikeComment($commentId: ID!) {
                    likeComment(commentId: $commentId)
                }`
                ,
                variables: {
                    commentId: comment.id
                }
            }).then(response => {
                if (!response) {
                    setLike(!previousValue);

                }

            }).catch(error => {
                setLike(!previousValue);
            })

        } else {

            client.query({
                query: gql`
                mutation LikeComment($replayId: ID!) {
                    likeReplay(replayId: $replayId)
                }`
                ,
                variables: {
                    replayId: comment.id
                }
            }).then(response => {

                if (!response) {
                    setLike(!previousValue);

                }
            }).catch(error => {

                setLike(!previousValue);
            })

        }

    }, [like]);


    useEffect(() => {
        // replay handler 
        // check if this replay belongs to this comment 
        // if so add it ti replays array 
        // and update the num of replays 

        if (!isReplay) {
            const addReplay = (replay) => {

                if (replay.commentId == comment.id) {


                    setReplays([replay, ...replays]);
                    if (numReplays !== null)
                        setNumReplays(numReplays + 1);
                    setShowReplays(true)
                }
            }

            events.addListener("new-replay", addReplay);

            return () => {
                events.removeListener("new-replay", addReplay);
            }
        }
    }, [isReplay, comment, replays, numReplays])

    const onReplay = useCallback(() => {
        loadComment(comment);
    }, [comment])


    const loadReplies = async () => {
        if (replays.length == 0)
            setFirstFetch(true);
        else
            setIsLoading(true);
        client.query({
            query: gql`
            query Query($commentId: ID!, $offset: Int!, $limit: Int!) {
                getCommentReplays(commentId: $commentId, offset: $offset, limit: $limit) {
                    id 
                  media {
                    id
                    path
                  }
                 
                  replay
                  liked
                  createdAt 
                  user {
                    name lastname
                    id
                    profilePicture {
                        id path 
                    }
                  }
                }
            }

            ` , variables: {
                offset: replays.length,
                limit: LIMIT,
                commentId: comment.id
            }
        }).then(response => {
            if (replays.length == 0)
                setFirstFetch(false);

            else
                setIsLoading(false);



            if (response) {

                setReplays([...replays, ...response.data.getCommentReplays]);
            }
        }).catch(error => {

            setFirstFetch(false);
        })

    }

    useEffect(() => {

        if (comment.media && comment.media.path) {

            setRecord(getMediaUri(comment.media.path));
        }

    }, [comment])

    const themeContext = useContext(ThemeContext);
    const styles = themeContext.getTheme() == "light" ? lightStyles : darkStyles;

    const toggleReplays = useCallback(() => {
        if (!defaultShowReplays)
            setShowReplays(!showReplays);
        if (comment.numReplays > 0) {

            if (replays.length == 0) {
                loadReplies()
            }
        }
    }, [showReplays, replays]);


    const keyExtractor = useCallback((item, index) => {
        return item.id;
    }, [replays]);

    const renderItem = useCallback(({ item }) => {
        return <Comment
            comment={item}
            isReplay={true}
            owner={currentUser && (owner || item.user.id == currentUser?.id)}
            onDeleteReplay={prepareReplayToDelete}
        />
    }, [owner, currentUser, replays, prepareReplayToDelete]);


    const loadMore = useCallback(() => {
        loadReplies();
    }, [replays, comment, firstFetch, isLoading]);


    const onDelete = useCallback(() => {


        if (!isReplay) {
            onDeleteComment && onDeleteComment(comment.id);
        } else {
            onDeleteReplay && onDeleteReplay(comment.id);
        }
    }, [isReplay, onDeleteReplay, onDeleteComment])


    const deleteReplay = useCallback(() => {

        if (replayToDelete) { 
            setIsDeleting( true ) ; 
            client.mutate({
                mutation : gql`
                mutation DeleteReplay($replayId: ID!) {
                    deleteReplay(replayId: $replayId) {
                      id
                    }
                }` , 
                variables : { 
                    replayId : replayToDelete 
                }
            }).then( response => { 
                if ( response && response.data) {
                    const index = replays.findIndex(replay => replay.id == replayToDelete);
                    if (index >= 0) {
                        var cloneReplays = [...replays];
                        cloneReplays.splice(index, 1);
                        setReplays(cloneReplays)
                        setNumReplays(numReplays - 1)
            
                    }
                    closeConfirmation();
                    setReplayToDelete(null);
                }
                setIsDeleting( false ) ; 
            }).catch(error => {
                setIsDeleting( false ) ; 
            }) 

        }
 

    }, [replays, numReplays, replayToDelete]);

    const closeConfirmation = useCallback(() => {
        setShowDeleteConfirmation(false);
        setReplayToDelete(null);
    }, [showDeleteConfirmation])


    const prepareReplayToDelete = useCallback((id) => {
        setShowDeleteConfirmation(true);
        setReplayToDelete(id);
    }, [])

    return (
        <View style={styles.container}>
            <View style={styles.commentHeader}>
                <View style={styles.user}>
                    {
                        comment.user.profilePicture &&
                        <Image source={{ uri: getMediaUri(comment.user.profilePicture.path) }} style={styles.userImage} />

                    }
                    {
                        !comment.user.profilePicture &&
                        <Image source={require("../../../assets/illustrations/gravater-icon.png")} style={styles.userImage} />
                    }

                </View>
                <View style={styles.commentInfo}>

                    <Text style={styles.name}>
                        {comment.user.validated && <AntDesign name="checkcircle" style={styles.blueIcon} />} {comment.user.name} {comment.user.lastname}
                    </Text>
                    <Text style={styles.time}>
                        {timing.getPeriod(comment.createdAt)}
                    </Text>
                </View>
                {
                    !replayMode &&
                    <TouchableOpacity style={styles.interaction} onPress={likeComment}>

                        <LikeHeart
                            style={styles.interactionIcon}
                            like={like}
                            color={themeContext.getTheme() == "light" ? null : darkTheme.textColor}
                        />

                    </TouchableOpacity>
                }
                {
                    replayMode &&
                    <TouchableOpacity style={styles.interaction} onPress={detechCommmentForReplay}>
                        <FontAwesome name="times" size={18} color="red" />
                    </TouchableOpacity>
                }

            </View>
            <View style={styles.commentSection}>


                <View style={styles.commentContent}>
                    {

                        comment.comment &&
                        <Text style={styles.commentText}> {comment.comment}</Text>
                    }
                    {
                        comment.replay &&
                        <Text style={styles.commentText}> {comment.replay}</Text>
                    }
                    {
                        record &&
                        <RecordPlayer uri={record} />
                    }

                </View>
                {
                    owner &&
                    <Feather name="trash-2" style={styles.deleteIcon} onPress={onDelete} />

                }
            </View>
            {
                !replayMode && !isReplay &&
                <View style={styles.footer}>
                    <View style={styles.info}>
                        {
                            !firstFetch && numReplays !== null &&

                            <Text style={[styles.footerText, styles.bold]} onPress={toggleReplays}>
                                الردود ({numReplays})
                            </Text>

                        }
                        {
                            firstFetch &&
                            <ActivityIndicator style={styles.footerText} color={"#1A6ED8"} />
                        }
                        <Text style={styles.footerText} onPress={onReplay}>
                            إضافة رد
                        </Text>
                    </View>
                </View>
            }
            {
                showReplays &&

                <FlatList
                    nestedScrollEnabled
                    data={replays}
                    renderItem={renderItem}
                    keyExtractor={keyExtractor}
                    style={styles.replays}
                />
            }
            {

                showReplays && !replayMode && replays.length > 0 && replays.length != numReplays && !isLoading && numReplays !== null &&
                <TouchableOpacity onPress={loadMore}>
                    <Text style={[styles.footerText, styles.bold, { textAlign: "center" }]}>
                        تحميل المزيد ({numReplays - replays.length})
                    </Text>
                </TouchableOpacity>
            }
            {
                showReplays && !replayMode && replays.length > 0 && replays.length != numReplays && isLoading &&
                <ActivityIndicator style={styles.footerText} color={"#1A6ED8"} />

            }
            {
                showDeleteConfirmation &&
                <Modal
                    transparent
                    onRequestClose={closeConfirmation}
                >
                    <Confirmation loading={isDeleting} title={DELETE_MESSAGE.title} message={DELETE_MESSAGE.message} onClose={closeConfirmation} onConfirm={deleteReplay} />
                </Modal>
            }

        </View>
    )
};


export default React.memo(Comment);

const lightStyles = StyleSheet.create({
    container: {
        marginBottom: 16,
        padding: 8,
        borderRadius: 4,
        paddingHorizontal: 0,
        /*
        borderBottomColor : "#eee" , 
        borderBottomWidth : 1
        */
    },
    blueIcon: {
        color: "blue",
        fontSize: 12
    },
    commentInfo: {

        flex: 1,
        marginRight: 16,

    },
    time: {
        fontFamily: textFonts.regular,
        color: "#666",
        fontSize: 10
    },
    userImage: {
        width: 32,
        height: 32,
        borderRadius: 42,



    },

    commentHeader: {
        flexDirection: "row-reverse",

        alignItems: "center",

    },
    interactionIcon: {
        fontSize: 16,
        color: "#666",

    },

    like: {
        color: "#FF3159",

    },
    user: {

        flexDirection: "row-reverse"
    },
    userInfo: {
        flexDirection: "row-reverse",
        marginLeft: 16,


    },
    name: {

        fontFamily: textFonts.bold,
        fontSize: 12 , 
        textAlign : "right"
    },

    commentText: {
        fontFamily: textFonts.regular,
        fontSize: 12,
        color: "#666",
        marginVertical: 8

    },
    info: {
        flexDirection: "row-reverse",

        justifyContent: "flex-start",
        marginTop: 8
    },
    footerText: {
        color: "#1A6ED8",
        fontFamily: textFonts.regular,
        fontSize: 12,
        marginLeft: 16
    },
    interaction: {

        height: "100%",
        paddingTop: 8

    },
    bold: {
        fontFamily: textFonts.bold,
        fontWeight: "bold",
    },
    replays: {
        marginTop: 8,
        paddingHorizontal: 16,
        borderRightColor: "#eee",
        borderRightWidth: 4

    },
    commentSection: {
        flexDirection: "row-reverse",
        alignItems: "center",
        marginLeft: 52,

    },
    commentContent: {


        flex: 1,


    },
    deleteIcon: {
        fontSize: 18,
        color: "red",
        paddingRight: 12,
        paddingVertical: 12,

    }
})

const darkStyles = {
    ...lightStyles,
    name: {

        fontFamily: textFonts.bold,
        color: darkTheme.textColor,

        fontSize: 12 , 
        textAlign : "right"
    }
    ,
    commentText: {

        fontFamily: textFonts.regular,
        fontSize: 12,
        color: darkTheme.secondaryTextColor,
        marginVertical: 8

    },
    interactionIcon: {
        fontSize: 20,
        color: darkTheme.secondaryTextColor
    },
    replays: {
        marginTop: 8,
        paddingHorizontal: 16,
        borderRightColor: darkTheme.borderColor,
        borderRightWidth: 4

    }

}