
import { View, Text, StyleSheet, Image, SafeAreaView } from "react-native";
import { textFonts } from "../../../design-system/font";
import react, { useEffect } from "react";
import { getMediaUri } from "../../../api";
import StoryComments from "./StoryComments";


function StoryView({ story, currentStory }) {





    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.userHeader}>
                {

                    story.user.profilePicture &&
                    <Image source={{ uri: getMediaUri(story.user.profilePicture.path) }} style={styles.userImage} />

                }
                {

                    !story.user.profilePicture &&
                    <Image source={require("../../../assets/illustrations/gravater-icon.png")} style={styles.userImage} />

                }
                <Image source={story.user.image} style={styles.userImage} />
                <Text style={styles.username}>{story.user.name} {story.user.lastname}</Text>
            </View>
        
                <StoryComments story={story} currentStory={currentStory} />

     


            <Image source={{ uri: getMediaUri(story.media.path) }} style={styles.image} />
        </SafeAreaView>

    )
};

export default react.memo(StoryView);

const styles = StyleSheet.create({
    container: {
        width: "100%",
        height: "100%",
        position: "relative",
    },
    
    image: {
        flex: 1,
        width: "100%",
        resizeMode: "cover",
        backgroundColor: "black" , 
 
    },
    userHeader: {
        position: "absolute",
        width: "100%",
        zIndex: 99,
        flexDirection: "row-reverse",

        paddingTop: 42,
        alignItems: "center",
        paddingHorizontal: 16
    },
    userImage: {
        width: 42,
        height: 42,
        borderRadius: 48
    },
    username: {
        color: "white",
        fontFamily: textFonts.regular,
        marginRight: -16
    },
})
