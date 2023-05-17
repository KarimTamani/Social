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

const LIMIT = 10;

export default function AccountSuggestions({ navigation }) {
    const themeContext = useContext(ThemeContext);
    const styles = themeContext.getTheme() == "light" ? lightStyles : darkStyles;

    const event = useEvent();
    const client = useContext(ApolloContext);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refrechFollowersHandler, setRefrechFollowersHandler] = useState(false);

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
                }
            
            ` ,
            variables: {
                offset: offset,
                limit: LIMIT
            }
        }).then(response => {

            console.log(response) ; 
            setUsers([...previousUsers, ...response.data.suggestUsers])
            setLoading(false)
        })



    }

    useEffect(() => {


       

       load_more_users([]);




    }, []);


    useEffect(() => {


        const handleFollowingStateChanged = ({ userId, state , sourcePage }) => {

            if (sourcePage == "suggest-users") 
                return ; 



            if (users.length == 0) {
                if (refrechFollowersHandler)
                    clearTimeout(refrechFollowersHandler);

                setRefrechFollowersHandler(setTimeout(() => {
                    setLoading(true)
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
        return <SuggestedUser user={item} navigation={navigation} />
    }, [users]);

    const keyExtractor = useCallback((item, index) => {
        return item.id;
    }, [users])

    if (!loading && users.length == 0)
        return (
            <View style={styles.emptyContainer}>
                <Text style={styles.emptyMessage}>
                    لا يوجد اي اقتاراحات حاليا
                </Text>
            </View>
        )

    if (!loading)
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
                />

            </View>
        )
    if (loading)
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
        fontFamily: textFonts.semiBold,
        marginBottom: 16 , 
        
    },
    emptyContainer: {
        backgroundColor: "#eee",
        height: 120,
        width: "100%",
        borderRadius: 16,
        alignItems: "center",
        justifyContent: "center" , 
        marginTop : 16
    },
    emptyMessage: {
        fontFamily: textFonts.bold,
        color: "#555", fontSize: 12
    }
});


const darkStyles = {
    ...lightStyles,
    title: {
        fontFamily: textFonts.semiBold,
        marginBottom: 16,
        color: darkTheme.textColor
    } , 
    emptyContainer : {
        backgroundColor: darkTheme.backgroudColor,
        height: 120,
        width: "100%",
        borderRadius: 16,
        alignItems: "center",
        justifyContent: "center" , 
        marginTop : 16
    } , 
    emptyMessage: {
        fontFamily: textFonts.bold, 
        fontSize: 12 , 
        color: darkTheme.textColor
    } 

}
