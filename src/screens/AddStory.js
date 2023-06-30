import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { useCallback, useContext, useState } from "react";
import { FontAwesome } from '@expo/vector-icons';
import { textFonts } from "../design-system/font";
import { ApolloContext } from "../providers/ApolloContext";
import { gql } from "@apollo/client";
import { createRNUploadableFile } from "../providers/MediaProvider";
import { useEvent } from "../providers/EventProvider";
import PrimaryButton from "../components/Buttons/PrimaryButton" ; 
export default function AddStory({ navigation, route }) {

    const media = route.params?.media;
    const client = useContext(ApolloContext);
    const [isLoading , setIsLoading] = useState(false) ; 
    const event = useEvent();


    const clear = useCallback(() => {
        navigation.goBack();
    }, []);


    const share = useCallback(() => {
        setIsLoading(true) ; 
        (async () => {
            const file = await createRNUploadableFile(media.uri);
            client.mutate({
                mutation: gql`
                mutation CreateStory($storyInput: StoryInput!) {
                    createStory(storyInput: $storyInput) {
                      createdAt
                      expiredAt
                      id
                      media {
                        id
                        path
                      }
                      
                    }
                  }
                ` , variables: {
                    storyInput: {
                        media: file
                    }
                }
            }).then(response => {
                if (response) {
                    var story = response.data.createStory;
                    story.liked = false;
                    event.emit("new-story", story);
                    navigation.goBack();
                    setIsLoading(false) ; 
                }
            }).catch(error => {
                setIsLoading( false ) ; 
            })
        })()

    }, [])

    return (
        <View style={styles.container}>

            {
                media &&
                <View style={styles.mediaContainer}>
                    <View style={styles.header}>
                        <TouchableOpacity onPress={clear}>
                            <FontAwesome name="times" size={24} color="red" />
                        </TouchableOpacity>


                        <PrimaryButton
                            title={"شارك"}
                            onPress={ share }
                            style={styles.outlineButton} 
                            textStyle={  styles.outlineText }
                            loading ={ isLoading } 
                        />

              
                        
                    </View>
                    <Image source={media} style={styles.storyImage} />
                </View>
            }
        </View>
    )

};


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "white",
        alignItems: "center"
    },
    addButton: {
        position: "absolute",
        bottom: 36,
        backgroundColor: "#1A6ED8",
        width: 56,
        height: 56,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 46
    },
    storyImage: {
        flex: 1,
        resizeMode: "cover",
        width: "100%",

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
    mediaContainer: {
        flex: 1,
        position: "relative",
        height: "100%",

        width: "100%"
    },
    header: {
        position: "absolute",
        width: "100%",
        zIndex: 8,
        flexDirection: "row-reverse",
        justifyContent: "space-between",
        height: 48,

        top: 48,

        paddingHorizontal: 16,
        alignItems: "center"
    }
})