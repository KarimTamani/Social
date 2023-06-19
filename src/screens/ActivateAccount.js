import { useCallback, useContext, useEffect, useState } from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import ThemeContext from "../providers/ThemeContext";
import { textFonts } from "../design-system/font";
import { getMediaUri } from "../api";
import darkTheme from "../design-system/darkTheme";
import { useTiming } from "../providers/TimeProvider";
import PrimaryButton from "../components/Buttons/PrimaryButton";
import { ApolloContext } from "../providers/ApolloContext";
import { gql } from "@apollo/client";
import { AuthContext } from "../providers/AuthContext";

const TEST_USER = { "disabled": true, "id": "1", "lastname": "كريم", "name": "تماني", "profilePicture": { "id": "37", "path": "uploads\\pictures\\0-1685374583455.jpg" }, "updatedAt": "1687100703000", "username": "tamani_karim", "validated": false };

export default function ActivateAccount({ route, navigation }) {


    const userAuth = route?.params?.login;
    const user = userAuth.user;
    const isRemove = user.removeRequest != null;

    const themeContext = useContext(ThemeContext);
    const styles = themeContext.getTheme() == "light" ? lightStyles : darkStyles;

    const timing = useTiming();
    const [loading, setLoading] = useState(false);
    const client = useContext(ApolloContext);
    const auth = useContext(AuthContext);

    const activateAccount = useCallback(() => {
        setLoading(true);
        client.mutate({
            mutation: gql`
            
            mutation Mutation {
                activateAccount
              }
            `,
            context: {
                headers: {
                    "Authorization": userAuth?.token
                }
            }
        }).then(async response => {
           
            setLoading(false);
            if (response && response.data.activateAccount) {
                await auth.logIn(userAuth);
                setLoading(false);
                navigation.navigate("HomeNavigation");
            }
        }).catch(error => {
      
            setLoading(false);
        })
    }, [auth])


    const skip = useCallback(() => {
        navigation.navigate("HomeNavigation");
    }, [])

    return (
        <View style={styles.container}>
            <View style={styles.content}>

                {
                    user.profilePicture &&
                    <Image style={styles.profileImage} source={{ uri: getMediaUri(user.profilePicture.path) }} />
                }
                {
                    !user.profilePicture &&
                    <Image style={styles.profileImage} source={require("../assets/illustrations/gravater-icon.png")} />
                }
                <Text style={styles.fullname}>
                    {
                        user.validated &&
                        <AntDesign name="checkcircle" style={styles.blueIcon} />
                    }
                    <Text>
                        {user.name} {user.lastname}
                    </Text>
                </Text>
                {
                    isRemove &&
                    <Text style={styles.message}>
                        لقد قمت بحذف حسابك يوم :<Text style={styles.bold}> {timing.castTime(user.updatedAt)}</Text>
                    </Text>
                }
                {
                    !isRemove &&
                    <Text style={styles.message}>
                        لقد قمت بتعطيل حسابك يوم :<Text style={styles.bold}> {timing.castTime(user.updatedAt)} </Text>
                    </Text>
                }
                <PrimaryButton
                    title={"استرجاع الحساب"}
                    style={styles.buttons}
                    onPress={activateAccount}
                    loading={loading}
                />
                <PrimaryButton
                    title={"تخطي"}
                    style={{ ...styles.buttons, ...styles.skipButton }}
                    textStyle={styles.skipText}
                    onPress={skip}
                />
            </View>
        </View>
    )

};


const lightStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor : "white"
    },
    buttons: {
        width: "50%",
        marginVertical: 12,

    },
    content: {
        alignItems: "center",
        marginTop: 56
    },
    profileImage: {
        width: 86,
        height: 86,
        resizeMode: "cover",
        borderRadius: 112,
    },
    fullname: {
        fontSize: 16,
        marginTop: 8,
        fontFamily: textFonts.bold,
        fontWeight: "bold",
    },
    message: {
        color: "#555",
        marginVertical: 16
    },
    bold: {
        fontWeight: "bold"
    },
    skipButton: {
        backgroundColor: "#eee"
    },
    skipText: {
        color: "#212121"
    }
});


const darkStyles = {
    ...lightStyles,
    container: {
        flex: 1,
        backgroundColor: darkTheme.backgroudColor,
    },
    fullname: {
        ...lightStyles.fullname,
        color: darkTheme.textColor,
    },
    message: {
        ...lightStyles.message,
        color: darkTheme.textColor,

    },

}