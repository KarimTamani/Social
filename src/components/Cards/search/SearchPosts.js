import { useCallback, useContext, useEffect, useState } from "react";
import { View, Text, StyleSheet, FlatList } from "react-native";
import { ApolloContext } from "../../../providers/ApolloContext";
import { gql } from "@apollo/client";
import LoadingActivity from "../post/loadingActivity";
import LoadingPost from "../loadings/LoadingPost";
import Post from "../post/Post";
import { useEvent } from "../../../providers/EventProvider";
import ThemeContext from "../../../providers/ThemeContext";
import darkTheme from "../../../design-system/darkTheme";

const LIMIT = 4;
export default function SearchPosts({ type, query, navigation }) {

    const client = useContext(ApolloContext);
    const [posts, setPosts] = useState([]);


    const [firstFetch, setFirstFetch] = useState(true);
    const [loading, setLoading] = useState(false);
    const [end, setEnd] = useState(false);



    const themeContext = useContext(ThemeContext);
    const styles = themeContext.getTheme() == "light" ? lightStyles : darkStyles;

    const event = useEvent();
    const search_posts = async (query, previousSearch) => {
        var offset = previousSearch.length;
        client.query({
            query: gql`
            query SearchPost($type: String!, $offset: Int!, $limit: Int!, $query: String) {
                searchPost(type: $type, offset: $offset, limit: $limit, query: $query) {
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
                query: query,
                offset,
                limit: LIMIT,
                type
            }
        }).then(response => {

            var newSearch = response.data.searchPost;
            setPosts([...previousSearch, ...newSearch])

            if (newSearch.length < LIMIT)
                setEnd(true);

            setLoading(false);
            setFirstFetch(false);

        }).catch(error => {
            setLoading(false);
            setFirstFetch(false);
        })

    }

    useEffect(() => {

        setFirstFetch(true);
        setEnd(false);
        setLoading(false);
        if (query)
            search_posts(query, [])
        else
            search_posts("", []);
    }, [query]);


    useEffect(() => {

        if (loading)
            search_posts(query, posts.filter(post => post.type != "loading"));
    }, [loading])



    const renderItem = useCallback(({ item, index }) => {
        if (item.type == "loading")
            return <LoadingPost />
        return (
            <Post post={item} navigation={navigation} />
        )
    }, [])

    const keyExtractor = useCallback((item, index) => {
        return item.id;
    }, [])



    const reachEnd = useCallback(() => {

        if (!loading && !end && !firstFetch) {

            setPosts([...posts, { id: 0, type: "loading" }])
            setLoading(true);
        }
    }, [loading, posts, end, firstFetch]);



    useEffect(() => {

        const userBlocked = (user) => {
            setPosts(posts.filter(post => post.type == "loading" || post.user.id != user.id));
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


        if (type == "reel") {
            event.addListener("update-post-likes", updatePostLikes);
            event.addListener("update-post-comments", updatePostComments);
        }


        event.addListener("blocked-user", userBlocked);
        return () => {
            event.removeListener("update-post-likes", updatePostLikes);
            event.removeListener("update-post-comments", updatePostComments);
            event.removeListener("blocked-user", userBlocked);

        }




    }, [type, event, posts]);


    useEffect(() => {
        const deletePost = (deletedPost) => {


            const index = posts.findIndex(post => post.type != "loading" && post.id == deletedPost.id);
            if (index >= 0) {
                var newPostsState = [...posts];
                newPostsState.splice(index, 1);
                setPosts(newPostsState);

            }


        }


        const editPost = (editablePost) => {

            const index = posts.findIndex(post => post.type != "loading" && post.id == editablePost.id);
            if (index >= 0) {

                var newPostsState = [...posts];
                newPostsState[index] = {
                    ...editablePost
                }

                setPosts(newPostsState);
            }

        }

        event.addListener("delete-post", deletePost);
        event.addListener("edit-post", editPost);

        return () => {
            event.removeListener("delete-post", deletePost);
            event.removeListener("edit-post", editPost);
        }
    }, [posts]);


    return (
        <View style={styles.container} >
            {
                !firstFetch &&
                <FlatList
                    data={posts}
                    keyExtractor={keyExtractor}
                    renderItem={renderItem}
                    style={styles.list}
                    onEndReached={reachEnd}
                    onEndReachedThreshold={0.5}
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
        flex: 1,
        backgroundColor: "#eee"
    }
});


const darkStyles = {
    container: {
        flex: 1,
        backgroundColor: darkTheme.secondaryBackgroundColor
    }
}