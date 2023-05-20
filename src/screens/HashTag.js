import { useCallback, useContext, useEffect, useState } from "react";
import { View, Text, StyleSheet, Image, FlatList } from "react-native";
import HashTagHeader from "../components/Cards/HashTagHeader";
import { ApolloContext } from "../providers/ApolloContext";
import { gql } from "@apollo/client";
import LoadingPost from "../components/Cards/loadings/LoadingPost";
import Post from "../components/Cards/post/Post";

const LOADING_COMPONENTS = [{ id: 0, type: "loading" }, { id: 0, type: "loading" }, { id: 0, type: "loading" }];
const LIMIT = 10;

export default function HashTag({ route , navigation }) {

    const { hashtagName } = route?.params
    const [posts, setPosts] = useState([]);
    const client = useContext(ApolloContext);

    const [firstFetch, setFirstFetch] = useState(true);
    const [loading, setLoading] = useState(false);
    const [end, setEnd] = useState(false);


    const load_posts = async ( previousPosts) => {

        var offset = previousPosts.length ; 

        client.query({
            query: gql`
            query GetHashTagPosts($name: String!, $offset: Int!, $limit: Int!) {
                getHashTagPosts(name: $name, offset: $offset, limit: $limit) {           
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
                        thumbnail { 
                            id  path 
                        } 
                        views
                    }
          
                }
            }
            ` ,

            variables: {
                name: hashtagName,
                offset: offset,
                limit: LIMIT
            }
        }).then(response => {

            var newPosts = response.data.getHashTagPosts

            setPosts([...previousPosts, ...newPosts]);


            if (newPosts.length < LIMIT)
                setEnd(true);

            setFirstFetch(false);
            setLoading(false);

        })
    };



    useEffect(() => {
        setPosts([...LOADING_COMPONENTS]);
        load_posts([]);
    }, [hashtagName]) ; 


    useEffect(() => {
        if (loading) { 
            load_posts(posts.filter(post => post.type != "loading"));
        }
    }, [loading])



    const reachEnd = useCallback(() => {

        if (!loading && !end && !firstFetch) {
            setPosts([...posts, { type: "loading" }])
            setLoading(true);

        }

    }, [loading, posts, end, firstFetch])

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
    }, [posts, navigation]);


    return (
        <View style={styles.container}>
            <HashTagHeader hashtagName={hashtagName} />
            <FlatList
                onEndReached={reachEnd}
                onEndReachedThreshold={0.2}
                data={posts}
                keyExtractor={keyExtractor}
                renderItem={renderItem}
                maxToRenderPerBatch={2}
                initialNumToRender={2}

            />
        </View>
    )

};


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "white"
    }
})