import { useCallback, useContext, useEffect, useRef, useState } from "react";
import {
    Text,
    View,
    StyleSheet,
    Image,
    TextInput,
    Keyboard,
    TouchableOpacity,
    Dimensions
} from "react-native";
import Header from "../components/Cards/Header";
import NewPostUploader from "../components/Cards/NewPostUploader";
import PostImage from "../components/Cards/post/PostImage";
import darkTheme from "../design-system/darkTheme";
import { textFonts } from "../design-system/font";
import ThemeContext from "../providers/ThemeContext";
import { AuthContext } from "../providers/AuthContext";
import { getMediaUri } from "../api";
import { ApolloContext } from "../providers/ApolloContext";
import { ReactNativeFile } from "apollo-upload-client";
import { gql } from "@apollo/client";
import { manipulateAsync, SaveFormat } from "expo-image-manipulator";
import { Video, getRealPath } from 'react-native-compressor';

import * as VideoThumbnails from 'expo-video-thumbnails';


import BackgroundService from 'react-native-background-actions';
import { useEvent } from "../providers/EventProvider";
import { compreessImage, createRNUploadableFile } from "../providers/MediaProvider";

const WIDTH = Dimensions.get("screen").width;

export default function NewPost({ navigation }) {


    const inputRef = useRef();
    const [text, setText] = useState("");
    const [numberOfLines, setNumOfLines] = useState(1);
    const [disabled, setDisabled] = useState(true);
    const [user, setUser] = useState(null);
    const auth = useContext(AuthContext);
    const client = useContext(ApolloContext);


    const event = useEvent()

    const [post, setPost] = useState({
        media: []
    });

    const [images, setImages] = useState([]);
    const [video, setVideo] = useState(null);



    useEffect(() => {
        const subscription = Keyboard.addListener("keyboardDidHide", () => {
            inputRef.current?.blur();
        });
        (async () => {
            const userAuth = await auth.getUserAuth();
            setUser(userAuth.user);
        })()

        return subscription.remove;
    }, []);


    useEffect(() => {

        const lines = text.split("\n").length;
        if (lines >= 4)
            setNumOfLines(4);
        else
            setNumOfLines(lines)
    }, [text]);


    useEffect(() => {
        setDisabled(!(text.trim().length > 1 || images.length > 0 || video))
    }, [text, images, video])


    const onImagesChanged = useCallback((data) => {
        setPost({
            media: data
        });
        setImages(data);
    }, []);

    const onVideoChange = useCallback((data) => {
        setVideo(data)
    }, []);


    const createPost = async (params) => {





        var { client, event, text, images, video } = params;

        var media = [];
        var type = "note";
        var thumbnail = null;
        // if the images where selected 
        // then loop over them and resize and compress them into one media array 
        if (images.length > 0) {
            type = "image";
            for (let index = 0; index < images.length; index++) {
                media.splice(0, 0, await createRNUploadableFile(images[index].uri));
            }
        }


        // in case the video was selected then we need to estabilish a compression and keep the user informed 
        // in case the compress failed we continue with uncompressed video 
        if (video) {

            var compressedFileUrl = null;
            type = "reel";

            try {

                compressedFileUrl = await Video.compress(
                    video.uri,
                    {
                        compressionMethod: "auto",

                    },
                    async (progress) => {
                        await BackgroundService.updateNotification({
                            taskDesc: "يتم الآن ضغط الريلز يرجى الإنتظار",
                            progressBar: {
                                max: 100,
                                value: Math.round(progress * 100),
                            }
                        }); // Only Android, iOS will ignore this call

                    }
                )


                if (compressedFileUrl.startsWith("file://")) {
                    compressedFileUrl = compressedFileUrl.replace("file://", "file:///");

                }

                console.log(compressedFileUrl);
            } catch (error) {
                console.log(error);
            }

            // extract a thumbnail for the video
            try {
                const { uri } = await VideoThumbnails.getThumbnailAsync(
                    video.uri,
                    {
                        time: 15000,
                    }
                );
                thumbnail = await createRNUploadableFile(uri);
            } catch (e) {
                return;
            }

            if (compressedFileUrl)
                video.uri = compressedFileUrl

            media = [await createRNUploadableFile(video.uri)];


        }



        try {
            var response = await client.mutate({
                mutation: gql`
            mutation CREATE_POST($postInput : PostInput!) {
                createPost(postInput: $postInput) { 
                    id 
                    title 
                    type 
                    media {
                        id path 
                    }
                    reel {
                        id 
                        views 
                        thumbnail { 
                            id path 
                        }
                    }
                    createdAt 
                    updatedAt 
                }
            }` ,
                variables: {
                    postInput: {
                        title: (text.trim().length > 0) ? text.trim() : null,
                        media: media,
                        type: type,
                        reel: (type == "reel") ? ({
                            thumbnail: thumbnail
                        }) : null
                    }
                }
            });


            if (response) {

                var newPost = response.data.createPost;
                newPost.user = user;
                newPost.likes = 0;
                newPost.liked = false;
                newPost.isFavorite = false;
                newPost.numComments = 0;

                event.emit("new-post", newPost);
            }
        } catch (error) {
            

            await BackgroundService.stop();
        }
        setTimeout(async () => {
            await BackgroundService.stop();

        }, 10000)

    }

    const newPost = useCallback(() => {
        (async () => {
            try {
                const options = {
                    taskName: 'UPLOAD_CONTENT',
                    taskTitle: 'رفع المحتوى',
                    taskDesc: '.. تحميل المحتوى الخاص بك الرجاء الانتظار',
                    taskIcon: {
                        name: 'ic_launcher',
                        type: 'mipmap',
                    },
                    color: '#ff00ff',
                    linkingURI: 'yourSchemeHere://chat/jane', // See Deep Linking for more info
                    parameters: {
                        text: text,
                        images: images,
                        video: video,
                        client: client,
                        event: event
                    },
                };


                await BackgroundService.start(createPost, options);
                navigation.goBack();
                // iOS will also run everything here in the background until .stop() is called
            } catch (error) {


                createPost({ client, event, text, images, video });
                navigation.goBack();

            }
        })();


    }, [event, client, text, images, video])


    const themeContext = useContext(ThemeContext);
    const styles = themeContext.getTheme() == "light" ? lightStyles : darkStyles

    return (
        <View style={styles.container}>
            <Header navigation={navigation} />
            <View style={styles.content}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={newPost} style={[styles.outlineButton, disabled && styles.disabled]} disabled={disabled}>
                        <Text style={styles.outlineText}>
                            شارك
                        </Text>
                    </TouchableOpacity>
                    {
                        user &&
                        <View style={styles.userInfo}>
                            {
                                user.profilePicture &&
                                <Image source={{ uri: getMediaUri(user.profilePicture.path) }} style={styles.userImage} />
                            }
                            {
                                !user.profilePicture &&
                                <Image style={styles.userImage} source={require("../assets/illustrations/gravater-icon.png")} />
                            }
                            <Text style={styles.fullname}>
                                {user.name} {user.lastname}
                            </Text>
                        </View>
                    }
                </View>
                <TextInput
                    placeholder="ماذا تريد ان تكتب"
                    style={styles.input}
                    ref={inputRef}
                    multiline
                    numberOfLines={numberOfLines}
                    onChangeText={setText}
                    placeholderTextColor={styles.placeholderTextColor}

                >
                    <Text style={styles.inputText} >
                        {text}
                    </Text>
                </TextInput>
                {
                    post.media.length > 0 &&
                    <PostImage
                        post={post}
                        navigation={navigation}
                    />
                }
                {
                    video &&
                    <TouchableOpacity style={styles.videoContainer}>
                        <Image source={video} style={styles.video} />
                    </TouchableOpacity>
                }


            </View >
            <NewPostUploader

                onImagesChanged={onImagesChanged}
                onVideoChange={onVideoChange}
            />
        </View>
    )
}


const lightStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "white"
    },
    blueIcon: {
        color: "blue",
        fontSize: 18
    },
    userImage: {
        width: 48,
        height: 48,
        borderRadius: 64
    },
    userInfo: {

        alignItems: "center",
        paddingHorizontal: 16,

        flexDirection: "row-reverse"
    },
    fullname: {
        fontFamily: textFonts.semiBold,
        paddingRight: 16
    },
    username: {
        color: "#666",
        fontSize: 12
    },
    content: {
        flex: 1,
        marginTop: 16,
    },
    input: {
        padding: 16,
        fontFamily: textFonts.regular,
        marginTop: 16,
        paddingTop: 0,
        paddingBottom: 0,


        textAlignVertical: "top",

    },
    outlineButton: {
        width: 86,
        backgroundColor: "#1A6ED8",

        borderRadius: 26,
        flexDirection: "row",
        justifyContent: "center",
        paddingVertical: 4,
        alignItems: "center",
        height: 36,
    },
    outlineText: {
        fontFamily: textFonts.regular,
        color: "white",

    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        paddingLeft: 16,
    },

    disabled: {
        opacity: 0.5
    },
    video: {
        width: WIDTH,
        height: WIDTH,
        resizeMode: "contain",

    },
    videoContainer: {
        marginVertical: 16,
        height: "100%",
        width: "100%",
    }

});

