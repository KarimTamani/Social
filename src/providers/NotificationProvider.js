import messaging from '@react-native-firebase/messaging';
import { createContext, useContext, useEffect, useState } from 'react';
import { ApolloContext } from './ApolloContext';
import { gql } from '@apollo/client';
import PushNotification, { Importance } from "react-native-push-notification";

import { Platform } from "react-native";
import { getMediaUri } from '../api';

const NotificationContext = createContext(messaging);

const NotificationProvider = ({ children, userAuth }) => {

    const client = useContext(ApolloContext);
    const [permission, setPermission] = useState(false);

    async function requestUserPermission() {
        const authStatus = await messaging().requestPermission();
        const enabled =
            authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
            authStatus === messaging.AuthorizationStatus.PROVISIONAL;

        if (enabled) {
            console.log('Authorization status:', authStatus);
        }

        setPermission(enabled);
        return enabled;
    }


    useEffect(() => {
        if (userAuth) {
            try {
                requestUserPermission();
                messaging().onNotificationOpenedApp(remoteMessage => {
                    console.log(
                        'Notification caused app to open from background state:',
                        remoteMessage.notification,
                    );

                    //navigation.navigate(remoteMessage.data.type);
                });
            } catch (error) {
                setPermission(false);
            }
        }
    }, [userAuth]);


    useEffect(() => {
        if (permission) {
            messaging().getToken().then((fcmToken) => {

                client.query({
                    query: gql`
                    mutation Mutation($token: String!) {
                        updateToken(token: $token)
                    }` ,
                    variables: {
                        token: fcmToken
                    }
                }).then()
            })
        }
    }, [permission])

    return (
        <NotificationContext.Provider value={messaging}>
            {children}
        </NotificationContext.Provider>
    )

};


export default NotificationProvider;

export const useNotification = () => {
    return useContext(NotificationContext);
};



const DEFAULT_USER_ICON = "assets/gravater-icon.png";



const createChannel = (channelId, options) => {
    var config = {
        channelId: channelId, // (required)
        channelName: "My channel", // (required)
        channelDescription: "A channel to categorise your notifications", // (optional) default: undefined.
        playSound: true, // (optional) default: true
        soundName: "default", // (optional) See `soundName` parameter of `localNotification` function
        importance: Importance.HIGH, // (optional) default: Importance.HIGH. Int value of the Android notification importance
        vibrate: true, // (optional) default: true. Creates the default vibration pattern if true.

    };
    if (options)
        config = {
            ...config,
            ...options
        };
    PushNotification.createChannel(config);
}


const showNotification = (channelId, options) => {

    var config = {
        /* Android Only Properties */
        channelId: channelId, // (required) channelId, if the channel doesn't exist, notification will not trigger.
        largeIcon: "ic_launcher", // (optional) default: "ic_launcher". Use "" for no large icon.
        largeIconUrl: "https://thumbs.dreamstime.com/b/default-avatar-profile-icon-vector-unknown-social-media-user-photo-default-avatar-profile-icon-vector-unknown-social-media-user-184816085.jpg", // (optional) default: undefined
        subText: "This is a subText", // (optional) default: none

        bigLargeIcon: "ic_launcher", // (optional) default: undefined

        color: "#4348D2", // (optional) default: system default
        vibration: 300, // vibration length in milliseconds, ignored if vibrate=false, default: 1000

        priority: "high", // (optional) set notification priority, default: high
        ignoreInForeground: false, // (optional) if true, the notification will not be visible when the app is in the foreground (useful for parity with how iOS notifications appear). should be used in combine with `com.dieam.reactnativepushnotification.notification_foreground` setting
        shortcutId: "shortcut-id", // (optional) If this notification is duplicative of a Launcher shortcut, sets the id of the shortcut, in case the Launcher wants to hide the shortcut, default undefined
        onlyAlertOnce: true, // (optional) alert will open only once with sound and notify, default: false

        invokeApp: true, // (optional) This enable click on actions to bring back the application to foreground or stay in background, default: true
        title: "My Notification Title", // (optional)
        message: "My Notification Message", // (required)
        subText: "followers",


    }
    if (options)
        config = {
            ...config,
            ...options
        };
    PushNotification.localNotification(config);
}


