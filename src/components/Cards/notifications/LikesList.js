import { View, Text, StyleSheet, Image, FlatList, TouchableOpacity } from "react-native";
import { useCallback, useContext, useEffect, useState } from "react";
import { textFonts } from "../../../design-system/font";
import ThemeContext from "../../../providers/ThemeContext";
import darkTheme from "../../../design-system/darkTheme";
import { ApolloContext } from "../../../providers/ApolloContext";
import { gql } from "@apollo/client";
import { getMediaUri } from "../../../api";
import LoadingActivity from "../post/loadingActivity";
import { useRealTime } from "../../../providers/RealTimeContext";



const LIMIT = 10;


export default function LikesList({ navigation, route }) {

    const client = useContext(ApolloContext);
    const [likes, setLikes] = useState([]);


    const realTime = useRealTime() ; 
    const [firstFetch, setFirstFetch] = useState(true);
    const [loading, setLoading] = useState(false);
    const [end, setEnd] = useState(false);

    
    const themeContext = useContext(ThemeContext);
    const styles = themeContext.getTheme() == "light" ? lightStyles : darkStyles; 

    
    useEffect(() => {

        if (!route || !route.params || !route.params.notificationData) 
            return ; 
        const notificationData = route.params.notificationData;

        if (notificationData && notificationData.post) {

         
            const post = JSON.parse(notificationData.post);

            if (post.type != "reel")

                navigation.navigate("ViewPosts", {
                    getPosts: () => {
                        return getPostById(post.id)
                    },
                    title: "الأسهم",
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
        }

    }, [route])

    const loadNotfications = async (offset) => {
        client.query({
            query: gql`
            query GetLikePostNotification($offset: Int!, $limit: Int!) {
                getLikePostNotification(offset: $offset, limit: $limit) {
                  like {
                    createdAt
                    id
                    user {
                      id name lastname 
                      profilePicture {
                        id path 
                      }
                    }
                    post {
                      createdAt
                      id
                      likes
                      userId 
                      media {
                        id
                        path
                      }
                      reel {
                        thumbnail {
                          id
                          path
                        }
                      }
                      type
                      title
                    }
                  }
                }
              }
            ` ,
            variables: {
                offset: offset,
                limit: LIMIT
            }
        }).then(response => {



            if (response && response.data) {

                var newLikes = response.data.getLikePostNotification;

                if (newLikes.length < LIMIT)
                    setEnd(true);

                setLikes([...likes.filter(like => like.type != "loading"), ...newLikes]);

            }

            setFirstFetch(false);
            setLoading(false);

        }).catch(error => {
            setFirstFetch(false);
            setLoading(false);

        })

    }

    useEffect(() => {
        setLikes([]);
        setFirstFetch(true);
        loadNotfications(likes.filter(like => like.type != "loading").length);
    }, []);



    useEffect(() => {
        if (loading)
            loadNotfications(likes.filter(like => like.type != "loading").length);
    }, [loading])

    useEffect(() => { 


        const onNewLike = ( newLike ) => {
            const index = likes.findIndex(like => like.like.post.id == newLike.post.id) ; 
            if ( index < 0) {
                setLikes([{like : newLike} , ...likes]) ; 
            }else{ 
                console.log("push tp the top")
                likes.splice(index ,1 ) ; 
                setLikes([{like : newLike} , ...likes]) ; 
            }
        } ; 


        realTime.addListener("NEW_LIKE" , onNewLike) ; 


        return () => { 
            realTime.removeListener("NEW_LIKE" , onNewLike) ; 
        }



    } , [likes])

    const keyExtractor = useCallback((item, index) => {
        return index
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


    const openPost = useCallback((post) => {


        if (post.type != "reel")

            navigation.navigate("ViewPosts", {
                getPosts: () => {
                    return getPostById(post.id)
                },
                title: "الأسهم",
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
    }, [])


    const renderItem = useCallback(({ item }) => {

        if (item.type == "loading")
            return <LoadingActivity style={{ height: 56 }} />


        var imageSource = null;
        if (item.like.post.type == "image" && item.like.post.media.length >= 1)
            imageSource = getMediaUri(item.like.post.media[0].path);


        if (item.like.post.type == "reel")
            imageSource = getMediaUri(item.like.post.reel.thumbnail.path);



        const fullname = `${item.like.user.name} ${item.like.user.lastname}`;
        var postType = "منشورك";

        if (item.like.post.type == "image")
            postType = "صورتك";
        else if (item.like.post.type == "reel")
            postType = "الريلز الخاصة بك";


        var otherLikers = "";

        if (item.like.post.likes == 2)
            otherLikers = "و مستخدم آخر";
        else if (item.like.post.likes > 2)
            otherLikers = `و ${item.like.post.likes - 1} اخرين`




        return (
            <TouchableOpacity style={styles.notification} onPress={() => openPost(item.like.post)}>
                {
                    item.like.user.profilePicture &&
                    <Image source={{ uri: getMediaUri(item.like.user.profilePicture.path) }} style={styles.userImage} />
                }
                {
                    !item.like.user.profilePicture &&
                    <Image source={require("../../../assets/illustrations/gravater-icon.png")} style={styles.userImage} />
                }
                {
                    <Text style={styles.text} numberOfLines={2} ellipsizeMode="tail">
                        ساهم <Text style={styles.bold}>{fullname}</Text> في {postType} {otherLikers}
                    </Text>

                }
                {
                    imageSource &&
                    <Image style={styles.image} source={{ uri: imageSource }} />
                }
                {
                    !imageSource &&
                    <View style={styles.image}>

                    </View>
                }

            </TouchableOpacity>
        )
    }, [ styles]);


    const reachEnd = useCallback(() => {


        if (!loading && !end && !firstFetch) {
            setLikes([...likes, { id: 0, type: "loading" }])
            setLoading(true);
        }

    }, [loading, likes, end, firstFetch])


    return (
        <View style={styles.container}>
            {
                !firstFetch &&
                <FlatList
                    data={likes}
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
    list: {
        flex: 1,
        marginBottom: 64,
    },
    notification: {
        flexDirection: "row-reverse",
        justifyContent: "space-between",
        alignItems: "center",
        marginTop: 16,
        paddingHorizontal: 16
    },
    text: {
        flex: 1,
        color: "#666",
        fontSize: 12,
        fontFamily: textFonts.regular,
        lineHeight: 26,
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
        fontFamily: textFonts.semiBold,
        color: "#212121"
    },
});

const darkStyles = {
    ...lightStyles,
    text: {
        
        
        
        flex: 1,
        color: "#666",
        fontSize: 12,
        fontFamily: textFonts.regular,
        lineHeight: 26,
        color: darkTheme.secondaryTextColor,
    } , 
    bold: {
        fontFamily: textFonts.semiBold,
        color: darkTheme.textColor
    },

}