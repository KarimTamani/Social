import { gql } from "@apollo/client";
import React, { useCallback, useContext, useEffect, useState } from "react";
import { View, Text, StyleSheet, Image, FlatList, Dimensions, TouchableOpacity } from "react-native";
import { getMediaUri } from "../../../api";
import darkTheme from "../../../design-system/darkTheme";
import { ApolloContext } from "../../../providers/ApolloContext";
import ThemeContext from "../../../providers/ThemeContext";
import LoadingActivity from "../post/loadingActivity";
import { useEvent } from "../../../providers/EventProvider";
import Skelton from "../loadings/Skelton";
import { useFocusEffect } from "@react-navigation/native";

const WIDTH = Dimensions.get("screen").width;
const LIMIT = 12;


export default function ProfileImages({ navigation, route }) {

    const [images, setImages] = useState([]);
    const [posts, setPosts] = useState([]);
    const [firstFetch, setFirstFetch] = useState(true);
    const { userId } = route.params;


    const themeContext = useContext(ThemeContext);
    const styles = themeContext.getTheme() == "light" ? lightStyles : darkStyles;
    const client = useContext(ApolloContext);

    const [loading, setLoading] = useState(false);
    const [end, setEnd] = useState(false);

    const event = useEvent();


    const load_data = async () => {
        return client.query({
            query: gql`

            query GET_IMAGES($userId : ID! , $offset : Int! , $limit : Int! ){
                getUserPosts(userId: $userId, postType: "image", offset: $offset , limit: $limit) {
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
            }` ,
            variables: {
                userId: userId,
                offset: posts.length,
                limit: LIMIT
            }
        })
    }

    // update the content height whenever we fcus on this page 
    useFocusEffect(useCallback(() => {
        event.emit("update-height", Math.ceil(images.length / 3) * (WIDTH / 3 + 2));
    }, [images]))


    const pipePostsToImages = (newPosts, addTop = false) => {

        var imageSources = [...(images).filter(image => image.type != "loading")];
        for (let index = 0; index < newPosts.length; index++) {
            if (!addTop)
                imageSources = [...imageSources, ...newPosts[index].media.map((image) => ({
                    id: newPosts[index].id,
                    uri: getMediaUri(image.path)
                }))];
            else
                imageSources = [...newPosts[index].media.map((image) => ({
                    id: newPosts[index].id,
                    uri: getMediaUri(image.path)
                })), ...imageSources];

        };
        return imageSources;
    }


    useEffect(() => {

        load_data().then(response => {
            var newPosts = response.data.getUserPosts;
            setPosts([...posts, ...newPosts]);
            var imageSource = pipePostsToImages(newPosts);
            setImages(imageSource);
            if (newPosts.length < LIMIT)
                setEnd(true);
            setFirstFetch(false)
        }).catch(error => {
            console.log(error);
        });


    }, []);

    useEffect(() => {
        const addNewPost = (newPost) => {
            if (newPost.type == "image") {
                setPosts([...posts, newPost]);
                var imageSource = pipePostsToImages([newPost], true);
                setImages(imageSource);
            }
        }


        const updatePostLikes = (postId, value, numLikes) => {




            const index = posts.findIndex(post => post.type != "loading" && post.id == postId);


            if (index >= 0) {


                var newPostsState = [...posts];
                newPostsState[index] = {
                    ...posts[index],
                    liked: value,
                    likes: numLikes
                };

                setPosts(newPostsState);

            }

        }
        const updatePostFavorite = (postId, value) => {
            const index = posts.findIndex(post => post.type != "loading" && post.id == postId);

            if (index >= 0) {
                var newPostsState = [...posts];
                newPostsState[index] = {
                    ...posts[index],
                    isFavorite: value,
                };
                setPosts(newPostsState);
            }

        }
        const updatePostComments = (postId, value) => {
            const index = posts.findIndex(post => post.type != "loading" && post.id == postId);
            if (index >= 0) {
                var newPostsState = [...posts];
                newPostsState[index] = {
                    ...posts[index],
                    numComments: value,
                };
                setPosts(newPostsState);
            }
        }
        const updateProfile = (profile) => {
            var newState = posts.map(post => {
                post.user = profile;
                return post;
            });
            setPosts([...newState]);
        };

        const deletePost = (deletedPost) => {
            if (deletedPost.type == "image") {
                const index = posts.findIndex(post => post.type != "loading" && post.id == deletedPost.id);
                if (index >= 0) {
                    var newPostsState = [...posts];
                    newPostsState.splice(index, 1);
                    setPosts(newPostsState);
                    setImages([...images].filter(image =>  image.id != deletedPost.id));
                }
            }
        }
        const editPost = (editablePost) => {

            if (editablePost.type == "image") {
                var index = posts.findIndex(post => post.type != "loading" &&  post.id == editablePost.id);
                if (index >= 0) {

                    var newPostsState = [...posts];
                    newPostsState.splice(index, 1, editablePost);
                    setPosts(newPostsState);

                    var newImagesState = [...images] ; 
                    index = images.findIndex(image => image.type != "loading" && image.id == editablePost.id) ; 

                    newImagesState = newImagesState.filter(image => image.type != "loading" && image.id != editablePost.id) ; 

                    newImagesState.splice (index , 0 , ...editablePost.media.map((image) => ({
                        id: editablePost.id,
                        uri: getMediaUri(image.path)
                    }))) ;
                
                    
                    setImages ( newImagesState ) ; 
                }
            }
        }


        event.addListener("update-post-likes", updatePostLikes);
        event.addListener("update-post-comments", updatePostComments);
        event.addListener("update-post-favorite", updatePostFavorite);
        event.addListener("update-profile", updateProfile);
        event.addListener("new-post", addNewPost);
        event.addListener("delete-post", deletePost);
        event.addListener("edit-post", editPost);


        return () => {
            event.removeListener("new-post", addNewPost);
            event.removeListener("update-profile", updateProfile);
            event.removeListener("update-post-likes", updatePostLikes);
            event.removeListener("update-post-comments", updatePostComments);
            event.removeListener("update-post-favorite", updatePostFavorite);
            event.removeListener("delete-post", deletePost);
            event.removeListener("edit-post", editPost);
        }
    }, [posts, images])

    const openViewPosts = useCallback((postId) => {
        navigation.navigate("ViewPosts", {
            getPosts: () => posts,
            focusPostId: postId,
            title: "الصور"
        })
    }, [navigation, posts]);

    const renderItem = useCallback(({ item }) => {
        if (item.type == "loading") {
            return <LoadingActivity size={26} style={styles.imageView} color='#aaaa' />
        } else
            return (
                <TouchableOpacity style={styles.imageView} onPress={() => openViewPosts(item.id)}>
                    <Image source={item} style={styles.image} />
                </TouchableOpacity>
            )
    }, [images, posts]);

    const keyExtractor = useCallback((item, index) => {
        return `${item.id}-${index}`;
    }, [images]);



    useEffect(() => {
        if (loading) {
            load_data().then(response => {
                var newPosts = response.data.getUserPosts;
                setPosts([...posts, ...newPosts]);



                var imageSource = pipePostsToImages(newPosts);

                setImages(imageSource);
                if (newPosts.length < LIMIT)
                    setEnd(true);

                setLoading(false);
            }).catch(error => {
                console.log(error);
            });
        }
    }, [loading])

    // whenever we reach the end of the list 
    // set the state to be loading and increase the offset 
    const reachEnd = useCallback(() => {

        if (!loading && !end) {

            var loadingComponents = [];
            const loadingLength = images.length % 3 == 0 ? 3 : (images.length % 3 + 3);

            for (var index = 0; index < loadingLength; index++) {
                loadingComponents.push({
                    id: 0,
                    type: "loading"
                })
            }
            setImages([...images, ...loadingComponents]);
            setLoading(true);

        }

    }, [loading, images, end]);




    return (
        <View style={styles.container}>
            {
                !firstFetch &&
                <FlatList
                    nestedScrollEnabled
                    data={images}
                    keyExtractor={keyExtractor}
                    renderItem={renderItem}
                    numColumns={3}
                    onEndReachedThreshold={0.4}
                    onEndReached={reachEnd}
                    maxToRenderPerBatch={10}
                    getItemLayout={(data, index) => (
                        { length: (WIDTH / 3), offset: (WIDTH / 3) * index, index }
                    )}

                />
            }
            {
                firstFetch &&

                <LoadingActivity size={26} style={[styles.imageView, { alignSelf: "center" }]} color='#aaaa' />
            }
        </View>
    )
}

const lightStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#eee",


    },
    imageView: {
        width: "33.33333%",

        height: WIDTH / 3,
        padding: 1
    },
    image: {
        width: "100%",
        height: "100%",
        resizeMode: "cover",

    }
})
const darkStyles = {
    ...lightStyles,
    container: {
        flex: 1,
        backgroundColor: darkTheme.secondaryBackgroundColor,

    }
}