import { useCallback, useContext, useEffect, useState } from "react";
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from "react-native";
import Post from "../components/Cards/post/Post";
import { AntDesign } from '@expo/vector-icons';
import { textFonts } from "../design-system/font";
import Header from "../components/Cards/Header";
import ThemeContext from "../providers/ThemeContext";
import darkTheme from "../design-system/darkTheme";
import LoadingActivity from "../components/Cards/post/loadingActivity";

export default function ViewPosts({ navigation, route }) {
    const { getPosts, focusPostId, title } = route.params;
    const [posts, setPosts] = useState();
    const [loading, setLoading] = useState(true);



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