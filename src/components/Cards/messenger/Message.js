import { LinearGradient } from "expo-linear-gradient";
import { View, Text, StyleSheet, Image, Dimensions, TouchableOpacity, ActivityIndicator } from "react-native";
import { getMediaUri } from "../../../api";
import { textFonts } from "../../../design-system/font";
import RecordPlayer from "../RecordPlayer";
import { Video } from "expo-av";
import { FontAwesome5 } from '@expo/vector-icons';
import { useContext, useEffect } from "react";
import ThemeContext from "../../../providers/ThemeContext";
import darkTheme from "../../../design-system/darkTheme";

const WIDTH = Dimensions.get("screen").width;
export default function Message({ message, openImage, openVideo, showSender, lastSeenAt }) {

    const { myMessage, sending } = message;
    var textBackground = ["#E8E7E8", "#EFEFEF"];

    const themeContext = useContext(ThemeContext);
    const styles = themeContext.getTheme() == "light" ? lightStyles : darkStyles;


    if (themeContext.getTheme() == "dark") {

        textBackground = [darkTheme.secondaryBackgroundColor, darkTheme.secondaryBackgroundColor];
    }
    if (myMessage) {

        textBackground = ['#BAD0FD', "#BBD2FE"];


    }






    function renderContent() {

        switch (message.type) {
            case "text":
                return (
                    <LinearGradient
                        colors={textBackground}
                        style={[styles.contentText, myMessage && styles.sendContentText]}>
                        {myMessage && !sending &&
                            <FontAwesome5 name="check-double" style={[styles.check, lastSeenAt && lastSeenAt > message.createdAt && styles.seenMessage]} />}
                        <Text style={[styles.text , !myMessage && styles.whiteText ]}>
                            {message.content}
                        </Text>
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
                            {myMessage && !sending &&
                                <FontAwesome5 name="check-double" style={[styles.check, lastSeenAt && lastSeenAt > message.createdAt && styles.seenMessage]} />}

                        </View>
                        :
                        <LinearGradient
                            colors={textBackground}
                            style={[styles.contentText, myMessage && styles.sendContentText, { flexDirection: "column" }]}>
                            <Text style={[styles.text, { marginBottom: 4 } ,  !myMessage && styles.whiteText]}>
                                {message.content}

                            </Text>
                            {sending && message.type == "text" &&
                                <ActivityIndicator color={"white"} style={[styles.loading, { marginRight: 8 }]} size={16}></ActivityIndicator>}
                            <View style={{
                                width: WIDTH * 0.5, marginBottom: 8, alignSelf: "flex-start", alignItems: "flex-end"
                            }}>
                                <RecordPlayer uri={message.media.uri} />

                                {myMessage && !sending &&
                                    <FontAwesome5 name="check-double" style={[styles.check, lastSeenAt && lastSeenAt > message.createdAt && styles.seenMessage]} />}

                            </View>
                        </LinearGradient>


                );
            case "image":
                return (
                    <TouchableOpacity onPress={() => openImage(message.media.uri)}>
                        <Image source={{ uri: message.media.uri }} style={[styles.messageImage, myMessage && { alignSelf: "flex-end" }]} />
                        {myMessage && !sending &&
                            <FontAwesome5 name="check-double" style={[styles.check, styles.mediaCheck, lastSeenAt && lastSeenAt > message.createdAt && styles.seenMessage]} />}
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
                        {myMessage && !sending &&
                            <FontAwesome5 name="check-double" style={[styles.check, styles.mediaCheck, lastSeenAt && lastSeenAt > message.createdAt && styles.seenMessage]} />}

                    </TouchableOpacity>
                );
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
        padding: 8,
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
        fontSize: 12,
        
        display: "flex",


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
    }
});
const darkStyles = {
    ...lightStyles,
    whiteText : { 
        color : darkTheme.textColor
    }
}