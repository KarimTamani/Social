import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView } from "react-native";
import { textFonts } from "../../design-system/font";
import { FontAwesome } from '@expo/vector-icons';
import * as DocumentPicker from 'expo-document-picker';
import { useCallback, useContext, useEffect, useState } from "react";
import ThemeContext from "../../providers/ThemeContext";
import darkTheme from "../../design-system/darkTheme";

export default function FormUploader({ placeholder = "الصور أو الفيديو", style, noDisplay = false, oneImage = false, onChanges, mediaType = ["image/*"], defaultImages },) {

    const [images, setImages] = useState([]);
    const [video, setVideo] = useState(null);

    const themeContext = useContext(ThemeContext);
    const styles = themeContext.getTheme() == "light" ? lightStyles : darkStyles;


    useEffect(() => {



        if (defaultImages && defaultImages.length > 0)
            setImages(defaultImages);


    }, [defaultImages])

    const pickMedia = useCallback(() => {

        var type = mediaType;
        /*
        if (!video)
            type.push("video/mp4");
        */
        (async () => {
            let result = await DocumentPicker.getDocumentAsync({
                type: type
            });
            if (result.type != "cancel") {

                if (result.mimeType.startsWith('image')) {
                    if (!oneImage) {
                        setImages([...images, result])
                        onChanges && onChanges([...images, result])
                    }
                    else {
                        setImages([result]);
                        onChanges && onChanges([result])
                    }
                } else if (result.mimeType.startsWith("video")) {

                    setVideo(result);
                    onChanges && onChanges(result);
                }

            }
        })();
    }, [images]);


    const deleteImage = useCallback((uri) => {

        setImages(images.filter(image => image.uri != uri));

    }, [images]);


    const deleteVideo = useCallback(() => {

        setVideo(null);
    }, [])
    return (
        <View style={[{ marginVertical: 16, paddingVertical: 8 }, style]}>
            <TouchableOpacity style={styles.button} onPress={pickMedia}>
                <Text style={styles.text}>
                    {placeholder}
                </Text>
                <Image source={require("../../assets/icons/wish-list.png")} style={{ width: 32, height: 32 }} />
            </TouchableOpacity>

            {
                !noDisplay &&
                <ScrollView style={styles.mediaList}>
                    {

                        video &&
                        <View style={styles.mediaContainer} key={video.uri} >
                            <TouchableOpacity onPress={deleteVideo}>
                                <FontAwesome name="trash-o" style={[styles.trashIcon]} />
                            </TouchableOpacity>
                            <Image source={video} style={styles.image} />
                        </View>

                    }

                    {
                        images.map(image => (
                            <View style={styles.mediaContainer} key={image.uri}>
                                <TouchableOpacity onPress={() => deleteImage(image.uri)}>
                                    <FontAwesome name="trash-o" style={[styles.trashIcon]} />
                                </TouchableOpacity>
                                <Image source={image} style={styles.image} />
                            </View>
                        ))
                    }
                </ScrollView>
            }

        </View>
    )
};


const lightStyles = StyleSheet.create({
    button: {
        backgroundColor: "#eee",
        padding: 16,
        paddingVertical: 8,
        borderRadius: 8,
        flexDirection: "row",
        justifyContent: "flex-end",
        alignItems: "center"

    },
    text: {
        fontFamily: textFonts.regular,
        color: "#888",
        paddingRight: 16
    },
    image: {
        height: 64,
        width: 48,
        borderRadius: 4
    },
    mediaContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        paddingVertical: 8,
        borderBottomColor: "#eee",
        borderBottomWidth: 1,
        alignItems: "center"
    },
    trashIcon: {
        fontSize: 24,
        color: "red"
    }
});

const darkStyles = {
    ...lightStyles,
    button: {
        backgroundColor: darkTheme.secondaryBackgroundColor,
        padding: 16,
        paddingVertical: 12,
        borderRadius: 8,
        flexDirection: "row",
        justifyContent: "flex-end",
        alignItems: "center"

    },

    mediaContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        paddingVertical: 8,
        borderBottomColor: darkTheme.borderColor,
        borderBottomWidth: 1,
        alignItems: "center"
    },

} 