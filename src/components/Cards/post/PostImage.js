import { useCallback, useEffect, useState } from "react";
import { View, Image, Text, StyleSheet, Dimensions, TouchableOpacity } from "react-native";
import { getMediaUri } from "../../../api";

const WIDTH = Dimensions.get("screen").width;

export default function PostImage({ post, navigation }) {

    const [images, setImages] = useState([]);
    const viewImage = useCallback((imageIndex) => {

        navigation.navigate("ImageViewer", {
            images: images,
            imageIndex: imageIndex
        })

    }, [navigation , images]);


    useEffect(() => {


        for (let index = 0; index < post.media.length; index++) {
            if (!post.media[index].uri && post.media[index].path)
                post.media[index].uri = getMediaUri(post.media[index].path);
        }

        setImages(post.media) ; 

    }, [post.media])
    return (
        <View style={styles.container}>
            {
                images.length == 1 &&
                <View style={styles.row}>
                    <TouchableOpacity onPress={() => viewImage(0)} style={[styles.image, styles.imageContainer]}>
                        <Image source={images[0]} style={styles.image} />
                    </TouchableOpacity>
                </View>
            }
            {
                images.length >= 2 &&
                <View style={styles.row}>
                    <TouchableOpacity onPress={() => viewImage(0)} style={[styles.image, styles.gridImage, styles.imageContainer]}>
                        <Image source={images[0]} style={[styles.image, styles.gridImage]} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => viewImage(1)} style={[styles.image, styles.gridImage, styles.imageContainer]}>
                        <Image source={images[1]} style={[styles.image, styles.gridImage]} />
                    </TouchableOpacity>
                </View>

            }
            {
                images.length == 3 &&
                <View style={styles.row}>
                    <TouchableOpacity onPress={() => viewImage(2)} style={[styles.image, styles.gridImage, styles.imageContainer]}>
                        <Image source={images[2]} style={[styles.image, styles.gridImage]} />
                    </TouchableOpacity>
                </View>
            }
            {
                images.length >= 4 &&
                <View style={styles.row}>
                    <TouchableOpacity onPress={() => viewImage(2)} style={[styles.image, styles.gridImage, styles.imageContainer]}>
                        <Image source={images[2]} style={[styles.image, styles.gridImage]} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => viewImage(3)} style={[styles.image, styles.gridImage, styles.imageContainer]}>
                        <Image source={images[3]} style={[styles.image, styles.gridImage]} />
                        {
                            images.length > 4 && 
                            <TouchableOpacity style={styles.plus} onPress={() => viewImage(0)}>
                                <Text style={styles.plusText}>
                                    + {images.length - 4}
                                </Text>
                            </TouchableOpacity>
                        }
                    </TouchableOpacity>
                </View>

            }
        </View>
    )


};

const styles = StyleSheet.create({
    container: {

        paddingVertical: 16
    },
    image: {
        height: 360,
        width: "100%",
        resizeMode: "cover",



    },
    imageContainer: {
        margin: 1,
    },
    row: {
        flexDirection: "row",
        marginHorizontal: -2,

    },

    gridImage: {
        width: undefined,
        flex: 1,
        height: WIDTH / 2 - 32,
    } , 
    plus : { 
        position : "absolute" , 
        width : "100%" , 
        height : "100%" , 
        backgroundColor : "rgba(0,0,0,.6)" , 
        alignItems : "center" , 
        justifyContent : "center"
    }  , 
    plusText : { 
        color : "white" , 
        fontSize : 24
    }
})