const darkStyles = {
    ...lightStyles,
    placeholderTextColor: darkTheme.secondaryTextColor,
    container: {
        flex: 1,
        backgroundColor: darkTheme.secondaryBackgroundColor
    },

    fullname: {
        fontFamily: textFonts.semiBold,
        paddingRight: 16,
        color: darkTheme.textColor
    },
    username: {
        color: "#666",
        fontSize: 12,
        color: darkTheme.secondaryTextColor
    },

    input: {
        padding: 16,
        fontFamily: textFonts.regular,
        marginTop: 16,
        paddingTop: 0,
        paddingBottom: 0,
        textAlignVertical: "top",
        color: darkTheme.textColor

    },
}


/*

    const createPost = async () => {

        var media = [];
        var type = "note";
        var thumbnail = null;
        if (images.length > 0) {

            type = "image";

            for (let index = 0; index < images.length; index++) {

                var image = images[index];

                const manipResult = await manipulateAsync(
                    image.uri,
                    [{ resize: { width: 512 } }],
                    { format: 'jpeg' }
                );

                media.splice(0, 0, new ReactNativeFile({
                    type: "image/jpeg",
                    name: "image",
                    uri: manipResult.uri
                }));
            }
        } if (video) {

            type = "reel";
            var compressedFileUrl = null;

            try {
                compressedFileUrl = await Video.compress(
                    video.uri,
                    {
                        compressionMethod: "auto",
                        maxSize: 520,
                        minimumFileSizeForCompress: 3
                    },
                    (progress) => {
                        console.log({ compression: progress });
                    }
                )
            } catch (error) {
                //       alert("Compression Failed " + error);
            }
            if (compressedFileUrl) {
                video.uri = compressedFileUrl
            }

            try {
                const { uri } = await VideoThumbnails.getThumbnailAsync(
                    video.uri,
                    {
                        time: 15000,
                    }
                );

                thumbnail = new ReactNativeFile({
                    type: "image/jpeg",
                    name: "thumbnail",
                    uri: uri
                });


            } catch (e) {

                alert("Failed to generate thumbnail " + e.message);

                return;
            }

            media = [new ReactNativeFile({
                type: "video/mp4",
                name: "video",
                uri: video.uri
            })]
        }

        var response = await client.mutate({
            mutation: gql`
        mutation CREATE_POST($postInput : PostInput!) {
            createPost(postInput: $postInput) { 
                id 
                title 
                type 
                media {
                    id path 
                }
                reel {
                    id 
                    views 
                    thumbnail { 
                        id path 
                    }
                }
                createdAt 
                updatedAt 
            }
        }` ,
            variables: {
                postInput: {
                    title: (text.trim().length > 0) ? text.trim() : null,
                    media: media,
                    type: type,
                    reel: (type == "reel") ? ({
                        thumbnail: thumbnail
                    }) : null
                }
            } 
        }) ;  
        if ( response ) { 
            var newPost = response.data.createPost ; 
            newPost.user = user ; 
            newPost.likes = 0 ; 
            newPost.liked = false ; 
            newPost.isFavorite = false ; 
            newPost.numComments = 0 ; 

            event.emit("new-post" , newPost) ; 
        }
    }
    


*/ 