import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { AntDesign } from '@expo/vector-icons';
import { textFonts } from "../../../design-system/font";
import { Entypo } from '@expo/vector-icons';
import { useContext, useEffect, useState } from "react";
import ThemeContext from "../../../providers/ThemeContext";
import darkTheme from "../../../design-system/darkTheme";
import { AuthContext } from "../../../providers/AuthContext";
import { getMediaUri } from "../../../api";
import { useEvent } from "../../../providers/EventProvider";



export default function AccountName({ openProfile }) {
    const themeContext = useContext(ThemeContext);
    const [user, setUser] = useState(null);
    const styles = themeContext.getTheme() == "light" ? lightStyles : darkStyles;

    const auth = useContext(AuthContext);
    const event = useEvent();

    useEffect(() => {
        (
            async () => {

                const userAuth = await auth.getUserAuth();
                if (userAuth && userAuth.user)
                    setUser(userAuth.user);
            }
        )() ; 

        event.on("update-profile", async () => {
            const userAuth = await auth.getUserAuth();
            if (userAuth && userAuth.user)
                setUser(userAuth.user);
            else 
                setUser(null)
        })

        return () =>  {
            event.off("update-profile") 
        }
    }, [])

    if (!user)
        return;

    return (

        <TouchableOpacity style={styles.container} onPress={openProfile}>
            {

                !user.profilePicture &&
                <Image source={require("../../../assets/illustrations/gravater-icon.png")} style={styles.userImage} />

            }
            {

                user.profilePicture &&
                <Image source={{ uri: getMediaUri(user.profilePicture.path) }} style={styles.userImage} />

            }

            <View style={styles.userInfo}>
                <Text style={styles.fullname}>
                    {user.validated && <AntDesign name="checkcircle" style={styles.blueIcon} />}<Text> {user.name} {user.lastname} </Text>

                </Text>
                <Text style={styles.username}>
                    @{user.username}
                </Text>
            </View>
            <Entypo name="chevron-down" size={32} color="#666" />

        </TouchableOpacity>
    )
};

const lightStyles = StyleSheet.create({
    container: {

        backgroundColor: "white",
        marginTop: 16,
        borderRadius: 4,
        flexDirection: "row-reverse",

        alignItems: "center",
        elevation: 4,

        padding: 16,
        borderRadius: 6,
        marginBottom: 16,


    },
    blueIcon: {
        color: "blue",
        fontSize: 18
    },
    userImage: {
        width: 56,
        height: 56,
        borderRadius: 64
    },
    userInfo: {
        flex: 1,
        alignItems: "flex-end",
        paddingHorizontal: 16,
        justifyContent: "center"
    },
    fullname: {
        fontFamily: textFonts.semiBold,
    },
    username: {
        color: "#666",
        fontSize: 12
    }
});
const darkStyles = {
    ...lightStyles,
    container: {

        backgroundColor: darkTheme.backgroudColor,
        marginTop: 16,
        borderRadius: 4,
        flexDirection: "row-reverse",

        alignItems: "center",
        elevation: 4,

        padding: 16,
        borderRadius: 6,
        marginBottom: 16,


    },
    fullname: {
        fontFamily: textFonts.semiBold,
        color: darkTheme.textColor,
    },
    username: {
        color: "#666",
        fontSize: 12,

        color: darkTheme.secondaryTextColor,
    }
}