const PushNotificationConfig = (NotificationNavigator) => {
    PushNotification.configure({
        onNotification: function (notification) {

        

            const channelId = Math.random().toString(36).substring(7);
            createChannel(channelId);
            console.log(notification) ; 
            if (notification.userInteraction) {

                if (NotificationNavigator)
                    NotificationNavigator.handleNotificationClick(notification) 
                    
                return ;
            }

            switch (notification.data.type) {
                case "follow":
                    var user = JSON.parse(notification.data.user);

                    showNotification(channelId, {
                        subText: "المتابعات",
                        title: "متابع جديد 🎉",
                        message: `لقد قام ${user.name} ${user.lastname} بمتابعة حسابك`,
                        largeIconUrl: (user.profilePicture) ? (getMediaUri(user.profilePicture.path)) : getMediaUri(DEFAULT_USER_ICON),
                        data : notification.data
                    });
                    break;


                case "post-like":

                    var user = JSON.parse(notification.data.user);
                    var post = JSON.parse(notification.data.post);

                    var fullname = `${user.name} ${user.lastname}`;

                    var postType = "منشورك";

                    if (post.type == "image")
                        postType = "صورتك";
                    else if (post.type == "reel")
                        postType = "الريلز الخاصة بك";


                    var otherLikers = "";

                    if (post.likes == 2)
                        otherLikers = "و مستخدم آخر";
                    else if (post.likes > 2)
                        otherLikers = `و ${post.likes - 1} اخرين`
                    //  ساهم <Text style={styles.bold}>{fullname}</Text> في {postType} {otherLikers}

                    showNotification(channelId, {
                        subText: "الأسهم",
                        title: "سهم جديد 💘",
                        message: `ساهم ${fullname} في ${postType} ${otherLikers}`,
                        largeIconUrl: (user.profilePicture) ? (getMediaUri(user.profilePicture.path)) : getMediaUri(DEFAULT_USER_ICON),
                        data : notification.data
                    });
                    break;

                case "post-comment":

                    var post = JSON.parse(notification.data.post);
                    var comment = JSON.parse(notification.data.comment);
                    var user = comment.user;

                    var postType = "منشورك";


                    if (post.type == "image") {
                        postType = "صورتك";
                    }

                    if (post.type == "reel") {
                        postType = "الريلز الخاصة بك";
                    }

                    var fullname = `${comment.user.name} ${comment.user.lastname}`;

                    // علق<Text style={styles.bold}> {user.name} </Text> على {postType} ب :
                    var message = `علق ${fullname} على ${postType} ب : ${comment.comment}`;

                    if (comment.isRecord) {
                        message = `علق ${fullname} على ${postType} ب تسجيل صوتي`;
                    }


                    showNotification(channelId, {

                        subText: "التعليقات",
                        title: "تعليق جديد 💬",
                        message: message,
                        largeIconUrl: (user.profilePicture) ? (getMediaUri(user.profilePicture.path)) : getMediaUri(DEFAULT_USER_ICON),
                        data : notification.data

                    });
                    break;


                case "comment-replay":

                    var replay = JSON.parse(notification.data.replay);
                    var user = replay.user;

                    var fullname = `${user.name} ${user.lastname}`;

                    var message = `رد ${fullname} على تعليقك ب : ${replay.replay}`;
                    if (replay.isRecord) {
                        message = `رد ${fullname} على تعليقك بتسجيل صوتي`;
                    }

                    showNotification(channelId, {

                        subText: "الردود",
                        title: "رد على تعليقك 💬",
                        message: message,
                        largeIconUrl: (user.profilePicture) ? (getMediaUri(user.profilePicture.path)) : getMediaUri(DEFAULT_USER_ICON),
                        data : notification.data

                    });
                    break;
                case "message":


                    if (notification.foreground)
                        break;

                    var user = JSON.parse(notification.data.user);
                    var message = JSON.parse(notification.data.message);

                    var fullname = `${user.name} ${user.lastname}`;

                    var messageType = `${message.content}`;

                    if (message.type == "image") {
                        messageType = "صورة";
                    }

                    if (message.type == "video") {
                        messageType = "فيديو";
                    }
                    if (message.type == "record") {
                        messageType = "تسجيل صوتي";
                    }

                    var message = `لقد ارسل لك ${fullname} : ${messageType}`

                    showNotification(channelId, {

                        subText: "رسائل",
                        title: "رسالة جديدة ✉️",
                        message: message,
                        largeIconUrl: (user.profilePicture) ? (getMediaUri(user.profilePicture.path)) : getMediaUri(DEFAULT_USER_ICON),
                        data : notification.data

                    });
                    break;
                case "story-comment":
                    var user = JSON.parse(notification.data.user);
                    var storyComment = JSON.parse(notification.data.storyComment);

                    var fullname = `${user.name} ${user.lastname}`;
                    var postType = "قصتك";
                    var message = `علق ${fullname} على ${postType} ب : ${storyComment.comment}`;

                    showNotification(channelId, {
                        subText: "التعليقات",
                        title: "تعليق جديد 💬",
                        message: message,
                        largeIconUrl: (user.profilePicture) ? (getMediaUri(user.profilePicture.path)) : getMediaUri(DEFAULT_USER_ICON),
                        data : notification.data
                    });
                    break;
                default:
                    break;


            }
        },
        onAction: function (notification) {
            console.log("ACTION:", notification.action);
            console.log("NOTIFICATION:", notification);
        },

        onRegistrationError: function (err) {
            console.error(err.message, err);
        },

        permissions: {
            alert: true,
            badge: true,
            sound: true,
        },

        popInitialNotification: true,
        requestPermissions: Platform.OS === 'ios',
    });
}




export {
    PushNotificationConfig
}