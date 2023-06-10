import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image } from "react-native";
import { SimpleLineIcons, AntDesign, FontAwesome } from '@expo/vector-icons';
import { textFonts } from "../../design-system/font";
import * as DocumentPicker from 'expo-document-picker';
import { useCallback, useContext, useEffect, useState } from "react";
import ThemeContext from "../../providers/ThemeContext";
import darkTheme from "../../design-system/darkTheme";
import * as ImagePicker from 'expo-image-picker';

export default function NewPostUploader({ onImagesChanged, onVideoChange, defaultImages = [], defaultVideo = null, type = null }) {

    const [images, setImages] = useState([]);
    const [video, setVideo] = useState(null);


    useEffect(() => {
        if (defaultImages && defaultImages.length > 0)
            setImages(defaultImages);
        if (defaultVideo)
            setVideo(defaultVideo);
    }, [defaultImages, defaultVideo])

    const pickImage = useCallback(() => {

        (async () => {

            let result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsMultipleSelection: true,
                quality: 0.2

            });
            if (result.canceled != "cancel") {
                setImages([...images, ...result.assets]);

            }
        })();
    }, [images])



    const pickVideo = useCallback(() => {

        (async () => {

            let result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Videos,

            });
            if (result.canceled != "cancel") {
                setVideo(result.assets[0]);
                onVideoChange(result.assets[0])

            }


        })()
    }, [video]);



    const deleteImage = useCallback((uri) => {
        setImages(images.filter((image) => image.uri != uri));
    }, [images]);



    const deleteVideo = useCallback(() => {
        setVideo(null);
        onVideoChange(null )
    }, [video])


    useEffect(() => {
        onImagesChanged(images);
    }, [images]);

 


    const themeContext = useContext(ThemeContext);
    const styles = themeContext.getTheme() == "light" ? lightStyles : darkStyles



    return (
        <View style={styles.container}>

            {
                type == "image" &&
                <TouchableOpacity style={[styles.option, images.length > 0 && styles.activeOption]} onPress={pickImage}>
                    <SimpleLineIcons name="picture" style={styles.icon} />
                    <Text style={styles.text}>
                        صورة
                    </Text>
                </TouchableOpacity>

            }
            {
                type == "reel" &&
                <TouchableOpacity style={[styles.option, video && styles.activeOption]} onPress={pickVideo}>
                    <AntDesign name="videocamera" style={styles.icon} />

                    <Text style={styles.text}>
                        ريلز
                    </Text>
                </TouchableOpacity>
            }


            {
                (images.length == 0 && !type) &&
                <TouchableOpacity style={[styles.option, video && styles.activeOption]} onPress={pickVideo}>
                    <AntDesign name="videocamera" style={styles.icon} />

                    <Text style={styles.text}>
                        ريلز
                    </Text>
                </TouchableOpacity>
            }
            {

                (!video && !type) &&
                <TouchableOpacity style={[styles.option, images.length > 0 && styles.activeOption]} onPress={pickImage}>
                    <SimpleLineIcons name="picture" style={styles.icon} />
                    <Text style={styles.text}>
                        صورة
                    </Text>
                </TouchableOpacity>
            }
            {
                (images.length > 0) &&
                <ScrollView style={styles.mediaContent} horizontal>
                    {
                        images.map((image) => (
                            <View style={styles.mediaContainer}>
                                <TouchableOpacity style={styles.closeButton} onPress={() => deleteImage(image.uri)}>
                                    <FontAwesome name="times" size={24} color="red" />

                                </TouchableOpacity>
                                <Image source={image} style={styles.media} />
                            </View>
                        ))
                    }
                </ScrollView>


            }
            {
                video &&
                <ScrollView horizontal style={[styles.mediaContent]}>
                    <View style={styles.mediaContainer}>
                        <TouchableOpacity style={styles.closeButton} onPress={deleteVideo}>
                            <FontAwesome name="times" size={24} color="red" />
                        </TouchableOpacity>
                        <Image source={video} style={styles.media} />
                    </View>
                </ScrollView>

            }
        </View>
    )

};

const lightStyles = StyleSheet.create({
    container: {
        height: 86,
        flexDirection: "row",
        backgroundColor: "white"
    },
    option: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",

    },
    icon: {
        color: "#1A6ED8",
        fontSize: 18
    },
    text: {
        color: "#1A6ED8",
        fontFamily: textFonts.bold
    },
    mediaContainer: {
        width: 48,
        height: "100%",
        justifyContent: "center",
        marginRight: 8
    },
    media: {
        backgroundColor: "black",
        width: "100%",
        height: "100%",
        borderRadius: 8
    },
    closeButton: {
        position: "absolute",
        zIndex: 99,
        alignSelf: "center",
        borderRadius: 24,
        backgroundColor: "white",
        width: 24,
        height: 24,
        alignItems: "center",
        justifyContent: "center",
        elevation: 4
    },
    mediaContent: {
        paddingVertical: 8
    },
    activeOption: {
        width: 112,
        flex: 0,
    }

})


const darkStyles = {
    ...lightStyles,
    container: {
        height: 86,
        flexDirection: "row",
        backgroundColor: darkTheme.backgroudColor
    },
}