import { useCallback, useContext, useEffect, useState } from "react";
import { View, StyleSheet, Text, Image, FlatList, ActivityIndicator } from "react-native";
import PrimaryButton from "../../../components/Buttons/PrimaryButton";
import Header from "../../../components/Cards/Header";
import darkTheme from "../../../design-system/darkTheme";
import { textFonts } from "../../../design-system/font";
import ThemeContext from "../../../providers/ThemeContext";
import { ApolloContext } from "../../../providers/ApolloContext";
import { gql } from "@apollo/client";
import { getMediaUri } from "../../../api";

const users = [
    {
        id: 1,
        fullname: "كريم تماني",
        image: require("../../../assets/illustrations/user.png"),
        username: "@tamanikarim",
        profession: "مبرمج",
        address: "الجزائر سطيف"
    },
    {
        id: 2,
        fullname: "خير الله غ",
        image: require("../../../assets/illustrations/mainUser.jpeg"),
        username: "@khirallah",
        profession: "صانع المحتوى",
        address: "العراق"
    }
]
const LIMIT = 10;
export default function BlockedUsers({ navigation }) {


    const themeContext = useContext(ThemeContext);
    const styles = themeContext.getTheme() == "light" ? lightStyles : darkStyles;

    const client = useContext(ApolloContext);
    const [users, setUsers] = useState([]);

    const [firstFetch, setFirstFetch] = useState(true);
    const [loading, setLoading] = useState(false);
    const [end, setEnd] = useState(false);


    const load_blocked_users = (previousUsers) => {
        const offset = previousUsers.length;

        client.query({
            query: gql`
            query Query($offset: Int!, $limit: Int!) {
                getBlockedUsers(offset: $offset, limit: $limit) {
                    id 
                    name 
                    lastname 
                    username 
               
                    profilePicture {
                        id path 
                         
                    }
                }
            }` ,


            variables: {
                offset: offset,
                limit: LIMIT
            }
        }).then(response => {
            if (response && response.data.getBlockedUsers) {
                var newUsers = response.data.getBlockedUsers;
                console.log(newUsers);

                if (newUsers.length < LIMIT)
                    setEnd(true);
                setUsers([...previousUsers, ...newUsers])
                setLoading(false);
                setFirstFetch(false);
            }
        }).catch(error => {
            setLoading(false);
            setFirstFetch(false);
        })

    }

    useEffect(() => {
        setFirstFetch(true);
        load_blocked_users([]);
    }, []);

    useEffect(() => {
        if (loading) {
            load_blocked_users(user.filter(blockedUser => blockedUser.type != "loading"));
        }
    }, [loading]);




    const setUserAsLoading = (userId, isLoading = true) => {

        const index = users.findIndex(blockedUser => blockedUser.id == userId);
        if (index >= 0) {
            var cloneUsers = [...users];
            cloneUsers[index] = {
                ...cloneUsers[index],
                loading: isLoading
            }
           
            setUsers(cloneUsers);
        }



    };

    const deleteUser = (userId) => {

        const index = users.findIndex(blockedUser => blockedUser.id == userId);
        if (index >= 0) {
            var cloneUsers = [...users];
            cloneUsers.splice(index, 1);
            setUsers(cloneUsers);
        }

    }



    const unBlockUser = useCallback((user) => {

        setUserAsLoading( user.id )

        client.mutate({
            mutation : gql`
            mutation Mutation($userId: ID!) {
                toggleBlock(userId: $userId)
            }` , 
            variables : { 
                userId : user.id 
            }
        }).then(response => {
            if (response && response.data && !response.data.toggleBlock) { 

                deleteUser( user.id ) ;  
            }
        })
        .catch(error => { 
            setUserAsLoading( user.id  , false ) ; 
        })


    }, [users])

    const renderItem = useCallback(({ item }) => {


        return (
            <View style={styles.user}>

                {
                    !item.profilePicture &&
                    <Image source={require("../../../assets/illustrations/gravater-icon.png")} style={styles.userImage} />

                }
                {
                    item.profilePicture &&
                    <Image source={{ uri: getMediaUri(item.profilePicture.path) }} style={styles.userImage} />

                }
                <View style={styles.infoSection}>

                    <Text style={styles.fullname}>
                        {item.name} {item.lastname}
                    </Text>
                    <Text style={styles.username}>
                        @{item.username}
                    </Text>
                </View>

                {
                    !item.loading &&
                    <PrimaryButton
                        title={"إزالة الحظر"}
                        style={styles.button}
                        textStyle={styles.buttonTextStyle}
                        onPress={() => unBlockUser(item)}


                    />
                }
                {
                    item.loading &&
                    <ActivityIndicator color={"#1A6ED8"} size={24} />
                }
            </View>
        )
    }, [users]);


    const keyExtractor = useCallback((item) => {
        return item.id;
    }, [])

    return (
        <View style={styles.container}>
            <Header
                navigation={navigation}
                title={
                    <Text>
                        الحسابات المحظورة
                    </Text>
                }
            />
            <FlatList
                data={users}
                keyExtractor={keyExtractor}
                renderItem={renderItem}
            />

        </View>
    )
};

const lightStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "white"
    },
    usersCount: {
        color: "#1A6ED8",
        fontFamily: textFonts.regular
    },
    user: {
        flexDirection: "row-reverse",
        alignItems: "center",
        padding: 16,
        borderBottomColor: "#eee",
        borderBottomWidth: 1

    },
    userImage: {
        width: 48,
        height: 48,
        borderRadius: 48
    },
    fullname: {

        fontFamily: textFonts.regular,
        fontWeight: "bold"
    },
    button: {
        backgroundColor: "white"
    },
    buttonTextStyle: {
        color: "#1A6ED8",
        fontFamily: textFonts.regular,
        fontWeight: "bold"
    },


    infoSection: {
        flex: 1,
        paddingRight: 16,
        justifyContent: "center",

    },
    username: {
        textAlign: "right",
        fontSize: 12,
        color: "#888888"
    }

})

const darkStyles = {
    ...lightStyles,
    container: {
        flex: 1,
        backgroundColor: darkTheme.backgroudColor
    }
    ,
    user: {
        flexDirection: "row-reverse",
        alignItems: "center",
        padding: 16,
        borderBottomColor: darkTheme.borderColor,
        borderBottomWidth: 1

    },

    button: {
        backgroundColor: darkTheme.backgroudColor
    },
    fullname: {

        fontFamily: textFonts.regular,
        fontWeight: "bold",

        color: darkTheme.textColor
    },
    username: {
        textAlign: "right",
        fontSize: 12,
        color: darkTheme.secondaryTextColor
    }

}