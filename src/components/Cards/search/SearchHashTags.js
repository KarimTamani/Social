import { useCallback, useContext, useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { ApolloContext } from "../../../providers/ApolloContext";
import { FlatList } from "react-native-gesture-handler";
import LoadingActivity from "../post/loadingActivity";
import { textFonts } from "../../../design-system/font";
import { gql } from "@apollo/client";
import ThemeContext from "../../../providers/ThemeContext";
import darkTheme from "../../../design-system/darkTheme";

const LIMIT = 10 ;
export default function SearchHashTags({ query , navigation }) {
    const client = useContext(ApolloContext);
    const [hashtags, setHashtags] = useState([]);



    const themeContext = useContext(ThemeContext);
    const styles = themeContext.getTheme() == "light" ? lightStyles : darkStyles;

    const [firstFetch, setFirstFetch] = useState(true);
    const [loading, setLoading] = useState(false);
    const [end, setEnd] = useState(false);

    const search_hashtags = async (query, previousSearch) => {
        var offset = previousSearch.length;
        client.query({
            query: gql`
        
            query SearchHashTag($name: String!, $offset: Int!, $limit: Int!) {
                searchHashTag(name: $name, offset: $offset, limit: $limit) {
                    id name numPosts 
                }
            }
          ` ,
            variables: {
                name: query,
                offset,
                limit: LIMIT
            }
        }).then(response => {

            var newSearch = response.data.searchHashTag;
            setHashtags([...previousSearch, ...newSearch])

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

        setFirstFetch(true) ; 
        setEnd(false) ; 
        setLoading(false) ; 
        if (query)
            search_hashtags(query, [])
        else
        search_hashtags("", []);
    }, [query]);


    useEffect(() => {
        if (loading)
            search_hashtags(query, hashtags.filter(hashtag => hashtag.type != "loading") );
    }, [loading])

   

    const openHashtag = useCallback((hashtag) => {
        navigation.navigate("HashTag" , {
            hashtagName :  hashtag
        })
    } , [navigation]) 



    const renderItem = useCallback(({ item, index }) => {
        if (item.type == "loading") {
            return <LoadingActivity style={{ height: 56 }} />
        }
        return (
            <TouchableOpacity style={styles.hashResult} onPress={() => openHashtag(item.name)}>
                <Text style={[styles.hashtag, styles.hashtagName]}>
                    {item.name}
                </Text>
                <Text style={styles.numPosts}>
                    عدد المنشورات {item.numPosts}
                </Text>
            </TouchableOpacity>
        )

    }, [navigation , styles ]);




    const keyExtractor = useCallback((item, index) => {
        return item.id;
    }, []) ; 


    const reachEnd = useCallback(() => {

        if (!loading && !end && !firstFetch) {
            setHashtags([...hashtags, { id: 0, type: "loading" }])
            setLoading(true);
        }
    }, [loading, hashtags , end, firstFetch]);


    return (
        <View style={styles.container} >
         {
                !firstFetch &&
                <FlatList
                    data={hashtags}
                    keyExtractor={keyExtractor}
                    renderItem={renderItem}
                    style={styles.list}
                    onEndReached={reachEnd}
                    onEndReachedThreshold={0.5}
                    ItemSeparatorComponent={<View style={styles.separator}></View>}
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
    } , 
    
    
    hashResult: {
        paddingVertical: 4,
        paddingHorizontal : 16 , 
        alignItems: "flex-end"
    },
    hashtagName: {
        fontFamily: textFonts.bold,
        fontSize: 12
    },
    numPosts: {
        color: "#888",
        fontFamily: textFonts.regular,
        fontSize: 10
    },
    separator: {
        height: 1,
        backgroundColor: "#eee"
    } , 
    hashtag: {
        color: "#1A6ED8"
    },
}) ; 


const darkStyles = { 
    ...lightStyles , 
    separator: {
        height: 1,
        backgroundColor: darkTheme.borderColor
    } , 
    numPosts: {
        color: darkTheme.secondaryTextColor,
        fontFamily: textFonts.regular,
        fontSize: 10
    },
}