import { View, Text, StyleSheet, FlatList } from "react-native";
import Header from "../components/Cards/Header";
import { useCallback, useContext, useEffect, useState } from "react";
import { ApolloContext } from "../providers/ApolloContext";
import { gql } from "@apollo/client";
import LoadingPost from "../components/Cards/loadings/LoadingPost";
import Post from "../components/Cards/post/Post";
import { useEvent } from "../providers/EventProvider";
import ThemeContext from "../providers/ThemeContext";
import darkTheme from "../design-system/darkTheme";


const LOADING_COMPONENTS = [{ id: 0, type: "loading" }, { id: 0, type: "loading" }, { id: 0, type: "loading" }];
const LIMIT = 10;
export default function Favorites({ navigation }) {

    const [favorites, setFavorites] = useState([...LOADING_COMPONENTS]);
    const client = useContext(ApolloContext);
    const [firstFetch, setFirstFetch] = useState(true);
    const [loading, setLoading] = useState(false);
    const [end, setEnd] = useState(false);
    const event = useEvent() ; 


        
    const themeContext = useContext(ThemeContext);
    const styles = themeContext.getTheme() == "light" ? lightStyles : darkStyles;

    const load_favorites = async (offset) => {

        client.query({
            query: gql`
            
            query Query($offset: Int!, $limit: Int!) {
                getFavorites(offset: $offset, limit: $limit) {
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
                    user { 
                        id
                        name 
                        lastname 
                        profilePicture { 
                            id path 
                        } 
                        validated 
                    }
                    reel { 
                        id
                        thumbnail { 
                            id  path 
                        } 
                        views
                    }
                }
            }
            
            ` ,

            variables: {
                offset: offset,
                limit: LIMIT
            }
        }).then(response => {

            var newFavorites = response.data.getFavorites

            setFavorites([...favorites.filter(post => post.type != "loading"), ...newFavorites]);


            if (newFavorites.length < LIMIT)
                setEnd(true);

            setFirstFetch(false);
            setLoading(false);

        })
    }
    useEffect(() => {

        setFavorites([...LOADING_COMPONENTS]);
        load_favorites(0);

    }, []);


    useEffect(() => {
        if (loading) {
            const offset = favorites.filter(post => post.type != "loading").length;
            load_favorites(offset);
        }
    }, [loading])



    useEffect(() => {
        const updatePostLikes = (postId, value, numLikes) => {


 

            const index = favorites.findIndex(post => post.type != "loading"  &&  post.id == postId);
            if (index >= 0) {
                var newPostsState = [...favorites];
                newPostsState[index] = {
                    ...favorites[index],
                    liked: value,
                    likes: numLikes
                };
                setFavorites(newPostsState) ; 

            }

        }  
        const updatePostComments = (postId, value) => {
            const index = favorites.findIndex(post => post.type != "loading"  && post.id == postId);
          
            if (index >= 0) {

                console.log("updating num of comments " , value) ; 

                var newPostsState = [...favorites];
                newPostsState[index] = {
                    ...favorites[index],
                    numComments: value,
                };
                setFavorites(newPostsState);
            }
        }

        const deletePost = (deletedPost) => {
            const index = favorites.findIndex(post => post.type != "loading"  && post.id == deletedPost.id);
            if (index >= 0) {
                var newPostsState = [...favorites];
                newPostsState.splice(index, 1);
                setFavorites(newPostsState);
            }
        }


        const editPost = ( editablePost) => { 
            const index = favorites.findIndex(post => post.type != "loading" && post.id == editablePost.id);
            if (index >= 0) { 
                var newPostsState = [...favorites];
                newPostsState[index] = {
                    ...editablePost
                } 
      
                setFavorites(newPostsState);
            }
        }

        event.addListener("update-post-likes", updatePostLikes); 
        event.addListener("update-post-comments", updatePostComments);
        event.addListener("delete-post", deletePost); 
        event.addListener("edit-post" ,editPost ) ; 

        return() => { 
            event.removeListener("update-post-likes", updatePostLikes);
            event.removeListener("update-post-comments", updatePostComments);
            event.removeListener("delete-post", deletePost);
            event.removeListener("edit-post" ,editPost ) ; 
        }
    } , [event , favorites])

    const reachEnd = useCallback(() => {

        if (!loading && !end && !firstFetch) {
            setFavorites([...favorites, { type: "loading" }])
            setLoading(true);

        }

    }, [loading, favorites, end, firstFetch])

    const keyExtractor = useCallback((item, index) => {
        if (item.type == "loading") {
            return "loading-" + index;
        } else
            return item.id;
    }, []);

    const renderItem = useCallback(({ item, index }) => {
        if (item.type == "loading") {
            return <LoadingPost />
        } else
            return <Post navigation={navigation} post={item} />
    }, [favorites, navigation]);

    return (
        <View style={styles.container}>
            <Header
                title={"المحفوضات"}
                navigation={navigation}
            />
            <FlatList
                onEndReached={reachEnd}
                onEndReachedThreshold={0.2}
                data={favorites}
                keyExtractor={keyExtractor}
                renderItem={renderItem}
                maxToRenderPerBatch={2}
                initialNumToRender={2}

            />
        </View>
    )
}



const lightStyles = StyleSheet.create({
    container: {
        flex: 1
    }
})


const darkStyles = { 
    ...lightStyles , 
    container : { 
        flex : 1 , 
        backgroundColor : darkTheme.secondaryBackgroundColor
    }
}