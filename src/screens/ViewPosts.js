import { useCallback, useContext, useEffect, useState } from "react";
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from "react-native";
import Post from "../components/Cards/post/Post";
import { AntDesign } from '@expo/vector-icons';
import { textFonts } from "../design-system/font";
import Header from "../components/Cards/Header";
import ThemeContext from "../providers/ThemeContext";
import darkTheme from "../design-system/darkTheme";
import LoadingActivity from "../components/Cards/post/loadingActivity";
import { useEvent } from "../providers/EventProvider";

export default function ViewPosts({ navigation, route }) {
    const { getPosts, focusPostId, title } = route.params;
    const [posts, setPosts] = useState();
    const [loading, setLoading] = useState(true);



    const event = useEvent() ; 



    useEffect(() => {
        setLoading(true) ; 
        (async () => {

            const postsData = await getPosts();



            if (focusPostId) {
                const findIndex = postsData.findIndex((post) => post.id == focusPostId);
                const focusPost = postsData[findIndex];
                postsData.splice(findIndex, 1);
                postsData.splice(0, 0, focusPost)
            }

            setPosts(postsData);
            setLoading (false) ; 

        })();
    }, [])

    // a callback to render the home page 
    // contains stories at the first section and list of posts 
    const renderItem = useCallback(({ item, index }) => {

        return (
            <Post navigation={navigation} post={item} />
        )
    }, []);

    const keyExtractor = useCallback((item) => {
        return item.id;
    }, []);


    useEffect(() => {
        const deletePost = (deletedPost) => {
            const index = posts.findIndex(post => post.type != "loading"  && post.id == deletedPost.id);
            if (index >= 0) {
                var newPostsState = [...posts];
                newPostsState.splice(index, 1);
                setPosts(newPostsState);
            }
        }

        const editPost = ( editablePost) => { 
            const index = posts.findIndex(post => post.type != "loading" && post.id == editablePost.id);
            if (index >= 0) { 
                var newPostsState = [...posts];
                newPostsState[index] = {
                    ...editablePost
                } 
      
                setPosts(newPostsState);
            }
        }

        const userBlocked = (user) => {
            setPosts( posts.filter(post => post.type == "loading" || post.type == "stories" || post.type == "reels" || post.user.id != user.id) );
        }


        event.addListener("delete-post", deletePost); 
        event.addListener("edit-post" ,editPost ) ; 
        event.addListener("blocked-user", userBlocked);

        return () => {
            event.removeListener("delete-post", deletePost);
            event.removeListener("edit-post" ,editPost ) ; 
            event.removeListener("blocked-user", userBlocked);
        }
    } , [posts])


    const themeContext = useContext(ThemeContext);
    const styles = themeContext.getTheme() == "light" ? lightStyles : darkStyles;


    return (
        <View style={styles.container}>

            <Header
                title={title}
                navigation={navigation}
            />
            {
                loading &&
                <LoadingActivity />
            }
            {
                !loading &&
                <FlatList
                    data={posts}
                    keyExtractor={keyExtractor}
                    renderItem={renderItem}
                    maxToRenderPerBatch={2}
                    initialNumToRender={2} />

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
    ...lightStyles,
    container: {
        flex: 1,
        backgroundColor: darkTheme.secondaryBackgroundColor
    },
}