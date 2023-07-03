import { useCallback, useContext, useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView, FlatList } from "react-native";
import darkTheme from "../../../design-system/darkTheme";
import { textFonts } from "../../../design-system/font";
import ThemeContext from "../../../providers/ThemeContext";
import SuggestedUser from "./SuggestedUser";
import { ApolloContext } from "../../../providers/ApolloContext";
import { gql } from "@apollo/client";
import LoadingSuggestions from "../loadings/LoadingSuggestions";
import { useEvent } from "../../../providers/EventProvider";
import LoadingActivity from "../../Cards/post/loadingActivity";
const LIMIT = 10;

export default function AccountSuggestions({ navigation }) {
    const themeContext = useContext(ThemeContext);
    const styles = themeContext.getTheme() == "light" ? lightStyles : darkStyles;

    const event = useEvent();
    const client = useContext(ApolloContext);
    const [users, setUsers] = useState([]);
    const [firstFetch, setFirstFetch] = useState(true);
    const [refrechFollowersHandler, setRefrechFollowersHandler] = useState(false);



    const [loading, setLoading] = useState(false);
    const [end, setEnd] = useState(false);

    const load_more_users = async (previousUsers) => {

        const offset = previousUsers.length;

        client.query({
            query: gql`
                query Login($offset: Int!, $limit: Int!) {
                    suggestUsers(offset: $offset, limit: $limit) {
                    id 
                    name 
                    lastname 
                    username 
                    isFollowed
                    profilePicture {
                        id path 
                    }
                    }
                }`,
            variables: {
                offset: offset,
                limit: LIMIT
            }
        }).then(response => {
            var newUsers = response.data.suggestUsers
            if (newUsers.length < LIMIT)
                setEnd(true);
            setUsers([...previousUsers, ...newUsers])
            setFirstFetch(false)
            setLoading(false);
        }).catch(error => {
            setFirstFetch(false);
            setLoading(false);
        })
    }

    useEffect(() => {
        setFirstFetch(true);
        setLoading(false);
        setEnd(false);
        load_more_users([]);
    }, []);

    useEffect(() => {
        if (loading) {
            load_more_users(users.filter(user => user.type != "loading"));
        }
    }, [loading])
    useEffect(() => {
        const handleFollowingStateChanged = ({ userId, state, sourcePage }) => {
            if (sourcePage == "suggest-users")
                return;

            if (users.length == 0) {
                if (refrechFollowersHandler)
                    clearTimeout(refrechFollowersHandler);

                setRefrechFollowersHandler(setTimeout(() => {
                    setFirstFetch(true)
                    load_more_users([]);
                }, 5000));
            }
            else {
                // check if the user exists in the users list and update it following state 
                const index = users.findIndex(user => user.id == userId);
                if (index >= 0) {
                    var cloneState = [...users];
                    cloneState[index] = {
                        ...cloneState[index],
                        isFollowed: state
                    };

                    setUsers(cloneState)
                }
            }
        }
        event.addListener("new-following", handleFollowingStateChanged);

        return () => {
            event.removeListener("new-following", handleFollowingStateChanged)
        }

    }, [users, refrechFollowersHandler])


    const renderItem = useCallback(({ item }) => {

        if (item.type == "loading")
            return (
                <LoadingActivity style={styles.loadingUser} />
            )

        return <SuggestedUser user={item} navigation={navigation} />
    }, [users]);

    const keyExtractor = useCallback((item, index) => {
        return item.id;
    }, [users]);


    const endReach = useCallback(() => {
        if (!firstFetch && !end && !loading) {



            setLoading(true);

            setUsers([...users, { id: 0, type: "loading" }])
        }

    }, [firstFetch, end, loading, users]);



    if (!firstFetch && users.length == 0)
        return (
            <View style={styles.emptyContainer}>
                <Text style={styles.emptyMessage}>
                    لا يوجد اي اقتاراحات حاليا
                </Text>
            </View>
        )

    if (!firstFetch)
        return (
            <View style={styles.container}>
                <Text style={styles.title}>
                    ربما تعرف
                </Text>
                <FlatList
                    data={users}
                    renderItem={renderItem}
                    keyExtractor={keyExtractor}
                    style={styles.list}
                    horizontal
                    onEndReached={endReach}
                />

            </View>
        )
    if (firstFetch)
        return (
            <View style={styles.container}>

                <Text style={styles.title}>
                    البحث عن متابعين
                </Text>
                <LoadingSuggestions />
            </View>
        )
};

const lightStyles = StyleSheet.create({
    container: {
    },
    list: {
        borderRadius: 6,

    },
    title: {
        fontFamily: textFonts.bold,
        marginBottom: 16,

    },
    emptyContainer: {
        backgroundColor: "#eee",
        height: 120,
        width: "100%",
        borderRadius: 16,
        alignItems: "center",
        justifyContent: "center",
        marginTop: 16
    },
    emptyMessage: {
        fontFamily: textFonts.bold,
        fontWeight: "bold",
        color: "#555", fontSize: 12
    },
    loadingUser: {
        width: 120
    }
});


const darkStyles = {
    ...lightStyles,
    title: {
        fontFamily: textFonts.bold,
        marginBottom: 16,
        color: darkTheme.textColor
    },
    emptyContainer: {
        backgroundColor: darkTheme.backgroudColor,
        height: 120,
        width: "100%",
        borderRadius: 16,
        alignItems: "center",
        justifyContent: "center",
        marginTop: 16
    },
    emptyMessage: {
        fontFamily: textFonts.bold,
        fontWeight: "bold",
        fontSize: 12,
        color: darkTheme.textColor
    }

}
