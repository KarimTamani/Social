import { View, Text, StyleSheet, Image, Dimensions, TouchableOpacity } from "react-native";
import { AntDesign } from '@expo/vector-icons';
import { textFonts } from "../../../design-system/font";
import { LinearGradient } from "expo-linear-gradient";
import { getMediaUri } from "../../../api";
import { useEffect, useState } from "react";


export default function Story({ stories, onPress, user, openAddStoryScreen, mine = false }) {


    const [story, setStory] = useState(null);

    useEffect(() => {

        
   

        if (stories && stories.length > 0) {
            setStory(stories[0]);
        }

    }, [stories])


    if (mine) {


        return (
            <TouchableOpacity style={[styles.container, styles.addStory , !story && !user.profilePicture && styles.whiteBackground]} onPress={openAddStoryScreen}>
                {
                    story &&
                    <Image source={{ uri: getMediaUri(story.media.path) }} style={[styles.image, styles.addImage]} />

                }
                {

                    !story && user.profilePicture &&
                    <Image source={{ uri: getMediaUri(user.profilePicture.path) }} style={[styles.image, styles.addImage]} />

                }
                {

                    !story && !user.profilePicture &&
                    <Image source={require("../../../assets/illustrations/gravater-icon.png")} style={[styles.image, styles.addImage]} />

                }
                <View style={styles.addContainer}>
                    <AntDesign name="pluscircleo" style={styles.addIcon} />
                    <Text style={styles.addText}>
                        أضف قصة
                    </Text>
                </View>
            </TouchableOpacity>
        )

    }
    else if (story)


        return (
 
            <LinearGradient
                // Button Linear Gradient
                colors={['#FE000088', '#4348D2']}
                start={{ x: 0.5, y: 0 }}
                end={{ x: 0.5, y: 1 }}
                style={[styles.container, story.seen && styles.seen]}
            >

                <TouchableOpacity style={styles.storyContainer} onPress={onPress} activeOpacity={0.8}>



                    {

                        user.profilePicture &&
                        <Image source={{ uri: getMediaUri(user.profilePicture.path) }} style={[styles.userImage]} />

                    }
                    {

                        !user.profilePicture &&
                        <Image source={require("../../../assets/illustrations/gravater-icon.png")} style={[styles.userImage]} />

                    }
               
                        
                        <Image source={{ uri: getMediaUri(story.media.path)  }} style={[styles.image]} />
                    
           
                    <LinearGradient
                        style={styles.user}
                        colors={['#00000000', '#000000']}
                    >
                        <Text style={styles.username} numberOfLines={2} ellipsizeMode="tail">
                            {user.name} {user.lastname}
                        </Text>
                    </LinearGradient>

                </TouchableOpacity>
            </LinearGradient>
 
        )

}

const styles = StyleSheet.create({
    whiteBackground :  {
        backgroundColor : "rgba(0,0,0,0.25)"  ,  
    }  ,
    addStory: {
        backgroundColor : "black" , 
        padding: 0,
        transform: [{ scaleX: -1 }]

    },
    storyContainer: {
        flex: 1,
        width: "100%",
        borderRadius: 10,
        overflow: "hidden",
        transform: [{ scaleX: -1 }]
    },
    seen: {
        padding: 0,
        opacity: 0.7
    },
    container: {
        height: 164,
        width: 96,
        position: "relative",
        alignItems: "center",
        padding: 3,
        borderRadius: 12,
        overflow: "hidden",
        marginLeft: 8,

    },

    image: {
        width: "100%",
        height: "100%",
        resizeMode: "cover",
    },
    addImage: {
        opacity: 0.7
    },
    addContainer: {
        position: "absolute",
        alignItems: "center",
        bottom: 8
    },
    addText: {
        color: "white",
        fontSize: 14,
        fontFamily: textFonts.bold , 
        fontWeight : "bold" , 
    },
    addIcon: {
        color: "white",
        fontSize: 28
    },
    user: {
        position: "absolute",
        width: "100%",

        bottom: 0,
        zIndex: 999,
        flexDirection: "row",
        padding: 4,
        height: "50%",
        alignItems: "flex-end"
    },
    userImage: {
        width: 32,
        height: 32,
        borderRadius: 32,

        position: "absolute",
        zIndex: 99,
        right: 8,
        top: 8
    },
    username: {
        flex: 1,
        textAlign: "right",
        paddingRight: 4,
        color: "white",
        textAlignVertical: "center",
        fontSize: 10,
        textAlign: "right",
        paddingBottom: 12,
        paddingRight: 6,
        fontFamily: textFonts.bold

    }
})