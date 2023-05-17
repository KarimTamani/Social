import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { AntDesign } from '@expo/vector-icons';
import { Foundation } from '@expo/vector-icons';
import { useCallback, useContext, useEffect, useState } from "react";
import { textFonts } from "../../design-system/font";
import ThemeContext from "../../providers/ThemeContext";
import darkTheme from "../../design-system/darkTheme";
import AuthButton from "../Buttons/AuthButton";
import { AuthContext } from "../../providers/AuthContext";
import { ApolloContext } from "../../providers/ApolloContext";
import { gql } from "@apollo/client";
import { useEvent } from "../../providers/EventProvider";
import { useRealTime } from "../../providers/RealTimeContext";

export default function HomeTabBar({ navigation, activePage }) {

    const [transparent, setTransparent] = useState(false);
    const themeContext = useContext(ThemeContext);
    const styles = themeContext.getTheme() == "light" ? lightStyles : darkStyles;
    const auth = useContext(AuthContext);
    const client = useContext(ApolloContext);
    const [notificationsState, setNotificationsState] = useState(null);
    const [unseenNotifications, setUnseenNotifications] = useState(0);
    const event = useEvent();
    const realTime = useRealTime();

    const navigate = useCallback((page) => {
        if (page != "Notifications")
            navigation.navigate(page);
        else
            navigation.navigate("Notifications", {
                notificationsState
            });

    }, [navigation, notificationsState]);

    useEffect(() => {
        if (activePage == "Reels") {
            setTransparent(true);
        } else {
            setTransparent(false);
        }
    }, [activePage]);


    useEffect(() => {
        (async () => {

            const userAuth = await auth.getUserAuth();
            if (!userAuth)
                return;


            client.query({
                query: gql`
                
                query GetNotificationState {
                    getNotificationState {
                      id 
                      userId
                      unseenCommentNotification
                      unseenFollowNotification
                      unseenLikeNotification
                    }
                }
                
                `
            }).then(response => {
                setNotificationsState(response.data.getNotificationState);
            })

        })();

    }, [])

    useEffect(() => {


        if (notificationsState) {
            var total = notificationsState.unseenCommentNotification +
                notificationsState.unseenFollowNotification +
                notificationsState.unseenLikeNotification;

            if (total > 99)
                total = "+99";


            setUnseenNotifications(
                total
            );


            const updateNotificationsState = (newNotificationsState) => {
                setNotificationsState({ ...newNotificationsState })
            };

            const onNewFollow = (newFollow) => {

                event.emit("update-notifications-state", {
                    ...notificationsState,
                    unseenFollowNotification: notificationsState.unseenFollowNotification + 1
                })
            };

            const onNewLike = (newLike) => {
                event.emit("update-notifications-state", {
                    ...notificationsState,
                    unseenLikeNotification: notificationsState.unseenLikeNotification + 1
                })
            };

            const onNewComment = (newComment) => {
                event.emit("update-notifications-state", {
                    ...notificationsState,
                    unseenCommentNotification: notificationsState.unseenCommentNotification + 1
                })
            };


            realTime.addListener("NEW_FOLLOW", onNewFollow);
            realTime.addListener("NEW_LIKE", onNewLike);
            realTime.addListener("NEW_COMMENT", onNewComment);
            realTime.addListener("NEW_REPLAY", onNewComment);
            realTime.addListener("NEW_STORY_COMMENT", onNewComment);

            event.addListener("update-notifications-state", updateNotificationsState);
            return () => {
                event.removeListener("update-notifications-state", updateNotificationsState);
                realTime.removeListener("NEW_FOLLOW", onNewFollow);
                realTime.removeListener("NEW_LIKE", onNewLike);

                realTime.removeListener("NEW_COMMENT", onNewComment);
                realTime.removeListener("NEW_REPLAY", onNewComment);
                realTime.removeListener("NEW_STORY_COMMENT", onNewComment);


            }
        }
    }, [notificationsState]);


    const openNewPost = useCallback(() => {
        navigation.navigate("NewPost");
    }, [navigation])


    return (
        <View style={[styles.container, transparent && styles.transparent]}>
            <TouchableOpacity style={styles.tab} onPress={() => navigate("Home")}>
                <AntDesign name="home" style={[styles.tabIcon, transparent && styles.whiteIcon, activePage == "Home" && styles.activeTab]} />
                <Text style={[styles.tabText, transparent && styles.whiteIcon, activePage == "Home" && styles.activeTab]}>
                    الرئيسية
                </Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.tab} onPress={() => navigate("Reels")}>
                <Foundation name="play-video" style={[styles.tabIcon, transparent && styles.whiteIcon, activePage == "Reels" && styles.activeTab]} />
                <Text style={[styles.tabText, transparent && styles.whiteIcon, activePage == "Reels" && styles.activeTab]}>
                    ريلز
                </Text>
            </TouchableOpacity>

            <AuthButton style={styles.tab} onPress={openNewPost} navigation={navigation}>
                <View style={[styles.newContentButton, transparent && { backgroundColor: "transparent" }]}>
                    <Image source={require("../../assets/icons/plus-circle.png")} style={styles.addImage} />
                </View>

            </AuthButton>

            <AuthButton style={styles.tab} onPress={() => navigate("Notifications")} navigation={navigation}>
                <AntDesign name="hearto" style={[styles.tabIcon, transparent && styles.whiteIcon, activePage == "Notifications" && styles.activeTab]} />
                <Text style={[styles.tabText, transparent && styles.whiteIcon, activePage == "Notifications" && styles.activeTab]}>
                    إشعارات
                </Text>
                {

                    unseenNotifications != 0 &&
                    <Text style={styles.unseenNotifications}>
                        {unseenNotifications}
                    </Text>
                }
            </AuthButton>

            <AuthButton style={styles.tab} onPress={() => navigation.navigate('AccountStack', { screen: 'Account' })} navigation={navigation}>
                <AntDesign name="user" style={[styles.tabIcon, transparent && styles.whiteIcon, activePage == "AccountStack" && styles.activeTab]} />
                <Text style={[styles.tabText, transparent && styles.whiteIcon, activePage == "AccountStack" && styles.activeTab]}>
                    الحساب
                </Text>
            </AuthButton>
        </View>
    )


}



