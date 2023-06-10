import { useCallback, useContext, useEffect, useState } from "react";
import { View, Text, StyleSheet, Image, Dimensions } from "react-native";
import { getMediaUri } from "../../../api";
import { textFonts } from "../../../design-system/font";
import ThemeContext from "../../../providers/ThemeContext";
import darkTheme from "../../../design-system/darkTheme";

const { height } = Dimensions.get("screen");

export default function ConversationMembers({ members }) {

    const [firstThree, setFirstThree] = useState([]);
    const themeContext = useContext(ThemeContext);
    const styles = themeContext.getTheme() == "light" ? lightStyles : darkStyles;

    useEffect(() => {
        if (members)
            setFirstThree(members.slice(0, 3));
    }, [members])


    if (members && members.length == 0)
        return null;

    const renderInfo = useCallback(() => {
        if (firstThree.length == 1) {
            const reciver = firstThree[0].user;

            return (
                <View>
                    <View style={styles.infoContainer}>
                        <Text style={styles.name}>
                            {reciver.name} {reciver.lastname}
                        </Text>
                        <Text style={styles.text}>
                            @{reciver.username}
                        </Text>

                        <View style={styles.followingsState}>
                            <Text style={[styles.text, styles.followingText]}>
                                متابعون {reciver.numFollowers}
                            </Text>
                            <Text style={[styles.text, styles.followingText]}>
                                يتبع {reciver.numFollowing}
                            </Text>
                        </View>
                    </View>
                </View>
            )
        } else if (firstThree.length > 1) {
            var groupName = members.map(member => member.user.name + " " + member.user.lastname).join(",")
            return (
                <View>
                    <View style={styles.infoContainer}>
                        <Text style={styles.name} numberOfLines={1}>
                            {groupName}
                        </Text>
                        <Text style={styles.text}>
                            عدد الأعضاء {members.length}
                        </Text>
                    </View>
                </View>
            )
        }
    }, [firstThree]);


    const getProfileImageStyle = (index) => {

        if (firstThree.length == 3) {
            if (index == 0)
                return styles.floatOne;
            if (index == 2)
                return styles.floatTwo;
        }

        if (firstThree.length == 2) {
            if (index == 0)
                return styles.floatRight;
            if (index == 1)
                return styles.floatLeft;

        }
    }

    return (
        <View style={styles.container}>
            <View style={styles.images}>
                {
                    firstThree.map((member, index) => {
                        return (
                            !member.user.profilePicture ?
                                <Image style={[styles.profileImage, getProfileImageStyle(index)]} source={require("../../../assets/illustrations/gravater-icon.png")} />
                                :
                                <Image style={[styles.profileImage, getProfileImageStyle(index)]} source={{ uri: getMediaUri(member.user.profilePicture.path) }} />
                        )
                    })

                }
            </View>
            {
                renderInfo()
            }

        </View>
    )
}


const lightStyles = StyleSheet.create({
    container: {
        height: height * 0.3

    },
    profileImage: {
        width: 84,
        height: 84,
        resizeMode: "cover",
        borderRadius: 112,
    },
    images: {
        alignItems: "center",
        flexDirection: "row",

        justifyContent: "center"
    },
    infoContainer: {
        alignItems: "center",
        paddingVertical: 16
    },
    name: {
        fontFamily: textFonts.bold,
        fontWeight : "bold" , 
        color: "#212121",
        marginBottom: 8
    },
    text: {
        fontFamily: textFonts.regular,
        color: "#888",
        lineHeight: 21,
        height: 21,
        fontSize: 12,
        marginHorizontal: 4
    },
    followingsState: {
        flexDirection: "row",

        width: "50%",
        alignItems: "center",
        justifyContent: "center"
    },
    followingText: {
        color: "#212121",
        fontFamily: textFonts.bold
    },
    floatOne: {
        transform: [{
            translateX: 84 / 2
        }]
    }
    ,
    floatTwo: {

        transform: [{
            translateX: -84 / 2
        }]
    },
    floatRight: {

        transform: [{
            translateX: 42 / 2
        }]
    },

    floatLeft: {
        transform: [{
            translateX: -42 / 2
        }]
    }

})


const darkStyles = { 
    ...lightStyles , 
    text: {
        ...lightStyles.text ,
        color: darkTheme.secondaryTextColor,

    },
    name : { 
        ...lightStyles.name ,
        color: darkTheme.textColor,

    } , 
    followingText: {
        color: darkTheme.textColor,
        fontFamily: textFonts.bold
    },
}