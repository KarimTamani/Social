import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image, Dimensions, Keyboard, TextInput, FlatList } from "react-native";
import Header from "../components/Cards/Header";
import { useEvent } from "../providers/EventProvider";
import { AuthContext } from "../providers/AuthContext";
import { getMediaUri } from "../api";
import ThemeContext from "../providers/ThemeContext";
import darkTheme from "../design-system/darkTheme";
import { textFonts } from "../design-system/font";
import { ApolloContext } from "../providers/ApolloContext";
import { gql } from "@apollo/client";

import BackgroundService from 'react-native-background-actions';
import PostImage from "../components/Cards/post/PostImage";
import NewPostUploader from "../components/Cards/NewPostUploader";
import { createRNUploadableFile } from "../providers/MediaProvider";

import { Video } from 'react-native-compressor';
import * as VideoThumbnails from 'expo-video-thumbnails';

const WIDTH = Dimensions.get("screen").width;
const HASHTAG_REGEX = /#+([ا-يa-zA-Z0-9_]+)/ig;

export default function EditPost({ route, navigation }) {



    var [post, setPost] = useState(route.params.post);
    const [disabled, setDisabled] = useState(true);
    const [user, setUser] = useState(null);
    const auth = useContext(AuthContext);
    const event = useEvent();
    const inputRef = useRef();
    const [numberOfLines, setNumOfLines] = useState(1);
    const [text, setText] = useState(post.title ? post.title : "");
    const [selection, setSelection] = useState(null);

    const [searchHandler, setSearchHandler] = useState(null);
    const [hashtags, setHashTags] = useState([]);
    const [focusHashTag, setFocusHashTag] = useState(null);
    const client = useContext(ApolloContext);

    const [defaultImage, setDefaultImages] = useState([]);
    const [defaultVideo, setDefaultVideo] = useState(null);

    const [images, setImages] = useState([]);
    const [video, setVideo] = useState(null);
    const [thumbnail , setThumbnail] = useState( null ) ; 




    useEffect(() => {
        const subscription = Keyboard.addListener("keyboardDidHide", () => {
            inputRef.current?.blur();
        });
        (async () => {
            const userAuth = await auth.getUserAuth();
            setUser(userAuth.user);
        })();




        if (post.type == "image") {
            post.media = post.media.map(image => {
                image.uri = getMediaUri(image.path);
                return image;
            });

            setDefaultImages(post.media);
            setImages(post.media);
        }
        if (post.type == "reel" && post.media.length > 0) {



      
            post.media[0].uri = getMediaUri(post.media[0].path);
            post.reel.thumbnail.uri = getMediaUri(post.reel.thumbnail.path) ;  
            setDefaultVideo(post.reel.thumbnail);
            setVideo(post.media[0]);
            setThumbnail(post.reel.thumbnail)
        }

        return subscription.remove;

    }, [])




    useEffect(() => {

        const lines = text.split("\n").length;



        if (lines >= 4)
            setNumOfLines(4);
        else
            setNumOfLines(lines)


    }, [text]);

    const themeContext = useContext(ThemeContext);
    const styles = themeContext.getTheme() == "light" ? lightStyles : darkStyles;


    const processHashTag = (text, hashtags) => {

        if (hashtags.length == 0)
            return [text]

        var sequences = text.split(hashtags[0]);

        if (hashtags.length == 1)
            return [sequences[0], <Text style={styles.hashtag}>{hashtags[0]}</Text>, sequences[1]];
        else if (hashtags.length > 1)
            return [sequences[0], <Text style={styles.hashtag}>{hashtags[0]}</Text>, ...processHashTag(sequences[1], hashtags.slice(1))];
    }

    const renderText = () => {
        var hashtags = text.match(HASHTAG_REGEX);
        if (!hashtags)
            return text;
        else {
            var processedText = processHashTag(text, hashtags);
            return processedText
        }
    }
    useEffect(() => {



        if (post.type == "note" && text.trim().length > 1)
            setDisabled(false);
        else if (post.type == "image" && images.length > 0)
            setDisabled(false);
        else if (post.type == "reel" && video)
            setDisabled(false);
        else
            setDisabled(true)

    }, [text, images, video, post]);



    useEffect(() => {

        if (!selection) 
            return ; 

        const position = selection ? selection.start : text.length;



        var after = text.slice(position);
        var before = text.slice(0, position);
        after = after.split(" ");
        before = before.split(" ");
        var beforeWord = before.pop();
        var focusWord = beforeWord + after[0];


        if (focusWord.match(HASHTAG_REGEX)) {

            if (searchHandler) {
                clearTimeout(searchHandler)
            }

            setSearchHandler(setTimeout(() => {


                client.query({
                    query: gql`
                query SearchHashTag($name: String!, $limit: Int!, $offset: Int!) {
                    searchHashTag(name: $name, limit: $limit, offset: $offset) {
                      id
                      name
                      numPosts
                    }
                  }
                
                ` , variables: {
                        offset: 0,
                        limit: 10,
                        name: focusWord
                    }
                }).then(response => {
                    setHashTags(response.data.searchHashTag)

                    setFocusHashTag({
                        word: focusWord,
                        position: position - beforeWord.length
                    })
                })
            }, 100))
        } else
            setHashTags([]);

    }, [selection]);


    const selectHashTag = useCallback((hashtag) => {


        var before = text.substring(0, focusHashTag.position);
        var after = text.substring(focusHashTag.position + focusHashTag.word.length);

        setText(before + hashtag.name + " " + after);
        setHashTags([])
    }, [text, focusHashTag])


    const keyExtractor = useCallback((item, index) => {
        return item.id;
    }, []);

    const renderItem = useCallback(({ item, index }) => {
        return (
            <TouchableOpacity style={styles.hashResult} onPress={() => selectHashTag(item)}>
                <Text style={[styles.hashtag, styles.hashtagName]}>
                    {item.name}
                </Text>
                <Text style={styles.numPosts}>
                    عدد المنشورات {item.numPosts}
                </Text>
            </TouchableOpacity>
        )
    }, [text, focusHashTag])


    const editPost = async (params) => {
        var { client, event, text, images, video, hashtags, post } = params;

        const type = post.type;
        var thumbnail = null;

        var media = [];

        // if the images where selected 
        // then loop over them and resize and compress them into one media array 
        if (type == "image" && images.length > 0) {

            for (let index = 0; index < images.length; index++) {

                if (images[index].id) {
                    media.splice(0, 0, {
                        id: images[index].id

                    });

                } else {
                    media.splice(0, 0, {
                        id: null,
                        path: null,
                        file: await createRNUploadableFile(images[index].uri)
                    });

                }
            }
        }

        // in case the video was selected then we need to estabilish a compression and keep the user informed 
        // in case the compress failed we continue with uncompressed video 

        
        if (type == "reel" && video && video.id) {
        
            media = [{
                id : video.id , 
                path : video.path 
            }] ;
            thumbnail = { 
                id : post.reel.thumbnail.id , 
                path  : post.reel.thumbnail.path 
            } 
        } else if (type == "reel" && video) {
            var compressedFileUrl = null;
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
                thumbnail = {file : await createRNUploadableFile(uri)};
            } catch (e) {
                return;
            }

            if (compressedFileUrl)
                video.uri = compressedFileUrl
            media = [{ file : await createRNUploadableFile(video.uri) }];
        
        }

        try {
            var response = await client.mutate({
                mutation: gql`
                mutation Mutation($postInput: EditPostInput!) {
                    editPost(postInput: $postInput) {
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
    
                        hashtags {
                            id name 
                        }
                        createdAt 
                        updatedAt 
                    }
                }
                ` ,
                variables: {
                    postInput: {
                        id: post.id,
                        title: (text.trim().length > 0) ? text.trim() : null,
                        media: media,
                        reel: (type == "reel") ? ({
                            thumbnail: thumbnail
                        }) : null ,
         
                        hashtags: hashtags
                    }
                }
            });


            if (response) {

                
                var editPost = response.data.editPost;
                post.title = editPost.title;
                post.hashtags = editPost.hashtags;
                post.media = editPost.media;
                post.reel = editPost.reel;

                console.log(editPost) ; 

                event.emit("edit-post", post);
            }
        } catch (error) {
            console.log(error) ; 
            await BackgroundService.stop();
        }
        setTimeout(async () => {
            await BackgroundService.stop();
        }, 10000)


    }


    const edit = useCallback(() => {
        (async () => {

            var hashtags = text.match(HASHTAG_REGEX);
            try {

                const options = {
                    taskName: 'EDIT_CONTENT',
                    taskTitle: 'رفع المحتوى',
                    taskDesc: '.. تحميل المحتوى الخاص بك الرجاء الانتظار',
                    taskIcon: {
                        name: 'ic_launcher',
                        type: 'mipmap',
                    },
                    color: '#ff00ff',
                    linkingURI: 'yourSchemeHere://chat/jane', // See Deep Linking for more info
                    parameters: {
                        post: post,
                        text: text,
                        images: images,
                        video: video,
                        client: client,
                        event: event,
                        hashtags: hashtags
                    },
                };

                await BackgroundService.start(editPost, options);
                 navigation.goBack();
                // iOS will also run everything here in the background until .stop() is called
            } catch (error) {


                editPost({ client, event, text, images, video, hashtags, post });
                 navigation.goBack();

            }

        })();
    }, [event, client, text, images, video]);


    const onImagesChanged = useCallback((data) => {
        setPost({
            ...post,
            media: data
        });
        setImages(data);
    }, [post]);

    const onVideoChange = useCallback((data) => {
        setVideo(data) ; 
        setThumbnail(data)
    }, []);

    return (
        <View style={styles.container}>
            <Header navigation={navigation} />
            <View style={styles.content}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={edit} style={[styles.outlineButton, disabled && styles.disabled]} disabled={disabled}>
                        <Text style={styles.outlineText}>
                            تعديل
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
                    onSelectionChange={(event) => setSelection(event.nativeEvent.selection)}



                >
                    <Text style={styles.inputText} >
                        {renderText()}
                    </Text>
                </TextInput>

                <FlatList
                    style={[styles.hashtags, { top: 56 + (32 * numberOfLines) }]}
                    data={hashtags}
                    keyExtractor={keyExtractor}
                    renderItem={renderItem}
                    ItemSeparatorComponent={<View style={styles.separator}></View>}
                />

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
                        <Image source={thumbnail} style={styles.video} />
                    </TouchableOpacity>
                }


            </View>

            {

                post.type != "note" &&
                <NewPostUploader
                    defaultImages={defaultImage}
                    defaultVideo={defaultVideo}
                    onImagesChanged={onImagesChanged}
                    onVideoChange={onVideoChange}
                    type={post.type}
                />
            }
        </View>
    )

};


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
    hashtags: {


        backgroundColor: "white",
        width: "92%",

        alignSelf: "center",
        elevation: 4,
        position: "absolute",
        marginTop: 16,
        zIndex: 999,
        borderRadius: 4,
        paddingHorizontal: 16,
        maxHeight: 260,


    },
    hashtag: {
        color: "#1A6ED8" , 
        textAlign : "right"
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
    },
    hashResult: {
        paddingVertical: 4,

        alignItems: "flex-end"
    },
    hashtagName: {
        fontFamily: textFonts.semiBold,
        fontSize: 12
    },
    numPosts: {
        color: "#888",
        fontFamily: textFonts.regular,
        fontSize: 10
    },
    separator: {
        height: 1,
        backgroundColor: "#eee"
    } , 
    inputText :  {
        textAlign : "auto" 
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
    hashtags: {

        ...lightStyles.hashtags , 
        backgroundColor : darkTheme.backgroudColor


    },
    numPosts: {
        color: darkTheme.secondaryTextColor,
        fontFamily: textFonts.regular,
        fontSize: 10
    },
    separator: {
        height: 1,
        backgroundColor: darkTheme.borderColor
    }
}