const lightStyles = StyleSheet.create({
    container: {
        flexDirection: "row-reverse",
        position: "absolute",
        zIndex: 999,
        width: "100%",
        bottom: 0,
        backgroundColor: "white",
    },
    transparent: {
        backgroundColor: "transparent",
        borderTopWidth: 0
    }
    ,
    whiteIcon: {
        color: "white"
    }
    ,
    tab: {
        flex: 1,
        alignItems: "center",
        position: "relative",
        //        paddingVertical : 16  , 
        justifyContent: "center",
        paddingVertical: 8,
    },
    tabIcon: {
        fontSize: 22,
        color: "#555"
    },
    activeTab: {
        color: "#1A6ED8",

    },

    newContentButton: {




        borderRadius: 48,
        width: "100%",
        height: "100%",

    },
    addImage: {
        width: "100%",
        height: "100%",
        resizeMode: "contain"
    },
    tabText: {
        fontFamily: textFonts.regular,
        fontSize: 8,
        marginTop: 2
    },
    unseenNotifications: {
        position: "absolute",
        backgroundColor: "#FF3159",
        color: "white",
        fontSize: 10,
        width: 22,
        height: 22,
        textAlign: "center",
        textAlignVertical: "center",
        borderRadius: 26,
        top: 8,
        right: 8
    }
});

const darkStyles = {
    ...lightStyles,
    container: {
        flexDirection: "row-reverse",
        position: "absolute",
        zIndex: 999,
        width: "100%",
        bottom: 0,
        backgroundColor: darkTheme.backgroudColor,


    },

    tabText: {
        fontFamily: textFonts.regular,
        fontSize: 8,
        marginTop: 2,
        color: darkTheme.textColor
    },
    tabIcon: {
        fontSize: 22,
        color: darkTheme.textColor

    },
}