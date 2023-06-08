import { useCallback, useContext, useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image, FlatList, SafeAreaView } from "react-native";
import { Ionicons } from '@expo/vector-icons';
import { Feather, AntDesign } from '@expo/vector-icons';
import { textFonts } from "../../../design-system/font";
import Header from "../Header";
import ThemeContext from "../../../providers/ThemeContext";
import darkTheme from "../../../design-system/darkTheme";
import PrimaryInput from "../../Inputs/PrimaryInput";
import { ApolloContext } from "../../../providers/ApolloContext";
import { gql } from "@apollo/client";
import { getMediaUri } from "../../../api";
import LoadingActivity from "../post/loadingActivity";
import { useEvent } from "../../../providers/EventProvider";


const LIMIT = 10;

export default function CreateGroup({ navigation }) {

    const [users, setUsers] = useState([]);
    const [members, setMembers] = useState([]);

    const [followers, setFollowers] = useState([]);
    const [followings, setFollowings] = useState([]);
    const [query, setQuery] = useState("");
    const client = useContext(ApolloContext);

    const [end, setEnd] = useState(false);
    const [loading, setLoading] = useState(false);
    const [firstFetch, setFirstFetch] = useState(true);

    const [searchHandler, setSearchHandler] = useState(null);
    const [isCreating, setIsCreating] = useState(false);


    
    const event = useEvent() ; 
    
    const load_users = async (previousUsers, previousFollowers, previousFollowings, query) => {

        const followersOffset = previousFollowers.length;
        const followingOffset = previousFollowings.length;

    
        client.query({
            query: gql`
            
            query GetFollowing($followersOffset: Int!, $limit: Int!, $query: String, $followingOffset: Int!) {
                getFollowers(offset: $followersOffset, limit: $limit, query: $query) {
                  id name lastname username
                  profilePicture {
                    id path
                  }
                }
                getFollowing(query : $query , offset: $followingOffset, limit: $limit) {
                  id name lastname username
                  profilePicture {
                    id path
                  }
                }
            }    
            ` ,
            variables: {
                query,
                followersOffset,
                followingOffset,
                limit: LIMIT
            }
        }).then(response => {

            var newFollowers = response.data.getFollowers;
            var newFollowing = response.data.getFollowing;


            if (newFollowers.length < LIMIT && newFollowing.length < LIMIT)
                setEnd(true);


            setFollowers([...previousFollowers, ...newFollowers]);
            setFollowings([...previousFollowings, ...newFollowing]);

            var newUsers = [...previousUsers.filter(user => user.type != "loading"), ...newFollowers, ...newFollowing];


            newUsers = newUsers.filter((element, index) => {
                return newUsers.findIndex(user => user.id == element.id) === index;
            });

            newUsers.map(user => {
                user.selected = members.findIndex(member => member.id == user.id) >= 0;
                return user;
            })


            setUsers(newUsers);
            setLoading(false);
            setFirstFetch(false);

        }).catch(error => {
            setLoading(false);
            setFirstFetch(false);
        })
    }

    useEffect(() => {

        if (searchHandler) {
            clearTimeout(searchHandler)
        };

        setSearchHandler(setTimeout(() => {

            setFirstFetch(true);
            setEnd(false);
            setLoading(false);

            load_users([], [], [], query)
        }, 500));


    }, [query]);

    useEffect(() => {
        if (loading)
            load_users(users, followers, followings, query);
    }, [loading]);



    const renderItem = useCallback(({ item }) => {
        if (item.type == "loading")
            return <LoadingActivity style={{ height: 56 }} />

        return (
            <TouchableOpacity style={styles.user} onPress={() => selectUser(item.id)}>
                {
                    item.profilePicture &&
                    <Image source={{ uri: getMediaUri(item.profilePicture.path) }} style={styles.userImage} />
                }
                {

                    !item.profilePicture &&
                    <Image source={require("../../../assets/illustrations/gravater-icon.png")} style={styles.userImage} />
                }

                <View style={styles.userInfo}>

                    <Text style={styles.fullname}>
                        {item.name} {item.lastname}
                    </Text>
                    <Text style={styles.username}>
                        @{item.username}
                    </Text>
                </View>

                {
                    !item.selected &&
                    <Feather name="circle" style={styles.icon} />
                }
                {
                    item.selected &&
                    <AntDesign name="checkcircle" style={[styles.icon, styles.blueIcon]} />
                }
            </TouchableOpacity>
        )

    }, [users]);

    const keyExtractor = useCallback((item, index) => {
        return item.id;
    }, [users])

    const selectUser = useCallback((userId) => {


        var cloneUsers = [...users];
        var index = cloneUsers.findIndex(user => user.id == userId);
        if (index >= 0) {
            cloneUsers[index].selected = !cloneUsers[index].selected;
            setUsers(cloneUsers);


            var memberIndex = members.findIndex(member => member.id == userId);
            var cloneMembers = [...members];
            if (memberIndex >= 0) {

                cloneMembers.splice(memberIndex, 1);


            } else {

                cloneMembers.push(cloneUsers[index]);

            }

            setMembers(cloneMembers)

        }




    }, [users, members]);


    const reachEnd = useCallback(() => {
        if (!loading && !end && !firstFetch) {
            setUsers([...users, { id: 0, type: "loading" }])
            setLoading(true);
        }
    }, [loading, users, end, firstFetch]);


    const themeContext = useContext(ThemeContext);
    const styles = themeContext.getTheme() == "light" ? lightStyles : darkStyles;



    const createGroup = useCallback(() => {
        setIsCreating(true) ; 

        client.query({
            query: gql`
            mutation Mutation($members: [ID!]!) {
                createGroup(members: $members) {
                  id
                  type
                   
                    
                }
            }
            ` ,
            variables: {
                members: members.map(member => member.id)
            }
        }).then(response => {
       
            if (response) {

                event.emit("group-created") ; 
                setIsCreating( false ) ; 
                navigation && navigation.goBack()
            }
        }).catch(error => {
            setIsCreating( false ) ; 
        })

    }, [members])


    return (
        <SafeAreaView style={styles.container}>
            <Header
                title={"إنشاء مجموعة"}
                navigation={navigation}
            />
            <View style={styles.group}>
                <View style={styles.members}>
                    {
                        members.map((user, index) => (
                            user.profilePicture ?
                                <Image key={user.id} source={{ uri: getMediaUri(user.profilePicture.path) }} style={[styles.member, index == 1 && styles.floatOne, index == 2 && styles.floatTwo]} />
                                :
                                <Image key={user.id} source={require("../../../assets/illustrations/gravater-icon.png")} style={[styles.member, index == 1 && styles.floatOne, index == 2 && styles.floatTwo]} />

                        ))
                    }
                </View>
                {
                    !isCreating &&
                    <TouchableOpacity style={[styles.createButton, members.length == 0 && { opacity: 0.5 }]} disabled={members.length == 0} onPress={createGroup}>
                        <Ionicons name="add-outline" size={32} color="#1A6ED8" />
                        <Text style={styles.createText}>
                            إنشاء
                        </Text>
                    </TouchableOpacity>
                }
                { 
                    isCreating &&
                    <LoadingActivity
                        style={styles.createButton}
                        size={48}
                        color={"#1A6ED8"}
                    />
                }
            </View>

            <View style={styles.usersList}>
                <PrimaryInput
                    style={styles.input}
                    placeholder={"البحث"}
                    onChange={setQuery}
                />
                {
                    !firstFetch &&

                    <FlatList
                        data={users}
                        renderItem={renderItem}
                        keyExtractor={keyExtractor}
                        style={styles.searchList}
                        onEndReached={reachEnd}
                    />
                }

                {

                    firstFetch &&
                    <LoadingActivity />
                }
            </View>
        </SafeAreaView>
    )

};



const lightStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "white"
    },
    content: {
        padding: 16
    },
    input: {
        height: 48
    },

    icon: {
        fontSize: 24,
        color: "#666"
    },
    blueIcon: {
        color: "#1A6ED8"
    },
    userImage: {
        width: 42,
        height: 42,
        borderRadius: 48
    },
    user: {
        flexDirection: "row-reverse",
        alignItems: "center",
        justifyContent: "space-between",
        marginTop: 16

    },
    userInfo: {
        flex: 1,
        paddingRight: 16,

    },
    fullname: {
        fontFamily: textFonts.semiBold,
        flex: 1,
        textAlign: "right",
        fontSize: 12
    },
    usersList: {
        padding: 16,
        flex: 1
    },
    group: {
        paddingHorizontal: 16,

        flexDirection: "row",
        height: 72
    },
    members: {
        flex: 1,
        flexDirection: "row"
    },
    createButton: {
        width: 64,

        alignItems: "center",
        justifyContent: "center" , 
        
        height : "auto"
    },
    createText: {
        fontFamily: textFonts.regular,
        color: "#1A6ED8"
    },
    member: {
        borderRadius: 64,
        width: 72,
        height: 72,
        borderWidth: 6,
        borderColor: "white",

    },
    floatOne: {

        transform: [{
            translateX: -36
        }]
    }
    ,
    floatTwo: {

        transform: [{
            translateX: -72
        }]
    },
    username: {
        textAlign: "right",
        fontSize: 12,
        color: "#888"
    },
    searchList: {
        flex: 1,

    }
})


const darkStyles = {
    ...lightStyles,
    container: {
        flex: 1,
        backgroundColor: darkTheme.backgroudColor
    }
    ,
    fullname: {
        fontFamily: textFonts.semiBold,
        flex: 1,
        textAlign: "right",
        fontSize: 12,

        color: darkTheme.textColor
    },
    username: {
        textAlign: "right",
        fontSize: 12,
        color: darkTheme.secondaryTextColor
    },
    member: {
        borderRadius: 64,
        width: 72,
        height: 72,
        borderWidth: 6,
        borderColor: darkTheme.backgroudColor,

    },
}