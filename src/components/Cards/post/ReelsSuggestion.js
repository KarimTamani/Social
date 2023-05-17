import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Dimensions } from "react-native";
import { Foundation } from '@expo/vector-icons';
import { Entypo } from '@expo/vector-icons';
import { textFonts } from "../../../design-system/font";
import { useCallback, useContext, useEffect, useState } from "react";
import { LinearGradient } from "expo-linear-gradient";
import { AntDesign } from '@expo/vector-icons';
import ThemeContext from "../../../providers/ThemeContext";
import darkTheme from "../../../design-system/darkTheme";
import { getMediaUri } from "../../../api";
import { useEvent } from "../../../providers/EventProvider";
const WIDTH = Dimensions.get("screen").width;
const HEIGHT = Dimensions.get("screen").height;

export default function ReelsSuggestion(props) {


    const {navigation} = props ;  

    const themeContext = useContext(ThemeContext);
    const styles = themeContext.getTheme() == "light" ? lightStyles : darkStyles;
    const [reels , setReels] = useState(props.reels) ; 

    const event = useEvent() ; 



    const openSuggestions = useCallback((reelId) => {
        navigation.navigate("ReelsViewer", {

            focusPostId: reelId ? reelId : null ,
            getReels: () => reels , 
            fetchMore : true 

        }) ; 
    }, [reels]);


    useEffect(() => { 

        const updatePostLikes = (postId, value, numLikes) => {
            const index = reels.findIndex(post => post.id == postId);
            if (index >= 0) {

                var newPostsState = [...reels];
                newPostsState[index] = {
                    ...reels[index],
                    liked: value,
                    likes: numLikes
                };


                setReels(newPostsState);

            }

        }
        const updatePostFavorite = (postId, value) => {
            const index = reels.findIndex(post =>  post.id == postId);

            if (index >= 0) {
                var newPostsState = [...reels];
                newPostsState[index] = {
                    ...reels[index],
                    isFavorite: value,
                };
                setReels(newPostsState);
            }

        }
        const updatePostComments = (postId, value) => {
            const index = reels.findIndex(post =>  post.id == postId);

            if (index >= 0) {
                var newPostsState = [...reels];
                newPostsState[index] = {
                    ...reels[index],
                    numComments: value,
                };
                setReels(newPostsState);
            }
        }


        const updateProfile = (profile) => {

            var newState = reels.map(reel => {
                if (reel.user.id == profile.id)
                    reel.user = profile;
                return reel;
            });

            setReels([...newState]);

        };
        event.addListener("update-post-likes", updatePostLikes);
        event.addListener("update-post-comments", updatePostComments);
        event.addListener("update-post-favorite", updatePostFavorite);
        event.addListener("update-profile", updateProfile);
 
        return () => {
     
            event.removeListener("update-post-likes", updatePostLikes);
            event.removeListener("update-post-comments", updatePostComments);
            event.removeListener("update-post-favorite", updatePostFavorite);
            event.removeListener("update-profile", updateProfile);
        }
    } , [reels]) 





    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <View style={styles.section}>

                    <LinearGradient
                        // Button Linear Gradient
                        colors={['#FE0000', '#4348D2']}
                        start={{ x: 0, y: 0.5 }}
                        end={{ x: 1, y: 0.5 }}
                        style={styles.button}>
                        <TouchableOpacity style={{ flexDirection: "row", alignItems: "center" }}
                            onPress={() => openSuggestions()}>

                            <Text style={[styles.text, { color: "white", fontSize: 10 }]}>
                                مشاهدة الكل
                            </Text>
                            <Entypo name="controller-play" size={16} color="white" />
                        </TouchableOpacity>

                    </LinearGradient>
                </View>
                <View style={[styles.section, { justifyContent: "flex-end" }]}>
                    <Text style={styles.text}>
                        اقتراحات
                    </Text>
                    <Foundation name="play-video" style = { styles.icon } />
                </View>
            </View>
            <ScrollView
                horizontal
                style={styles.list}
            >

                {
                    reels.map((post) => {

                        return (

                            <TouchableOpacity style={styles.reel} key={post.id} onPress={() => openSuggestions(post.id)}>
                                {

                                    <Image source={{ uri: getMediaUri(post.reel.thumbnail.path) }} style={styles.thumbnail} />

                                }
                                <LinearGradient
                                    style={styles.reelBackground}
                                    colors={['#00000000', '#000000']}
                                >


                                    <Text style={styles.reelTitle} numberOfLines={2} ellipsizeMode="tail">
                                        {post.title}
                                    </Text>
                                    <Text style={styles.views}>
                                        <AntDesign name="eye" size={12} color="white" /> {post.reel.views}
                                    </Text>
                                </LinearGradient>

                            </TouchableOpacity>
                        )
                    })

                }


            </ScrollView>
        </View>

    )

};

const lightStyles = StyleSheet.create({
    container: {
        backgroundColor: "white",
        marginTop: 16,
        paddingTop: 8
    },
    header: {
        flexDirection: "row",
        paddingVertical: 8,
        paddingHorizontal: 16,
        justifyContent: "space-between",
        alignItems: "center"

    },
    icon : { 
        fontSize : 24 , 
        color : "black"
    } , 
    section: {
        flexDirection: "row",
        flex: 1,

    },
    button: {
        flexDirection: "row",
        padding: 8,
        
        borderRadius: 50
    },
    text: {
        fontFamily: textFonts.regular,
        fontSize: 12,
        paddingHorizontal: 8,
        fontSize: 14

    },

    thumbnail: {

        width: "100%",
        height: "100%",
        borderRadius: 4,

    },
    reel: {

        width: WIDTH / 3,
        height: WIDTH / 2,
        paddingHorizontal: 4,
        position: "relative",


    },

    list: {
        paddingVertical: 16,

    },
    reelBackground: {
        position: "absolute",
        zIndex: 10,
        width: "100%",
        left: 4,
        height: "50%",
        backgroundColor: "rgba(0,0,0,0.1)",
        borderRadius: 4,

        alignItems: "flex-start",
        justifyContent: "flex-end",
        padding: 8,
        bottom: 0
    },
    reelIcon: {
        fontSize: 32,
        backgroundColor: "white",
        width: 48,
        height: 48,
        textAlign: "center",
        textAlignVertical: "center",
        borderRadius: 64
    },
    reelTitle: {
        color: "white",
        fontFamily: textFonts.regular,
        fontSize: 12,
        lineHeight: 24,

        width: "100%"
    },
    views: {
        color: "white"
    }

});

const darkStyles = {
    ...lightStyles,
    container: {
        backgroundColor: darkTheme.backgroudColor,
        marginTop: 16,
        paddingTop: 8
    },
    text: {
        fontFamily: textFonts.regular,
        fontSize: 12,
        paddingHorizontal: 8,
        fontSize: 14,
        color: darkTheme.textColor
    },
    icon : { 
        fontSize : 24 , 
        color : darkTheme.textColor 
    } , 
}