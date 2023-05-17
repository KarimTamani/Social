import { useCallback, useEffect, useState } from "react";
import { View, Text, StyleSheet, Image, Dimensions, TouchableOpacity } from "react-native";
import { getMediaUri } from "../../../api";
import { AntDesign } from '@expo/vector-icons';

const width = Dimensions.get("screen").width;


export default function PostVideo({ post , navigation }) {

    const [thumbnail, setThumbnail] = useState(null);

    useEffect(() => {
        if (post.reel && post.reel.thumbnail) {
            setThumbnail(getMediaUri(post.reel.thumbnail.path));
        }
    }, [post]) ; 

    const openReel = useCallback(() => {
        navigation.navigate("ReelsViewer", {
            focusPostId: post.id,
            getReels: () => [post] , 
            fetchMore : false 
        }) ; 

    } , [navigation , post ])

    return (
        <TouchableOpacity style={styles.container} onPress={ openReel }>
         
                {
                    thumbnail &&
                    <Image source={{ uri: thumbnail }} style={styles.thumbnail} />
                }
                <AntDesign name="playcircleo" style={styles.pausePlayIcon} />
             
        </TouchableOpacity>
    )
}


const styles = StyleSheet.create({
    container: {
        height: width,
        width: "100%",
        marginVertical: 16,
        backgroundColor: "black",
        alignItems: "center",
        justifyContent: "center"
    },
    thumbnail: {
        resizeMode: "contain",
        width: width,
        height: "100%",

    },
    pausePlayIcon: {
        color: "white",
        fontSize: 56,
        opacity: 0.8,
        position: "absolute"
    },
})