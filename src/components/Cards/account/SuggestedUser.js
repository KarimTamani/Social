import React, { useCallback, useContext, useEffect, useState } from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import darkTheme from "../../../design-system/darkTheme";
import { textFonts } from "../../../design-system/font";
import ThemeContext from "../../../providers/ThemeContext";
import SmallFollowButton from "../../Buttons/SmallFollowButton";
import { getMediaUri } from "../../../api";
import { ApolloContext } from "../../../providers/ApolloContext";
import { gql } from "@apollo/client";
import { useEvent } from "../../../providers/EventProvider";

function SuggestedUser({ user , navigation }) {

    const themeContext = useContext(ThemeContext);
    const styles = themeContext.getTheme() == "light" ? lightStyles : darkStyles;

    const [following, setFollowing] = useState(false);
    const [loading, setLoading] = useState(false);

    const client = useContext(ApolloContext) ; 
    const event = useEvent() ; 

    useEffect(() => { 
        setFollowing(user.isFollowed)
    }, [user])

    const toggleFollowing = useCallback(() => {

        setFollowing(!following);
        setLoading(true) ; 
 
  
        client.mutate({
            mutation: gql`
                mutation ToggleFollow($userId: ID!) {
                    toggleFollow(userId: $userId)
                }
            ` ,
            variables: {
                userId : user.id
            }
        }).then(response => {
            
            if (response) {
                setLoading( false ) ; 
                event.emit("new-following" , {
                    userId : user.id , 
                    state : response.data.toggleFollow , 
                    pageSource : "suggest-users"
                }) ; 

            }

        }).catch(error => {
            setFollow(!previousValue) ; 
            setLoading( false ) ; 
        })
      
    }, [ following, loading ])  ;



    const openProfile = useCallback(() => { 
        navigation.navigate("Profile" , {
            userId : user.id 
        })
    } , []) ; 

    return (
        <TouchableOpacity style={styles.container} onPress={ openProfile }>

            {
                !user.profilePicture &&
                <Image source={require("../../../assets/illustrations/gravater-icon.png")} style={styles.image} />

            }
            {
                user.profilePicture &&
                <Image source={{ uri: getMediaUri(user.profilePicture.path) }} style={styles.image} />

            }
            <Text style={styles.fullname}>
                {user.name} {user.lastname}
            </Text>
            <Text style={styles.category}>
                @{user.username}
            </Text>

            <SmallFollowButton
                style={!following ? styles.button : styles.unfollowButton}
                textStyle={!following ? styles.buttonText : styles.unfollowText}
                text={!following ? "متابعة" : "تمت المتابعة"}
                loading={loading}
                onPress={toggleFollowing}
            />
        </TouchableOpacity>
    )
};

const comparator = (previousProp , nextProp) => { 
 
    return false ; 
}

export default React.memo(SuggestedUser , comparator)

const lightStyles = StyleSheet.create({
    container: {
        width: 120,
        justifyContent: "center",
        alignItems: "center",

        paddingVertical: 16,

    },
    image: {
        width: 48,
        height: 48,
        borderRadius: 48
    },
    fullname: {
        fontFamily: textFonts.semiBold,
        fontSize: 12,
        marginTop: 8
    },
    category: {
        color: "#666",
        fontSize: 10,
        fontFamily: textFonts.regular,
        height: 24,

    },
    button: {
        width: 86,
        borderRadius: 26,
        padding: 0,
        height: 32,
        justifyContent: "center"
    },
    unfollowButton: {
        width: 86,
        borderRadius: 26,
        padding: 0,
        height: 32,
        justifyContent: "center",
        backgroundColor: "#ccc"

    },
    buttonText: {

        fontSize: 10
    },
    unfollowText: {
        fontSize: 10,
        color: "#212121"

    }
});

const darkStyles = {
    ...lightStyles,
    container: {
        width: 120,
        justifyContent: "center",
        alignItems: "center",

        paddingVertical: 16,
       
    },
    fullname: {
        fontFamily: textFonts.semiBold,
        fontSize: 12,
        marginTop: 8,
        color: darkTheme.textColor,
    },
    category: {
        color: "#666",
        fontSize: 10,
        fontFamily: textFonts.regular,
        height: 24,
        color: darkTheme.secondaryTextColor,

    },


}