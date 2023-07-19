import { LinearGradient } from "expo-linear-gradient";
import { View, Text, StyleSheet, Image, Dimensions, TouchableOpacity, ActivityIndicator } from "react-native";
import { getMediaUri } from "../../../api";
import { textFonts } from "../../../design-system/font";
import RecordPlayer from "../RecordPlayer";
import { Video } from "expo-av";
import { FontAwesome5 } from '@expo/vector-icons';
import { useCallback, useContext, useEffect } from "react";
import ThemeContext from "../../../providers/ThemeContext";
import darkTheme from "../../../design-system/darkTheme";
import { useTiming } from "../../../providers/TimeProvider";
import { AuthContext } from "../../../providers/AuthContext";

const WIDTH = Dimensions.get("screen").width;
export default function Message({ message, openImage, openVideo, showSender, lastSeenAt, navigation }) {

    const { myMessage, sending } = message;
    var textBackground = ["#E8E7E8", "#EFEFEF"];

    const themeContext = useContext(ThemeContext);
    const styles = themeContext.getTheme() == "light" ? lightStyles : darkStyles;

    const auth = useContext(AuthContext) ; 

    if (themeContext.getTheme() == "dark") {
        textBackground = [darkTheme.secondaryBackgroundColor, darkTheme.secondaryBackgroundColor];
    }
    if (myMessage) {
        textBackground = ['#BAD0FD', "#BBD2FE"];
    }

    const timing = useTiming();
    const openPost = useCallback(() => {

        navigation.navigate("ViewPosts", {
            getPosts: () => [message.post],
            title: "مشاراكات"
        })

    }, [message, navigation]); 


    const openAccount = useCallback(() => {
        (async() => {
            var userAuth = await  auth.getUserAuth() ; 
            
            if (userAuth && userAuth.user) {
                var currentUser = userAuth.user ; 
                if (currentUser.id == message.account.id) { 
                    navigation.navigate("AccountStack", { screen: "MyProfile" })
                }else{
                    navigation.navigate("Profile", { userId: message.account.id });
                }
            }
        
        }) ( )
        

    } , [message , navigation])



    function renderContent() {

        switch (message.type) {
            case "text":
                return (
                    <LinearGradient
                        colors={textBackground}
                        style={[styles.contentText, myMessage && styles.sendContentText]}>
                        {myMessage && !sending &&
                            <FontAwesome5 name="check-double" style={[styles.check, lastSeenAt && lastSeenAt > message.createdAt && styles.seenMessage]} />}
                        <View style={styles.textContent}>

                            <Text style={[styles.text, !myMessage && styles.whiteText]}>
                                {message.content}
                            </Text>

                            <Text style={styles.time}>
                                {message && message.createdAt && timing.getHourlyPerdiod(message.createdAt)}
                            </Text>
                        </View>
                        {sending && message.type == "text" &&
                            <ActivityIndicator color={"white"} style={[styles.loading, { marginRight: 8 }]} size={16}></ActivityIndicator>}
                    </LinearGradient>
                );

            case "record":

                return (

                    !message.content ?
                        <View style={{
                            width: WIDTH * 0.5, marginBottom: 8, alignSelf: myMessage ? "flex-end" : "flex-start", alignItems: "flex-end"
                        }}>
                            <RecordPlayer uri={message.media.uri} />
                            <View style={[styles.recivingInfo]}>
                                {myMessage && !sending &&
                                    <FontAwesome5 name="check-double" style={[styles.check, lastSeenAt && lastSeenAt > message.createdAt && styles.seenMessage]} />}
                                <Text style={styles.time}>
                                    {message && message.createdAt && timing.getHourlyPerdiod(message.createdAt)}
                                </Text>
                            </View>
                        </View>
                        :
                        <LinearGradient
                            colors={textBackground}
                            style={[styles.contentText, myMessage && styles.sendContentText, { flexDirection: "column" }]}>
                            <Text style={[styles.text, { marginBottom: 4 }, !myMessage && styles.whiteText]}>
                                {message.content}
                            </Text>
                            {sending && message.type == "text" &&
                                <ActivityIndicator color={"white"} style={[styles.loading, { marginRight: 8 }]} size={16}></ActivityIndicator>}
                            <View style={{
                                width: WIDTH * 0.5, marginBottom: 8, alignSelf: "flex-start", alignItems: "flex-end"
                            }}>
                                <RecordPlayer uri={message.media.uri} />
                                <View style={styles.recivingInfo}>

                                    {myMessage && !sending &&
                                        <FontAwesome5 name="check-double" style={[styles.check, lastSeenAt && lastSeenAt > message.createdAt && styles.seenMessage]} />}
                                    <Text style={styles.time}>
                                        {message && message.createdAt && timing.getHourlyPerdiod(message.createdAt)}
                                    </Text>

                                </View>
                            </View>
                        </LinearGradient>


                );
            case "image":
                return (
                    <TouchableOpacity onPress={() => openImage(message.media.uri)} >
                        <Image source={{ uri: message.media.uri }} style={[styles.messageImage, myMessage && { alignSelf: "flex-end" }]} />
                        <View style={[styles.recivingInfo, { marginBottom: 8 }, !myMessage && { alignSelf: "flex-start" }]}>
                            {myMessage && !sending &&
                                <FontAwesome5 name="check-double" style={[styles.check, lastSeenAt && lastSeenAt > message.createdAt && styles.seenMessage]} />}
                            <Text style={styles.time}>
                                {message && message.createdAt && timing.getHourlyPerdiod(message.createdAt)}
                            </Text>
                        </View>
                    </TouchableOpacity>
                );
            case "video":
                return (

                    <TouchableOpacity onPress={() => openVideo(message.media.uri)}>
                        <Video
                            style={[styles.messageImage, myMessage && { alignSelf: "flex-end" }]}
                            resizeMode="cover"
                            isLooping
                            source={{ uri: message.media.uri }}
                            shouldPlay={false} />
                        <View style={[styles.recivingInfo, { marginBottom: 8 }, !myMessage && { alignSelf: "flex-start" }]}>
                            {myMessage && !sending &&
                                <FontAwesome5 name="check-double" style={[styles.check, lastSeenAt && lastSeenAt > message.createdAt && styles.seenMessage]} />}
                            <Text style={styles.time}>
                                {message && message.createdAt && timing.getHourlyPerdiod(message.createdAt)}
                            </Text>
                        </View>

                    </TouchableOpacity>
                );


            case "post":
                const post = message.post;


                var media = null;

                if (post.type == "image" && post.media && post.media.length > 0)
                    media = post.media[0];
                else if (post.type == "reel" && post.reel && post.reel.thumbnail) {
                    media = post.reel.thumbnail;
                }

                return (

                    <LinearGradient
                        colors={textBackground}
                        style={[styles.contentText, myMessage && styles.sendContentText, styles.postContainer]}>
                        {
                            post &&
                            <TouchableOpacity style={styles.post} onPress={openPost}>
                                <View style={styles.posterInfo}>

                                    {
                                        post.user.profilePicture &&
                                        <Image source={{ uri: getMediaUri(post.user.profilePicture.path) }} style={styles.posterUserImage} />
                                    }
                                    {
                                        !post.user.profilePicture &&
                                        <Image source={require("../../../assets/illustrations/gravater-icon.png")} style={styles.posterUserImage} />
                                    }
                                    <Text style={[styles.fullanme, !myMessage && styles.whiteText]}>
                                        {post.user.lastname} {post.user.name}
                                    </Text>
                                </View>
                                {
                                    post.title &&
                                    <Text style={[styles.postTitle, !myMessage && styles.whiteText]}>
                                        {post.title}
                                    </Text>
                                }
                                {

                                    media &&
                                    <Image source={{ uri: getMediaUri(media.path) }} style={styles.postImage} />

                                }
                                <View style={styles.recivingInfo} >

                                    {myMessage && !sending &&
                                        <FontAwesome5 name="check-double" style={[styles.check, lastSeenAt && lastSeenAt > message.createdAt && styles.seenMessage]} />}
                                    <Text style={styles.time}>
                                        {message && message.createdAt && timing.getHourlyPerdiod(message.createdAt)}
                                    </Text>
                                </View>

                            </TouchableOpacity>
                        }
                    </LinearGradient>
                );


            case "account":


                return (
                    <TouchableOpacity onPress={ openAccount }>
                        <LinearGradient
                            colors={textBackground}
                            style={[styles.contentText, myMessage && styles.sendContentText, styles.postContainer]}>

                            <View style={styles.accountInfo}>

                                {
                                    message.account.profilePicture &&
                                    <Image source={{ uri: getMediaUri(message.account.profilePicture.path) }} style={styles.accountImage} />
                                }
                                {
                                    !message.account.profilePicture &&
                                    <Image source={require("../../../assets/illustrations/gravater-icon.png")} style={styles.accountImage} />
                                }


                                <View style={styles.sharedAccountInfo}>

                                    <Text style={[styles.accountFullanme, !myMessage && styles.whiteText]}>
                                        {message.account.lastname} {message.account.name}
                                    </Text>
                                    <Text style={styles.accountUsername}>
                                        @{message.account.username}
                                    </Text>

                                </View>
                            </View>

                        </LinearGradient>
                    </TouchableOpacity>
                )

            default:
                break;
        }

    }

    return (
        <View style={[styles.container, myMessage && { flexDirection: "row-reverse", }]}>
            <View style={styles.imageSection}>
                {
                    message.sender.profilePicture && showSender &&
                    <Image source={{ uri: getMediaUri(message.sender.profilePicture.path) }} style={styles.userImage} />
                }
                {
                    !message.sender.profilePicture && showSender &&
                    <Image source={require("../../../assets/illustrations/gravater-icon.png")} style={styles.userImage} />
                }
                {
                    sending && (message.type == "image" || message.type == "video") &&
                    <ActivityIndicator color={"#aaa"} style={styles.loading}></ActivityIndicator>
                }
            </View>
            <View style={styles.contentSection}>
                {renderContent()}
            </View>
        </View>

    )

}


