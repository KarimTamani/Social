import { useCallback, useContext, useEffect, useState } from "react";
import { Text, View, StyleSheet, TouchableOpacity } from "react-native";
import darkTheme from "../../../design-system/darkTheme";
import { textFonts } from "../../../design-system/font";
import ThemeContext from "../../../providers/ThemeContext";
import { useEvent } from "../../../providers/EventProvider";
import { ApolloContext } from "../../../providers/ApolloContext";
import { gql } from "@apollo/client";
export default function NotificationsNavBar({ navigation, activePage, notificationsState }) {

    const themeContext = useContext(ThemeContext);
    const styles = themeContext.getTheme() == "light" ? lightStyles : darkStyles;
    const event = useEvent();
    const client = useContext(ApolloContext);

    const [unseenNotifications, setUnseenNotifications] = useState(notificationsState);


    useEffect(() => {

        const updateNotificationState = (newNotificationsState) => {
            setUnseenNotifications(newNotificationsState)
        }
        event.addListener("update-notifications-state", updateNotificationState)
        return () => {
            event.removeListener("update-notifications-state", updateNotificationState);
        }

    }, [notificationsState])

    const seeLikeNotifications = useCallback(() => {
        return client.query({
            query: gql`
            mutation Mutation {
                seeLikeNotifications {
                  id 
                }
            }
            `
        });

    }, [client]);

    const seeFollowNotifications = useCallback(() => {
        return client.query({
            query: gql`
            mutation Mutation {
                seeFollowNotifications {
                  id 
                }
            }
            `
        });

    }, [client]);

    const seeCommentNotifications = useCallback(() => {
        return client.query({
            query: gql`
            mutation Mutation {
                seeCommentNotifications {
                  id 
                }
            }
            `
        });

    }, [client]);

    const navigate = useCallback((page) => {



        if (unseenNotifications)
            switch (activePage) {
                case "FollowsList":

                    if (unseenNotifications.unseenFollowNotification != 0) {

                        event.emit("update-notifications-state", {
                            ...unseenNotifications,
                            unseenFollowNotification: 0
                        });
                        seeFollowNotifications().then();
                    }

                    break;
                case "LikesList":


                    if (unseenNotifications.unseenLikeNotification != 0) {
                        event.emit("update-notifications-state", {
                            ...unseenNotifications,
                            unseenLikeNotification: 0
                        });
                        seeLikeNotifications().then()
                    }
                    break;
                case "CommentsList":


                    if (unseenNotifications.unseenCommentNotification != 0) {
                        event.emit("update-notifications-state", {
                            ...unseenNotifications,
                            unseenCommentNotification: 0
                        });
                        seeCommentNotifications().then();
                    }
                    break;

            }

        navigation.navigate(page);


    }, [navigation, activePage, unseenNotifications]);


    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.tab} onPress={() => navigate("FollowsList")}>
                <Text style={[styles.tabText, activePage == "FollowsList" && styles.activeText]}>
                    متابعون
                </Text>
                {
                    unseenNotifications && unseenNotifications.unseenFollowNotification != 0 &&

                    <Text style={styles.unseenNotifications}>
                        {(unseenNotifications.unseenFollowNotification > 99) ? ("+99") : (unseenNotifications.unseenFollowNotification)}
                    </Text>
                }
            </TouchableOpacity>


            <TouchableOpacity style={styles.tab} onPress={() => navigate("LikesList")}>
                <Text style={[styles.tabText, activePage == "LikesList" && styles.activeText]}>
                    الأسهم

                </Text>
                {
                    unseenNotifications && unseenNotifications.unseenLikeNotification != 0 &&

                    <Text style={styles.unseenNotifications}>
                        {(unseenNotifications.unseenLikeNotification > 99) ? ("+99") : (unseenNotifications.unseenLikeNotification)}

                    </Text>
                }
            </TouchableOpacity>


            <TouchableOpacity style={styles.tab} onPress={() => navigate("CommentsList")}>
                <Text style={[styles.tabText, activePage == "CommentsList" && styles.activeText]}>
                    تعليقات
                </Text>
                {
                    unseenNotifications && unseenNotifications.unseenCommentNotification != 0 &&

                    <Text style={styles.unseenNotifications}>
                        {(unseenNotifications.unseenCommentNotification > 99) ? ("+99") : (unseenNotifications.unseenCommentNotification)}

                    </Text>
                }
            </TouchableOpacity>

            {
                /*
                <TouchableOpacity style={styles.tab} onPress={() => navigate("ServicesList")}>
                    <Text style={[styles.tabText, activePage == "ServicesList" && styles.activeText]}>
                        خدمات
                    </Text>
                </TouchableOpacity>
                */
            }

        </View>
    )
}

const lightStyles = StyleSheet.create({
    container: {
        flexDirection: "row-reverse",

    },
    tab: {
        flex: 1,
        alignItems: "center"
    },
    tabText: {

        textAlign: "center",
        fontSize: 14,
        color: "#666",
        paddingVertical: 8,
        fontFamily: textFonts.medium
    },
    activeText: {
        color: "#1A6ED8",
        borderBottomColor: "#1A6ED8",
        borderBottomWidth: 4,



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
})

const darkStyles = {
    ...lightStyles,
    tabText: {

        textAlign: "center",
        fontSize: 14,
        color: darkTheme.secondaryTextColor,
        paddingVertical: 8,
        fontFamily: textFonts.medium
    },

    container: {
        flexDirection: "row-reverse",
        backgroundColor: darkTheme.backgroudColor

    },
}