import { useCallback, useContext, useEffect, useState } from "react";
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity } from "react-native";

import { ApolloContext } from "../../../providers/ApolloContext";
import { gql } from "@apollo/client";
import LoadingActivity from "../post/loadingActivity";
import { textFonts } from "../../../design-system/font";
import { AuthContext } from "../../../providers/AuthContext";
import ThemeContext from "../../../providers/ThemeContext";
import darkTheme from "../../../design-system/darkTheme";
const LIMIT = 10;

export default function SearchUsers({ query, navigation }) {

    const client = useContext(ApolloContext);
    const [users, setUsers] = useState([]);


    const [firstFetch, setFirstFetch] = useState(true);
    const [loading, setLoading] = useState(false);
    const [end, setEnd] = useState(false);


    const [currentUser, setCurrentUser] = useState(null);
    const auth = useContext(AuthContext);


    const themeContext = useContext(ThemeContext);
    const styles = themeContext.getTheme() == "light" ? lightStyles : darkStyles;


    useEffect(() => {



        if (!currentUser) {
            (async () => {
                const userAuth = await auth.getUserAuth();
                if (userAuth) {
                    setCurrentUser(userAuth.user);

                }
            })();
        }
    }, [])

    const search_users = async (query, previousSearch) => {
        var offset = previousSearch.length;
        client.query({
            query: gql`
            query SearchUser($query: String!, $limit: Int!, $offset: Int!) {
                searchUser(query: $query, limit: $limit, offset: $offset) {
                    id name lastname username 
                    profilePicture {
                        id path 
                    }
                }
            }` ,
            variables: {
                query: query,
                offset,
                limit: LIMIT
            }
        }).then(response => {

            var newSearch = response.data.searchUser;
            setUsers([...previousSearch, ...newSearch])

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
            search_users(query, [])
        else
            search_users("", []);
    }, [query]);

    useEffect(() => {
        if (loading)
            search_users(query, users.filter(user => user.type != "loading") );
    }, [loading])

    const openProfile = useCallback((userId) => {
        if (userId == currentUser.id) {
            navigation.navigate("AccountStack", { screen: "MyProfile" })

        } else {
            navigation.navigate("Profile", { userId: userId });
        }
    }, [navigation, currentUser])


    const renderItem = useCallback(({ item, index }) => {
        if (item.type == "loading") {
            return <LoadingActivity style={{ height: 56 }} />
        }
        return (
            <TouchableOpacity style={styles.user} onPress={() => openProfile(item.id)}>
                <View style={styles.infoSection}>
                    <Text style={styles.fullname}>
                        {item.name} {item.lastname}
                    </Text>
                    <Text style={styles.username}>
                        @{item.username}
                    </Text>
                </View>
                {
                    item.profilePicture &&
                    <Image source={{ uri: getMediaUri(item.profilePicture.path) }} style={styles.userImage} />
                }
                {
                    !item.profilePicture &&
                    <Image source={require("../../../assets/illustrations/gravater-icon.png")} style={styles.userImage} />

                }
            </TouchableOpacity>
        )

    }, [navigation, currentUser , styles]);




    const keyExtractor = useCallback((item, index) => {
        return item.id;
    }, [])



    const reachEnd = useCallback(() => {

        if (!loading && !end && !firstFetch) {
            setUsers([...users, { id: 0, type: "loading" }])
            setLoading(true);
        }
    }, [loading, users, end, firstFetch]);


    return (
        <View style={styles.container} >
            {
                !firstFetch &&
                <FlatList
                    data={users}
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
        flex: 1 , 
        padding : 16 , 
        paddingBottom : 0
    },
    user: {
        flexDirection: "row",
        alignItems: "center"
    },

    userImage: {
        width: 42,
        height: 42,
        borderRadius: 48
    },

    infoSection: {
        flex: 1,
        alignItems: "flex-end",
        paddingRight: 16
    },
    fullname: {
        fontFamily: textFonts.semiBold,
        fontSize: 12
    },
    username: {
        fontFamily: textFonts.regular,
        color: "#888",
        fontSize: 12
    }

}); 


const darkStyles = { 
    ...lightStyles , 
    username: {
        fontFamily: textFonts.regular,
        color: darkTheme.secondaryTextColor,
        fontSize: 12
    } , 
    fullname: {
        fontFamily: textFonts.semiBold,
        fontSize: 12 , 
        color: darkTheme.textColor,
        
    },
}