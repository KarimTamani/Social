import { useCallback, useEffect, useState } from "react";
import { View, Text, StyleSheet, Image, Dimensions } from "react-native";
import { getMediaUri } from "../../../api";
import { textFonts } from "../../../design-system/font";

const { height } = Dimensions.get("screen");

export default function ConversationMembers({ members }) {

    const [firstThree, setFirstThree] = useState([]);


    useEffect(() => {
        if (members)
            setFirstThree(members.slice(0, 2));
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

        }
    }, [firstThree]);

    return (
        <View style={styles.container}>
            <View style={styles.images}>
                {
                    firstThree.map(member => {
                        return (
                            !member.user.profilePicture ?
                                <Image style={styles.profileImage} source={require("../../../assets/illustrations/gravater-icon.png")} />
                                :
                                <Image style={styles.profileImage} source={{ uri: getMediaUri(member.user.profilePicture.path) }} />
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


const styles = StyleSheet.create({
    container: {
        height : height * 0.3  
        
    },
    profileImage: {
        width: 84,
        height: 84,
        resizeMode: "cover",
        borderRadius: 112,
    },
    images: {
        alignItems: "center"
    },
    infoContainer: {
        alignItems: "center",
        paddingVertical: 16
    },
    name: {
        fontFamily: textFonts.bold,
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
        fontFamily: textFonts.semiBold
    }

})