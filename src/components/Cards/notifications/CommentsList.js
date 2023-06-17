import { useCallback, useContext, useEffect, useState } from "react";
import { View, Text, StyleSheet, Image, FlatList, TouchableOpacity, Modal } from "react-native";
import { ApolloContext } from "../../../providers/ApolloContext";
import { gql } from "@apollo/client";
import { getMediaUri } from "../../../api";
import { textFonts } from "../../../design-system/font";
import LoadingActivity from "../post/loadingActivity";
import RecordPlayer from "../../Cards/RecordPlayer";
import Slider from "../Slider";
import Comments from "../comments/Comments";
import { AuthContext } from "../../../providers/AuthContext";
import { useEvent } from "../../../providers/EventProvider";
import ThemeContext from "../../../providers/ThemeContext";
import darkTheme from "../../../design-system/darkTheme";
import { useRealTime } from "../../../providers/RealTimeContext";
import { useTiming } from "../../../providers/TimeProvider";

const LIMIT = 3;

export default function CommentsList({ navigation, route }) {

  const client = useContext(ApolloContext);
  const [comments, setComments] = useState([]);
  const [postComments, setPostComments] = useState([]);
  const [storiesComments, setStoriesComment] = useState([]);
  const [replays, setReplays] = useState([]);


  const [firstFetch, setFirstFetch] = useState(true);
  const [loading, setLoading] = useState(false);
  const [end, setEnd] = useState(false);
  const [fetchingQuery, setFetchingQuery] = useState(null);
  const [notificationUser, setNotificationUser] = useState(null);
  const [selectedComment, setSelectedComment] = useState(null);

  const event = useEvent();
  const auth = useContext(AuthContext);
  const realTime = useRealTime();

  const timing = useTiming()


  const themeContext = useContext(ThemeContext);
  const styles = themeContext.getTheme() == "light" ? lightStyles : darkStyles;

  useEffect(() => {
    if (!route || !route.params || !route.params.notificationData)
      return;

    const notificationData = route.params.notificationData;

    if (notificationData) {

      if (notificationData.type == "post-comment") {
        var comment = JSON.parse(notificationData.comment)
        var loadingPromise = getCommentById(comment.id).then(comments => {
          setNotificationUser(comments[0].user);
          setSelectedComment({ comment: comments[0] });
          return comments;
        });

        setFetchingQuery({
          loader: () => {
            return loadingPromise
          }
        });

      }
      if (notificationData.type == "comment-replay") {
        var replay = JSON.parse(notificationData.replay)
        var loadingPromise = getReplayById(replay.id).then(comments => {
          setNotificationUser(comments[0].user);
          setSelectedComment({ replay: { comment: comments[0] } });
          return comments;
        })

        setFetchingQuery({
          loader: () => {
            return loadingPromise
          }
        });
      }

      if (notificationData.type == "story-comment") {
        var storyComment = JSON.parse(notificationData.storyComment);

        console.log(storyComment);

        const index = storiesComments.findIndex(comment => comment.storyComment.id == storyComment.id);


        if (index >= 0) {

          console.log("found");

          storyComment = storiesComments[index].storyComment;


          (async () => {
            const userAuth = await auth.getUserAuth();
            if (userAuth) {

              var user = userAuth.user;

              user.stories = [storyComment.story];
              navigation.navigate("StoriesList", {
                followers: [user],
                followerId: user.id
              })
            }
          })();
        }
      }
    }
  }, [route])
  const loadNotfications = async (postOffset, replayOffset, storyOffset) => {



    client.query({
      query: gql`
            query GetCommentNotification($offset: Int!, $limit: Int!, $replayOffset: Int!, $storyOffset: Int!) {
                getCommentPostNotification(offset: $offset, limit: $limit) {
                   comment {
                    comment
                    createdAt
                    id
                    media {
                      id
                      path
                    }
                    
                    user {
                      id
                      lastname
                      name
                      profilePicture {
                        id
                        path
                      }
                    }
                    post {
                      id
                      media {
                        id
                        path
                      }
                      reel {
                        id 
                        thumbnail {
                          id
                          path
                        }
                      }
                      type
                    }
                  }
                }
                getReplayCommentNotification(offset: $replayOffset, limit: $limit) {
                   replay {
                    comment {
                      id 
                      comment
                     
                      post {
                        id 
                        media {
                          id path
                        }
                        type 
                        reel {
                          id
                            thumbnail { 
                                id path 
                            }
                        }
                      }
                    }
                    id
                    createdAt
                    media {
                      path
                      id
                    }
                    replay
                    user {
                      id
                      name
                      lastname
                      profilePicture {
                        id
                        path
                      }
                    }
                  }
                }
                getStoryCommentNotification(offset: $storyOffset, limit: $limit) {
                  storyComment {
                    comment
                    createdAt
                    id
                    story {
                      id 
                      liked 
                      userId
                      media {
                        id
                        path
                      }
                    }
                    user {
                      id
                      lastname
                      name
                      profilePicture {
                        id
                        path
                      }
                    }
                  }
                }
              }` , variables: {
        offset: postOffset,
        replayOffset: replayOffset,
        storyOffset: storyOffset,
        limit: LIMIT
      }
    }).then(response => {
      if (response && response.data) {
        var newPostComments = response.data.getCommentPostNotification;
        var replayComments = response.data.getReplayCommentNotification;
        var newStoriesComments = response.data.getStoryCommentNotification;


        if (newPostComments.length < LIMIT && replayComments.length < LIMIT && newStoriesComments.length < LIMIT) {

          setEnd(true);
        }

        setReplays([...replays, ...replayComments]);
        setPostComments([...postComments, ...newPostComments]);
        setStoriesComment([...storiesComments, ...newStoriesComments]);

        var notfications = [...newPostComments, ...replayComments, ...newStoriesComments].sort((a, b) => {
          var aCreatedAt = a.comment?.createdAt || a.replay?.createdAt || a.storyComment?.createdAt;
          var bCreatedAt = b.comment?.createdAt || b.replay?.createdAt || b.storyComment?.createdAt;
          return aCreatedAt < bCreatedAt;
        });
        setComments([...comments.filter(comment => comment.type != "loading"), ...notfications]);


      }


      setFirstFetch(false);
      setLoading(false);
    }).catch(error => {

      setFirstFetch(false);
      setLoading(false);
    })
  }
  useEffect(() => {
    setFirstFetch(true);
    setEnd(false);
    setLoading(false);
    setComments([]);
    setPostComments([]);
    setReplays([]);
    setStoriesComment([]);
    loadNotfications(0, 0, 0);
  }, []);




  useEffect(() => {
    if (loading) {

      loadNotfications(
        postComments.length,
        replays.length,
        storiesComments.length
      );
    }
  }, [loading])




  useEffect(() => {

    const onNewComment = (newComment) => {
      setPostComments([{ comment: newComment }, ...postComments]);
      setComments([{ comment: newComment }, ...comments]);

    };

    const onNewReplay = (newReplay) => {

      setReplays([{ replay: newReplay }, ...replays]);
      setComments([{ replay: newReplay }, ...comments]);

    };

    const onNewStoryComment = (newStoryComment) => {

      setStoriesComment([{ storyComment: newStoryComment }, ...storiesComments]);
      setComments([{ storyComment: newStoryComment }, ...comments]);

    };




    realTime.addListener("NEW_COMMENT", onNewComment);
    realTime.addListener("NEW_REPLAY", onNewReplay);
    realTime.addListener("NEW_STORY_COMMENT", onNewStoryComment);


    return () => {
      realTime.removeListener("NEW_COMMENT", onNewComment);
      realTime.removeListener("NEW_REPLAY", onNewReplay);
      realTime.removeListener("NEW_STORY_COMMENT", onNewStoryComment);
    }

  }, [comments, storiesComments, postComments, replays])


  useEffect(() => {

    const likeStory = (value, story) => {

      for (let index = 0; index < comments.length; index++) {
        if (comments[index].storyComment && comments[index].storyComment.story.id == story.id) {
          comments[index].storyComment.story.liked = value;
        }
      }
      setComments(comments);

    }
    const userBlocked = (user) => {
      setComments(comments.filter(comment => {

        if (comment.type == "loading")
          return true;

        if (comment.comment && comment.comment?.user.id == user.id)
          return false;

        if (comment.replay && comment.replay?.user.id == user.id)
          return false;

        if (comment.storyComment && comment.storyComment?.user.id == user.id)
          return false;



      }));
    }



    event.addListener("blocked-user", userBlocked);
    event.addListener("like-story", likeStory);




    return () => {
      event.removeListener("like-story", likeStory);
      event.removeListener("blocked-user", userBlocked);
    }


  }, [comments, storiesComments])


  const getCommentById = (commentId) => {
    return client.query({
      query: gql`
      
      
      query GetCommentById($commentId: ID!) {
        getCommentById(commentId : $commentId) {
            comment
            createdAt
            id
            liked
            post {
              type 
              id 
            }
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
    }
      
      ` , variables: {
        commentId: commentId
      }
    }).then(response => {
      return [response.data.getCommentById]

    })
  }


  const getReplayById = (replayId) => {
    return client.query({
      query: gql`
      query GetReplayById($replayId: ID!) {
        getReplayById(replayId: $replayId) {
            id 
            media {
              id
              path
            }           
            replay
            liked
            user {
              name lastname
              id
              profilePicture {
                id path 
                }
            }
            comment {
              comment
                  createdAt
                  id
                  liked
                  post {
                    type 
                    id 
                  }
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
        }
      }` ,
      variables: {
        replayId: replayId
      }
    }).then(response => {

      var replay = response.data.getReplayById;
      var cloneComment = { ...replay.comment, numReplays: null };
      cloneComment.replays = [{ ...replay, comment: null }];
      return [cloneComment];

    })
  }


  const keyExtractor = useCallback((item, index) => {
    return index;
  }, []);



  const openComment = useCallback((comment) => {


    setSelectedComment(comment);
    if (comment.comment) {


      setNotificationUser(comment.comment.user);
      setFetchingQuery({
        loader: () => {
          return getCommentById(comment.comment.id)
        }
      })
    }
    if (comment.replay) {
      setNotificationUser(comment.replay.user);

      setFetchingQuery({
        loader: () => {
          return getReplayById(comment.replay.id)
        }
      })
    }
    if (comment.storyComment) {
      (async () => {
        const userAuth = await auth.getUserAuth();
        if (userAuth) {

          var user = userAuth.user;

          user.stories = [comment.storyComment.story];
          navigation.navigate("StoriesList", {
            followers: [user],
            followerId: user.id
          })
        }
      })();


    }
  }, []);


  const closeComments = useCallback(() => {
    setSelectedComment(null);
    setFetchingQuery(null);
    setNotificationUser(null);
  }, []);

  const getPostById = (postId) => {
    return client.query({
      query: gql`
        query GetPostById($postId: ID!) {
            getPostById(postId: $postId) {
                createdAt
                id
                liked
                isFavorite 
                numComments
                likes
                title

                media { 
                  id path 
                }
                
                reel { 
                    id 
                    views 
                    thumbnail {
                       id path
                    }
                }
                type
                user {
                  id
                  name
                  lastname
                  profilePicture {
                    id
                    path
                  }
                }
          }
        }
        
        ` ,


      variables: {
        postId: postId
      }
    }).then(response => {

      return [response.data.getPostById];
    });

  }
  const openPost = useCallback(() => {


    if (!selectedComment)
      return;


    var post = null;
    if (selectedComment.comment)
      post = selectedComment.comment.post;
    if (selectedComment.replay)
      post = selectedComment.replay.comment.post;



    if (post.type != "reel")

      navigation.navigate("ViewPosts", {
        getPosts: () => {
          return getPostById(post.id)
        },
        title: "المنشور",

      });


    else if (post.type == "reel") {
      navigation.navigate("ReelsViewer", {
        focusPostId: null,
        getReels: () => {
          return getPostById(post.id)
        },
        fetchMore: false

      });
    }

    closeComments();

  }, [selectedComment])

  const renderItem = useCallback(({ item }) => {


    if (item.type == "loading")
      return <LoadingActivity style={{ height: 56 }} />

    var user = item.comment?.user || item.replay?.user || item.storyComment?.user
    var media = item.comment?.post.reel?.thumbnail || item.comment?.post.media[0] || item.storyComment?.story.media || item.replay?.comment.post.reel?.thumbnail || item.replay?.comment.post.media[0];

    var record = null;
    if (item.comment && item.comment.media)
      record = getMediaUri(item.comment.media.path);

    if (item.replay && item.replay.media)
      record = getMediaUri(item.replay.media.path);


    var postType = "منشورك";

    if (item.comment) {
      if (item.comment.post.type == "image") {
        postType = "صورتك";
      }

      if (item.comment.post.type == "reel") {
        postType = "الريلز الخاصة بك";
      }

    } else if (item.storyComment) {
      postType = "القصة الخاصة بك";

    }



    return (
      <TouchableOpacity style={styles.notification} onPress={() => openComment(item)}>
        {
          user.profilePicture &&
          <Image source={{ uri: getMediaUri(user.profilePicture.path) }} style={styles.userImage} />
        }
        {
          !user.profilePicture &&
          <Image source={require("../../../assets/illustrations/gravater-icon.png")} style={styles.userImage} />
        }
        {
          item.comment &&
          <View style={styles.commentContainer}>
            <Text style={styles.text}>
              علق <Text style={styles.bold}>{user.name} {user.lastname}</Text> على {postType} ب :

            </Text>
            <Text style={[styles.comment, styles.bold]} numberOfLines={2} ellipsizeMode="tail">
              {item.comment.comment}
            </Text>
            {
              record &&
              <RecordPlayer uri={record} />
            }
            <Text style={styles.time}>
              {timing.getPeriod(item.comment.createdAt)}
            </Text>

          </View>

        }
        {
          item.replay &&
          <View style={styles.commentContainer}>
            <Text style={styles.text}>
              رد <Text style={styles.bold}>{user.name} {user.lastname}</Text> على تعليقك ب :
            </Text>

            <Text style={[styles.comment, styles.bold]} numberOfLines={2} ellipsizeMode="tail">
              {item.replay.replay}
            </Text>
            {
              record &&
              <RecordPlayer uri={record} />
            }
            <Text style={styles.time}>
              {timing.getPeriod(item.replay.createdAt)}
            </Text>

          </View>

        }
        {
          item.storyComment &&
          <View style={styles.commentContainer}>
            <Text style={styles.text}>
              علق <Text style={styles.bold}>{user.name} {user.lastname}</Text> على {postType} ب :
            </Text>
            <Text style={[styles.comment, styles.bold]} numberOfLines={2} ellipsizeMode="tail">
              {item.storyComment.comment}
            </Text>
            <Text style={styles.time}>
              {timing.getPeriod(item.storyComment.createdAt)}
            </Text>
          </View>
        }
        {
          media &&

          <Image style={styles.image} source={{ uri: getMediaUri(media.path) }} />

        }
        {
          !media &&
          <View style={styles.image}>
          </View>
        }
      </TouchableOpacity>
    )
  }, [styles]);


  const reachEnd = useCallback(() => {


    if (!loading && !end && !firstFetch) {




      setComments([...comments, { id: 0, type: "loading" }])
      setLoading(true);
    }

  }, [loading, comments, end, firstFetch])



  return (
    <View style={styles.container}>

      {
        fetchingQuery &&
        <Modal
          transparent
          onRequestClose={closeComments}
        >
          <Slider onClose={closeComments} percentage={0.1}>
            <Comments fetchingQuery={fetchingQuery} notificationUser={notificationUser} openPost={openPost} />
          </Slider>
        </Modal>
      }

      {
        !firstFetch &&
        <FlatList
          data={comments}
          keyExtractor={keyExtractor}
          renderItem={renderItem}
          onEndReached={reachEnd}
          style={styles.list}
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
    marginTop: 16,
    paddingHorizontal: 16
  },
  text: {
    flex: 1,
    color: "#666",
    fontSize: 12,
    fontFamily: textFonts.regular,
    lineHeight: 26,
    maxHeight: 26,

  },
  commentContainer: {
    flex: 1,
    justifyContent: "center"
  },
  comment: {
    fontSize: 12
  },
  image: {
    width: 48,
    height: 64,
    marginRight: 16,
    borderRadius: 4
  },
  userImage: {
    width: 38,
    height: 38,
    borderRadius: 48,
    marginLeft: 16
  },
  bold: {
    fontFamily: textFonts.bold,
    color: "#212121"
  },
  list: {

    flex: 1,
    marginBottom: 64,

  },
})


const darkStyles = {
  ...lightStyles,
  text: {
    flex: 1,
    color: darkTheme.secondaryTextColor,
    fontSize: 12,
    fontFamily: textFonts.regular,
    lineHeight: 26,
    maxHeight: 26,

  },
  bold: {
    fontFamily: textFonts.bold,
    color: darkTheme.textColor
  },
}