const lightStyles = StyleSheet.create({
    container: {
        flexDirection: "row",
    },
    check: {
        marginLeft: 8,
        fontSize: 10,
        color: "#eee",
        marginTop: 6
    },
    seenMessage: {
        color: "#FFD700"
    },
    userImage: {
        width: 38,
        height: 38,
        borderRadius: 48
    },
    imageSection: {
        paddingHorizontal: 16,
        justifyContent: "space-between",
        paddingBottom: 8,
        width: 64,

        alignItems: "center"

    },
    contentText: {
        padding: 6,
        paddingHorizontal: 12,
        borderTopRightRadius: 16,

        maxWidth: WIDTH * 0.75,
        borderBottomRightRadius: 16,
        borderBottomLeftRadius: 16,
        marginBottom: 8,
        alignSelf: 'flex-start',
    },
    text: {
        fontFamily: textFonts.regular,
        fontSize: 10,

        display: "flex",


    },
    time: {
        color: "#555",
        fontSize: 8,

        textAlign: "right"
    },
    sendContentText: {
        borderTopLeftRadius: 16,
        borderTopRightRadius: 0,
        alignSelf: "flex-end",
        flexDirection: "row-reverse"

    },
    messageImage: {
        width: "75%",
        height: 160,
        resizeMode: 'cover',
        borderRadius: 12,
        marginBottom: 8
    },

    contentSection: {
        flex: 1,
    },
    mediaCheck: {
        position: "absolute",
        bottom: 16,
        right: 16,
        color: "white"
    },


    post: {
        alignItems: "flex-end"
    },
    postTitle: {
        fontFamily: textFonts.regular,
        fontSize: 10,
        lineHeight: 16,
        marginTop: 8
    },
    posterUserImage: {
        width: 24,
        height: 24,
        borderRadius: 36
    },
    posterInfo: {
        flexDirection: "row-reverse",
        alignItems: "center",

    },
    fullanme: {
        fontFamily: textFonts.bold,
        fontSize: 10,
        paddingRight: 10
    },
    postImage: { 

        width : WIDTH / 2 ,  
        height:  WIDTH / 3,
        borderRadius: 12,
        marginTop: 8
    },
    recivingInfo: {
        flexDirection: "row-reverse",
        alignItems: "center",
    },

    accountInfo: {
        flexDirection: "row-reverse",
        alignItems: "center"

    },

    accountImage: {
        width: 56,
        height: 56 , 
        borderRadius : 56 
    },
    sharedAccountInfo: {
        width: "75%",
        padding: 12

    },
    accountFullanme: {
        textAlign: "right",
        fontSize: 14,
        fontWeight: "bold",
        fontFamily: textFonts.bold
    },
    accountUsername: {
        fontWeight: "100",
        fontSize: 12,
        color: "#888",
        textAlign: "right"
    } , 
    
    

});
const darkStyles = {
    ...lightStyles,
    whiteText: {
        color: darkTheme.textColor
    },
    /*
    postTitle: {
        fontFamily: textFonts.regular,
        fontSize: 10,
        lineHeight: 16,
        marginTop: 8 , 
        color: darkTheme.secondaryTextColor
    },
    fullanme: {
        fontFamily: textFonts.bold,
        fontSize: 10,
        paddingRight: 10 , 
        color: darkTheme.textColor
    },
    */
}